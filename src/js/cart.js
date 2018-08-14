$(function ($) {
    init();

    function init() {
        //1、判断是否已经登录
        if (!$.checkUserInfo()) {
            location.href = "/pages/login.html";
            return;
        } else {
            //2、已经登录了的话，显示页面
            // $("body").css("display","block");
            $("body").fadeIn();
        }



        edit_btn_event();

        getData();

    }

    //为编辑按钮注册点击事件
    function edit_btn_event() {
        $("#edit_btn").on("tap", function () {
            console.log(123);
            $("body").toggleClass("edit");
            if ($(this).text() == "编辑") {
                $(this).text("完成");
            } else {
                $(this).text("编辑");
            }
        });
    }

    //发送ajax请求获取数据
    function getData() {
        $.ajax({
            dataType: "json",
            type: "get",
            headers: {
                "Authorization": $.getToken()
            },
            url: "my/cart/all",
            success: function (ret) {
                //  console.log(ret);
                var data = JSON.parse(ret.data.cart_info);
                console.log(data);

                //调用模板引擎渲染数据
                var context = {
                    comments: data
                }
                //借助模板引擎的api
                var html = template('tmpl', context);

                //将渲染结果的html设置到默认元素的innerHTML中
                $(".cart_forms ul").html(html);

                //初始化数字输入框
                initNumbox();
            }
        });
    }

    function initNumbox() {
        mui(".mui-numbox").numbox();
    }

    /* 统计购物车中所有商品的价格总和 */
    function CountAllGoodsPrice () {
        
    }
});