import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
      port: this.configService.get('SMTP_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendBulkEmail(subject: string, content: string) {
    const students = await this.prisma.user.findMany({
      where: { role: 'student' },
      select: { email: true },
    });

    const emails = students.map((student) => student.email);

    if (emails.length === 0) {
      return {
        success: true,
        message: 'No students found to send emails to',
      };
    }

    const results = await Promise.allSettled(
      emails.map((email) =>
        this.transporter.sendMail({
          from: this.configService.get('SMTP_FROM') || this.configService.get('SMTP_USER'),
          to: email,
          subject,
          html: content,
        }),
      ),
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return {
      success: true,
      message: `Email sent to ${successful} students`,
      data: {
        totalSent: successful,
        failed,
      },
    };
  }
}
