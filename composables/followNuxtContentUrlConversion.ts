export const followNuxtContentUrlConversion = (_url: string) => {
    let url = _url;
    url = url.replaceAll(' ', '-');
    url = url.replaceAll('%20', '-');
    url = url.toLowerCase();

    // resolve path https://stackoverflow.com/questions/62507149/resolve-a-path-string-in-native-javascript/62507199
    url = url.split('/')
        .reduce((a, v) => {
            if (v === '.') return a;
            if (v === '..') a.pop();
            else a.push(v);
            return a;
        }, [] as string[])
        .join('/');
    return url;
};
