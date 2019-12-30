import { UserType } from '../../generated/graphql';

export const getAvatarThumb = (user: UserType): string => {
    const baseURL = process.env.BACKEND_URL;
    const thumbnailURL = user.avatarThumbnail;
    return baseURL && thumbnailURL ? baseURL + thumbnailURL : '/images/default_avatar.jpg';
};
