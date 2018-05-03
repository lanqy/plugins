/**
 * scroller plugin
 *
 * 	Depends:
 *	   - jQuery 1.4.2+
 * 	author:
 *     - lanqy 2017-06-01
 */
(function($) {
  $.extend($.fn, {
    Scroller: function(options) {
      return this.each(function() {
        var Scroller = $.data(this, "Scroller");
        if (!Scroller) {
          Scroller = new $.Scroller(options, this);
          $.data(this, "Scroller", Scroller);
        }
      });
    }
  });

  $.Scroller = function(options, el) {
    if (arguments.length) {
      this._init(options, el);
    }
  };

  $.Scroller.prototype = {
    options: {
      El: null, // wrapper element,require
      listEl: null, // list element wrapper,require
      navEl: null, // nav element wrapper,require
      interval: 4000,
      showPage: true, // show page
      showNextPrev: true, // show next && prev button
      next: ".next", // next button
      prev: ".prev", // prev button
      currentClass: "current", // default current
      pageItemClass: ".nav__item", // page class default .nav__item
      listItemClass: ".list__item", // list item default .list__item
      trigger: "click", // trigger default click,it can be mouseover etc.
      autoscroll: false, // auto scroll,default false
      start_from: 1, // start item
      render: null, // render data
      callback: null // callback function
    },

    _init: function(options, el) {
      this.options = $.extend(true, {}, this.options, options);
      this.element = $(el);
      this.index = this.options.start_from;
      if (this.options.render) {
        // if define render function
        this.options.render();
      }

      this.itemWidth = this.options.El.outerWidth(true);
      this.Itemlength = this.options.El.find(this.options.listItemClass).length;
      this.listWidth = this.itemWidth * this.Itemlength;
      this.navItemWidth = this.options.navEl
        .find(this.options.pageItemClass)
        .outerWidth(true);
      this.navWidth = this.navItemWidth * this.Itemlength;
      this._setListWidth();
      this._justify();
      this._setDefaultPos();
      this._setButton();
      if (this.options.autoscroll) {
        this._runAuto();
      }

      this.bindEvents();
    },

    _setButton: function() {
      if (!this.options.showNextPrev) {
        this.element.find(this.options.prev).hide();
        this.element.find(this.options.next).hide();
      }

      if (!this.options.showPage) {
        this.options.navEl.hide();
      }
    },

    _setListWidth: function() {
      this.options.listEl.css("width", this.listWidth);
    },

    bindEvents: function() {
      var self = this;
      this.element.delegate(this.options.next, "click", function(e) {
        self._next(self.index);
      });

      this.element.delegate(this.options.prev, "click", function(e) {
        self._prev(self.index);
      });

      this.element.delegate(
        this.options.pageItemClass,
        this.options.trigger,
        function(e) {
          var index = $(this).index();
          self._goto(index);
        }
      );

      if (this.options.autoscroll) {
        this.element.delegate(this.options.next, "hover", function(e) {
          if (e.type === "mouseenter") {
            clearInterval(self.timer);
          } else {
            self._runAuto();
          }
        });

        this.element.delegate(this.options.prev, "hover", function(e) {
          if (e.type === "mouseenter") {
            clearInterval(self.timer);
          } else {
            self._runAuto();
          }
        });

        this.element.delegate(this.options.pageItemClass, "hover", function(e) {
          if (e.type === "mouseenter") {
            clearInterval(self.timer);
          } else {
            self._runAuto();
          }
        });

        this.element.hover(
          function() {
            clearInterval(self.timer);
          },
          function() {
            self._runAuto();
          }
        );
      }
    },

    _runAuto: function() {
      var self = this;

      if (this.timer) {
        // clear if timer exist
        clearInterval(this.timer);
      }

      this.timer = setInterval(function() {
        self._autoscroll();
      }, this.options.interval);
    },

    _setDefaultPos: function() {
      this.options.start_from =
        this.options.start_from > this.Itemlength
          ? this.Itemlength
          : this.options.start_from;

      if (this.options.start_from) {
        var index = this.options.start_from - 1;
        this.index = index;
        this._goto(this.index);
      }
    },

    _justify: function() {
      // fixed pagiation to center
      this.options.navEl.css("margin-left", -(this.navWidth / 2));
    },

    _next: function(index) {
      if (index - 1 < 0) {
        this.index = 0;
        return;
      }
      this.index = index - 1;
      this._goto(this.index);
    },
    _prev: function(index) {
      if (index + 1 > this.Itemlength - 1) {
        this.index = this.Itemlength - 1;
        return;
      }
      this.index = index + 1;
      this._goto(this.index);
    },
    _goto: function(index) {
      var self = this;
      this.index = index;
      this.element
        .find(this.options.pageItemClass)
        .removeClass(this.options.currentClass);
      this.element
        .find(this.options.pageItemClass)
        .eq(index)
        .addClass(this.options.currentClass);
      this.options.listEl.stop(true, true).animate(
        {
          "margin-left": -(this.itemWidth * this.index)
        },
        500,
        function() {
          if (index + 1 > self.Itemlength - 1) {
            self.element.find(self.options.prev).addClass("disable");
            self.element.find(self.options.next).removeClass("disable");
          } else if (index - 1 < 0) {
            self.element.find(self.options.prev).removeClass("disable");
            self.element.find(self.options.next).addClass("disable");
          } else {
            self.element.find(self.options.prev).removeClass("disable");
            self.element.find(self.options.next).removeClass("disable");
          }
        }
      );

      if (this.options.callback) {
        this.options.callback(this.element, this.index); // pass element and index back
      }
    },

    _autoscroll: function() {
      if (this.index + 1 > this.Itemlength - 1) {
        this.index = 0;
      } else {
        this.index = this.index + 1;
      }

      this._goto(this.index);
    },

    _setIndex: function(index) {
      this._goto(index);
    },

    _getIndex: function() {
      return this.index;
    }
  };
  $.extend($.fn, {
    setIndex: function(index) {
      $(this).data("Scroller") &&
        $(this)
          .data("Scroller")
          ._setIndex(index);
    },

    getIndex: function() {
      return (
        $(this).data("Scroller") &&
        $(this)
          .data("Scroller")
          ._getIndex()
      );
    }
  });
})(jQuery);
