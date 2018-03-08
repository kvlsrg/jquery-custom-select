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
    <option class="bold" value="5">Fifth Item</option>
  </select>
  <script>
    $('.select--default').customSelect();
  </script>
</p>

Also, if original `<select>` have explicitly selected `<option>` (with `selected` attribute) custom select shows it as 
chosen value.

<p markdown="0">
  <select class="select select--default">
    <option value="1">First Item</option>
    <option value="2">Second Item</option>
    <option value="3" selected>Third Item</option>
    <option value="4">Fourth Item</option>
    <option value="5">Fifth Item</option>
  </select>
  <script>
    $('.select--default').customSelect();
  </script>
</p>

```js
$('select').customSelect();
```

## Options

* **`block`**  (type: _string_, default: `'custom-select'`) Custom select BEM block name.

    <p markdown="0">
      <select class="select select--block">
        <option value="1">First Item</option>
        <option value="2">Second Item</option>
        <option value="3">Third Item</option>
        <option value="4">Fourth Item</option>
        <option value="5">Fifth Item</option>
      </select>
      <script>
        $('.select--block').customSelect({
          block: 'my-select'
        });
      </script>
    </p>

    ```js
    $('select').customSelect({
      block: 'my-select'
    });
    ```

* **`includeValue`** (type: _boolean_, default: `false`) Adds chosen value option to dropdown. If enabled also cancels dropdown options rerender.

    Dropdown always includes all options of original select, current value don't removes.

    <p markdown="0">
      <select class="select select--include-value">
        <option value="1">First Item</option>
        <option value="2">Second Item</option>
        <option value="3">Third Item</option>
        <option value="4">Fourth Item</option>
        <option value="5">Fifth Item</option>
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
    
* **`keyboard`** (type: _boolean_, default: `true`) Enables keyboard control.

    <p markdown="0">
      <select class="select select--keyboard">
        <option value="1">First Item</option>
        <option value="2">Second Item</option>
        <option value="3">Third Item</option>
        <option value="4">Fourth Item</option>
        <option value="5">Fifth Item</option>
      </select>
      <script>
        $('.select--keyboard').customSelect({
          keyboard: false
        });
      </script>
    </p>
    
    ```js
    $('select').customSelect({
      keyboard: false
    });
    ```

* **`modifier`** (type: _string_, default: `false`) Custom select block BEM modifier.

    <p markdown="0">
      <select class="select select--modifier">
        <option value="1">First Item</option>
        <option value="2">Second Item</option>
        <option value="3">Third Item</option>
        <option value="4">Fourth Item</option>
        <option value="5">Fifth Item</option>
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

* **`placeholder`** (type: _string_, default: `false`) Placeholder hint, can be an HTML string (appears only if there is no explicitly selected options).

    <p markdown="0">
      <select class="select select--placeholder">
        <option value="1">First Item</option>
        <option value="2">Second Item</option>
        <option value="3">Third Item</option>
        <option value="4">Fourth Item</option>
        <option value="5">Fifth Item</option>
      </select>
      <script>
        $('.select--placeholder').customSelect({
          placeholder: '<span style="color: darkgray;">Please Select</span>'
        });
      </script>
    </p>

    ```js
    $('select').customSelect({
      placeholder: '<span style="color: darkgray;">Please Select</span>'
    });
    ```

* **`search`** (type: _boolean_, default: `false`) Adds input to filter options.

    Search input appears in dropdown to filter options.

    <p markdown="0">
      <select class="select select--search"><option value="1">First Item</option>
        <option value="2">Second Item</option>
        <option value="3">Third Item</option>
        <option value="4">Fourth Item</option>
        <option value="5">Fifth Item</option>
        <option value="6">Sixth Item</option>
        <option value="7">Seventh Item</option>
        <option value="8">Eighth Item</option>
        <option value="9">Ninth Item</option>
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

* **`transition`** (type: _number_ &#124; _string_, default: `0`) jQuery slideUp/Down param.

    <p markdown="0">
      <select class="select select--transition">
        <option value="1">First Item</option>
        <option value="2">Second Item</option>
        <option value="3">Third Item</option>
        <option value="4">Fourth Item</option>
        <option value="5">Fifth Item</option>
      </select>
      <script>
        $('.select--transition').customSelect({
          transition: 400
        });
      </script>
    </p>

    ```js
    $('select').customSelect({
      transition: 400
    });
    ```
    
* **`hideCallback`** (type: _Function_, default: `false`) Fires after dropdown closes.

    <p markdown="0">
      <select class="select select--hide-callback">
        <option value="1">First Item</option>
        <option value="2">Second Item</option>
        <option value="3">Third Item</option>
        <option value="4">Fourth Item</option>
        <option value="5">Fifth Item</option>
      </select>
      <script>
        $('.select--hide-callback').customSelect({
          hideCallback: function () {
            var $value = $(this).find('[class$="value"]');
            console.log(`Dropdown closed! Value text is "${$value.text()}".`);
          }
        });
      </script>
    </p>

    ```js
    $('select').customSelect({
      hideCallback: function () {
        var $value = $(this).find('[class$="value"]');
        console.log(`Dropdown closed! Value text is "${$value.text()}".`);
      }
    });
    ```
    
* **`showCallback`** (type: _Function_, default: `false`) Fires after dropdown opens.

    <p markdown="0">
      <select class="select select--show-callback">
        <option value="1">First Item</option>
        <option value="2">Second Item</option>
        <option value="3">Third Item</option>
        <option value="4">Fourth Item</option>
        <option value="5">Fifth Item</option>
      </select>
      <script>
        $('.select--show-callback').customSelect({
          showCallback: function () {
            console.log('Dropdown opened!');
          }
        });
      </script>
    </p>

    ```js
    $('select').customSelect({
      showCallback: function () {
        console.log('Dropdown opened!');
      }
    });
    ```

<script markdown="0">
  $('.select').on('change', function () {
    console.log($(this).val());
  });
</script>
