import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const fsstat = promisify(fs.stat);

const defaultOptions = {
    paths: [],
};

export default function pathResolve(opts = {}) {
    const options = Object.assign({}, defaultOptions, opts);
    let { paths } = options;

    paths = paths.map(p => path.resolve(p));

    const cache = new Map();

    async function findFile(source) {
        for(let pth of paths) {

            let fullPath = path.resolve(pth, source);

            let stat = await fsstat(fullPath).catch(() => null);

            if (stat) {

                // it exists and is a file, we're done here.
                if(stat.isFile()) return fullPath;

                // it exists, but is a directory.
                if(stat.isDirectory()) {
                    // does it have an index.js ?
                    let indexPath = path.join(fullPath, 'index.js');
                    stat = await fsstat(indexPath).catch(() => null);

                    if (!stat) return null;

                    if (stat.isFile()) return indexPath;
                }

            } else {
                // can we fix the extension?
                if (path.extname(fullPath) !== '') return null;

                fullPath = `${fullPath}.js`;
            
                stat = await fsstat(fullPath).catch(() => null);

                if(stat && stat.isFile()) return fullPath;
            }

        }
    }

    function generateBundle() {
        cache.clear();
    }

    async function resolveId(source) {
        // check in cache first
        const entry = cache.get(source);

        if (entry) return entry;

        // ignore IDs with null character, these belong to other plugins
        if (/\0/.test(source)) return null;

        // if it starts with a '@', a '/', or a '.', it's not for us.
        if (/^[@/.]/.test(source)) return null;

        const path = await findFile(source);

        if (!path) return null;

        cache.set(source, path);

        return path;
    }

    return {
        generateBundle,
        resolveId,
    }
}
