import puppeteer from "puppeteer";

export async function detikScrapping() {   
    try {
        
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: '/usr/bin/chromium-browser',
        ignoreDefaultArgs: ['--disable-extensions']
    });
    
    const page = await browser.newPage();

    await page.goto("https://news.detik.com/berita/d-7745563/hoegeng-awards-2025-resmi-dibuka-saatnya-usulkan-polisi-teladan-di-sekitarmu", {
        waitUntil: "domcontentloaded",
      });
      const getHeader = await page.$('span.komentar-iframe-min-font-bold')
      const header = await page.evaluate( el => el.innerText, getHeader); 

      console.log (header, link);
       
    await browser.close();
        
    } catch (error) {
        console.log(error);
    }
}