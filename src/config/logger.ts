import path from 'path';
import log4js from 'koa-log4';

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //生成文件的规则
      filename: path.join('back-end/logs/', 'access.log'), //生成文件名
      alwaysIncludePattern: true,
    },
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.join('back-end/logs/', 'application.log'),
      alwaysIncludePattern: true,
    },
    out: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    access: { appenders: ['access'], level: 'info' },
    application: { appenders: ['application'], level: 'info' }
  }
});


export const accessLogger = log4js.getLogger('access'); //记录所有访问级别的日志,主要是websocket相关的
export const logger = log4js.getLogger('application');  //记录所有应用级别的日志