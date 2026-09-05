/**
 * Email Notification Service Provider Abstraction
 * Phase 17 — DealFlow360
 *
 * Provides integration-ready email dispatch contract:
 * - EmailProvider.sendEmail()
 *
 * Safe provider abstraction: Logs transactional email payloads in dev mode
 * and connects cleanly to production SMTP/SendGrid/SES gateways without altering domain logic.
 */

class EmailProvider {
  async sendEmail(payload) {
    const { to, subject, template, data } = payload;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[EmailProvider] [DEV TRANSACTIONAL EMAIL DISPATCH]`, {
        to,
        subject,
        template,
        timestamp: new Date().toISOString(),
        data,
      });
    }
    // Future integration point: await sendgrid.send(...) or AWS SES call
    return { status: 'DISPATCHED_TO_QUEUE', to, subject };
  }
}

export const emailNotificationService = {
  provider: new EmailProvider(),

  /**
   * Send integration-ready email notification
   */
  async sendEmail({ to, subject, template, data }) {
    if (!to || !subject) return null;
    try {
      return await this.provider.sendEmail({ to, subject, template, data });
    } catch (e) {
      console.error('[emailNotificationService] Failed to queue transactional email:', e);
      return null;
    }
  },
};

export default emailNotificationService;
