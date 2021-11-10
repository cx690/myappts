declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production'
    }
}

declare module '@socket.io/sticky' {
    const setupMaster: (...args: any[]) => any;
    const setupWorker: (...args: any[]) => any;
    export { setupMaster, setupWorker };
}