# jquery-custom-select
Custom Select jQuery Plugin

[![npm version](https://img.shields.io/npm/v/jquery-custom-select.svg)](https://npmjs.com/package/jquery-custom-select)

Simple plugin creates custom select instead of default `<select>`.

### Demo

You can view demo [here](https://kvlsrg.github.io/jquery-custom-select/).

### Usage

```js
$('select').customSelect();
```

Note, plugin contain default style theme. It's divided into two SCSS files:

```
sass
├── _base.scss // Only dropdown positioning, reset of options & input
└── jquery.custom-select.scss // Base & default theme
```

Selectors naming of custom select based on BEM & it's easy to create different style. Just import only base to Sass.

### Options

* **`block`** (type: _string_, default: `'custom-select'`) Custom select BEM block name.

* **`hideCallback`** (type: _Function_, default: `false`) Fires after dropdown closes.

* **`includeValue`** (type: _boolean_, default: `false`) Adds chosen value option to dropdown. If enabled also cancels dropdown options rerender.

* **`keyboard`** (type: _boolean_, default: `true`) Enables keyboard control.

* **`modifier`** (type: _string_, default: `false`) Custom select block BEM modifier.

* **`placeholder`** (type: _string_, default: `false`) Placeholder hint, can be an HTML string (appears only if there is no explicitly selected options).

* **`search`** (type: _boolean_, default: `false`) Adds input to filter options.

* **`showCallback`** (type: _Function_, default: `false`) Fires after dropdown opens.

* **`transition`** (type: _number | string_, default: `0`) jQuery slideUp/Down param.
