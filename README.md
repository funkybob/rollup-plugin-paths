# rollup-plugin-searchpaths

A Rollup plugin to add additional search paths for imports.

## Install

Using npm:

```console
npm install rollup-plugin-searchpaths
```

## Usage

In your `rollup.config.js` :

```js
import searchpaths from 'rollup-plugin-searchpaths'

export default {
    ...
    plugins: [
        searchpaths({
            paths: ['app/', '../common/'],
            extensions: ['ts', 'jsx', 'jsx'],
        }),
    ],
}
```

## Options

### `paths`

Type: `string[]`
Default: `[]`

A list of paths to search for packages.

The list will be normalised and resolved relative to the current path.


### `extensions`

Type: `string[]`
Default `['js']`

A list of file extensions to look for, in order of priority, when an import
doesn't specify one.

