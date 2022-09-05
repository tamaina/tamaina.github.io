export const getImgRelativePath = (src: string, filepath: string) => {
    const getPathname = () => {
        const indexRegExp = /\/index\.(md|yml|yaml|json)$/;
        const isIndex = indexRegExp.test(filepath);
        const pathname = isIndex ? filepath.replace(indexRegExp, '') : filepath.replace(/\/[^/]+$/, '');
        return pathname;
    }

    return (src.startsWith('http') || src.startsWith('/')) ? src : `/${getPathname()}/${src}`;
}
