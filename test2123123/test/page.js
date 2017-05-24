/**
 * Created by zxm on 2017/3/31.
 */
$.fn.extend({
    "initPage":function(listCount,currentPage,fun){
        var maxshowpageitem = $(this).attr("maxshowpageitem");

        console.log(page);

        if(maxshowpageitem!=null&&maxshowpageitem>0&&maxshowpageitem!=""){
            page.maxshowpageitem = maxshowpageitem;
        }
        var pagelistcount = $(this).attr("pagelistcount");
        if(pagelistcount!=null&&pagelistcount>0&&pagelistcount!=""){
            page.pagelistcount = pagelistcount;
        }

        var pageId = $(this).attr("id");
        page.pageId=pageId;
        if(listCount<0){
            listCount = 0;
        }
        if(currentPage<=0){
            currentPage=1;
        }
        page.setPageListCount(listCount,currentPage,fun);

    }
});
var  page = {
    "pageId":"",
    "maxshowpageitem":5,//最多显示的页码个数
    "pagelistcount":1,//每一页显示的内容条数
    "totalPages":0,
    "currentPage":0,
    "id":"",
    "callBack":function(){

    },
    /**
     * 初始化分页界面
     * @param listCount 列表总量
     */
    "_id":function(item){
        var _index=item.indexOf("e");
        var _id=item.substring(_index+1);
        return _id
    },

    "initWithUl":function(listCount,currentPage){

      console.log('listCount',listCount);
      console.log('currentPage',currentPage);

        var pageCount = 1;
        if(listCount>=0){
            var pageCount = listCount%this.pagelistcount>0?parseInt(listCount/this.pagelistcount)+1:parseInt(listCount/this.pagelistcount);
        }
        var appendStr = this.getPageListModel(pageCount,currentPage);

        console.log(appendStr);

        $("#"+this.pageId).html(appendStr);
    },
    /**
     * 设置列表总量和当前页码
     * @param listCount 列表总量
     * @param currentPage 当前页码
     */
    "setPageListCount":function(listCount,currentPage,fun){
        this.totalPages = parseInt(listCount);
        this.currentPage = parseInt(currentPage);
        this.callBack = fun;
        this.initWithUl(this.totalPages,this.currentPage);
        this.initPageEvent(this.totalPages,this.callBack);
        // fun(currentPage);
    },
    "initPageEvent":function(listCount,fun){
        var self = this;
        $("#"+this.pageId +">li[class='pageItem']").on("click",function(){
            self.setPageListCount(listCount,$(this).attr("page-data"),fun);
            self.callBack($(this).attr("page-data"));
        });
    },
    "getPageListModel":function(pageCount,currentPage){
        var prePage = currentPage-1;
        var nextPage = currentPage+1;
        var prePageClass ="pageItem";
        var nextPageClass = "pageItem";
        if(prePage<=0){
            prePageClass="pageItemDisable";
        }
        if(nextPage>pageCount){
            nextPageClass="pageItemDisable";
        }
        var appendStr ="";
        // appendStr+="<li class='"+prePageClass+"' page-data='1' page-rel='firstpage'>首页</li>";
        // appendStr+="<li class='"+prePageClass+"' page-data='"+prePage+"' page-rel='prepage'>&lt;上一页</li>";
        var miniPageNumber = 1;
        if(currentPage-parseInt(this.maxshowpageitem/2)>0&&currentPage+parseInt(this.maxshowpageitem/2)<=pageCount){
            miniPageNumber = currentPage-parseInt(page.maxshowpageitem/2);
        }else if(currentPage-parseInt(this.maxshowpageitem/2)>0&&currentPage+parseInt(this.maxshowpageitem/2)>pageCount){
            miniPageNumber = pageCount-this.maxshowpageitem+1;
            if(miniPageNumber<=0){
                miniPageNumber=1;
            }
        }
        var showPageNum = parseInt(this.maxshowpageitem);
        if(pageCount<showPageNum){
            showPageNum = pageCount
        }

              console.log('showPageNum',showPageNum);

              console.log('miniPageNumber',miniPageNumber)

              for (var i = 0; i < showPageNum; i++) {
                var pageNumber = miniPageNumber++;
                var itemPageClass = 'pageItem';
                if (pageNumber == currentPage) {
                  itemPageClass = 'pageItemActive';
                }
                console.log('pageNumber',pageNumber);
                appendStr +=
                  "<li class='" +
                  itemPageClass +
                  "' page-data='" +
                  pageNumber +
                  "' page-rel='itempage'>" +
                  pageNumber +
                  '</li>';
              }
        appendStr+="<li class='"+nextPageClass+"' page-data='"+nextPage+"' page-rel='nextpage'>&gt;</li>";
        // appendStr+="<li class='"+nextPageClass+"' page-data='"+pageCount+"' page-rel='lastpage'>尾页</li>";
       return appendStr;

    }
}
