require("dotenv").config();
const attendance = require("./attendance");
const extractCookies = require("./login");

const run = async () => {
	console.log("======================================================");
	const localTime = new Date();
	const indoTime = new Date(
		localTime.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
	);
	if (indoTime.getHours() <= 8 || indoTime.getHours() >= 17) {
		const cookies = await extractCookies();
		const userData = cookies.find((el) => el.name === "_identity");
		await attendance({
			lat: process.env.LAT,
			long: process.env.LONG,
			desc: "",
			cookies: `${userData.name}=${userData.value}`,
			status: indoTime.getHours() <= 8 ? "checkin" : "checkout",
		});
	} else {
		console.log(
			"Working time no need attendance, if forget can use the web / mobile app"
		);
	}
	console.log("======================================================");
};

run();
