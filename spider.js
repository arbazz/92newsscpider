const puppeteer = require("puppeteer");
const fs = require("fs");
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
let index = 0;
let elements = "";

async function initiate(page, index) {
  return new Promise(async (res) => {
    const elements = await page.$$(".post-item");
    res(elements);
  });
}
fs.readFile("test.txt", "utf8", async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  index = parseInt(data);
  console.log(data);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://92newshd.tv/latest-news");
  await getData(page, browser);
});
async function getData(page, browser) {
  await fs.writeFileSync("test.txt", String(index));
  console.log("cuuret ->  ", index);
  console.log("element length =>  ", elements.length);
  await delay(2000);
  let newTemp = await initiate(page);
  console.log("new lenght ", newTemp.length);
  if (newTemp.length <= index) {
    increaeTemp(page, browser);
    return;
  }
  elements = await page.$$(".post-item");
  console.log("innder ======", elements.length);
  let button = await elements[index];
  await page.keyboard.down("Control");
  await button.click();
  await page.keyboard.up("Control");
  await page.waitForTimeout(1000);
  const otherPage = (await browser.pages())[2];
  await otherPage.waitForSelector(".post-details");
  const title = await otherPage.$eval(
    ".post-details h1",
    (element) => element.innerHTML
  );
  console.log(title);
  const desc = await otherPage.$eval(
    ".content_detail p:nth-child(2) ",
    (element) => element.innerHTML
  );
  fs.appendFile("good.csv", title + "," + desc + "\r\n", (err) => {
    if (err) console.log(err);
    console.log('The "data to append" was appended to file!');
  });
  await otherPage.close();
  index += 1;
  if (index >= elements.length) {
    console.log("phir se");
    // const btnAction = await page.evaluateHandle(() =>
    //   document.querySelector(".btn-more")
    // );
    // console.log(btnAction);
    // await btnAction.evaluate((form) => form.click());
    let button = await page.$(".btn-more");
    await button.click();
    await delay(2000);
    let newTemp = await initiate(page);
    elements = newTemp;
    console.log(elements.length);
    getData(page, browser);
  } else {
    getData(page, browser);
  }
}

const increaeTemp = async (page, browser) => {
  let button = await page.$(".btn-more");
  await button.click();
  await delay(2000);
  let newTemp = await initiate(page);
  elements = newTemp;
  getData(page, browser);
};
