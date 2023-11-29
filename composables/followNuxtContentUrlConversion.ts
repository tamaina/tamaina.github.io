export const followNuxtContentUrlConversion = (_url: string) => {
    let url = _url;
    url = url.replaceAll(' ', '-');
    url = url.replaceAll('%20', '-');
    url = url.toLowerCase();
    return url;
};
