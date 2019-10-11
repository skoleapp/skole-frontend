import { Variant } from '../interfaces';

export const getColorForVariant = (variant: Variant): string => {
  switch (variant) {
    case 'red':
      return 'var(--primary)';
    case 'white':
      return 'var(--white)';
    default:
      return 'var(--black)';
  }
};

// TODO: Build a meme generator
export const getLoadingText = (): string => {
  return 'Loading...';
};
