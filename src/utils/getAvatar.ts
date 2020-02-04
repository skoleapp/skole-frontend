import { UserObjectType } from '../../generated/graphql';

export const getAvatar = (user: UserObjectType): string => {
    const baseURL = process.env.BACKEND_URL;
    const avatarURL = user.avatar;
    return baseURL && avatarURL ? baseURL + avatarURL : '/images/default_avatar.jpg';
};
