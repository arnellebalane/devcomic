# devcomic

Get latest dev comics from several comic sites.


## Installation

You can install it locally to use the API:

```bash
npm install devcomic
```

or globally to use the CLI:


```
npm install -g devcomic
```


## Usage

```js
const devcomic = require('devcomic');

devcomic({sources: ['commitstrip', 'xkcd']}).then(results => {
    // [{
    //   "source": "commitstrip",
    //   "image": "http://..."
    // }, {
    //   "source": "xkcd",
    //   "image": "http://..."
    // }]
});
```


## API

- **`devcomic(options)`**
  - Accepts the following options as an object:
    - `options.sources`
      - An array of comic source idenfiers, e.g. `['commitstrip', 'xkcd']`
      - Available sources are: `commitstrip`, `xkcd`, `hacktoons`
      - If not provided, defaults to using all the available sources
  - Returns a `Promise` that resolves to an array of objects containing the following keys:
    - `source`: The comic source identifier
    - `image`: The URL to the comic image


## CLI

```bash
$ devcomic --help

  Usage:
    $ devcomic [source ...]

  Sources:
    commitstrip
    xkcd
    hacktoon

  Examples:
    $ devcomic
    $ devcomic commitstrip
    $ devcomic commitstrip xkcd
```


## License

MIT License
