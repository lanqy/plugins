/**
 * Tabs plugin
 *
 * 	Depends:
 *	   - jQuery 1.4.2+
 * 	author:
 *     - lanqy 2016-06-06
 */
(function($) {
    $.extend($.fn, {
        Tabs: function(options) {
            return this.each(function() {
                var tab = $.data(this, "tab");
                if (!tab) {
                    tab = new $.Tabs(options, this);
                    $.data(this, "tab", tab);
                }
            });
        }
    });

    $.Tabs = function(options, el) {
        if (arguments.length) {
            this._init(options, el);
        }
    }

    $.Tabs.prototype = {
        options: {
            event: "click", // jquery event
            callback: null, // callback
            curCls: "current", // current class
            index: 0, // index from 0
            itemEl: "li", // tab element
            bodyEl: "div", // content element
            itemCls: ".tab-item", //item class
            bodyCls: ".content-item", // content class
            tabHeader: ".tab-hd", // tab header class
            tabBody: ".tab-content" // content parent container class
        },

        _init: function(options, el) {
            this.options = $.extend(true, {}, this.options, options);
            this.options.cookieName = el.id + '_cookieName'; //defaults
            this.element = $(el);
            this.bindEvents();
            var index = this.getCookie(this.options.cookieName) ? this.getCookie(this.options.cookieName) : this.options.index;
            this.handlerClick(this.getCurrentEl(index));
        },

        bindEvents: function() {
            var self = this;
            var el = this.options.itemEl;
            var elCls = this.options.itemCls;
            var event = this.options.event;
            var c = this.options.cookieName;
            this.element.delegate(el + elCls, event, function() {
                self.handlerClick($(this));
                self.createCookie(c,$(this).index(),7); // cookie last 7 days
                return false;
            });
        },

        _callback: function() { // callback
            var cb = this.options.callback;
            if (cb && (typeof cb === "function")) {
                cb();
            }
        },

        setTabCls: function(el) {
            var curCls = this.options.curCls;
            var itemCls = this.options.itemCls;
            this.element.find(this.options.tabHeader).find(itemCls).removeClass(curCls);
            this.setCurrent(el);
        },

        getIndex: function(el) {
            return el.index();
        },

        getContentByIndex: function(index) {
            var bodyCls = this.options.bodyCls;
            return this.element.find(bodyCls).eq(index);
        },

        setCurrent: function(el) {
            var curCls = this.options.curCls;
            el.addClass(curCls);
        },

        getCurrentEl: function(index){
          var elCls = this.options.itemCls;
          return this.element.find(this.options.tabHeader).find(elCls).eq(index);
        },

        showContent: function(el) {
            el.show();
        },

        hideContent: function() {
          this.element.find(this.options.tabBody).find(this.options.bodyCls).hide();
        },

        _setCur: function(index){ // set default tab
          this.getCurrentEl(index).trigger("click");
        },

        handlerClick: function(el) {
            var index = this.getIndex(el);
            this.setTabCls(el);
            var a = this.getContentByIndex(index);
            this.hideContent();
            this.showContent(a);
        },

        createCookie: function(name, val, days) { // create cookie
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            } else var expires = "";
            document.cookie = name + "=" + val + expires + "; path=/";
            this[name] = val;
        },

        getCookie: function(name) { // get cookie
            var nameEQ = name + "=";
            var ca = document.cookie.split(";");
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == " ") c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        delCookie: function(name) { // delete cookie
            this.createCookie(name, "", -1);
            this[name] = undefined;
        }
    }
    $.extend($.fn, {
        setCur: function(index) {
            $(this).data("tab") && $(this).data("tab")._setCur(index);
        }
    });
})(jQuery);
