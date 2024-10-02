import { publishMessage } from '../../config/rabbitmq';
import { IUserProfile } from '../../../types/user';

export const emitUserRegistered = async (user: IUserProfile): Promise<void> => {
  await publishMessage('user_registered', JSON.stringify(user));
};

export const emitUserProfileUpdated = async (user: IUserProfile): Promise<void> => {
  await publishMessage('user_profile_updated', JSON.stringify(user));
};