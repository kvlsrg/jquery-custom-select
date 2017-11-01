

/*!
 * Custom Select jQuery Plugin
 */

var CustomSelect = function ($) {

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
      var $select = $(this);
      var optionsArray = [];

      var defaults = {
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

      $select.hide().after('<div class="' + defaults.block + '">\n             <button class="' + defaults.block + '__option ' + defaults.block + '__option--value"></button>\n             <div class="' + defaults.block + '__dropdown"></div>\n           </div>');

      var $selectOptions = $select.find('option');

      var customSelect = '.' + defaults.block;
      var customSelectActiveModifier = defaults.block + '--active';
      var dropdownOptionHtml = '<button class="' + defaults.block + '__option"></button>';
      var dropdownOptions = customSelect + '__option';

      var $customSelect = $select.next(customSelect);
      var $customSelectValue = $customSelect.find(customSelect + '__option--value');
      var $dropdown = $customSelect.find(customSelect + '__dropdown');

      if (defaults.modifier) {
        $customSelect.addClass(defaults.modifier);
      }

      createOptionsArray();
      $dropdown.html('').hide();
      var $input = null;

      // Add autocomplete input
      if (defaults.autocomplete) {
        $input = $('<input class="' + defaults.block + '__input">');
        if (defaults.placeholder) {
          $input.attr('placeholder', defaults.placeholder);
        }
        $dropdown.append($input);
      }

      // Create custom select options
      $.each(optionsArray, function (i, el) {
        var cssClass = $selectOptions.eq(i).attr('class');
        var $currentOption = $(dropdownOptionHtml).text(el).addClass(cssClass);

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

      var $dropdownOptions = $dropdown.find(dropdownOptions);
      var $optionWrap = null;

      if (defaults.autocomplete) {
        $dropdownOptions.wrapAll('<div class="' + defaults.block + '__option-wrap"></div>');
        $optionWrap = $dropdown.find(customSelect + '__option-wrap');
      }

      $dropdownOptions.on('click', function (event) {
        var choice = $(this).text().trim();
        $customSelectValue.text(choice).removeClass($customSelectValue.data('class'));
        $selectOptions.prop('selected', false);

        $.each(optionsArray, function (i, el) {
          if (!defaults.includeValue && el === choice) {
            optionsArray.splice(i, 1);
          }
          $.each($selectOptions, function (i, option) {
            var $option = $(option);
            if ($option.text().trim() === choice) {
              var cssClass = $option.attr('class');
              $option.prop('selected', true);
              $customSelectValue.addClass(cssClass).data('class', cssClass);
            }
          });
        });

        hideDropdown();

        // Recreate custom select dropdown options
        if (!defaults.includeValue) {
          $.each($dropdownOptions, function (i, option) {
            var $option = $(option);
            $option.text(optionsArray[i]);

            // Reset option class
            $option.attr('class', defaults.block + '__option');

            $.each($selectOptions, function () {
              var $this = $(this);
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
          var query = $input.val().trim();
          if (query.length) {
            setTimeout(function () {
              if (query === $input.val().trim()) {
                $.each($dropdownOptions, function (i, option) {
                  var $option = $(option);
                  var match = $option.text().trim().toLowerCase().indexOf(query.toLowerCase()) !== -1;
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

        $.each($selectOptions, function (i, option) {
          var el = $(option).text().trim();
          optionsArray.push(el);
        });
      }

      function hideDropdown() {
        $customSelect.removeClass(customSelectActiveModifier);
        $dropdown.slideUp(defaults.transition, function () {
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
        $customSelectValue.one('click', function () {
          var windowEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';

          $customSelect.addClass(customSelectActiveModifier);
          $dropdown.slideDown(defaults.transition, function () {
            // Open callback
            if (typeof defaults.showCallback === 'function') {
              defaults.showCallback.call($customSelect[0]);
            }
          });

          $(window).on(windowEvent, windowEventHandler);
          $customSelectValue.one('click', function () {
            hideDropdown();
          });

          if (defaults.keyboard) {
            defaults.index = -1;
            $(window).on('keydown', keyboardHandler);
          }
        });
      }

      function windowEventHandler(event) {
        var $target = $(event.target);
        if (!$target.parents().is($customSelect) && !$target.is($customSelect)) {
          hideDropdown();
        }
      }

      function keyboardHandler(event) {
        var visibleOptions = dropdownOptions + ':visible';

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
}($);
//# sourceMappingURL=jquery.custom-select.js.map