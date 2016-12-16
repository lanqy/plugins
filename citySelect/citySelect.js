/**
 * city select plugin
 *
 * 	Depends:
 *	   - jQuery 1.4.2+
 * 	author:
 *     - lanqy 2016-12-16
 */
(function($) {
    $.extend($.fn, {
        CitySelect: function(options) {
            return this.each(function() {
                var CitySelect = $.data(this, "CitySelect");
                if (!CitySelect) {
                    CitySelect = new $.CitySelect(options, this);
                    $.data(this, "CitySelect", CitySelect);
                }
            });
        }
    });

    $.CitySelect = function(options, el) {
        if (arguments.length) {
            this._init(options, el);
        }
    }

    $.CitySelect.prototype = {

        options: {
            width: null,
            height: null,
            defaultText: '请选择',
            cityData: null, // data list
            textForValue: false, // use text for value
            showDefaultText: false,
            container: null,
            province: null,
            city: null,
            area: null,
            callback: null
        },

        _init: function(options, el) {
            this.options = $.extend(true, {}, this.options, options);
            this.element = $(el);
            var a = this.render(this.options.cityData['86'], 'province');
            this.buildProvinceSel(a, 'province');
            this.bindEvents();
        },

        bindEvents: function() {
            var self = this;
            this.element.delegate('select', 'change', function(e) {
                self._onChange(e);
            });

        },

        _onChange: function(e) {
            this.renderToEl(e);
        },

        renderToEl: function(e){
              var self = this;
              var target = e.currentTarget;
              var $t = $(target);
              var $sel = $t.find(":selected");
              var text = $sel.attr("data-txt");
              var type = $sel.attr("data-type");
              var v = $sel.attr("data-val");
              var _type = type === "province" ? 'city' : 'area';
              var d = this.options.cityData;
              var row = self.render(d[parseInt(v, 10)], (type === "province" ? 'city' : 'area'));
              var isSelect = this.isSelect($t);
              var defaultOption = "<option value=''> "+ this.options.defaultText +" </option>";
              if (isSelect) {
                  row = "<select data-type=" + _type + "> " + row + "</select>";
              }

              if (type === "province") {
                  self.options.city.html(row);
                  self.options.area.html(defaultOption);
              }

              if (type === "city") {
                  self.options.area.html((v == '' ? defaultOption : row));
              }
        },

        render: function(data, type) {

            var defaultOption = "<option value='' data-type='$type' > "+ this.options.defaultText +" </option>";
            var tpl = "<option value='$key' data-val='$key' data-type='$type' data-txt='$value'>$value</option>";
            var row = '';

            for (var key in data) {
                row += tpl.replace(/\$key/g, key)
                    .replace(/\$value/g, data[key])
                    .replace(/\$type/g, type)
            }

            if(this.options.showDefaultText && this.options.defaultText){
              row = defaultOption.replace(/\$type/g, type) + row;
            }

            return row;
        },

        buildProvinceSel: function(row, type) {
            if (this.isSelect(this.options.province)) {
                this.options.province.html(row);
            } else {
                this.options.province.html("<select data-type=" + type + "> " + row + "</select>")
            }
        },

        isSelect: function(el) { // check if is select element
            return this.element[0].tagName === "SELECT";
        }
    }
    $.extend($.fn, {

        setValue: function(index) {
            $(this).data("select") && $(this).data("select")._setValue(index);
        },

        getValue: function() {
            $(this).data("select") && $(this).data("select")._getValue();
        }
    });
})(jQuery);
