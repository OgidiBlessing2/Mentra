import cron from "cron"
import https from "https"
import dotenv from "dotenv/config"


const job = new cron.CronJob("*/14 * * * *", function() {
	https.get(process.env.API_URL, (res) => {
		if (res.statusCode === 200) console.log('GET REQUST SENT SUCCESFULLY')
		else console.log('GET REQUEST FAILED', res.statusCode);
	}).on("error", (e) => console.error("Error while sending requst "), e)

});

export default job