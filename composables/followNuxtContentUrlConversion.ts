export const followNuxtContentUrlConversion = (_url: string) => {
    let url = _url;
    url = url.replace(' ', '-');
    url = url.replace('%20', '-');
    url = url.toLowerCase();
    return url;
};
