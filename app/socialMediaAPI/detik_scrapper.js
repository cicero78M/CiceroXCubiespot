import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: '/usr/bin/google-chrome',
    ignoreDefaultArgs: ['--disable-extensions']

});

const page = await browser.newPage();

export async function detikScrapping(url) {
            
    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });
    const document = await page.waitForSelector(".komentar-iframe-min-comment-body komentar-iframe-min-comment-body--detiknews");

    console.log(document)  

}