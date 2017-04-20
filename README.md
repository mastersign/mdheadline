MdHeadline
==========

[![npm package][npm-img]][npm-url]
[![dependency status][libraries-img]][libraries-url]
[![build status][travis-img]][travis-url]

> helper functions for processing [Markdown] headlines

Functions
---------

To use a function require _MdHeadline_ and call the function as a member of the module.

``` js
// require MdHeadline
var mdheadline = require('mdheadline');

// call a function from the module
var href = '#' + mdheadline.anchor('## 1. Einführung'); // -> '#einführung'
```

### `anchor(title)`

Derives an HTML anchor for a headline.
Uses the same rules as [Pandoc].

### `getAttributes(title)`

Parses the attributes of a headline and returnes a map with the found attributes.
Supportes the [PHP Markdown Extra syntax][spe-attr],

The following attribute types are supported:

* ID attributes like `# Chapter 1 { #ch_1 }`
  (is mapped to the key `id`)
* Class attributes `# Chapter 1 { .highlighted .pivot }`
  (are mapped as an array to the key `classes`)
* Explicit key value pairs `## Section 1. 2. { level=2 number="1. 2." }`
  (are mapped under thier given name)

Example:

``` js
var title = '## Chapter 1 { #ch_1 level=2 .highlighted .pivot }';
var attributes = mdheadline.getAttributes(title);
```

Result:

``` json
{
  "id": "ch_1",
  "classes": [ "highlighted", "pivot" ],
  "level": "2"
} 
```

### `removeFormat(title)`

Strippes a headline from all formatting and optional [attributes][spe-attr].

License
-------

_MdHeadline_ is published under MIT license.

[npm-url]: https://www.npmjs.com/package/mdheadline
[npm-img]: https://img.shields.io/npm/v/mdheadline.svg
[libraries-url]: https://libraries.io/npm/mdheadline
[libraries-img]: https://img.shields.io/librariesio/github/mastersign/mdheadline.svg
[travis-img]: https://img.shields.io/travis/mastersign/mdheadline/master.svg
[travis-url]: https://travis-ci.org/mastersign/mdheadline
[Markdown]: https://daringfireball.net/projects/markdown/
[spe-attr]: https://michelf.ca/projects/php-markdown/extra/#spe-attr
[Pandoc]: http://pandoc.org/README.html#header-identifiers
