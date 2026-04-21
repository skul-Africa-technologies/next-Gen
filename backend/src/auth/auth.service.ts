import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserRole } from './schemas/user.schema';
import { SignupDto, LoginDto, RefreshTokenDto, AdminSignupDto } from './dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly verificationTokenExpiry = 24 * 60 * 60 * 1000;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userModel.findOne({ email: signupDto.email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const refreshToken = this.generateRefreshToken();
    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + this.verificationTokenExpiry);

    const user = new this.userModel({
      ...signupDto,
      password: hashedPassword,
      refreshToken: await bcrypt.hash(refreshToken, 10),
      verificationToken,
      verificationExpires,
      role: UserRole.STUDENT,
      isActive: false,
      isEmailVerified: false,
    });

    await user.save();

    this.emailService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationToken,
    }).catch((err) => this.logger.error('Failed to send verification email', err));

    const userResponse = user.toJSON();

    return {
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        user: userResponse,
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.isActive = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    const refreshToken = this.generateRefreshToken();
    const accessToken = this.generateAccessToken(user._id.toString(), user.role);

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    const userResponse = user.toJSON();

    return {
      success: true,
      message: 'Email verified successfully',
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return { success: true, message: 'If the email exists, a verification email will be sent' };
    }

    if (user.isEmailVerified) {
      return { success: true, message: 'Email already verified' };
    }

    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + this.verificationTokenExpiry);

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    this.emailService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationToken,
    }).catch((err) => this.logger.error('Failed to send verification email', err));

    return { success: true, message: 'Verification email sent' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshToken = this.generateRefreshToken();
    const accessToken = this.generateAccessToken(user._id.toString(), user.role);

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    this.emailService.sendLoginEmail({
      email: user.email,
      name: user.name,
    }).catch((err) => this.logger.error('Failed to send login email', err));

    const userResponse = user.toJSON();

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const user = await this.userModel.findOne({
      refreshToken: { $ne: null },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(
      refreshTokenDto.refreshToken,
      user.refreshToken,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = this.generateRefreshToken();

    user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  async adminLogin(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied. Admin credentials required.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshToken = this.generateRefreshToken();
    const accessToken = this.generateAccessToken(user._id.toString(), user.role);

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    const userResponse = user.toJSON();

    return {
      success: true,
      message: 'Admin login successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };
  }

  async adminSignup(adminSignupDto: AdminSignupDto) {
    const adminKey = this.configService.get('ADMIN_KEY');
    if (adminSignupDto.adminKey !== adminKey) {
      throw new UnauthorizedException('Invalid admin key');
    }

    const existingUser = await this.userModel.findOne({ email: adminSignupDto.email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(adminSignupDto.password, 10);
    const refreshToken = this.generateRefreshToken();

    const user = new this.userModel({
      name: adminSignupDto.name,
      email: adminSignupDto.email,
      password: hashedPassword,
      refreshToken: await bcrypt.hash(refreshToken, 10),
      role: UserRole.ADMIN,
      isActive: true,
    });

    await user.save();

    const accessToken = this.generateAccessToken(user._id.toString(), user.role);
    const userResponse = user.toJSON();

    return {
      success: true,
      message: 'Admin created successfully',
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  private generateAccessToken(userId: string, role: UserRole): string {
    return this.jwtService.sign(
      { sub: userId, role },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: '15m' },
    );
  }

  private generateRefreshToken(): string {
    return this.jwtService.sign(
      {},
      { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '7d' },
    );
  }
}