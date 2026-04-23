import User from '../models/User';

let expoInstance: any;

const getExpoInstance = async () => {
  if (!expoInstance) {
    const { Expo } = await import('expo-server-sdk');
    expoInstance = new Expo();
  }
  return expoInstance;
};


export const sendPushNotification = async (
  userId: string, 
  title: string, 
  body: string, 
  data: any = {}
) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.expoPushToken) {
      console.log(`Push notification skipped: User ${userId} has no token.`);
      return;
    }

    const { Expo } = await import('expo-server-sdk');
    if (!Expo.isExpoPushToken(user.expoPushToken)) {
      console.error(`Push notification failed: ${user.expoPushToken} is not a valid Expo push token.`);
      return;
    }

    const expo = await getExpoInstance();

    const messages = [{
      to: user.expoPushToken,
      sound: 'default' as const,
      title,
      body,
      data,
    }];

    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }
  } catch (error) {
    console.error('Push notification service error:', error);
  }
};

