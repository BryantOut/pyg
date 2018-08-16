$(function ($) {
    //先判断是否已经登录，假如没有登录跳转到登录页面
    if ($.getToken()=="") {
        location.href = "/pages/login.html";
        return;
    }

    //将body的display重新写出block
    $("body").css("display","block");

    init();

    function init() {
        getData();
        eventListener();
    }

    function getData() {
        $.ajax({
            dataType: "json",
            type: "get",
            url: "my/users/userinfo",
            headers: {
                "Authorization": $.getToken()
            },
            success: function (ret) {
                console.log(ret.data);
                render(ret.data);
            }
        });
    }

    function render(data) {
        //调用模板引擎渲染数据
        var context = {
            comments: data
        }
        //借助模板引擎的api
        var html = template('tmpl', context);
        //将渲染结果的html设置到默认元素的innerHTML中
        $(".userInfo").html(html);
    }

    function eventListener() {
        //为退出按钮注册点击事件
        $(".outLogin").on("tap",function() {
            console.log("触发退出按钮");
            localStorage.removeItem("userInfo");
            $.setCurrHref();
            location.href = "/pages/login.html";
        });
    }
});