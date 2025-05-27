import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { Provider } from "@nestjs/common";

export const firebaseAdminProvider: Provider = {
  provide: "FIREBASE_ADMIN",
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const projectId = configService.get<string>("PROJECT_ID");
    const clientEmail = configService.get<string>("CLIENT_EMAIL");
    const privateKey = configService
      .get<string>("PRIVATE_KEY")
      ?.replace(/\\n/g, "\n");

    let defaultApp: admin.app.App;

    // ✅ Check if already initialized
    if (admin.apps.length === 0) {
      defaultApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      defaultApp = admin.app(); // ✅ Reuse existing app
    }

    return { defaultApp };
  },
};
