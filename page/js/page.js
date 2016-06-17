/**
 * jQuery pagination plugin
 *
 * 	Depends:
 *	   - jQuery 1.4.2+
 * 	author:
 *     - lanqy 2016-6-16
 * 	github:
 *	   - https://github.com/lanqy/plugins/page
 */
(function($) {
    $.extend($.fn, {
        Page: function(options) {
            return this.each(function() {
                var Page = $.data(this, "Page");
                if (!Page) {
                    Page = new $.Page(options, this);
                    $.data(this, "Page", Page);
                }
            });
        }
    });

    $.Page = function(options, el) {
        if (arguments.length) {
            this._init(options, el);
        }
    }

    $.Page.prototype = {
        options: {
            currPage: 1,
            totalPageCount: 0,
            pageSize: 20,
            showDisable:false,
            showPageCount: 5,
            currentCls: 'active',
            pageTitle: '',
            url: null,
            onPageClick: function(page) {

            }
        },

        setCurrentPage: function(page) {
            this.options.currPage = parseInt(page, 10);
        },

        _init: function(options, el) { // init
            this.options = $.extend(true, {}, this.options, options)
            this.element = $(el);
            this._bindEvents();
        },

        _bindEvents: function() { // bind events
            var self = this;
            this._build();
            this.element.delegate('a', 'click', function() {

                if ($(this).hasClass(self.options.currentCls)) {
                    return;
                }
                self._selectPage($(this).attr('data-page'));
            });

            this.element.delegate('a.goto', 'click', function() {
                return false;
            });
        },

        getTotalPageCount: function() {
            return (this.options.totalCount - 1) / this.options.pageSize + 1;
        },

        renderPage: function() {

            var str = "<div class='pageDivClass'>";

            if (this.options.totalPageCount == 1) { //
                str += "第" + currPage + "页/共" + totalPageCount + "页</div>";
                return str;
            }

            if (this.options.currPage <= 1) {
                this.options.currPage = 1;
            }

            if (this.options.currPage >= this.options.totalPageCount) {
                this.options.currPage = this.options.totalPageCount;
            }

            var down = (this.options.currPage + 1 > this.options.totalPageCount ? this.options.totalPageCount : this.options.currPage + 1);
            var up = (this.options.currPage - 1 == 0 ? 1 : this.options.currPage - 1);
            var size = this.options.pageSize;

            str += "<span class='per-page'>第" + this.options.currPage + "页/共" + this.options.totalPageCount + "页</span>";

            if (this.options.currPage !== 1) {
                str += "<span class='prev'><a data-page='1' data-pageSize=" + size + " href='javascript:void(0);'>首页</a></span>";
                str += "<span class='prev' ><a data-page=" + up + " data-pageSize=" + size + " href='javascript:void(0);'><i class='iconfont'>&#xe60d;</i>上一页</a></span>";
            }

            if(this.options.currPage !== 1 && this.options.showDisable){
                str += "<span class='prev page-disabled'>首页</span>";
                str += "<span class='prev page-disabled'><i class='iconfont'>&#xe60d;</i>上一页</span>";
            }

            var upColor = this.getCls(this.options.currPage - 1 == 0 ? 1 : this.options.currPage == this.options.totalPageCount ? this.options.totalPageCount : this.options.currPage - 1, up);
            var downColor = this.getCls(this.options.currPage, down);
            if (this.options.totalPageCount < this.options.showPageCount) {
                this.options.showPageCount = this.options.totalPageCount;
            }

            if (this.options.showPageCount != 2) {
                var i = 1,
                    sum = 0;
                var half = this.options.showPageCount / 2;
                if (this.options.currPage > half) {
                    i = this.options.currPage - half;
                }
                if (this.options.totalPageCount - i < this.options.showPageCount) {
                    i = this.options.totalPageCount - this.options.showPageCount + 1;
                }

                var inter = this.getRount(this.options.showPageCount, this.options.totalPageCount, this.options.currPage);

                for (i = inter[0]; i <= this.options.totalPageCount; i++) {
                    if (sum == this.options.showPageCount) {
                        if (this.options.totalPageCount > i) {
                            str += "<span class='page_dot'>...</span>";
                        }
                        break;
                    }
                    sum++;
                    var curColor = this.getCls(this.options.currPage, i);
                    str += "<a data-page=" + i + " data-pageSize=" + size + " href='javascript:void(0);' " + curColor + ">" + i + "</a>";
                }
            } else {
                var tempcurrPage = this.options.currPage;
                if (this.options.currPage == 1) {
                    up = 1;
                    down = 2;
                } else {
                    if (this.options.currPage == this.options.totalPageCount) {
                        tempcurrPage = this.options.totalPageCount - 1;
                    }
                }
                str += "<a data-page=" + up + " data-pageSize=" + size + " href='javascript:void(0);' " + upColor + ">" + tempcurrPage + "</a>";
                str += "<a data-page=" + down + " data-pageSize=" + size + " href='javascript:void(0);' " + downColor + ">" + (tempcurrPage + 1) + "</a>";
            }

            if (this.options.currPage != this.options.totalPageCount) {
                str += "<span class='next'><a data-page=" + down + " data-pageSize=" + size + " href='javascript:void(0);'>下一页<i class='iconfont'>&#xe60c;</i></a></span>";
                str += "<span class='prev'><a data-page=" + this.options.totalPageCount + " data-pageSize=" + size + "  href='javascript:void(0);'>末页</a></span>";
            }

            if(this.options.currPage !== this.options.totalPageCount && this.options.showDisable){
                str += "<span class='next page-disabled'>下一页<i class='iconfont'>&#xe60c;</i></span>";
                str += "<span class='prev page-disabled'>末页</span>";
            }

            var inputText = "<span class='goto-page'>到第<input type='text' class='page-input' size=4 value=" + this.options.currPage + " />页</span><a href='javascript:void(0)' class='goto'>确定</a></div>";
            str = str + inputText;
            return str;
        },

        _selectPage: function(page) {
            this.options.currPage = parseInt(page,10);
            this._build();
            return this.options.onPageClick(this.options.currPage);
        },

        getCls: function(currPage, i) {
            if (currPage == i) {
                return "class=" + this.options.currentCls;
            }
            return "";
        },

        getRount: function(showPageCount, totalPageCount, currPage) {
            var inter = [];
            var rount = totalPageCount - showPageCount + 1;
            if (rount > 0) {
                if (rount > showPageCount) {
                    if (currPage >= showPageCount && currPage <= rount) {
                        inter[0] = currPage;
                        inter[1] = showPageCount + currPage - 1;
                    } else if (currPage > rount && currPage <= totalPageCount) {
                        inter[0] = rount;
                        inter[1] = totalPageCount;
                    } else {
                        inter[0] = 1;
                        inter[1] = showPageCount;
                    }
                } else {
                    if (currPage >= showPageCount) {
                        inter[0] = rount;
                        inter[1] = totalPageCount;
                    } else {
                        inter[0] = 1;
                        inter[1] = showPageCount;
                    }
                }
            } else {
                inter[0] = 1;
                inter[1] = showPageCount;
            }
            return inter;
        },

        _build: function() {
            this.element.html(this.renderPage());
        },

        _getOptions: function() {
            return this.options;
        }
    }

    $.extend($.fn, {

        page: function(page) {
            $(this).data("Page") && $(this).data("Page").setPage(page)
        },

        getOptions: function() {
            return $(this).data("Page") && $(this).data("Page")._getOptions();
        }
    });

})(jQuery);
