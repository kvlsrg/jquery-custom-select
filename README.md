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

Name | Type | Default | Description
---- | ---- | ------- | -----------
`block` | string | `'custom-select'` | Class name (BEM block name)
`hideCallback` | Function | `false` | Fires after dropdown closes
`includeValue` | boolean | `false` | Shows chosen value option in dropdown, if enabled also cancels dropdown options rerender
`keyboard` | boolean | `true` | Enables keyboard control
`modifier` | string | `false` | Additional class (BEM modifier)
`placeholder` | string | `false` | Custom select placeholder hint, can be an HTML string (appears if there is no explicitly selected options)
`search` | boolean | `false` | Adds input to search options
`showCallback` | Function | `false` | Fires after dropdown opens
`transition` | number &#124; string | `0` | jQuery slideUp/Down speed
