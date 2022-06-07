const puppeteer = require("puppeteer");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  let classBtn = ".see-more";
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://92newshd.tv/latest-news");
  for (let i = 0; i < 4200; i++) {
    await delay(3000);
    await page.waitForSelector(classBtn);
    const btnAction = await page.evaluateHandle(() =>
      document.querySelector(".btn-more")
    );
    await btnAction.evaluate((form) => form.click());
    console.log("index0 ", i);
  }
})();
