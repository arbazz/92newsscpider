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
  await getData(page, index);
});
async function getData(page) {
  await fs.writeFileSync("test.txt", String(index));
  console.log("cuuret ->  ", index);
  console.log("element length =>  ", elements.length);
  await delay(2000);
  let newTemp = await initiate(page);
  console.log("new lenght ", newTemp.length);
  if (newTemp.length <= index) {
    increaeTemp(page);
    return;
  }
  elements = await page.$$(".post-item");
  console.log("innder ======", elements.length);
  let button = await elements[index];
  await button.click();

  await page.waitForSelector(".post-details");
  const title = await page.$eval(
    ".post-details h1",
    (element) => element.innerHTML
  );
  console.log(title);
  const desc = await page.$eval(
    ".content_detail p:nth-child(2) ",
    (element) => element.innerHTML
  );
  fs.appendFile("good.csv", title + "," + desc + "\r\n", (err) => {
    if (err) console.log(err);
    console.log('The "data to append" was appended to file!');
  });
  await page.goBack();
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
    getData(page);
  } else {
    getData(page);
  }
}

const increaeTemp = async (page) => {
  let button = await page.$(".btn-more");
  await button.click();
  await delay(2000);
  let newTemp = await initiate(page);
  elements = newTemp;
  getData(page);
};
