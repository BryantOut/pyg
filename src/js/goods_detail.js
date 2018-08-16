$(function ($) {
    var GoodDataObj;
    init();

    function init() {
        setHTML();

        // 为了在pc端更好的去调试
        onresize = function () {
            setHTML();
        }
        getData();
        eventListener();
        addtoShoppingCart();
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

        $.get("goods/detail", {
            goods_id: goods_id
        }, function (ret) {
            // console.log(ret);
            var data = ret.data;
            console.log(data);
            // console.log("--------");

            //调用模板引擎渲染数据
            var context = {
                comments: data
            }
            //借助模板引擎的api
            var html = template('viewTmpl', context);
            //将渲染结果的html设置到默认元素的innerHTML中
            $(".view").html(html);
            sliderInit(); //渲染完毕之后再初始化

            GoodDataObj = {
                goods_id: data.goods_id,
                cat_id: data.cat_id,
                goods_name: data.goods_name,
                goods_price: data.goods_price,
                goods_small_logo: data.goods_small_logo,
                goods_number: data.goods_number,
                goods_weight: data.goods_weight

            }
            console.log(GoodDataObj);

        });
    }

    function addtoShoppingCart() {

        $(".addtoShoppingCart").on("tap", function () {
            var currHref = location.href;
            // console.log("href:"+currHref);
            sessionStorage.setItem("currHref", currHref);

            //小优化。点击按钮，先判断本地存储中是否存储了"userInfo"，有的话再赋值拿数据，否则回报undefined
            if (!localStorage.getItem("userInfo")) {
                mui.toast('未登录', {
                    duration: 'short',
                    type: 'div'
                })
                setTimeout(function () {
                    location.href = "/pages/login.html";
                }, 1000);

                return;
            }

            // 获取本地存储中的值
            var val = localStorage.getItem("userInfo");
            var userInfo = JSON.parse(val);
            console.log(userInfo);
            var token = userInfo.token;

            //发送请求--购物车添加商品
            //http://api.pyg.ak48.xyz/api/public/v1/my/cart/add

            $.ajax({
                dataType: "json",
                type: "post",
                url: "my/cart/add",
                headers: {
                    Authorization: token
                },
                data: {
                    info: JSON.stringify(GoodDataObj)
                },
                success: function (ret) {
                    console.log(ret);
                    var status = ret.meta.status;
                    // console.log(status);
                    if (status == 401) {
                        mui.toast('未登录', {
                            duration: 'short',
                            type: 'div'
                        })
                        setTimeout(function () {
                            location.href = "/pages/login.html";
                        }, 1000);
                    } else if (status == 200) {
                        mui.toast(ret.meta.msg, {
                            duration: 'short',
                            type: 'div'
                        })
                        //弹出框，选择是否跳转到购物车页面
                        mui.confirm("是否跳转到购物车页面", "添加成功", ["前往", "留下"], function (e) {
                            if (e.index = 1) {
                                location.href = "/pages/cart.html";
                            } else {
                                // location.href = "/pages/cart.html";
                            }
                        });
                    } else {
                        mui.toast(ret.meta.msg, {
                            duration: 'short',
                            type: 'div'
                        })
                    }
                }
            });k
        });
    }
});