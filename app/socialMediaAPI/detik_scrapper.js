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

    await page.goto("http://quotes.toscrape.com/", {
        waitUntil: "domcontentloaded",
      });

    console.log(page);

    await browser.close();
        
    } catch (error) {
        console.log(error);
    }


}