export const getImgRelativePath = async (src: string) => {
    const getPathname = async () => {
        const route = useRoute();
        const { data: content } = await useAsyncData(() => queryContent(route.path).findOne());
        const indexRegExp = /\/index\.(md|yml|yaml|json)$/;
        const isIndex = indexRegExp.test(content.value._file);
        const pathname = isIndex ? content.value._file.replace(indexRegExp, '') : content.value._file.replace(/\/[^/]+$/, '');
        return pathname;
    }

    return (src.startsWith('http') || src.startsWith('/')) ? src : `/${await getPathname()}/${src}`;
}
