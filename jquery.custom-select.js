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
     * @param {Object} select - `<select>` DOM element
     * @param {Object} [options] - Settings object
     * @param {string} [options.block=custom-select] - Class name (BEM block name)
     * @param {Function} [options.hideCallback=false] - Fires after dropdown closes
     * @param {boolean} [options.includeValue=false] - Shows chosen value option in
     * dropdown, if enabled also cancels dropdown options rerender
     * @param {boolean} [options.keyboard=true] - Enables keyboard control
     * @param {string} [options.modifier=false] - Additional class, e.g. BEM modifier
     * @param {string} [options.placeholder=false] - Custom select placeholder hint,
     * can be an HTML string (appears if there is no explicitly selected options)
     * @param {boolean} [options.search=false] - Adds input to search options
     * @param {Function} [options.showCallback=false] - Fires after dropdown opens
     * @param {number || string} [options.transition=0] - jQuery slideUp/Down speed
     */
    constructor(select, options) {
      this._$select = $(select);
      this._options = options;

      // Modifiers
      this._activeModifier = `${this._options.block}--active`;
      this._dropupModifier = `${this._options.block}--dropup`;

      // Event handlers that can be removed
      this._keydown = this._keydown.bind(this);
      this._dropup = this._dropup.bind(this);
      this._outside = this._outside.bind(this);

      this._init();
    }

    /**
     * Renders initial state of custom select & sets
     * options click event listeners
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

      // Create values array
      this._$values = this._$select.find('option');
      this._values = [];

      $.each(this._$values, (i, option) => {
        const el = $(option).text().trim();
        this._values.push(el);
      });

      this._$value = this._$element.find(`.${this._options.block}__option--value`);

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

      this._$dropdown = this._$element.find(`.${this._options.block}__dropdown`);

      // Render options
      $.each(this._values, (i, el) => {
        const cssClass = this._$values.eq(i).attr('class');
        const $option = $(
          `<button class="${this._options.block}__option" type="button">${el}</button>`
        );

        if (el === this._$select.find(':selected').text().trim()) {
          this._$value
            .text(el)
            .addClass(cssClass).data('class', cssClass);

          if (this._options.includeValue || this._options.placeholder) {
            $option.addClass(cssClass);
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

      this._$value.one('click', (event) => {
        this._show(event);
      });

      if (!this._$options.length) {
        this._$value.prop('disabled', true);
      }

      this._$options.on('click', (event) => {
        this._select(event);
      });
    }

    /**
     * Shows custom select dropdown & sets outside
     * click listener to hide
     *
     * @param {Object} event - Value click jQuery event
     * @private
     */
    _show(event) {
      event.preventDefault();

      // Set dropdown position modifier
      this._dropup();
      $(window).on('resize scroll', this._dropup);

      this._$element.addClass(this._activeModifier);

      this._$dropdown.slideDown(this._options.transition, () => {
        if (this._options.search) {
          this._$input.focus();
        }

        // Open callback
        if (typeof this._options.showCallback === 'function') {
          this._options.showCallback.call(this._$element[0]);
        }
      });

      setTimeout(() => {
        const outsideClickEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
        $(window).on(outsideClickEvent, this._outside);
      }, 0);

      this._$value.one('click', (event) => {
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
     * listeners to initial
     *
     * @private
     */
    _hide() {
      this._$dropdown.slideUp(this._options.transition, () => {
        this._$element
          .removeClass(this._activeModifier)
          .removeClass(this._dropupModifier);

        // Close callback
        if (typeof this._options.hideCallback === 'function') {
          this._options.hideCallback.call(this._$element[0]);
        }

        $(window)
          .off('touchstart click', this._outside)
          .off('resize scroll', this._dropup);
        this._$value
          .off('click')
          .one('click', (event) => {
            this._show(event);
          });
      });

      if (this._options.keyboard) {
        this._$options.blur();
        $(window).off('keydown', this._keydown);
      }

      // Clear search
      if (this._options.search) {
        this._$options.show();
        this._$input
          .val('')
          .blur();
        this._$wrap.scrollTop(0);
      }
    }

    /**
     * Changes value of custom select & `<select>`
     * by chosen option
     *
     * @param {Object} event - Option click jQuery event
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

      // Update dropdown options content
      if (!this._options.includeValue) {
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

          $.each(this._$values, function() {
            const $this = $(this);
            if ($this.text().trim() === values[i]) {
              $option.addClass($this.attr('class'));
            }
          });
        });
      }

      if (typeof event.originalEvent !== 'undefined') {
        this._$select.trigger('change');
      }
    }

    /**
     * Wraps options by wrap element, adds input to
     * dropdown & implements options search
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

        this._$wrap.scrollTop(0);

        if (query.length) {
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
     * on space for dropdown below
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
     * on `$window`) is not custom select
     *
     * @param {Object} event - Outside "click" jQuery event
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
     * select options
     *
     * @param {Object} event - Keydown jQuery event
     * @private
     */
    _keydown(event) {
      const $visible = this._$options.filter(':visible');

      switch (event.keyCode) {
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
     * Creates jQuery plugin function
     *
     * @param {Object} [options] - Settings object
     * @returns {Function} - jQuery plugin
     * @private
     */
    static _jQueryPlugin(options) {
      return this.each(function () {
        const $this = $(this);
        let data = $this.data('custom-select');
        const _options = {
          ...defaults,
          ...typeof options === 'object' && options
        };

        if (!data) {
          data = new CustomSelect(this, _options);
          $this.data('custom-select', data);
        }
      });
    }
  }

  $.fn['customSelect'] = CustomSelect._jQueryPlugin;
  $.fn['customSelect'].noConflict = () => $.fn['customSelect'];

})($);

export default CustomSelect;
