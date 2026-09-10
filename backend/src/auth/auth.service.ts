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
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRole } from './schemas/user.schema';
import { SignupDto, LoginDto, RefreshTokenDto, AdminSignupDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly verificationTokenExpiry = 24 * 60 * 60 * 1000;
  private readonly resetTokenExpiry = 30 * 60 * 1000;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private userResponse(user: {
    id: string;
    name: string;
    email: string;
    school: string | null;
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      school: user.school,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async signup(signupDto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const refreshToken = this.generateRefreshToken();
    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + this.verificationTokenExpiry);

    const user = await this.prisma.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
        refreshToken: await bcrypt.hash(refreshToken, 10),
        verificationToken,
        verificationExpires,
        role: UserRole.STUDENT,
        isActive: false,
        isEmailVerified: false,
      },
    });

    this.emailService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationToken,
    }).catch((err) => this.logger.error('Failed to send verification email', err));

    return {
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        user: this.userResponse(user),
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const refreshToken = this.generateRefreshToken();
    const accessToken = this.generateAccessToken(user.id, user.role as UserRole);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        isActive: true,
        verificationToken: null,
        verificationExpires: null,
        refreshToken: await bcrypt.hash(refreshToken, 10),
      },
    });

    const updatedUser = await this.prisma.user.findUnique({ where: { id: user.id } });

    return {
      success: true,
      message: 'Email verified successfully',
      data: {
        user: this.userResponse(updatedUser!),
        accessToken,
        refreshToken,
      },
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: true, message: 'If the email exists, a verification email will be sent' };
    }

    if (user.isEmailVerified) {
      return { success: true, message: 'Email already verified' };
    }

    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + this.verificationTokenExpiry);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpires,
      },
    });

    this.emailService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationToken,
    }).catch((err) => this.logger.error('Failed to send verification email', err));

    return { success: true, message: 'Verification email sent' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
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
    const accessToken = this.generateAccessToken(user.id, user.role as UserRole);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(refreshToken, 10),
      },
    });

    this.emailService.sendLoginEmail({
      email: user.email,
      name: user.name,
    }).catch((err) => this.logger.error('Failed to send login email', err));

    const updatedUser = await this.prisma.user.findUnique({ where: { id: user.id } });

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: this.userResponse(updatedUser!),
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    const users = await this.prisma.user.findMany({
      where: { refreshToken: { not: null } },
      select: { id: true, refreshToken: true, role: true },
    });

    let matchedUser = null;

    for (const user of users) {
      if (!user.refreshToken) continue;

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.generateAccessToken(matchedUser.id, matchedUser.role as UserRole);
    const newRefreshToken = this.generateRefreshToken();

    await this.prisma.user.update({
      where: { id: matchedUser.id },
      data: {
        refreshToken: await bcrypt.hash(newRefreshToken, 10),
      },
    });

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
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  async adminLogin(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
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
    const accessToken = this.generateAccessToken(user.id, user.role as UserRole);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(refreshToken, 10),
      },
    });

    const updatedUser = await this.prisma.user.findUnique({ where: { id: user.id } });

    return {
      success: true,
      message: 'Admin login successful',
      data: {
        user: this.userResponse(updatedUser!),
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

    const existingUser = await this.prisma.user.findUnique({
      where: { email: adminSignupDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(adminSignupDto.password, 10);
    const refreshToken = this.generateRefreshToken();

    const user = await this.prisma.user.create({
      data: {
        name: adminSignupDto.name,
        email: adminSignupDto.email,
        password: hashedPassword,
        refreshToken: await bcrypt.hash(refreshToken, 10),
        role: UserRole.ADMIN,
        isActive: true,
        isEmailVerified: true,
      },
    });

    const accessToken = this.generateAccessToken(user.id, user.role as UserRole);

    return {
      success: true,
      message: 'Admin created successfully',
      data: {
        user: this.userResponse(user),
        accessToken,
        refreshToken,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      return {
        success: true,
        message: 'If an account with this email exists, a reset link has been sent.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiresAt = new Date(Date.now() + this.resetTokenExpiry);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: tokenHash,
        resetTokenExpiresAt,
      },
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    this.emailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetLink,
    }).catch((err) => this.logger.error('Failed to send password reset email', err));

    return {
      success: true,
      message: 'If an account with this email exists, a reset link has been sent.',
    };
  }

  private async validateResetToken(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: tokenHash,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    return user;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.validateResetToken(resetPasswordDto.token);

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
        refreshToken: null,
      },
    });

    this.emailService.sendPasswordChangedConfirmationEmail({
      email: user.email,
      name: user.name,
    }).catch((err) => this.logger.error('Failed to send password change confirmation email', err));

    return {
      success: true,
      message: 'Password has been successfully reset.',
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
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
