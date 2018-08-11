$(function ($) {
    // 左侧的滚动条
    var LeftScroll;
    // 服务器返回回来的数据
    var Datas;
    init();


    function init() {
        setHTML();
        getQsearch();
        leftListEvenListener();
    }



    // 为了在pc端更好的去调试
    window.onresize = function () {
        setHTML();
    }

    function setHTML() {
        // 基础值
        var baseVal = 100;
        // 设计稿的宽度
        var pageWidth = 375;
        // 要适配的屏幕的宽度?
        var screenWidth = document.querySelector("html").offsetWidth;
        // 要设置的fontsize
        var fontsize = screenWidth * baseVal / pageWidth;

        // 设置到html标签的中
        document.querySelector("html").style.fontSize = fontsize + "px";

    }

    function getQsearch() {
        $.get("categories", function (ret) {
            console.log(ret);
            Datas = ret.data;
            //调用模板引擎渲染数据
            var context = {
                comments: Datas
            }
            //借助模板引擎的api
            var html = template('leftNavTmpl', context);
            //将渲染结果的html设置到默认元素的innerHTML中
            $(".leftNav ul").html(html);

            LeftScroll = new IScroll('.leftNav');


            renderRightCon(0);
        });
    }

    function renderRightCon(index) {
        //渲染右侧内容
        var context1 = {
            comments: Datas[index]
        }
        //借助模板引擎的api
        var html2 = template('rightConTmpl', context1);
        //将渲染结果的html设置到默认元素的innerHTML中
        $(".bigBox").html(html2);

        var imgLength = $(".bigBox img").length;
        $(".bigBox img").on("load", function () {
            imgLength--;
            if (imgLength == 0) {
                new IScroll('.rightCon');
            }
        })
    }

    function leftListEvenListener() {
        $(".leftNav").on("tap", "li", function () {
            $(this).addClass("active").siblings().removeClass("active");
            //获取当前li的索引
            var index = $(this).data("index");
            // 往上滚动置顶
            LeftScroll.scrollToElement(this);
            //并调用函数重新渲染右边的内容
            renderRightCon(index);
        });
    }
})