devcomic
========

Get latest dev comics from several comic sites.


### Install

You can install it locally:

```bash
npm install --save devcomic
```

or globally:


```
npm install --g devcomic
```


### Usage

```javascript
var devcomic = require('devcomic');

devcomic(function(comics) {
    // comics is an `Object`
});
```


### API

#### `devcomic(callback [, options])`

Returns an object of comics from different sources. It could look like:

```javascript
{
    "CommitStrip": [
        {
            "title": "...",
            "link": "..."
        }
    ],
    "HackToons": [
        {
            "title": "...",
            "link": "..."
        }
    ]
}
```

##### `options` object

- **`all`** Display all results.
- **`sources`** Only display results from the given list of sources. Currently,
  the available sources are only **CommitStrip** and **HackToon**.


### CLI

```bash
$ devcomic --help

  Usage:
    $ devcomic [sources]
    $ devcomic [options] [sources]

  Options:
    --all, -a              Display all results.
    --preview, -p          Preview comics images.

  By default (without options), it displays one result from all sources.

  Examples:
    $ devcomic
    $ devcomic --all
    $ devcomic --all commitstrip hacktoons
    $ devcomic -pa
```


### License

MIT License
