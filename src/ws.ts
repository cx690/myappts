import path from 'path';
import { Namespace, Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { fileURLToPath } from 'url';
import { ClassFunction } from './router.js';
import { getPath } from './utils/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nspList: NSP[] = [];


export function getNspList(): NSP[];
export function getNspList(path: string): NSP | null;
export function getNspList(path?: string) {
	if (path === undefined) return nspList;
	return nspList.find(v => v.path === path) ?? null;
}

/** 注册ws命名空间以及方法 */
export async function registWs(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
	const urls = await getPath(__dirname, './websockets');
	const allClass: ClassFunction[] = [];
	(await Promise.all([...findWebsockets(urls)])).map(v => {
		for (const key in v) {
			if (Reflect.getMetadata('isnsp', v[key]) != null) {
				allClass.push(v[key]);
			}
		}
	});
	for (const item of allClass) {
		const path = Reflect.getMetadata('isnsp', item);
		const instance: any = new item();
		const namespace = io.of(path);

		const events: EV[] = []
		for (const propertyKey of Object.getOwnPropertyNames(item.prototype)) {
			if (propertyKey === 'constructor' || propertyKey === 'connection') continue;
			const ev = Reflect.getMetadata('action', item, propertyKey);
			if (ev) {
				events.push({
					ev,
					propertyKey
				})
			}
		}

		namespace.on('connection', async (socket) => {
			await instance['connection'](socket);
			for (const { ev, propertyKey } of events) {
				socket.on(ev, async (...args) => {
					instance[propertyKey](socket, ...args);
				})
			}
		})

		nspList.push({
			path,
			nsp: namespace,
			instance
		})
	}
}

function* findWebsockets(urls: string[]) {
	for (const path of urls) {
		yield import(path);
	}
}

type EV = {
	ev: string;
	propertyKey: string;
}

type NSP = {
	path: string;
	nsp: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
	instance: any
}