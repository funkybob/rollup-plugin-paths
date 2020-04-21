import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const fsstat = promisify(fs.stat);

const defaultOptions = {
    paths: [],
    extensions: ['js'],
};

export default function pathResolve(opts = {}) {
    const options = Object.assign({}, defaultOptions, opts);
    let { paths, extensions } = options;

    paths = paths.map(p => path.resolve(p));

    const cache = new Map();

    async function resolveExtension(fullPath) {
        let stat = await fsstat(fullPath).catch(() => null);

        if (stat && stat.isFile()) return fullPath;

        if (path.extname(fullPath) !== '') return;

        for(let ext of extensions) {
            let extPath = `${fullPath}.${ext}`;
            let extStat = await fsstat(extPath).catch(() => null);

            if (extStat && extStat.isFile()) return extPath;
        }

    }

    async function findFile(source) {
        for(let pth of paths) {

            const resolvedPath = path.resolve(pth, source);

            const stat = await fsstat(resolvedPath).catch(() => null);
            if (stat && stat.isFile()) return resolvedPath;

            const fullName = resolveExtension(resolvedPath);
            if (fullName) return fullName;

            if (stat && stat.isDirectory()) {
                const indexName = resolveExtension(path.join(resolvedPath, 'index'));
                if(indexName) return indexName;
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
