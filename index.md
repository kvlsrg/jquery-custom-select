---
title: Custom Select jQuery Plugin
---

## Default

By default, all the classes of `<option>` elements are copied.

<p markdown="0">
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
</p>

```js
$('select').customSelect();
```

## Options

* #### `block` (default: `'custom-select'`) - Other class name (BEM block name)

    Note, this example have same style in demo, but classes of all custom select elements are different.

    <p markdown="0">
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
    </p>

    ```js
    $('select').customSelect({
      block: 'my-custom-select'
    });
    ```

* #### `includeValue` (default: `false`) - Included in dropdown current value

    Dropdown always includes all options of original select, current value don't removes.

    <p markdown="0">
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
    </p>

    ```js
    $('select').customSelect({
      includeValue: true
    });
    ```

* #### `modifier` (default: `false`) - Block modifier (additional CSS class)

    <p markdown="0">
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
    </p>

    ```js
    $('select').customSelect({
      modifier: 'custom-select--dark'
    });
    ```

* #### `placeholder` (default: `false`) - Placeholder hint

    <p markdown="0">
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
    </p>

    ```js
    $('select').customSelect({
      placeholder: '<span style="color: gray;">Please Select</span>'
    });
    ```

* #### `search` (default: `false`) - Options search

    Search input appears in dropdown to filter options.

    <p markdown="0">
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
    </p>

    ```js
    $('select').customSelect({
      search: true
    });
    ```

<script markdown="0">
  $('.select').on('change', function () {
    console.log($(this).val());
  });
</script>
