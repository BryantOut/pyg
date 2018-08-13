$(function ($) {
    //自定义总页数
    var PageCount = 1;
    //自定义查询参数
    var QueryObj = {
        pagenum: 1,
        pagesize: 6,
        query: "",
        cid: getUrlValue("cid")
    }

    // 根据url上的key来获取值
    function getUrlValue(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    init();

    function init() {
        //mui 初始化时设置pullRefresh各项参数
        mui.init({
            pullRefresh: {
                container: ".view", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    auto: true, //可选,默认false.首次加载自动下拉刷新一次
                    callback: function () {
                        // console.log("湖人总冠军");
                        $(".view ul").html("");
                        QueryObj.pagenum = 1;
                        getData(function () {
                            //没有更多内容了，endPulldown 传入true， 不再执行下拉刷新
                            mui('.view').pullRefresh().endPulldownToRefresh();
                            // 重置 上拉组件
                            mui('.view').pullRefresh().refresh(true);//为了上拉加载和上拉刷新反复切换（坑）
                        });
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                },
                
                up: {
                    callback: function () {
                        /* 1、判断有没有下一页，有 QueryObj.pagenum++;
                        2、没有了，不执行了！！
                        3、计算总页数
                            totalPage=Math.ceil(total/QueryObj.pagesize)
                        4、当前页码和总页码做判断 */
                        if (QueryObj.pagenum >= PageCount) {
                            console.log("没有数据了 不再执行");
                            //结束上拉加载更多，如果没有数据，传入true，否则传入false
                            mui('.view').pullRefresh().endPullupToRefresh(true);
                            // mui('.view').pullRefresh().disablePullupToRefresh();
                            return;
                        } else {
                            QueryObj.pagenum++;
                            getData(function () {
                                console.log($(".view li").length);
                                mui('.view').pullRefresh().endPullupToRefresh();
                            });
                        }
                    }
                }
            }
        });

        liOnTap();
    }

    //发送ajax请求数据
    function getData(callback) {
        $.get("goods/search", QueryObj, function (res) {



            console.log(res.data);
            var data = res.data;
            var goodsCount = data.total;
            console.log(PageCount);
            //计算总页数
            PageCount = Math.ceil(goodsCount / QueryObj.pagesize);
            // console.log("总页数为"+PageCount);
            //调用模板引擎渲染数据
            var context = {
                comments: data.goods
            }
            //借助模板引擎的api
            var html = template('goodListTmpl', context);
            //将渲染结果的html设置到默认元素的innerHTML中
            $(".view ul").append(html);

            callback && callback();
        });
    }

    function liOnTap () {
        $(".view").on("tap","a",function () {
            var href = this.href;
            // console.log(href);
            location.href = href;
        })
    }
});