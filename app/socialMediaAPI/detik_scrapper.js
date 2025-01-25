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
        waitUntil: "networkidle2",
      });

      const quotes = await page.evaluate(() => {

        const quote = document.querySelector("#h1");

        return { quote };
      });

      console.log (quotes);
    
    
    await browser.close();
        
    } catch (error) {
        console.log(error);
    }

}