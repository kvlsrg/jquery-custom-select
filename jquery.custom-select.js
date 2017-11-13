import $ from 'jquery';

/*!
 * Custom Select jQuery Plugin
 */

const CustomSelect = (($) => {

  const defaults = {
    autocomplete: false,
    autocompletePlaceholder: false,
    block: 'custom-select',
    hideCallback: false,
    includeValue: false,
    keyboard: true,
    modifier: false,
    placeholder: false,
    showCallback: false,
    transition: 100
  };

  class CustomSelect {

    /**
     * Custom Select
     *
     * @param {Object} select - `<select>` element
     * @param {Object} [options] - Settings object
     * @param {boolean} [options.autocomplete=false] - Adds input to filter options
     * @param {string} [options.autocompletePlaceholder=false] - Autocomplete input
     * placeholder hint (appears if autocomplete option is not false)
     * @param {string} [options.block=custom-select] - Class name (BEM block name)
     * @param {Function} [options.hideCallback=false] - Fires after dropdown closes
     * @param {boolean} [options.includeValue=false] - Shows chosen value option in
     * dropdown, if enabled also cancels dropdown options rerender
     * @param {boolean} [options.keyboard=true] - Enables keyboard control
     * @param {string} [options.modifier=false] - Additional class, e.g. BEM modifier
     * @param {string} [options.placeholder=false] - Custom select placeholder hint,
     * can be an HTML string (appears if there is no explicitly selected options)
     * @param {Function} [options.showCallback=false] - Fires after dropdown opens
     * @param {number || string} [options.transition=100] - jQuery slideUp/Down speed
     */
    constructor(select, options) {
      this._$select = $(select);
      this._options = options;

      // Event handlers that can be removed
      this._keydownHandler = this._keydownHandler.bind(this);
      this._toggleDropupModifier = this._toggleDropupModifier.bind(this);
      this._outsideClickHandler = this._outsideClickHandler.bind(this);

      this._init();
    }

    _init() {
      this._$element = $(
        `<div class="${this._options.block}">
           <button class="${this._options.block}__option ${this._options.block}__option--value"></button>
           <div class="${this._options.block}__dropdown"></div>
         </div>`
      );

      this._$select
        .hide()
        .after(this._$element);

      // TODO: Move to constants out of class (?)
      // Modifiers
      this._activeModifier = `${this._options.block}--active`;
      this._dropupModifier = `${this._options.block}--dropup`;

      this._$value = this._$element.find(`.${this._options.block}__option--value`);
      this._$dropdown = this._$element.find(`.${this._options.block}__dropdown`);

      if (this._options.modifier) {
        this._$element.addClass(this._options.modifier);
      }
      this._$dropdown.html('').hide();

      // Create values array
      this._values = [];
      this._$selectOptions = this._$select.find('option');
      this._getValues();

      // Add autocomplete input
      if (this._options.autocomplete) {
        this._$input = $(`<input class="${this._options.block}__input">`);
        if (this._options.autocompletePlaceholder) {
          this._$input.attr('placeholder', this._options.autocompletePlaceholder);
        }
        this._$dropdown.append(this._$input);
      }

      if (this._options.placeholder) {
        // Disable placeholder if there is explicitly selected option
        if (this._$select.find('[selected]').length) {
          this._options.placeholder = false;
        } else {
          this._$value.html(this._options.placeholder);
          // Set select value to null
          this._$select.prop('selectedIndex', -1);
        }
      }

      // Render custom select options
      $.each(this._values, (i, el) => {
        let cssClass = this._$selectOptions.eq(i).attr('class');
        let $option = $(`<button class="${this._options.block}__option">${el}</button>`).addClass(cssClass);

        if (el === this._$select.find(':selected').text().trim()) {
          this._$value
            .text(el)
            .addClass(cssClass).data('class', cssClass);

          if (this._options.includeValue || this._options.placeholder) {
            this._$dropdown.append($option);
          }
        } else {
          this._$dropdown.append($option);
        }
      });

      this._$value.one('click', this._valueClickHandler.bind(this));
      this._$options = this._$dropdown.find(`.${this._options.block}__option`);
      this._$options.on('click', this._optionsClickHandler.bind(this));

      if (this._options.autocomplete) {
        // Add scrollable wrap
        this._$options.wrapAll(`<div class="${this._options.block}__option-wrap"></div>`);
        this._$optionWrap = this._$element.find(`.${this._options.block}__option-wrap`);

        this._$input.on('focus', () => {
          this._options.index = -1;
          this._$optionWrap.scrollTop(0);
        });

        this._$input.on('keyup', () => {
          let query = this._$input.val().trim();
          if (query.length) {
            setTimeout(() => {
              if (query === this._$input.val().trim()) {
                $.each(this._$options, (i, option) => {
                  let $option = $(option);
                  let text = $option.text().trim().toLowerCase();
                  let match = text.indexOf(query.toLowerCase()) !== -1;

                  $option.toggle(match);
                });
              }
            }, 300);
          } else {
            this._$options.show();
          }
        });
      }
    }

    _getValues() {
      this._values = [];

      $.each(this._$selectOptions, (i, option) => {
        let el = $(option).text().trim();
        this._values.push(el);
      });
    }

    _hideDropdown() {
      this._$dropdown.slideUp(this._options.transition, () => {
        this._$element
          .removeClass(this._activeModifier)
          .removeClass(this._dropupModifier);

        // Close callback
        if (typeof this._options.hideCallback === 'function') {
          this._options.hideCallback.call(this._$element[0]);
        }

        $(window)
          .off('touchstart click', this._outsideClickHandler)
          .off('resize scroll', this._toggleDropupModifier);
        this._$value
          .off('click')
          .one('click', this._valueClickHandler.bind(this));
      });

      if (this._options.keyboard) {
        this._$options.blur();
        $(window).off('keydown', this._keydownHandler);
      }

      // Clear autocomplete
      if (this._options.autocomplete) {
        this._$options.show();
        this._$input.val('');
        this._$optionWrap.scrollTop(0);
      }
    }

    _valueClickHandler(event) {
      event.preventDefault();

      // Set dropdown position modifier
      this._toggleDropupModifier();
      $(window).on('resize scroll', this._toggleDropupModifier);

      this._$element.addClass(this._activeModifier);

      this._$dropdown.slideDown(this._options.transition, () => {
        // Open callback
        if (typeof this._options.showCallback === 'function') {
          this._options.showCallback.call(this._$element[0]);
        }
      });

      let outsideClickEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
      setTimeout(() => {
        $(window).on(outsideClickEvent, this._outsideClickHandler);
      }, 0);

      this._$value.one('click', (event) => {
        event.preventDefault();

        this._hideDropdown();
      });

      if (this._options.keyboard) {
        this._options.index = -1;
        $(window).on('keydown', this._keydownHandler);
      }
    }

    _optionsClickHandler(event) {
      event.preventDefault();

      let choice = $(event.currentTarget).text().trim();
      this._$value
        .text(choice)
        .removeClass(this._$value.data('class'));
      this._$selectOptions.prop('selected', false);

      $.each(this._values, (i, el) => {
        if (!this._options.includeValue && el === choice) {
          this._values.splice(i, 1);
        }

        $.each(this._$selectOptions, (i, option) => {
          let $option = $(option);
          if ($option.text().trim() === choice) {
            let cssClass = $option.attr('class');

            $option.prop('selected', true);
            this._$value.addClass(cssClass).data('class', cssClass);
          }
        });
      });

      this._hideDropdown();

      // Update dropdown options content
      if (!this._options.includeValue) {
        if (this._$options.length > this._values.length - 1) {
          this._$options.eq(this._values.length).remove();
        }

        $.each(this._$options, (i, option) => {
          let $option = $(option);
          $option.text(this._values[i]);

          // Reset option class
          $option.attr('class', `${this._options.block}__option`);

          $.each(this._$selectOptions, (i, selectOption) => {
            let $selectOption = $(selectOption);
            if ($selectOption.text().trim() === this._values[i]) {
              $option.addClass($selectOption.attr('class'));
            }
          });
        });
      }

      this._getValues();

      if (typeof event.originalEvent !== 'undefined') {
        this._$select.trigger('change');
      }
    }

    _toggleDropupModifier() {
      let bottom = this._$element[0].getBoundingClientRect().bottom;
      let up = $(window).height() - bottom < this._$dropdown.height();

      this._$element.toggleClass(this._dropupModifier, up);
    }

    _outsideClickHandler(event) {
      let $target = $(event.target);
      if (!$target.parents().is(this._$element) && !$target.is(this._$element)) {
        this._hideDropdown();
      }
    }

    _keydownHandler(event) {
      let visibleOptions = this._$options.filter(':visible');

      switch (event.keyCode) {
        // Down
        case 40:
          event.preventDefault();

          let next = this._$dropdown.find(visibleOptions).eq(this._options.index + 1).length;
          if (next !== 0) {
            this._options.index += 1;
          } else {
            this._options.index = 0;
          }

          this._$dropdown.find(visibleOptions).eq(this._options.index).focus();
          break;

        // Up
        case 38:
          event.preventDefault();

          let prev = this._$dropdown.find(visibleOptions).eq(this._options.index - 1).length;
          if (prev !== 0 && this._options.index - 1 >= 0) {
            this._options.index -= 1;
          } else {
            this._options.index = this._$dropdown.find(visibleOptions).length - 1;
          }

          this._$dropdown.find(visibleOptions).eq(this._options.index).focus();
          break;

        // Enter
        case 13:

        // Space
        case 32:
          if (!this._$input || !this._$input.is(':focus')) {
            event.preventDefault();

            let $option = $(`.${this._options.block}__option:focus`);
            $option.trigger('click');

            if (!$option.is(this._$value)) {
              this._$select.trigger('change');
            }
            this._$value.focus();
          }
          break;

        // Esc
        case 27:
          event.preventDefault();

          this._hideDropdown();
          this._$value.focus();
          break;

        default:
          break;
      }
    }

    static _jQueryPlugin(options) {
      return this.each(function () {
        const _options = $.extend({}, defaults);
        let $this = $(this);
        let data = $this.data('custom-select');

        if (typeof options === 'object') {
          $.extend(_options, options);
        }

        if (!data) {
          data = new CustomSelect(this, _options);
          $(this).data('custom-select', data);
        }
      });
    }
  }

  $.fn['customSelect'] = CustomSelect._jQueryPlugin;
  $.fn['customSelect'].noConflict = () => $.fn['customSelect'];

})($);

export default CustomSelect;
