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

* **`block`**
    <br>
    (type: _string_, default: `'custom-select'`)
    <br>
    Custom select BEM block name.

* **`hideCallback`**
    <br>
    (type: _Function_, default: `false`)
    <br>
    Fires after dropdown closes.

* **`includeValue`**
    <br>
    (type: _boolean_, default: `false`)
    <br>
    Adds chosen value option to dropdown. If enabled also cancels dropdown options rerender.

* **`keyboard`**
    <br>
    (type: _boolean_, default: `true`)
    <br>
    Enables keyboard control.

* **`modifier`**
    <br>
    (type: _string_, default: `false`) 
    <br>
    Custom select block BEM modifier.

* **`placeholder`**
    <br>
    (type: _string_, default: `false`)
    <br>
    Placeholder hint, can be an HTML string (appears only if there is no explicitly selected options).

* **`search`**
    <br>
    (type: _boolean_, default: `false`)
    <br>
    Adds input to filter options.

* **`showCallback`**
    <br>
    (type: _Function_, default: `false`)
    <br>
    Fires after dropdown opens.

* **`transition`**
    <br>
    (type: _number | string_, default: `0`)
    <br>
    jQuery slideUp/Down param.
