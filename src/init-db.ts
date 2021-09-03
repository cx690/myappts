import { sync } from "./model.js";

sync().then(() => {
	console.log('init db ok.');
	process.exit(0);
}).catch((e: any) => {
	console.error(e);
	process.exit(0);
});
