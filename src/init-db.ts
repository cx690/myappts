import connectDb from "./entity.js";

if (process.env.NODE_ENV === 'production') {
    throw new Error(`Can't use synchronize action on production!`);
}
connectDb(true).then(() => {
    console.log('Init database successfuly!');/* eslint-disable-line no-console */
    process.exit(0);
})