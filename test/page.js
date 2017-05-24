(function($) {
  $.extend($.fn, {
    initPage: function(options) {
      return this.each(function() {
        var initPage = $.data(this, 'initPage');
        if (!initPage) {
          initPage = new $.initPage(options, this);
          $.data(this, 'initPage', initPage);
        }
      });
    },
  });

  $.initPage = function(options, el) {
    if (arguments.length) {
      this._init(options, el);
    }
  };

  $.initPage.prototype = {
    options: {
      maxshowpageitem: 5, //最多显示的页码个数
      pagelistcount: 1, //每一页显示的内容条数
      totalPages: 0,
      listCount: 0,
      currentPage: 0,
      callback: null,
    },

    _init: function(options, el) {
      this.options = $.extend(true, {}, this.options, options);
      this.element = $(el);
      this._initPage();
      this.bindEvents();
    },

    _initPage: function() {

      if (this.options.listCount < 0) {
        this.options.listCount = 0;
      }
      if (this.options.currentPage <= 0) {
        this.options.currentPage = 1;
      }
      this.setPageListCount(
        this.options.listCount,
        this.options.currentPage,
        this.options.callback
      );
    },

    bindEvents: function() {
      var self = this;
      this.element.delegate('li.pageItem', 'click', function() {
        self.setPageListCount(
          self.options.listCount,
          $(this).attr('page-data'),
          self.options.callback
        );
        self.options.callback($(this).attr('page-data'));
      });
    },

    initWithUl: function(totalPages, currentPage) {
      var pageCount = 1;
      if (totalPages >= 0) {
        var pageCount = totalPages % this.options.pagelistcount > 0
          ? parseInt(totalPages / this.options.pagelistcount) + 1
          : parseInt(totalPages / this.options.pagelistcount);
      }

      console.log('___________________',pageCount)

      var appendStr = this.getPageListModel(parseInt(pageCount,10), currentPage);

      this.element.html(appendStr);
    },
    /**
     * 设置列表总量和当前页码
     * @param listCount 列表总量
     * @param currentPage 当前页码
     */
    setPageListCount: function(listCount, currentPage, callback) {

      console.log('_________________',currentPage);

      this.options.totalPages = parseInt(this.options.listCount);
      this.options.currentPage = currentPage;
      this.options.callback = callback;
      this.initWithUl(listCount, currentPage);
    },
    getPageListModel: function(pageCount, currentPage) {
      var prePage = currentPage - 1;
      var nextPage = currentPage + 1;
      var prePageClass = 'pageItem';
      var nextPageClass = 'pageItem';
      if (prePage <= 0) {
        prePageClass = 'pageItemDisable';
      }
      if (nextPage > pageCount) {
        nextPageClass = 'pageItemDisable';
      }
      var appendStr = '';
      // appendStr+="<li class='"+prePageClass+"' page-data='1' page-rel='firstpage'>首页</li>";
      // appendStr+="<li class='"+prePageClass+"' page-data='"+prePage+"' page-rel='prepage'>&lt;上一页</li>";
      var miniPageNumber = 1;
      if (
        currentPage - parseInt(this.options.maxshowpageitem / 2) > 0 &&
        currentPage + parseInt(this.options.maxshowpageitem / 2) <= pageCount
      ) {
        miniPageNumber = currentPage - parseInt(this.options.maxshowpageitem / 2);
      } else if (
        currentPage - parseInt(this.options.maxshowpageitem / 2) > 0 &&
        currentPage + parseInt(this.options.maxshowpageitem / 2) > pageCount
      ) {
        miniPageNumber = pageCount - this.options.maxshowpageitem + 1;
        if (miniPageNumber <= 0) {
          miniPageNumber = 1;
        }
      }
      var showPageNum = parseInt(this.options.maxshowpageitem);
      if (pageCount < showPageNum) {
        showPageNum = pageCount;
      }


      console.log('miniPageNumber_______________', miniPageNumber);

      for (var i = 0; i < showPageNum; i++) {
        var pageNumber = miniPageNumber++;
        var itemPageClass = 'pageItem';
        if (pageNumber == currentPage) {
          itemPageClass = 'pageItemActive';
        }

        console.log(pageNumber);

        appendStr +=
          "<li class='" +
          itemPageClass +
          "' page-data='" +
          pageNumber +
          "' page-rel='itempage'>" +
          pageNumber +
          '</li>';
      }
      appendStr +=
        "<li class='" +
        nextPageClass +
        "' page-data='" +
        nextPage +
        "' page-rel='nextpage'>&gt;</li>";
      // appendStr+="<li class='"+nextPageClass+"' page-data='"+pageCount+"' page-rel='lastpage'>尾页</li>";
      return appendStr;
    },
  };
})(jQuery);
