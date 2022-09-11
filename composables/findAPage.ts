export const findAPage = (path: string) => useAsyncData(`findContentOne:${path}`, () => queryContent(path).findOne());
