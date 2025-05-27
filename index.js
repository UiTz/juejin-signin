const schedule = require('node-schedule');
const puppeteer = require('puppeteer');
 
// 请在这里填入你的cookies
const cookies = []
let browserInstance;
(async () => {
  browserInstance = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 0,
      height: 0
    }
  });
  aa()
})()
// 每晚9点开始签到
const resetOnlineTimeJob = schedule.scheduleJob('0 9 * * *', async () => {  // 注意时间格式是24小时制
  const b = Math.floor(Math.random() * 60000)
  console.log('在' + b + '毫秒后开始签到');
  setTimeout(aa, b)
});
async function aa() {
  const page = await browserInstance.newPage();
 
  // 设置导航超时时间为60秒（单位为毫秒）
  await page.setDefaultNavigationTimeout(60000);
  try {
    await page.setCookie(...cookies);
    console.log('已设置cookies');
    // 导航到指定的页面
    await page.goto('https://juejin.cn/user/center/signin?from=main_page');
 
    // 等待5秒
    await delay(5000);
 
    // 检查并点击签到按钮
    if (await page.$('.signin.btn')) {
      await page.click('.signin.btn');
      console.log('找到.signin.btn');
    }else if (await page.$('.signedin.btn')) {
      await page.click('.signedin.btn');
      console.log('找到.signedin.btn');
    }
 
    // 等待5秒
    await delay(5000);
 
    // 等待并点击 btn-area 中的 btn 按钮
    // await page.waitForSelector('.btn-area .btn');
    // if (await page.$('.btn-area .btn')) {
    //   console.log('找到.btn-area .btn');
    //   await page.click('.btn-area .btn');
    // }
    // 确保该元素可以点击
    await page.waitForSelector('.btn-area .btn', { visible: true });
    await page.waitForFunction(
      selector => {
        const element = document.querySelector(selector);
        return element && !element.disabled && element.offsetWidth > 0 && element.offsetHeight > 0;
      },
      { timeout: 5000 },
      '.btn-area .btn'
    );
    await page.click('.btn-area .btn');
 
    console.log('签到成功');
 
    // 等待3秒
    await delay(3000);
 
    // 等待并点击抽奖按钮
    await page.waitForSelector('#turntable-item-0');
    if (await page.$('#turntable-item-0')) {
      const text = await page.$eval('#turntable-item-0', el => el.innerText);
      console.log('找到#turntable-item-0，文本内容为：', text);
      // await page.click('#turntable-item-0');
    }
    console.log('抽奖成功');
 
    // 等待3秒然后关闭页面
    await delay(3000);
    // await page.$('.wrapper .title').innerHTML
    // await page.close();
 
  } catch (error) {
    console.log(error);
    // await page.close();
  }
}
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}
console.log('掘金自动签到已启动');
