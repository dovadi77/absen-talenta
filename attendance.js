const https = require("node:https");
const FormData = require("form-data");

const rot13 = (message) => {
	const alpha =
		"abcdefghijklmnopqrstuvwxyzabcdefghijklmABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM";
	return message.replace(
		/[a-z]/gi,
		(letter) => alpha[alpha.indexOf(letter) + 13]
	);
};

/**
 * Do the check-in / check-out
 * @param {{long: string, lat: string, desc: string, cookies: string, status: 'checkout'|'checkin'}} obj
 * @return {Object} response
 */
const attendance = (obj) => {
	console.log("======================================================");
	console.log("now sending attendance data to TALENTA");
	const { long, lat, desc, cookies, status } = obj;
	const data = new FormData();

	const longEncoded = rot13(Buffer.from(long).toString("base64"));
	const latEncoded = rot13(Buffer.from(lat).toString("base64"));

	data.append("longitude", longEncoded);
	data.append("latitude", latEncoded);
	data.append("status", status);
	data.append("description", desc);

	const config = {
		method: "POST",
		headers: {
			Cookie: cookies,
			...data.getHeaders(),
		},
	};

	const req = https.request(
		"https://hr.talenta.co/api/web/live-attendance/request",
		config,
		(res) => {
			console.log(`STATUS: ${res.statusCode}`);
			const body = [];
			res.on("data", (chunk) => body.push(chunk));
			res.on("end", () => {
				const resString = Buffer.concat(body).toString();
				const res = JSON.parse(resString);
				console.log(`MESSAGE: ${res.message}`);
			});
		}
	);

	req.on("error", (e) => {
		console.error(`problem with request: ${e.message}`);
	});

	// Write data to request body
	data.pipe(req);
	req.end();
};

module.exports = attendance;
