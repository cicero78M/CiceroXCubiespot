import puppeteer from "puppeteer";

export async function detikScrapping() {   
    try {
        
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        executablePath: '/usr/bin/chromium-browser',
        ignoreDefaultArgs: ['--disable-extensions']
    });
    
    const page = await browser.newPage();

    await page.goto("https://news.detik.com/berita/d-7745563/hoegeng-awards-2025-resmi-dibuka-saatnya-usulkan-polisi-teladan-di-sekitarmu", {
        waitUntil: "domcontentloaded",
      });
      const comments = await page.$$('.komentar-iframe-min-list-content .komentar-iframe-min-list-content--bordered');

      console.log(comments);

      for (const comment of comments ){

        try {

          const user = await page.evaluate(el => el.querySelector('.komentar-iframe-min-media__user').textContent, comment);

          console.log(user);
          
        } catch (error) {

          console.error(error);
        }
      }
       
    await browser.close();
        
    } catch (error) {
        console.log(error);
    }
}