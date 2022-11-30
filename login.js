require("dotenv").config();
const puppeteer = require("puppeteer-extra");
const { executablePath, Browser } = require("puppeteer");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(stealthPlugin());

/**
 * Initialize puppeteer
 * @return {Promise<Browser>} browser
 */
const initBrowser = () => {
	const options = {
		headless: true,
		defaultViewport: null,
		dumpio: true,
		args: [
			"--flag-switches-begin",
			"--flag-switches-end",
			"--disable-accelerated-2d-canvas",
			"--no-first-run",
			"--no-zygote",
			"--disable-gpu",
		],
		executablePath: executablePath(),
	};
	return puppeteer.launch(options);
};

const extractCookies = async () => {
	const browser = await initBrowser();
	console.log("now login to your TALENTA account");
	const page = await browser.newPage();
	await page.goto("https://hr.talenta.co", {
		waitUntil: "domcontentloaded",
	});
	// fill login data
	await page.type("#user_email", process.env.EMAIL);
	await page.type("#user_password", process.env.PASSWORD);

	// do the login & wait navigation complete
	const [response] = await Promise.all([
		page.waitForNavigation({ waitUntil: "domcontentloaded" }),
		page.click("#new-signin-button"),
	]);
	console.log("======================================================");
	if (response.ok()) {
		const cookies = await page.cookies();
		await browser.close();
		console.log("login success, fuiyoo");
		return cookies;
	}
	console.log(`login failed, haiyaaa`);
	return null;
};

module.exports = extractCookies;
