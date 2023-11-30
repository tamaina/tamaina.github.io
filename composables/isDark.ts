//export const isDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
export const isDark = () => {
    console.log('override isDark() to false');
    return false;
};
