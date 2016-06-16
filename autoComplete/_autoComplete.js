/**
 * jQuery auto complete plugin
 *
 *  Depends:
 *     - jQuery 1.4.2+
 *  author:
 *     - lanqy 2016-3-25
 */
(function($) {

    $.extend($.fn, {
        _autoComplete: function(options) {
            return this.each(function() {
                var _autoComplete = $.data(this, "_autoComplete");
                if (!_autoComplete) {
                    _autoComplete = new $._autoComplete(options, this);
                    $.data(this, "_autoComplete", _autoComplete);
                }
            });
        }
    });

    $._autoComplete = function(options, el) {
        if (arguments.length) {
            this._init(options, el);
        }
    }

    $._autoComplete.prototype = {
        options: {
            hiddenId: 'hidenName',
            className: 'auto-box',
            listWidth: 400,
            fields: [],
            data: '',
            isInit: true, //是否初始化下拉数据
            listHeight: 300,
        },

        _init: function(options, el) { // init
            this.options = $.extend(true, {}, this.options, options)
            this.element = $(el);
            this.setDataId();
            this._build(this.element);
            this._bindEvents();
        },

        _bindEvents: function() {
            var self = this;
            this.element.focus(function(event) {
                self._onFocus();
            });

            this.element.keyup(function(event) {
                self._doKeyUp($(this), event);
            });

            this.element.keydown(function(event) {
                self._doKeyDown(event);
            });

            $(document).click(function(event) {
                self._docClick(event);
            });
        },

        _onFocus: function() {
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            if ($list.css("display") === 'none' && this._hasResult()) {
                this.showPop();
            }
        },

        _hasResult: function() {
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            return $list.find('ul li:first').attr('data-id');
        },

        _doKeyDown: function(a) {
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            var c = a.keyCode;
            if ($list.find('ul').find('li').attr("data-id")) {
                if (c === 38 || c === 40) { // 处理上线箭头
                    event.preventDefault();
                    this[c === 38 ? "previous" : "next"]();
                } else if (c === 9 || c === 13) { // tab键 enter键
                    this._setValue();
                }
            }
        },

        _doKeyUp: function(el, a) {

            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            var b = $.trim(el.val());
            var kc = a.keyCode;
            if (b && kc !== 38 && kc !== 40 && kc !== 13) {
                this.hidePop();
                var data = this._doFilter(this.options.data, b);
                this._getLiveData(data, true); //true 显示下拉
            }

            if (kc === 13 && $list.css("display") === 'block') {
                this._setValue();
            }
            if (b == "") {
                $list.find('ul').html('');
                $list.hide();
                $("#" + this.options.hiddenId).val("");
            }

        },

        _docClick: function(a) {
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            if (a.target.id !== this.element.attr('id') && $list.find('ul').css("display") === 'block') {
                this._setValue();
            }
        },

        setDataId: function() {
            var r = new Date().getTime();
            this.element.attr('data-autoId', 'auto_' + r);
        },

        getElementPos: function() {
            return this.element.offset();
        },

        getElementHeight: function() {
            return this.element.outerHeight();
        },

        _doHover: function() {
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            $list.find('ul').find('li').hover(function() {
                if ($(this).attr("data-id")) {
                    $list.find('ul').find('li').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        },

        _build: function() {
            var r = new Date().getTime();
            var id = this.element.attr('data-autoId');
            var left = this.getElementPos().left;
            var top = this.getElementPos().top + this.getElementHeight();
            $('body').append('<div id=wrap_' + id + ' class=' + this.options.className + ' style="position:absolute;top:' + top + 'px;left:' + left + 'px;z-index:99999;display:none;width:' + this.options.listWidth + 'px;height:' + this.options.listHeight + 'px"><ul></ul></div>');
            if (this.options.isInit) {
                this._buildTpl(this.options.data);
            }
        },

        _setValue: function() {
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            this.element.val($list.find('li.selected').attr("data-name"));
            $("#" + this.options.hiddenId).val($list.find('li.selected').attr("data-id")).trigger("change");
            this._hide();
        },

        _hide: function() {
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            $list.hide();
            $list.find('ul li span').removeClass('highlight');
        },

        _show: function() {
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            $list.show();
        },

        next: function() { // 下一个
            var o = this._getCountIndex();
            this._goto(o.index < o.count - 1 ? o.index + 1 : -1);
        },

        previous: function() { // 上一个
            var o = this._getCountIndex();
            this._goto(o.index === 0 ? 0 : o.index - 1);
        },

        _getCountIndex: function() { // 获取下拉数据的总数和当前选中的文本的索引
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            var count = $list.find("ul li").length;
            var index = $list.find("li.selected").index();
            return {
                'count': count,
                'index': index
            }
        },

        getArr: function(data) {
            return this.options.data;
        },

        _goto: function(i) {
            var a = $('#wrap_' + this.element.attr('data-autoId')),
                $li = a.find("ul li"),
                b = a.find("ul li.selected"),
                sel = 'selected';
            $li.removeClass(sel);
            $li.eq(i).addClass(sel);
            var c = a.find("ul li.selected")
            this._scrollTo(a, c);
        },

        _scrollTo: function(a, b) {
            a.scrollTop(a.scrollTop() - a.offset().top + b.offset().top);
        },

        _getLiveData: function(data, a) { // 实时获取数据
            this._buildTpl(data, a);
        },

        _buildTpl: function(data, a) { // 生成下拉数据列表
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            var self = this;
            var tpl = '<li data-id="$id" class="$selected" data-name="$name">$content</li>';
            var row = '';
            if (data.length !== 0) {
                $.each(data, function(a, b) {
                    var c = b[self.options.fields[1]] + '(' + b[self.options.fields[0]] + ')';
                    row += tpl.replace(/\$selected/, (a === 0 ? "selected" : '')).replace(/\$content/, c).replace(/\$name/g, b[self.options.fields[1]]).replace(/\$id/g, b[self.options.fields[0]]);
                });

            } else {
                row = '<li style="cursor:auto;">没有匹配的数据</li>'
            }
            $list.find('ul').empty().html(row);
            if (a) {
                this._show();
            }
            $list.highlight($.trim($(this.element).val())); // 依赖highlight 高亮插件
            this._doHover();

        },

        _doFilter: function(data, key) {
            var i;
            var entry;
            var results = [];
            var name = key.toLowerCase();
            var len = this.options.fields.length;
            var j;
            for (i = 0; i < data.length; ++i) {
                entry = data[i];
                for (j = 0; j <= len; j++) { // 通过字段索引
                    if ((entry && entry[j] && entry[j].toLowerCase().indexOf(name) !== -1)) {
                        results.push(entry);
                    }
                }
            }

            return results;
        },

        showPop: function() {
            var self = this;
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            if ($list.css("display") === "none") {
                this._show();
            }
        },

        hidePop: function() {
            var $list = $('#wrap_' + this.element.attr('data-autoId'));
            if ($list.css("display") === "block") {
                this._hide();
            }
        }
    }

})(jQuery);
