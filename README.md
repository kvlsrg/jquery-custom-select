# jquery-custom-select
Custom Select jQuery Plugin

[![npm version](https://img.shields.io/npm/v/jquery-custom-select.svg)](https://npmjs.com/package/jquery-custom-select)

### Usage

```js
$('select').customSelect({
  autocomplete: true,
  placeholder: 'Search...'
});
```

### Options

Name | Type | Default | Description
---- | ---- | ------- | -----------
`autocomplete` | boolean | `false` | Adds input to filter options
`block` | string | `'custom-select'` | Class name (BEM block name)
`hideCallback` | Function | `false` | Fires after dropdown closes
`includeValue` | boolean | `false` | Shows chosen value option in dropdown, if enabled also cancels dropdown options rerender
`keyboard` | boolean | `true` | Enables keyboard control
`modifier` | string | `false` | Additional class, e.g. BEM modifier
`placeholder` | string | `false` | Autocomplete input placeholder
`showCallback` | Function | `false` | Fires after dropdown opens
`transition` | number &#124;&#124; string | `100` | jQuery slideUp/Down speed

### Style

Note, plugin does not contain any additional CSS except of base, which includes only dropdown positioning, reset of options & input. 

Selectors naming of custom select based on BEM. Here is HTML structure of block (open dropdown state):

```html
<div class="custom-select custom-select--active">
  <button class="custom-select__option custom-select__option--value">...</button>
  <div class="custom-select__dropdown">
    <button class="custom-select__option">...</button>
    <button class="custom-select__option">...</button>
    <button class="custom-select__option">...</button>
  </div>
</div>
```

### Demo

You can view demo [here](https://kvlsrg.github.io/jquery-custom-select/).
