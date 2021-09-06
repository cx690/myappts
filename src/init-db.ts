import { sync } from "./model.js";

sync().then(() => {
	console.log('init db ok.');/* eslint-disable-line no-console */
	process.exit(0);
}).catch((e: any) => {
	console.error(e);/* eslint-disable-line no-console */
	process.exit(0);
});
