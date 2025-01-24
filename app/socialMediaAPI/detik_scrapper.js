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

      const quotes = await page.evaluate(() => {
        // Fetch the first element with class "quote"
        const quote = document.querySelector(".quote");
    
        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;
    
        return { text, author };
      });

      console.log (quotes);
    
    
    await browser.close();
        
    } catch (error) {
        console.log(error);
    }


}