import $ from 'jquery';

/*!
 * Custom Select jQuery Plugin
 */

const CustomSelect = (($) => {

  const defaults = {
    block: 'custom-select',
    hideCallback: false,
    includeValue: false,
    keyboard: true,
    modifier: false,
    placeholder: false,
    search: false,
    showCallback: false,
    transition: 0
  };

  class CustomSelect {

    /**
     * Custom Select
     *
     * @param {Element} select Original `<select>` DOM element to customize.
     * @param {(Object|string)=} options Settings object or method name.
     * @param {string=} options.block Custom select BEM block name.
     * @param {Function=} options.hideCallback Fires after dropdown closes.
     * @param {boolean=} options.includeValue Adds chosen value option to
     *     dropdown. If enabled also cancels dropdown options rerender.
     * @param {boolean=} options.keyboard Enables keyboard control.
     * @param {string=} options.modifier Custom select block BEM modifier.
     * @param {string=} options.placeholder Placeholder hint, can be an HTML
     *     string (appears only if there is no explicitly selected options).
     * @param {boolean=} options.search Adds input to filter options.
     * @param {Function=} options.showCallback Fires after dropdown opens.
     * @param {(number|string)=} options.transition jQuery slideUp/Down param.
     */
    constructor(select, options) {
      this._$select = $(select);
      this._options = {
        ...defaults,
        ...typeof options === 'object' ? options : {}
      };

      // Modifiers
      this._activeModifier = `${this._options.block}--active`;
      this._dropupModifier = `${this._options.block}--dropup`;
      this._optionSelectedModifier = `${this._options.block}__option--selected`;

      // Event handlers that can be removed
      this._keydown = this._keydown.bind(this);
      this._dropup = this._dropup.bind(this);
      this._outside = this._outside.bind(this);

      this._init();
    }

    /**
     * Resets custom select options.
     *
     * @public
     */
    reset() {
      this._$dropdown.hide().empty();
      this._$value.off('click');

      this._fill();
    }

    /**
     * Renders initial state of custom select & sets
     * options click event listeners.
     *
     * @private
     */
    _init() {
      this._$element = $(
        `<div class="${this._options.block}">
           <button class="${this._options.block}__option ${this._options.block}__option--value" type="button"></button>
           <div class="${this._options.block}__dropdown" style="display: none;"></div>
         </div>`
      );

      this._$select
        .hide()
        .after(this._$element);

      if (this._options.modifier) {
        this._$element.addClass(this._options.modifier);
      }

      this._$value = this._$element.find(`.${this._options.block}__option--value`);
      this._$dropdown = this._$element.find(`.${this._options.block}__dropdown`);

      this._fill();
    }

    /**
     * Renders custom select options by original
     * select element options.
     *
     * @private
     */
    _fill() {
      this._$values = this._$select.find('option');
      this._values = [];

      let placeholder = this._options.placeholder;

      $.each(this._$values, (i, option) => {
        const el = $(option).text().trim();
        this._values.push(el);
      });

      if (placeholder) {
        // Check explicitly selected option
        if (this._$select.find('[selected]').length) {
          placeholder = false;
        } else {
          this._$value.html(placeholder);
          // Set select value to null
          this._$select.prop('selectedIndex', -1);
        }
      }

      $.each(this._values, (i, el) => {
        const cssClass = this._$values.eq(i).attr('class');
        const $option = $(
          `<button class="${this._options.block}__option" type="button">${el}</button>`
        );
        const $selected = this._$select.find(':selected');

        if (this._$values.eq(i).attr('disabled')) {
          $option.prop('disabled', true);
        }

        if ((!$selected.length && i === 0) || el === $selected.text().trim()) {
          if (!placeholder) {
            this._$value
              .text(el)
              .removeClass(this._$value.data('class')).removeData('class')
              .addClass(cssClass).data('class', cssClass);
          }

          if (this._options.includeValue || placeholder) {
            $option.addClass(cssClass);
            $option.toggleClass(this._optionSelectedModifier, this._$values.eq(i).is('[selected]'));
            this._$dropdown.append($option);
          }
        } else {
          $option.addClass(cssClass);
          this._$dropdown.append($option);
        }
      });

      this._$options = this._$dropdown.find(`.${this._options.block}__option`);

      if (this._options.search) {
        this._search();
      }

      this._$value.one('click', event => {
        this._show(event);
      });

      this._$value.prop('disabled', !this._$options.length);

      this._$options.on('click', event => {
        this._select(event);
      });
    }

    /**
     * Shows custom select dropdown & sets outside
     * click listener to hide.
     *
     * @param {Object} event Value click jQuery event.
     * @private
     */
    _show(event) {
      event.preventDefault();

      this._dropup();
      $(window).on('resize scroll', this._dropup);

      this._$element.addClass(this._activeModifier);

      this._$dropdown.slideDown(this._options.transition, () => {
        if (this._options.search) {
          this._$input.focus();

          if (this._options.includeValue) {
            this._scroll();
          }
        }

        // Open callback
        if (typeof this._options.showCallback === 'function') {
          this._options.showCallback.call(this._$element[0]);
        }
      });

      setTimeout(() => {
        $(document).on('touchstart click', this._outside);
      }, 0);

      this._$value.one('click', event => {
        event.preventDefault();

        this._hide();
      });

      if (this._options.keyboard) {
        this._options.index = -1;
        $(window).on('keydown', this._keydown);
      }
    }

    /**
     * Hides custom select dropdown & resets events
     * listeners to initial.
     *
     * @private
     */
    _hide() {
      if (this._options.search) {
        this._$input.val('').blur();
        this._$options.show();
        this._$wrap.scrollTop(0);
      }

      this._$dropdown.slideUp(this._options.transition, () => {
        this._$element
          .removeClass(this._activeModifier)
          .removeClass(this._dropupModifier);

        // Close callback
        if (typeof this._options.hideCallback === 'function') {
          this._options.hideCallback.call(this._$element[0]);
        }

        this._$value
          .off('click')
          .one('click', event => {
            this._show(event);
          });
        $(document).off('touchstart click', this._outside);
        $(window).off('resize scroll', this._dropup);
      });

      if (this._options.keyboard) {
        this._$options.blur();
        $(window).off('keydown', this._keydown);
      }
    }

    /**
     * Centers chosen option in scrollable element
     * of dropdown.
     *
     * @private
     */
    _scroll() {
      $.each(this._$options, (i, option) => {
        const $option = $(option);

        if ($option.text() === this._$value.text()) {
          const top = $option.position().top;
          const height = this._$wrap.outerHeight();
          const center = height / 2 - $option.outerHeight() / 2;

          if (top > center) {
            this._$wrap.scrollTop(top - center);
          }

          return false;
        }
      });
    }

    /**
     * Changes value of custom select & `<select>`
     * by chosen option.
     *
     * @param {Object} event Option click jQuery event.
     * @private
     */
    _select(event) {
      event.preventDefault();

      const choice = $(event.currentTarget).text().trim();
      const values = [...this._values];

      this._$value
        .text(choice)
        .removeClass(this._$value.data('class'));
      this._$values.prop('selected', false);

      $.each(values, (i, el) => {
        if (!this._options.includeValue && el === choice) {
          values.splice(i, 1);
        }

        $.each(this._$values, (i, option) => {
          const $option = $(option);
          if ($option.text().trim() === choice) {
            const cssClass = $option.attr('class');

            $option.prop('selected', true);
            this._$value.addClass(cssClass).data('class', cssClass);
          }
        });
      });

      this._hide();

      if (!this._options.includeValue) {
        // Update dropdown options content
        if (this._$options.length > values.length) {
          const last = this._$options.eq(values.length);

          last.remove();
          this._$options = this._$options.not(last);

          if (!this._$options.length) {
            this._$value.prop('disabled', true);
          }
        }

        $.each(this._$options, (i, option) => {
          const $option = $(option);
          $option.text(values[i]);

          // Reset option class
          $option.attr('class', `${this._options.block}__option`);

          $.each(this._$values, function () {
            const $this = $(this);
            if ($this.text().trim() === values[i]) {
              $option.addClass($this.attr('class'));
              $option.prop('disabled', $this.prop('disabled'));
            }
          });
        });
      } else {
        // Select chosen option
        this._$options.removeClass(this._optionSelectedModifier);

        $.each(this._$options, (i, option) => {
          const $option = $(option);

          if ($option.text().trim() === choice) {
            $option.addClass(this._optionSelectedModifier);

            return false;
          }
        });
      }

      if (typeof event.originalEvent !== 'undefined') {
        this._$select.trigger('change');
      }
    }

    /**
     * Wraps options by wrap element, adds search
     * input to dropdown.
     *
     * @private
     */
    _search() {
      this._$input = $(`<input class="${this._options.block}__input" autocomplete="off">`);
      this._$dropdown.prepend(this._$input);

      // Add scrollable wrap
      this._$options.wrapAll(`<div class="${this._options.block}__option-wrap"></div>`);
      this._$wrap = this._$element.find(`.${this._options.block}__option-wrap`);

      this._$input.on('focus', () => {
        this._options.index = -1;
      });

      this._$input.on('keyup', () => {
        const query = this._$input.val().trim();

        if (query.length) {
          this._$wrap.scrollTop(0);

          setTimeout(() => {
            if (query === this._$input.val().trim()) {
              $.each(this._$options, (i, option) => {
                const $option = $(option);
                const text = $option.text().trim().toLowerCase();
                const match = text.indexOf(query.toLowerCase()) !== -1;

                $option.toggle(match);
              });
            }
          }, 300);
        } else {
          this._$options.show();
        }
      });
    }

    /**
     * Toggles custom select dropup modifier based
     * on space for dropdown below.
     *
     * @private
     */
    _dropup() {
      const bottom = this._$element[0].getBoundingClientRect().bottom;
      const up = $(window).height() - bottom < this._$dropdown.height();

      this._$element.toggleClass(this._dropupModifier, up);
    }

    /**
     * Hides dropdown if target of event (e.g. click
     * on `$window`) is not custom select.
     *
     * @param {Object} event Outside "click" jQuery event.
     * @private
     */
    _outside(event) {
      const $target = $(event.target);
      if (!$target.parents().is(this._$element) && !$target.is(this._$element)) {
        this._hide();
      }
    }

    /**
     * Controls navigation from keyboard by custom
     * select options.
     *
     * @param {Object} event Keydown jQuery event.
     * @private
     */
    _keydown(event) {
      const $visible = this._$options.filter(':visible').not('[disabled]');

      switch (event.which) {
        // Down
        case 40:
          event.preventDefault();

          const next = $visible.eq(this._options.index + 1).length;
          if (next) {
            this._options.index += 1;
          } else {
            this._options.index = 0;
          }

          $visible.eq(this._options.index).focus();
          break;

        // Up
        case 38:
          event.preventDefault();

          const prev = $visible.eq(this._options.index - 1).length;
          if (prev && this._options.index - 1 >= 0) {
            this._options.index -= 1;
          } else {
            this._options.index = $visible.length - 1;
          }

          $visible.eq(this._options.index).focus();
          break;

        // Enter
        case 13:

        // Space
        case 32:
          if (!this._$input || !this._$input.is(':focus')) {
            event.preventDefault();

            const $option = this._$options.add(this._$value).filter(':focus');
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

          this._hide();
          this._$value.focus();
          break;

        default:
          break;
      }
    }

    /**
     * Creates jQuery plugin function.
     *
     * @param {(Object|string)=} config Options or method.
     * @returns {Function} jQuery plugin.
     */
    static _jQueryPlugin(config) {
      return this.each(function () {
        const $this = $(this);
        let data = $this.data('custom-select');

        if (!data) {
          if (typeof config !== 'string') {
            data = new CustomSelect(this, config);
            $this.data('custom-select', data);
          }
        } else {
          if (config === 'reset') {
            data.reset();
          }
        }
      });
    }
  }

  $.fn['customSelect'] = CustomSelect._jQueryPlugin;
  $.fn['customSelect'].noConflict = () => $.fn['customSelect'];

  return CustomSelect;

})($);

export default CustomSelect;
