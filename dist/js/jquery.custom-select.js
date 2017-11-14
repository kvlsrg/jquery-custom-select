/*!
 * Custom Select jQuery Plugin
 */
var CustomSelect = function ($) {
  var defaults = {
    block: 'custom-select',
    hideCallback: false,
    includeValue: false,
    keyboard: true,
    modifier: false,
    placeholder: false,
    search: false,
    showCallback: false,
    transition: 100,
    // Deprecated options
    // TODO: Remove in v1.3.1
    autocomplete: false
  };

  var CustomSelect =
  /*#__PURE__*/
  function () {
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
     * @param {number || string} [options.transition=100] - jQuery slideUp/Down speed
     */
    function CustomSelect(select, options) {
      this._$select = $(select);
      this._options = options; // Event handlers that can be removed

      this._keydown = this._keydown.bind(this);
      this._dropup = this._dropup.bind(this);
      this._outside = this._outside.bind(this); // TODO: Remove in v1.3.1

      if (this._options.autocomplete) {
        this._options.search = true;
        console.warn('Option `autocomplete` is deprecated since v1.3.0! Please, use `search` instead.');
      }

      this._init();
    }

    var _proto = CustomSelect.prototype;

    _proto._init = function _init() {
      var _this = this;

      this._$element = $("<div class=\"" + this._options.block + "\">\n           <button class=\"" + this._options.block + "__option " + this._options.block + "__option--value\"></button>\n           <div class=\"" + this._options.block + "__dropdown\"></div>\n         </div>");

      this._$select.hide().after(this._$element); // Modifiers


      this._activeModifier = this._options.block + "--active";
      this._dropupModifier = this._options.block + "--dropup";
      this._$value = this._$element.find("." + this._options.block + "__option--value");
      this._$dropdown = this._$element.find("." + this._options.block + "__dropdown");

      if (this._options.modifier) {
        this._$element.addClass(this._options.modifier);
      }

      this._$dropdown.html('').hide(); // Create values array


      this._values = [];
      this._$selectOptions = this._$select.find('option');
      $.each(this._$selectOptions, function (i, option) {
        var el = $(option).text().trim();

        _this._values.push(el);
      });

      if (this._options.placeholder) {
        // Disable placeholder if there is explicitly selected option
        if (this._$select.find('[selected]').length) {
          this._options.placeholder = false;
        } else {
          this._$value.html(this._options.placeholder); // Set select value to null


          this._$select.prop('selectedIndex', -1);
        }
      } // Render custom select options


      $.each(this._values, function (i, el) {
        var cssClass = _this._$selectOptions.eq(i).attr('class');

        var $option = $("<button class=\"" + _this._options.block + "__option\">" + el + "</button>");

        if (el === _this._$select.find(':selected').text().trim()) {
          _this._$value.text(el).addClass(cssClass).data('class', cssClass);

          if (_this._options.includeValue || _this._options.placeholder) {
            _this._$dropdown.append($option);
          }
        } else {
          $option.addClass(cssClass);

          _this._$dropdown.append($option);
        }
      });

      this._$value.one('click', function (event) {
        _this._show(event);
      });

      this._$options = this._$dropdown.find("." + this._options.block + "__option");

      this._$options.on('click', function (event) {
        _this._select(event);
      });

      if (this._options.search) {
        this._search();
      }
    };

    _proto._show = function _show(event) {
      var _this2 = this;

      event.preventDefault(); // Set dropdown position modifier

      this._dropup();

      $(window).on('resize scroll', this._dropup);

      this._$element.addClass(this._activeModifier);

      this._$dropdown.slideDown(this._options.transition, function () {
        if (_this2._options.search) {
          _this2._$input.focus();
        } // Open callback


        if (typeof _this2._options.showCallback === 'function') {
          _this2._options.showCallback.call(_this2._$element[0]);
        }
      });

      var outsideClickEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
      setTimeout(function () {
        $(window).on(outsideClickEvent, _this2._outside);
      }, 0);

      this._$value.one('click', function (event) {
        event.preventDefault();

        _this2._hide();
      });

      if (this._options.keyboard) {
        this._options.index = -1;
        $(window).on('keydown', this._keydown);
      }
    };

    _proto._hide = function _hide() {
      var _this3 = this;

      this._$dropdown.slideUp(this._options.transition, function () {
        _this3._$element.removeClass(_this3._activeModifier).removeClass(_this3._dropupModifier); // Close callback


        if (typeof _this3._options.hideCallback === 'function') {
          _this3._options.hideCallback.call(_this3._$element[0]);
        }

        $(window).off('touchstart click', _this3._outside).off('resize scroll', _this3._dropup);

        _this3._$value.off('click').one('click', function (event) {
          _this3._show(event);
        });
      });

      if (this._options.keyboard) {
        this._$options.blur();

        $(window).off('keydown', this._keydown);
      } // Clear search


      if (this._options.search) {
        this._$options.show();

        this._$input.val('').blur();

        this._$wrap.scrollTop(0);
      }
    };

    _proto._select = function _select(event) {
      var _this4 = this;

      event.preventDefault();
      var choice = $(event.currentTarget).text().trim();

      var values = this._values.slice();

      this._$value.text(choice).removeClass(this._$value.data('class'));

      this._$selectOptions.prop('selected', false);

      $.each(values, function (i, el) {
        if (!_this4._options.includeValue && el === choice) {
          values.splice(i, 1);
        }

        $.each(_this4._$selectOptions, function (i, option) {
          var $option = $(option);

          if ($option.text().trim() === choice) {
            var cssClass = $option.attr('class');
            $option.prop('selected', true);

            _this4._$value.addClass(cssClass).data('class', cssClass);
          }
        });
      });

      this._hide(); // Update dropdown options content


      if (!this._options.includeValue) {
        if (this._$options.length > values.length) {
          this._$options.eq(values.length).remove();
        }

        $.each(this._$options, function (i, option) {
          var $option = $(option);
          $option.text(values[i]); // Reset option class

          $option.attr('class', _this4._options.block + "__option");
          $.each(_this4._$selectOptions, function () {
            var $this = $(this);

            if ($this.text().trim() === values[i]) {
              $option.addClass($this.attr('class'));
            }
          });
        });
      }

      if (typeof event.originalEvent !== 'undefined') {
        this._$select.trigger('change');
      }
    };

    _proto._search = function _search() {
      var _this5 = this;

      // Add search input
      this._$input = $("<input class=\"" + this._options.block + "__input\" autocomplete=\"off\">");

      this._$dropdown.prepend(this._$input); // Add scrollable wrap


      this._$options.wrapAll("<div class=\"" + this._options.block + "__option-wrap\"></div>");

      this._$wrap = this._$element.find("." + this._options.block + "__option-wrap");

      this._$input.on('focus', function () {
        _this5._options.index = -1;

        _this5._$wrap.scrollTop(0);
      });

      this._$input.on('keyup', function () {
        var query = _this5._$input.val().trim();

        if (query.length) {
          setTimeout(function () {
            if (query === _this5._$input.val().trim()) {
              $.each(_this5._$options, function (i, option) {
                var $option = $(option);
                var text = $option.text().trim().toLowerCase();
                var match = text.indexOf(query.toLowerCase()) !== -1;
                $option.toggle(match);
              });
            }
          }, 300);
        } else {
          _this5._$options.show();
        }
      });
    };

    _proto._dropup = function _dropup() {
      var bottom = this._$element[0].getBoundingClientRect().bottom;

      var up = $(window).height() - bottom < this._$dropdown.height();

      this._$element.toggleClass(this._dropupModifier, up);
    };

    _proto._outside = function _outside(event) {
      var $target = $(event.target);

      if (!$target.parents().is(this._$element) && !$target.is(this._$element)) {
        this._hide();
      }
    };

    _proto._keydown = function _keydown(event) {
      var visibleOptions = this._$options.filter(':visible');

      switch (event.keyCode) {
        // Down
        case 40:
          event.preventDefault();

          var next = this._$dropdown.find(visibleOptions).eq(this._options.index + 1).length;

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

          var prev = this._$dropdown.find(visibleOptions).eq(this._options.index - 1).length;

          if (prev !== 0 && this._options.index - 1 >= 0) {
            this._options.index -= 1;
          } else {
            this._options.index = this._$dropdown.find(visibleOptions).length - 1;
          }

          this._$dropdown.find(visibleOptions).eq(this._options.index).focus();

          break;
        // Enter

        case 13: // Space

        case 32:
          if (!this._$input || !this._$input.is(':focus')) {
            event.preventDefault();
            var $option = $("." + this._options.block + "__option:focus");
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
    };

    CustomSelect._jQueryPlugin = function _jQueryPlugin(options) {
      return this.each(function () {
        var _options = $.extend({}, defaults);

        var $this = $(this);
        var data = $this.data('custom-select');

        if (typeof options === 'object') {
          $.extend(_options, options);
        }

        if (!data) {
          data = new CustomSelect(this, _options);
          $(this).data('custom-select', data);
        }
      });
    };

    return CustomSelect;
  }();

  $.fn['customSelect'] = CustomSelect._jQueryPlugin;

  $.fn['customSelect'].noConflict = function () {
    return $.fn['customSelect'];
  };
}($);
//# sourceMappingURL=jquery.custom-select.js.map