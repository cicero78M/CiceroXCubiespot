import puppeteer from "puppeteer";

export async function detikScrapping(url) {   

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: '/usr/bin/google-chrome',
        ignoreDefaultArgs: ['--disable-extensions']
    });
    
    const page = await browser.newPage();
    
    page.setDefaultTimeout(30);

    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

    console.log(page);
    await browser.close();

}