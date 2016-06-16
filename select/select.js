/**
 * select plugin
 *
 * 	Depends:
 *	   - jQuery 1.4.2+
 * 	author:
 *     - lanqy 2016-05-25
 */
(function($) {
    $.extend($.fn, {
        Select: function(options) {
            return this.each(function() {
                var select = $.data(this, "select");
                if (!select) {
                    select = new $.Select(options, this);
                    $.data(this, "select", select);
                }
            });
        }
    });

    $.Select = function(options, el) {
        if (arguments.length) {
            this._init(options, el);
        }
    }

    $.Select.prototype = {

        options: {
            width: null,
            height: null,
            defaultText:'请选择',
            handlerCls: 'select-handler',
            listCls: 'p-select-list',
            selectedCls: 'selected',
            handlerTpl: "<div class='$handlerCls' id='$id'><span class='span_$handlerCls'></span><i></i></div>",
            itemTpl: "<li data-val='$value' class='$selected'>$text</li>",
            listWarpTpl: "<ul id='$id' class='$cls' style='display:none;'>$list</ul>",
            callback: null
        },

        _init: function(options, el) {
            this.options = $.extend(true, {}, this.options, options);
            this.element = $(el);
            this.buildSelect();
            this.bindEvents();
        },

        bindEvents: function() {
            var self = this;
            $(document).keydown(function(e) {
                var dom = $("#" + self.options.warpId);
                var isshow = dom.css("display");
                if (isshow === 'block' && (e.keyCode === 38 || e.keyCode === 40)) {
                    self._doSelect(e);
                }

                if (e.keyCode === 13 && isshow === 'block') {
                    self.setSelVal();
                    dom.hide();
                }

                if (e.keyCode === 27 && isshow === 'block') {
                    dom.hide();
                }
            });
        },

        _doSelect: function(e) {

            if (e.keyCode === 38) { //up arrow
                this._isUp();
            }

            if (e.keyCode === 40) { //down arrow
                this._isDown();
            }

        },

        _goto: function(index) {
            var dom = $("#" + this.options.warpId + " li");
            var cls = this.options.selectedCls;
            dom.removeClass(cls);
            dom.eq(index).addClass(cls);
            this.setSelVal();
        },

        _dohover: function() {
            var self = this;
            var dom = $("#" + this.options.warpId + " li");
            dom.hover(function() {
                dom.removeClass(self.options.selectedCls);
                $(this).addClass(self.options.selectedCls);
            });
        },

        docClick: function(id) {
            var self = this;
            var el = $("#" + id);
            $(document).click(function(event) {
                var isHandler = $(event.target).hasClass(self.options.handlerCls);
                var isSpanHandler = $(event.target).hasClass('span_' + self.options.handlerCls);
                if (el.css('display') === 'block' && !isHandler) {
                    el.hide();
                }
            });
        },

        handlerClick: function(el) {
            if (el.css("display") === 'block') {
                el.hide();
            } else {
                el.show();
            }
        },

        setDefaultSelected: function() {
            var v = this.element.val();
            var d = $("#" + this.options.warpId);
            var list = $("#" + this.options.warpId + ' li');
            list.removeClass(this.options.selectedCls);
            d.find('li[data-val=' + v + ']').addClass(this.options.selectedCls)
        },

        getLength: function() {
            return $("#" + this.options.warpId + " li").length;
        },

        getCurSelectedIndex: function() {
            return $("#" + this.options.warpId + " li.selected").index();
        },

        getSelElHeight: function() { // get select element height
            return this.element.outerHeight(true);
        },

        getSelElWidth: function() { // get select element width
            return this.element.outerWidth(true);
        },

        getSelElPos: function() { // get the select real position
            return {
                left: this.element.offset().left,
                top: this.element.offset().top
            }
        },

        setSelVal: function() { // set select element selected value
            var o = this.getCurSelectedTxtVal();
            $("#" + this.options.handlerId).children(":first").text(o.text);
            var cb = this.options.callback;
            this.element.val(o.value);
            if (cb && typeof cb === 'function') { // callback
                cb();
            }
        },

        getCurSelectedTxtVal: function() { // get select text and value
            var index = this.getCurSelectedIndex();
            var el = $("#" + this.options.warpId).find('li').eq(index);
            var txt = this.getText(el);
            var val = this.getDataValue(el);
            return {
                text: txt,
                value: val
            }
        },

        getDataValue: function(el) { // get data value
            return el.attr("data-val");
        },

        getText: function(el) { // get text
            return el.text();
        },

        buildSelect: function() {
            var row = "";
            var tpl = this.options.itemTpl;
            var value;
            var text;
            var self = this;
            this.element.find("option").each(function(a, b) {
                value = $(this).val();
                text = $(this).text();
                row += tpl.replace(/\$value/g, value).replace(/\$selected/, a === 0 ? self.options.selectedCls : "").replace(/\$text/g, text);
            });
            this._append(row);
            this._dohover();
            this.setSelOpacity();
        },

        setSelOpacity: function() { // set select opacity
            this.element.css({
                opacity: '0',
                visibility:'hidden'
            });
        },

        buildSelSimulate: function(id) { // build select element simulation
            var handlerId = 'handler_' + id;
            this.options.handlerId = handlerId;
            var handler = this.options.handlerTpl.replace(/\$id/, handlerId).replace(/\$handlerCls/g, this.options.handlerCls);
            $("body").append(handler);
            this.setHandlerStyle(handlerId);
            this.bindHandlerEvent(handlerId, id);
        },

        setHandlerStyle: function(id) {
            $("#" + id).css({
                width: this.getSelElWidth(),
                height: this.getSelElHeight(),
                position: 'absolute',
                left: this.getSelElPos().left,
                top: this.getSelElPos().top
            });
        },

        bindHandlerEvent: function(hid, id) { // handler click
            var self = this;
            var el = $("#" + id);
            var dom = $("#" + hid);
            var span = $("#" + hid + " span");

            dom.click(function(e) {
                self.handlerOpClick(el);
                return false
            });

            span.click(function(e) {
                self.handlerOpClick(el);
                return false
            });

            el.find('li').click(function() {
                self.getDataValue($(this));
                self.setSelVal();
                el.hide();
            });

            this.docClick(id);
        },

        handlerOpClick: function(el){
            this.hideAllSelect();
            this.handlerClick(el);
            this.setDefaultSelected();
        },

        hideAllSelect: function() { // hide all
            $(".select_cls").hide();
        },

        _append: function(row) { // append to body
            var id = "select_" + this._getTime();
            this.options.warpId = id;
            var list = this.options.listWarpTpl.replace(/\$id/, id).replace(/\$list/, row).replace(/\$cls/, this.options.listCls);
            $('body').append(list);
            this.setStyle(id);
            this.buildSelSimulate(id);
        },

        setStyle: function(id) { // set style for list
            var width = this.options.width;
            var height = this.options.height;
            $("#" + id).css({
                position: 'absolute',
                left: this.getSelElPos().left,
                top: this.getSelElPos().top + this.getSelElHeight(),
                width: width ? width : "auto",
                height: height ? height : "auto",
                overflow: 'auto'
            });
            $("#" + id).addClass('select_cls'); //
        },

        _isDown: function() { //
            var len = this.getLength();
            var i = this.getCurSelectedIndex() + 1;
            var index = (i === len) ? len : i;
            if (i === len) {
                return;
            }
            this._goto(index);
        },

        _isUp: function() { //
            var i = this.getCurSelectedIndex() - 1;
            if (i < 0) {
                return;
            }
            var index = (i < 0) ? 0 : i;

            this._goto(index);
        },

        _setValue: function(v) { // set default value
            var el = $("#" + this.options.warpId).find('li[data-val=' + v + ']');
            $("#" + this.options.warpId + " li").removeClass(this.options.selectedCls);
            el.addClass(this.options.selectedCls);
            this.setSelVal();
        },

        _getTime: function() {
            return new Date().getTime();
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
