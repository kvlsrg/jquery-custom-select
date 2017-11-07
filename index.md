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
$('.select--default').customSelect();
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
$('.select--placeholder').customSelect({
  placeholder: '<span style="color: gray;">Please Select</span>'
});
```
