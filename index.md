---
title: Custom Select jQuery Plugin
---

## Options

### Custom select inited with default options

By default, all the classes of `<option>` elements are copied.

<div markdown="0">
  <select class="select select--default">
    <option value="1">First Item</option>
    <option value="2">Second Item</option>
    <option class="bold" value="3">Third Item</option>
    <option value="4">Fourth Item</option>
    <option class="bold" value="5">Fifth Very Very Long Item</option>
  </select>
  <script>
    $('.select--default').customSelect();
  </script>
</div>

```js
$('select').customSelect();
```

### Other class name (BEM block name)

Note, this example have same style in demo, but classes of all custom select elements are different.

<div markdown="0">
  <select class="select select--block">
    <option value="1">First Item</option>
    <option value="2">Second Item</option>
    <option value="3">Third Item</option>
    <option value="4">Fourth Item</option>
    <option value="5">Fifth Very Very Long Item</option>
  </select>
  <script>
    $('.select--block').customSelect({
      block: 'my-custom-select'
    });
  </script>
</div>

```js
$('select').customSelect({
  block: 'my-custom-select'
});
```

### Placeholder hint

<div markdown="0">
  <select class="select select--placeholder">
    <option value="1">First Item</option>
    <option value="2">Second Item</option>
    <option value="3">Third Item</option>
    <option value="4">Fourth Item</option>
    <option value="5">Fifth Very Very Long Item</option>
  </select>
  <script>
    $('.select--placeholder').customSelect({
      placeholder: '<span style="color: gray;">Please Select</span>'
    });
  </script>
</div>

```js
$('select').customSelect({
  placeholder: '<span style="color: gray;">Please Select</span>'
});
```

### Options Search

<div markdown="0">
  <select class="select select--search">
    <option value="1">First Item</option>
    <option value="2">Second Item</option>
    <option value="3">Third Item</option>
    <option value="4">Fourth Item</option>
    <option value="5">Fifth Very Very Long Item</option>
  </select>
  <script>
    $('.select--search').customSelect({
      search: true
    });
  </script>
</div>

```js
$('select').customSelect({
  search: true
});
```

### Block modifier (additional CSS class)

<div markdown="0">
  <select class="select select--modifier">
    <option value="1">First Item</option>
    <option value="2">Second Item</option>
    <option value="3">Third Item</option>
    <option value="4">Fourth Item</option>
    <option value="5">Fifth Very Very Long Item</option>
  </select>
  <script>
    $('.select--modifier').customSelect({
      modifier: 'custom-select--dark'
    });
  </script>
</div>

```js
$('select').customSelect({
  modifier: 'custom-select--dark'
});
```

### Included in dropdown current value

Dropdown always includes all options of original select, current value don't removes.

<div markdown="0">
  <select class="select select--include-value">
    <option value="1">First Item</option>
    <option value="2">Second Item</option>
    <option value="3">Third Item</option>
    <option value="4">Fourth Item</option>
    <option value="5">Fifth Very Very Long Item</option>
  </select>
  <script>
    $('.select--include-value').customSelect({
      includeValue: true
    });
  </script>
</div>

```js
$('select').customSelect({
  includeValue: true
});
```

<script markdown="0">
  $('.select').on('change', function () {
    console.log($(this).val());
  });
</script>
