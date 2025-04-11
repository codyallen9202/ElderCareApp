import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { useMedications } from '@/components/MedicationsProvider';

// maps 0–6 to Expos weekday values (1 = Sunday, 7 = Saturday)
const getExpoWeekdays = (days: number[]) =>
  days
    .map((val, idx) => (val ? ((idx + 1) % 7) + 1 : null))
    .filter((day): day is number => day !== null);

// schedule notifications for each med
const scheduleMedNotifications = async () => {
  const { medications } = useMedications();

  await Notifications.cancelAllScheduledNotificationsAsync(); // Clear old ones

  for (const med of medications) {
    const [hour, minute] = med.time.split(':').map(Number);
    const weekdays = getExpoWeekdays(med.days);

    for (const weekday of weekdays) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time to take ${med.name}`,
          body: `Don't forget your ${med.name}!`,
        },
        trigger: {
          hour,
          minute,
          weekday,
          repeats: true,
        },
      });
    }
  }
};

// main function
export const usePillReminders = () => {
  const { medications } = useMedications();

  useEffect(() => {
    const setup = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      await scheduleMedNotifications();
    };

    if (medications.length > 0) {
      setup();
    }
  }, [medications]);
};
