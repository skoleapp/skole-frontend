export const getShortcutUrl = (href: any): string => {
  if (href.pathname) {
    return href.pathname;
  } else {
    return href;
  }
};
