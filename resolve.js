import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * @param {string} specifier
 * @param {{
 *   conditions: string[],
 *   parentURL?: string,
 * }} context
 * @param {Function} defaultResolve
 * @returns {Promise<{ url: string }>}
 */
export async function resolve(specifier, context, defaultResolve) {
    if (specifier.endsWith('.js') || /file:\/\//.test(specifier) || !specifier.startsWith('.')) {
        return defaultResolve(specifier, context, defaultResolve);
    }

    const { parentURL } = context;
    const file = parentURL ? new URL(specifier, parentURL).href : new URL(specifier).href;
    const url = fileURLToPath(file);

    if (fs.existsSync(url + '.js')) {
        return defaultResolve(specifier + '.js', context, defaultResolve);
    }

    if (fs.existsSync(url + '/index.js')) {
        return defaultResolve(specifier + '/index.js', context, defaultResolve);
    }

    return defaultResolve(specifier, context, defaultResolve);
}

