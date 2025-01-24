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

      const quotes = await page.evaluate(() => {
        // Fetch the first element with class "quote"
        const quote = document.querySelector(".comm1.box komentar_box");
    
        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)
        const text = quote.querySelector(".komentar-iframe-min-media__user").innerText;
    
        return { text };
      });

      console.log (quotes);
    
    
    await browser.close();
        
    } catch (error) {
        console.log(error);
    }


}