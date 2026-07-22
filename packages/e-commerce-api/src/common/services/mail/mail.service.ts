import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn(
        'SENDGRID_API_KEY is not set. Email sending will fail or be simulated.',
      );
    }
  }

  async sendVerificationEmail(
    to: string,
    otp: string,
    expirationMinutes: number,
  ) {
    const fromEmail =
      this.configService.get<string>('SENDGRID_FROM_EMAIL') ||
      'no-reply@example.com';
    const msg = {
      to,
      from: fromEmail,
      subject: 'Xác thực địa chỉ email của bạn',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h3>Xin chào,</h3>
          <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã OTP dưới đây để xác thực email của bạn:</p>
          <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px;">
            ${otp}
          </div>
          <p>Mã OTP này sẽ hết hạn trong vòng ${expirationMinutes} phút.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        </div>
      `,
    };

    try {
      if (
        this.configService.get<string>('NODE_ENV') === 'development' &&
        !this.configService.get<string>('SENDGRID_API_KEY')
      ) {
        this.logger.log(`[SIMULATED EMAIL] To: ${to}`);
        this.logger.log(
          `[SIMULATED EMAIL] OTP: ${otp} (Expires in ${expirationMinutes} mins)`,
        );
      } else {
        await sgMail.send(msg);
        this.logger.log(`Verification email sent to ${to}`);
      }
    } catch (error) {
      this.logger.error(`Error sending email to ${to}`, error);
      throw error;
    }
  }
}
