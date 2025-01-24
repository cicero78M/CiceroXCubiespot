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

    await page.goto(url);

    console.log(page);
    await browser.close();
        
    } catch (error) {
        console.log(error);
    }


}