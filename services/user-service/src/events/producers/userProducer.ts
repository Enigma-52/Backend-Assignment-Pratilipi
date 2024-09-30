import { getChannel } from '../../config/rabbitmq';

export const publishUserRegistered = async (user: { id: string, email: string }) => {
  const channel = getChannel();
  channel.publish('user_events', 'user.registered', Buffer.from(JSON.stringify(user)));
};

export const publishUserProfileUpdated = async (user: { id: string, email: string }) => {
  const channel = getChannel();
  channel.publish('user_events', 'user.profile.updated', Buffer.from(JSON.stringify(user)));
};