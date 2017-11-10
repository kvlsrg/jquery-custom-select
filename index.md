---
title: Custom Select jQuery Plugin
---

### Custom select inited with default options

<div markdown="0">
  <select class="select select--default">
    <option value="0">All</option>
    <option value="2">Second Item</option>
    <option value="3">Third Item</option>
    <option value="4">Fourth Item</option>
    <option value="5">Fifth Very Very Long Item</option>
  </select>
  <script>
    $('.select--default').customSelect();
  </script>
</div>

```js
$('select').customSelect();
```
### Placeholder hint

<div markdown="0">
  <select class="select select--placeholder">
    <option value="0">All</option>
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

### Block modifier (additional CSS class)

<div markdown="0">
  <select class="select select--modifier">
    <option value="0">All</option>
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
    <option value="0">All</option>
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
