import { Injectable, Inject } from '@nestjs/common';
import { SendNotificationDTO } from './dto/firebase-notification.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseNotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: { defaultApp: admin.app.App }
  ) {}

  async sendPush(notification: SendNotificationDTO) {
    try {
      await this.firebaseAdmin.defaultApp
        .messaging()
        .send({
          notification: {
            title: notification.title,
            body: notification.body,
          },
          token: notification.deviceId,
          data: {},
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              channelId: 'default',
            },
          },
          apns: {
            headers: {
              'apns-priority': '10',
            },
            payload: {
              aps: {
                contentAvailable: true,
                sound: 'default',
              },
            },
          },
        });
    } catch (error) {
      console.error('Error sending notification:', error);
      return error;
    }
  }
}
