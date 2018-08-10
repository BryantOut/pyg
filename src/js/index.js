$(function ($) {
    init();

    function init() {
        getSwiperdata();
        getCatitems();
        getGoodslist();
    }

});

function getSwiperdata() {
    /* 发送ajax请求轮播图数据渲染页面 */
    $.get("http://api.pyg.ak48.xyz/api/public/v1/home/swiperdata", function (res) {
        // console.log(res);
        var data = res.data;
        //调用模板引擎渲染数据
        var context = {
            comments: data
        }
        //借助模板引擎的api
        var html = template('swiperTmpl', context);

        //将渲染结果的html设置到默认元素的innerHTML中
        $(".mui-slider").html(html);

        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    });
}

function getCatitems() {
    $.get("http://api.pyg.ak48.xyz/api/public/v1/home/catitems", function (ret) {
        var data = ret.data;
        // console.log(data);
        //调用模板引擎渲染数据
        var context = {
            comments: data
        }
        //借助模板引擎的api
        var html = template('navTmpl', context);

        //将渲染结果的html设置到默认元素的innerHTML中
        $(".nav").html(html);
    });
}

function getGoodslist() {
    $.get("http://api.pyg.ak48.xyz/api/public/v1/home/goodslist", function (ret) {
        // console.log(ret);
        var data = ret.data;
        //调用模板引擎渲染数据
        var context = {
            comments: data
        }
        //借助模板引擎的api
        var html = template('tmpl', context);
        //将渲染结果的html设置到默认元素的innerHTML中
        $(".shop_list").html(html);
    });
}