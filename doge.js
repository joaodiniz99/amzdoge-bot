import dotenv from "dotenv";
dotenv.config();

import playwright from "playwright";
import isOnline from "is-online";

const browserType = "chromium"; // chrome

let strategyHour = 86460000;
let firstTime = true;
let delay = 60000;
// let boostHour = 10800000;

const signIn = async (username, password, page) => {
    await page.waitForTimeout(5000);

    const inputUsername = await page.$(
        '//*[@id="app"]/uni-app/uni-page/uni-page-wrapper/uni-page-body/uni-view[1]/uni-view[2]/uni-view[1]/uni-view[1]/uni-view[2]/uni-view/uni-view/uni-input/div/input'
    );
    // inputUsername.waitForElementState('visible');
    await inputUsername.type(username, 2000);

    const inputPassword = await page.$(
        '//*[@id="app"]/uni-app/uni-page/uni-page-wrapper/uni-page-body/uni-view[1]/uni-view[2]/uni-view[1]/uni-view[2]/uni-view[2]/uni-view/uni-view/uni-input/div/input'
    );
    await inputPassword.type(password, 2000);

    await page.waitForTimeout(2000);

    const loginBtn = await page.$(
        '//*[@id="app"]/uni-app/uni-page/uni-page-wrapper/uni-page-body/uni-view[1]/uni-view[3]/uni-view[1]'
    );
    await loginBtn.click();

    await page.waitForTimeout(6000);

    const closeBtn = await page.$(
        '//*[@id="app"]/uni-app/uni-page/uni-page-wrapper/uni-page-body/uni-view[1]/uni-view[4]/uni-view/uni-view/uni-view[2]/uni-view/uni-view/uni-view[2]/uni-view'
    );
    if (closeBtn !== null) await closeBtn.click();

    await page.waitForTimeout(3000);
};

const strategy = async () => {
    try {
        const browser = await playwright[browserType].launch({
            headless: true,
        });
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto("https://geodoge.com/");
        await page.waitForLoadState("domcontentloaded");

        await page.waitForTimeout(10000);

        const publish_username = process.env.PUBLISH_USERNAME;
        const publish_password = "#" + process.env.PUBLISH_PASSWORD;
        await signIn(publish_username, publish_password, page);

        const strategy =
            (await page.$('"Quant trade"')) !== null
                ? await page.$('"Quant trade"')
                : (await page.$('"Comercio"')) !== null
                ? await page.$('"Comercio"')
                : await page.$('"Troca"');
        await strategy.click();

        await page.waitForTimeout(4000);

        const order = await page.$('"24Hours"');
        await order.click();

        await page.waitForTimeout(4000);

        const magicSelect = await page.$(
            '//*[@id="app"]/uni-app/uni-page/uni-page-wrapper/uni-page-body/uni-view[2]/uni-view[2]/uni-view[1]/uni-picker/div[2]/uni-view'
        );
        await magicSelect.click();

        await page.waitForTimeout(1000);

        let magicSelectOption = await page.$(
            '//*[@id="app"]/uni-app/div/div[2]/div[2]/div[1]'
        );
        // if(magicSelectOption === null) {
        //     magicSelectOption = await page.$('//*[@id="app"]/uni-app/div/div[2]/div[2]/div[1]');
        // }
        magicSelectOption.click();

        await page.waitForTimeout(2000);

        const amountBtn = await page.$(
            '//*[@id="app"]/uni-app/uni-page/uni-page-wrapper/uni-page-body/uni-view[2]/uni-view[2]/uni-view[2]/uni-view[3]/uni-view[4]'
        );
        await amountBtn.click();

        await page.waitForTimeout(2000);

        const submitBtn = await page.$(
            '//*[@id="app"]/uni-app/uni-page/uni-page-wrapper/uni-page-body/uni-view[2]/uni-view[4]/uni-view'
        );
        await submitBtn.click();

        // const magicValidOption = magicSelectOptions.find(async (option) => {
        //     return console.log(option.);
        //     if(text.includes('[Used]') || text.includes('[Usado]')) return option;
        // })

        // console.log('active option:', magicValidOption);
        await page.waitForTimeout(4000);

        console.log(
            `[${new Date().getHours()}:${new Date().getMinutes()}] Order placed`
        );

        await browser.close();

        delay += 60000;
    } catch (e) {
        console.log("publish handler error!", e);
    }
};

const boost = async () => {
    try {
        const browser = await playwright[browserType].launch({
            headless: false,
        });
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto("https://geodoge.com/#/pages/login/login");
        await page.waitForLoadState("load");

        await page.waitForTimeout(3000);

        const publish_username = process.env.PUBLISH_USERNAME;
        const publish_password = "#" + process.env.PUBLISH_PASSWORD;
        await signIn(publish_username, publish_password, page);

        const strategy = await page.$('"My strategy"');
        await strategy.click();

        await page.waitForTimeout(4000);

        const order = await page.$(".uni-card__content");

        await order.click();

        await page.waitForTimeout(5000);

        let boost = await page.$(
            "#app > uni-app > uni-page > uni-page-wrapper > uni-page-body > uni-view.content"
        );
        if (boost === null) {
            console.log(
                `[${new Date().getHours()}:${new Date().getMinutes()}] Boost not found, browser closed`
            );
            return await browser.close();
        }
        await boost.click({ force: true });

        await page.waitForTimeout(3000);

        console.log(
            `[${new Date().getHours()}:${new Date().getMinutes()}] Boosted`
        );

        await browser.close();

        // boostHour = 7200000;
    } catch (e) {
        console.log("publish handler error!", e);
    }
};

// strategy();
// setInterval(() => {
//     setTimeout(() => {
//         strategy();
//     }, delay);
// }, strategyHour);

// boost();
setInterval(() => {
    boost();
}, 7200000);
