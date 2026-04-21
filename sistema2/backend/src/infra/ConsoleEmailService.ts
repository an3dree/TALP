import { EmailService } from '../domain/interfaces';

export class ConsoleEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log('=== EMAIL SIMULADO ===');
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log(`Corpo:\n${body}`);
    console.log('======================\n');
  }
}
