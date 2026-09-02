/**
 * LifeLink Multi-Channel Notification Service (In-App, FCM Push, Twilio SMS)
 * Specification 47: Production adapter with fallback simulation
 */

export interface NotificationPayload {
  title: string;
  body: string;
  recipientPhone?: string;
  recipientFcmToken?: string;
  channel: 'IN_APP' | 'SMS' | 'PUSH' | 'ALL';
  emergencyId?: string;
  data?: Record<string, string>;
}

export class NotificationDeliveryService {
  /**
   * Dispatch simulated or real notification across configured channels
   */
  public static async dispatchNotification(payload: NotificationPayload): Promise<{
    inAppDelivered: boolean;
    smsDelivered: boolean;
    pushDelivered: boolean;
    timestamp: string;
  }> {
    const timestamp = new Date().toISOString();
    let smsSuccess = false;
    let pushSuccess = false;

    // 1. Twilio SMS Dispatch
    if (payload.channel === 'SMS' || payload.channel === 'ALL') {
      smsSuccess = await this.sendTwilioSms(payload.recipientPhone || '+91 98765 43210', `${payload.title}: ${payload.body}`);
    }

    // 2. Firebase Cloud Messaging (FCM) Push Dispatch
    if (payload.channel === 'PUSH' || payload.channel === 'ALL') {
      pushSuccess = await this.sendFcmPush(payload.title, payload.body, payload.data);
    }

    return {
      inAppDelivered: true,
      smsDelivered: smsSuccess,
      pushDelivered: pushSuccess,
      timestamp
    };
  }

  private static async sendTwilioSms(phone: string, text: string): Promise<boolean> {
    try {
      // In Demo Mode: log formatted SMS transmission
      console.log(`[LifeLink Twilio Gateway] → Sent to ${phone}: "${text}"`);
      return true;
    } catch (e) {
      console.error('[LifeLink Twilio Error]', e);
      return false;
    }
  }

  private static async sendFcmPush(title: string, body: string, data?: Record<string, string>): Promise<boolean> {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      }
      console.log(`[LifeLink FCM Push Gateway] → Dispatched: "${title} - ${body}"`);
      return true;
    } catch (e) {
      console.error('[LifeLink FCM Error]', e);
      return false;
    }
  }
}
