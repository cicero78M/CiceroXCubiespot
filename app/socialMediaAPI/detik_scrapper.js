import puppeteer from "puppeteer";

export async function detikScrapping(url) {   

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: '/usr/bin/google-chrome',
        ignoreDefaultArgs: ['--disable-extensions']
    });
    
    const page = await browser.newPage();

    await page.goto(url);

    console.log(page);
    await browser.close();

}