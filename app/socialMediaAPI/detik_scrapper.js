import puppeteer from "puppeteer";

        
const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: '/usr/bin/chromium-browser'

});

const page = await browser.newPage();


export async function detikScrapping(url) {



    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

        // Get page data
    const document = await page.evaluate(() => {
    // Fetch the first element with class "quote"
        const comment = document.querySelector(".komentar-iframe-min-comment-body");

        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)
        const commentCount = comment.querySelector(".komentar-iframe-min-font-bold").innerText;

        console.log(commentCount)  
    });
}