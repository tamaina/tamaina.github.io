import { test, expect } from '@playwright/test';
const imageArticle='/blog/2022/05-20-m1mba-1';
for(const width of [390,575,576,768,991,992,1440]) {
  test(`layout and navigation at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto('/blog');await page.evaluate(()=>document.fonts.ready);
    const card=page.locator('.card').first();
    if(width>=576)expect((await card.boundingBox())!.height).toBe(184);
    else expect((await card.boundingBox())!.height).toBeGreaterThan(300);
    expect(await page.locator('main').evaluate(el=>getComputedStyle(el).maxWidth)).toBe('960px');
    if(width<992){await page.getByLabel('Toggle navigation').click();await expect(page.locator('#navbarSupportedContent')).toBeVisible();await page.getByLabel('Toggle navigation').click();await expect(page.locator('#navbarSupportedContent')).toBeHidden()}
    else await expect(page.locator('#navbarSupportedContent')).toBeVisible();
    await page.emulateMedia({colorScheme:'dark'});expect(await page.locator('body').getAttribute('data-bs-theme')).toBe('light');
    await page.goto(imageArticle);expect(await page.locator('main').evaluate(el=>getComputedStyle(el).maxWidth)).toBe('640px');
    await page.locator('main').locator('a').last().scrollIntoViewIfNeeded();
    await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
    const main=await page.locator('main').boundingBox(),nav=await page.locator('nav.fixed-bottom').boundingBox();expect(main!.y+main!.height).toBeLessThanOrEqual(nav!.y+1);
  });
}
test('query pagination, correction, direct input, reload and history',async({page})=>{
 await page.goto('/blog');await expect(page.locator('.card')).toHaveCount(10);
 const first=await page.locator('.card h5').first().textContent();
 await page.locator('[data-next]').first().click();await expect(page).toHaveURL(/page=2/);
 await expect(page.locator('.card h5').first()).not.toHaveText(first!);
 const second=await page.locator('.card h5').first().textContent();
 await page.reload();await expect(page.locator('.card h5').first()).toHaveText(second!);
 await page.goBack();await expect(page.locator('.card h5').first()).toHaveText(first!);
 await page.goForward();await expect(page.locator('.card h5').first()).toHaveText(second!);
 await page.getByLabel('ページ番号').first().fill('999');await page.getByLabel('ページ番号').first().press('Tab');await expect(page).toHaveURL(/page=4/);
 await expect(page.locator('[data-next]').first()).toBeDisabled();
 await page.goto('/blog?page=-2');await expect(page.getByLabel('ページ番号').first()).toHaveValue('1');
 await page.goto('/blog?page=NaN');await expect(page.getByLabel('ページ番号').first()).toHaveValue('1');
});
test('viewer opens original, Escape closes, anchor works, no AdSense',async({page})=>{
 const ads:string[]=[];page.on('request',request=>{if(/googlesyndication|fundingchoicesmessages|adsbygoogle/.test(request.url()))ads.push(request.url())});
 await page.goto(imageArticle);
 const img=page.locator('a[data-viewer] img').first();await img.scrollIntoViewIfNeeded();
 const original=await page.locator('a[data-viewer]').first().getAttribute('href');
 await img.click();await expect(page.locator('.viewer-container')).toBeVisible();
 await expect(page.locator('.viewer-canvas img')).toHaveAttribute('src',new RegExp(original!));
 await page.keyboard.press('Escape');await expect(page.locator('.viewer-container')).toHaveCount(0);
 const heading=page.locator('h2 a').first();const href=await heading.getAttribute('href');await heading.click();await expect(page).toHaveURL(url=>decodeURIComponent(url.hash)===href);
 expect(ads).toEqual([]);
});
test('no-JS body, original image links and first listing remain accessible',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4321/blog');await expect(page.locator('.card')).toHaveCount(10);
 await page.goto('http://127.0.0.1:4321'+imageArticle);await expect(page.locator('h1')).toBeVisible();
 const href=await page.locator('a[data-viewer]').first().getAttribute('href');expect(href).toBe('/2.blog/2022/05-20%20m1mba-1/0.webp');
 await context.close();
});
test('one-shot fallback and real 404, including missing media',async({page,request})=>{
 await page.goto(imageArticle);
 const img=page.locator('a[data-viewer] img').first();
 await img.evaluate((el:HTMLImageElement)=>{el.src='/missing-transformation';el.dispatchEvent(new Event('error'))});
 await expect(img).toHaveAttribute('data-fallback','1');
 const original=await img.getAttribute('data-original');await expect(img).toHaveAttribute('src',original!);
 await img.evaluate((el:HTMLImageElement)=>{el.src='/missing-again';el.dispatchEvent(new Event('error'))});await expect(img).toHaveAttribute('src','/missing-again');
 expect((await request.get('/not-a-page')).status()).toBe(404);expect((await request.get('/2.blog/2022/05-20%20m1mba-1/not-an-image.webp')).status()).toBe(404);
});
test('touch viewer opens and closes',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4321'+imageArticle);await page.locator('a[data-viewer] img').first().tap();await expect(page.locator('.viewer-container')).toBeVisible();await expect.poll(()=>page.locator('a[data-viewer] img').first().evaluate((el:any)=>el.viewer?.isShown)).toBe(true);await page.locator('.viewer-button').tap();await expect(page.locator('.viewer-container')).toHaveCount(0);await context.close();
});
test('unread listing pages do not request their images',async({page})=>{
 const images:string[]=[];page.on('request',r=>{if(r.resourceType()==='image')images.push(new URL(r.url()).pathname)});
 await page.goto('/blog');await expect(page.locator('.card')).toHaveCount(10);
 const visible=await page.locator('.card img').evaluateAll(imgs=>imgs.map(img=>new URL((img as HTMLImageElement).currentSrc || (img as HTMLImageElement).src).pathname));
 expect(images.every(url=>visible.includes(url))).toBe(true);
});
