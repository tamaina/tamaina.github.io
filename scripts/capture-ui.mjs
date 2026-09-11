import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const origin=process.argv[2] || 'http://127.0.0.1:4321';
const output=process.argv[3] || 'maintenance/after';
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
const result=[];
for(const width of [390,768,1440]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,colorScheme:'light'});
 if(origin==='https://a9z.dev') await page.route(/googlesyndication|fundingchoicesmessages|doubleclick/,route=>route.abort());
 for(const [name,path] of Object.entries({home:'/',blog:'/blog',page2:'/blog?page=2',year:'/blog/2024',image:'/blog/2022/05-20-m1mba-1',code:'/blog/2023/01-09-cloudflared-mk',products:'/products',memo:'/memo',missing:'/migration-missing-page'})) {
  try {
   const response=await page.goto(origin+path,{waitUntil:'domcontentloaded',timeout:30000});
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('h1').first().waitFor();
   if(name==='image') await page.evaluate(async()=>{ const imgs=[...document.querySelectorAll('.container img')];imgs.forEach(img=>img.loading='eager');await Promise.all(imgs.map(img=>img.decode().catch(()=>{}))); });
   if(origin==='https://a9z.dev') await page.evaluate(()=>{
    for(const ad of document.querySelectorAll('ins.adsbygoogle')){
     const parent=ad.parentElement;
     if(parent?.classList.contains('my-4') && parent.children.length===1)parent.remove();else ad.remove();
    }
   });
   if(origin!=='https://a9z.dev')await page.waitForFunction(()=>!document.documentElement.classList.contains('paging-pending'));
   const metrics=await page.evaluate(()=>{
    const pick=selector=>{const e=document.querySelector(selector);if(!e)return null;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {text:e.textContent.slice(0,80),x:r.x,y:r.y,width:r.width,height:r.height,font:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight,marginTop:s.marginTop,marginBottom:s.marginBottom}};
    return {h1:pick('h1'),h2:pick('h2'),paragraph:pick('h1+p'),card:pick('.card'),cardTitle:pick('.card h5'),breadcrumb:pick('[aria-label="breadcrumb"]'),navbar:pick('nav.fixed-bottom')};
   });
   await page.screenshot({path:`${output}/${name}-${width}.png`,fullPage:name==='image'});
   result.push({name,path,width,status:response.status(),metrics});console.log(name,width,response.status());
  }catch(error){result.push({name,path,width,error:error.message});console.log(name,width,error.message)}
 }
 await page.close();
}
await fs.writeFile(output+'/metrics.json',JSON.stringify(result,null,2));await browser.close();
