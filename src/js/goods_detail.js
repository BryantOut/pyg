$(function ($) {
    init();

    function init() {
        setHTML();

        // 为了在pc端更好的去调试
        onresize = function () {
            setHTML();
        }
        getData();    
        

        eventListener();
    }

    function sliderInit() {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    }

    function eventListener() {

    }

    function setHTML() {
        // 基础值
        var baseVal = 100;
        // 设计稿的宽度
        var pageWidth = 320;
        // 要适配的屏幕的宽度?
        var screenWidth = document.querySelector("html").offsetWidth;
        // 要设置的fontsize
        var fontsize = screenWidth * baseVal / pageWidth;

        // 设置到html标签的中
        document.querySelector("html").style.fontSize = fontsize + "px";

    }

    function getData() {
        var goods_id = $.getUrlValue("goods_id");  
        
        $.get("goods/detail",{goods_id:goods_id},function (ret) {
            console.log(ret); 
            var data = ret.data;
            console.log(data);

            //调用模板引擎渲染数据
            var context = {comments:data}
            //借助模板引擎的api
            var html = template('viewTmpl',context);
            //将渲染结果的html设置到默认元素的innerHTML中
            $(".view").html(html);
            sliderInit();//渲染完毕之后再初始化
        }); 
    }
});