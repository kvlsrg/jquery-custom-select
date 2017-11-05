import $ from 'jquery';

/*!
 * Custom Select jQuery Plugin
 */

const CustomSelect = (($) => {

  /**
   * Custom Select
   *
   * Creates custom dropdown instead of default `<select>`
   *
   * @param {Object} [options] - Settings object
   * @param {boolean} [options.autocomplete=false] - Adds input to filter options
   * @param {string} [options.block=custom-select] - Class name (BEM block name)
   * @param {Function} [options.hideCallback=false] - Fires after dropdown closes
   * @param {boolean} [options.includeValue=false] - Shows chosen value option in
   * dropdown, if enabled also cancels dropdown options rerender
   * @param {boolean} [options.keyboard=true] - Enables keyboard control
   * @param {string} [options.modifier=false] - Additional class, e.g. BEM modifier
   * @param {string} [options.placeholder=false] - Autocomplete input placeholder
   * @param {Function} [options.showCallback=false] - Fires after dropdown opens
   * @param {number || string} [options.transition=100] - jQuery slideUp/Down speed
   */
  function CustomSelect(options) {
    $(this).each(function () {
      let $select = $(this);
      let optionsArray = [];

      const defaults = {
        autocomplete: false,
        block: 'custom-select',
        hideCallback: false,
        includeValue: false,
        keyboard: true,
        modifier: false,
        placeholder: false,
        showCallback: false,
        transition: 100
      };

      if (typeof options === 'object') {
        $.extend(defaults, options);
      }

      $select
        .hide()
        .after(
          `<div class="${defaults.block}">
             <button class="${defaults.block}__option ${defaults.block}__option--value"></button>
             <div class="${defaults.block}__dropdown"></div>
           </div>`
        );

      let $selectOptions = $select.find('option');

      const customSelect = `.${defaults.block}`;
      const customSelectActiveModifier = `${defaults.block}--active`;
      const dropdownOptionHtml = `<button class="${defaults.block}__option"></button>`;
      const dropdownOptions = `${customSelect}__option`;

      let $customSelect = $select.next(customSelect);
      let $customSelectValue = $customSelect.find(`${customSelect}__option--value`);
      let $dropdown = $customSelect.find(`${customSelect}__dropdown`);

      if (defaults.modifier) {
        $customSelect.addClass(defaults.modifier);
      }

      createOptionsArray();
      $dropdown.html('').hide();
      let $input = null;

      // Add autocomplete input
      if (defaults.autocomplete) {
        $input = $(`<input class="${defaults.block}__input">`);
        if (defaults.placeholder) {
          $input.attr('placeholder', defaults.placeholder);
        }
        $dropdown.append($input);
      }

      // Create custom select options
      $.each(optionsArray, (i, el) => {
        let cssClass = $selectOptions.eq(i).attr('class');
        let $currentOption = $(dropdownOptionHtml).text(el).addClass(cssClass);

        if (el === $select.find(':selected').text().trim()) {
          $customSelectValue.text(el).addClass(cssClass).data('class', cssClass);
          if (defaults.includeValue) {
            $dropdown.append($currentOption);
          }
        } else {
          $dropdown.append($currentOption);
        }
      });

      setDropdownToggle();

      let $dropdownOptions = $dropdown.find(dropdownOptions);
      let $optionWrap = null;

      if (defaults.autocomplete) {
        $dropdownOptions.wrapAll(`<div class="${defaults.block}__option-wrap"></div>`);
        $optionWrap = $dropdown.find(`${customSelect}__option-wrap`);
      }

      $dropdownOptions.on('click', function (event) {
        let choice = $(this).text().trim();
        $customSelectValue.text(choice).removeClass($customSelectValue.data('class'));
        $selectOptions.prop('selected', false);

        $.each(optionsArray, (i, el) => {
          if (!defaults.includeValue && el === choice) {
            optionsArray.splice(i, 1);
          }
          $.each($selectOptions, function (i, option) {
            let $option = $(option);
            if ($option.text().trim() === choice) {
              let cssClass = $option.attr('class');
              $option.prop('selected', true);
              $customSelectValue.addClass(cssClass).data('class', cssClass);
            }
          });
        });

        hideDropdown();

        // Recreate custom select dropdown options
        if (!defaults.includeValue) {
          $.each($dropdownOptions, (i, option) => {
            let $option = $(option);
            $option.text(optionsArray[i]);

            // Reset option class
            $option.attr('class', `${defaults.block}__option`);

            $.each($selectOptions, function () {
              let $this = $(this);
              if ($this.text().trim() === optionsArray[i]) {
                $option.addClass($this.attr('class'));
              }
            });
          });
        }

        createOptionsArray();
        if (typeof event.originalEvent !== 'undefined') {
          $select.trigger('change');
        }
      });

      // Autocomplete
      if (defaults.autocomplete) {
        $input.on('focus', function () {
          defaults.index = -1;
          $optionWrap.scrollTop(0);
        });

        $input.on('keyup', function () {
          let query = $input.val().trim();
          if (query.length) {
            setTimeout(() => {
              if (query === $input.val().trim()) {
                $.each($dropdownOptions, (i, option) => {
                  let $option = $(option);
                  let match = $option.text().trim().toLowerCase().indexOf(query.toLowerCase()) !== -1;
                  $option.toggle(match);
                });
              }
            }, 300);
          } else {
            $dropdownOptions.show();
          }
        });
      }

      function createOptionsArray() {
        optionsArray = [];

        $.each($selectOptions, (i, option) => {
          let el = $(option).text().trim();
          optionsArray.push(el);
        });
      }

      function hideDropdown() {
        $dropdown.slideUp(defaults.transition, () => {
          $customSelect.removeClass(customSelectActiveModifier);

          // Close callback
          if (typeof defaults.hideCallback === 'function') {
            defaults.hideCallback.call($customSelect[0]);
          }
        });

        $(window).off('click touchstart', windowEventHandler);
        $customSelectValue.off('click');
        setDropdownToggle();

        if (defaults.keyboard) {
          $dropdownOptions.blur();
          $(window).off('keydown', keyboardHandler);
        }

        // Clear autocomplete
        if (defaults.autocomplete) {
          $dropdownOptions.show();
          $input.val('');
          $optionWrap.scrollTop(0);
        }
      }

      function setDropdownToggle() {
        $customSelectValue.one('click', () => {
          const windowEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';

          $customSelect.addClass(customSelectActiveModifier);
          $dropdown.slideDown(defaults.transition, () => {
            // Open callback
            if (typeof defaults.showCallback === 'function') {
              defaults.showCallback.call($customSelect[0]);
            }
          });

          $(window).on(windowEvent, windowEventHandler);
          $customSelectValue.one('click', () => {
            hideDropdown();
          });

          if (defaults.keyboard) {
            defaults.index = -1;
            $(window).on('keydown', keyboardHandler);
          }
        });
      }

      function windowEventHandler(event) {
        let $target = $(event.target);
        if (!$target.parents().is($customSelect) && !$target.is($customSelect)) {
          hideDropdown();
        }
      }

      function keyboardHandler(event) {
        let visibleOptions = dropdownOptions + ':visible';

        switch (event.keyCode) {
          // Down
          case 40:
            event.preventDefault();
            if ($dropdown.find(visibleOptions).eq(defaults.index + 1).length !== 0) {
              defaults.index += 1;
            } else {
              defaults.index = 0;
            }
            $dropdown.find(visibleOptions).eq(defaults.index).focus();
            break;
          // Up
          case 38:
            event.preventDefault();
            if ($dropdown.find(visibleOptions).eq(defaults.index - 1).length !== 0 && defaults.index - 1 >= 0) {
              defaults.index -= 1;
            } else {
              defaults.index = $dropdown.find(visibleOptions).length - 1;
            }
            $dropdown.find(visibleOptions).eq(defaults.index).focus();
            break;
          // Enter
          case 13:
          // Space
          case 32:
            if (!$input || !$input.is(':focus')) {
              event.preventDefault();
              $(dropdownOptions + ':focus').trigger('click');
              $select.trigger('change');
              $customSelectValue.focus();
            }
            break;
          // Esc
          case 27:
            event.preventDefault();
            hideDropdown();
            $customSelectValue.focus();
            break;
        }
      }
    });
  }

  $.fn['customSelect'] = CustomSelect;

})($);

export default CustomSelect;
