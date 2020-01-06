import { ResourcePartType } from '../../generated/graphql';

export const getFilePath = (resourcePart: ResourcePartType): string => {
    const baseURL = process.env.BACKEND_URL;
    const fileURL = resourcePart.file;
    return baseURL && fileURL ? baseURL + fileURL : '/images/default_resource.jpg';
};
