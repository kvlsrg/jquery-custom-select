# jquery-custom-select
Custom Select jQuery Plugin

[![npm version](https://img.shields.io/npm/v/jquery-custom-select.svg)](https://npmjs.com/package/jquery-custom-select)

Simple plugin creates custom select instead of default `<select>`.

### Docs & Demo

You can view docs & demo [here](https://kvlsrg.github.io/jquery-custom-select/).

### Usage

```js
$('select').customSelect();
```

Note, plugin contains default theme. It's divided into two SCSS files:

```
sass
├── _base.scss // Only dropdown positioning, reset of options & input
└── jquery.custom-select.scss // Base + default theme
```
