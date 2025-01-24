import puppeteer from "puppeteer";

export async function detikScrapping(url) {   
    try {

        
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: '/usr/bin/chromium-browser',
        ignoreDefaultArgs: ['--disable-extensions']
    });
    
    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded",
      });

      const quotes = await page.evaluate(() => {
        // Fetch the first element with class "quote"
        const quote = document.querySelector(".komentar-iframe-min-comment-body komentar-iframe-min-comment-body--detiknews");
    
        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)
        const author = quote.querySelector(".komentar-iframe-min-media__user").innerText;
        const text = quote.querySelector("komentar-iframe-min-media__desc").innerText;
    
        return { author, text };
      });

      console.log (quotes);
    
    
    await browser.close();
        
    } catch (error) {
        console.log(error);
    }


}