$(function($){
    init();
    function init () {
        //1、判断是否已经登录
        if(!$.checkUserInfo()) {
            location.href = "/pages/login.html";
            return;
        } else {
             //2、已经登录了的话，显示页面
            // $("body").css("display","block");
            $("body").fadeIn();
        }
       
        edit_btn_event();

    }

    //为编辑按钮注册点击事件
    function edit_btn_event () {
        $("#edit_btn").on("tap",function () {
            console.log(123);
        });
    }
});