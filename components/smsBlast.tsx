import { Linking } from 'react-native';

/**
 * Sends an SMS blast to all caregivers with a predefined alert message.
 * @param {Array<{ id: string, name: string, phone: string }>} caregivers - List of caregivers with phone numbers.
 */
export const sendSMSBlast = (caregivers: { id: string; name: string; phone: string }[]) => {
  if (caregivers.length === 0) {
    alert("No caregivers available to alert.");
    return;
  }

  const phoneNumbers = caregivers.map((c) => c.phone).join(',');
  const message = encodeURIComponent("⚠️ Urgent Alert: Please check in now!");
  const smsUrl = `sms:${phoneNumbers}?body=${message}`;

  Linking.openURL(smsUrl).catch((err) => console.error('Error opening SMS app:', err));
};
export const sendInviteSMS = (phone: string, inviteCode: string) => {
  const message = encodeURIComponent(`You've been added as a caregiver! Your invite code is: ${inviteCode}`);
  const smsUrl = `sms:${phone}?body=${message}`;

  Linking.openURL(smsUrl).catch((err) => console.error('Error sending invite SMS:', err));
};
