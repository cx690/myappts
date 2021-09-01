import { sync } from "./model";

sync().then(() => {
	console.log('init db ok.');
	process.exit(0);
})
