$(function ($) {
    init();

    function init() {
        eventListener();
    }

    function eventListener() {
        onBlurListener();
        loginBtnOnTap();
    }

    function onBlurListener() {

        //为手机号码文本框注册失去焦点事件
        $("[name='mobile']").on("blur", function () {
            if ($(this).val() == "") {
                mui.toast('手机号不能为空', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }
            //判断手机号码是否合法
            if (!$.checkPhone($(this).val())) {
                mui.toast('手机号不合法', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }
        });
        //为密码文本框注册失去焦点事件
        $("[name='pwd']").on("blur", function () {
            if ($(this).val() == "") {
                mui.toast('请填密码', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }
            //判断密码是否合法(坑)

        });
    }

    function loginBtnOnTap() {
        $(".btn_login").on("tap",function () {
            var mobile_txt = $("[name='mobile']").val().trim();
            var pwd_txt = $("[name='pwd']").val().trim();

            //判断手机号码是否为空
            if ($("[name='mobile']").val() == "") {
                mui.toast('手机号不能为空', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }

            //判断手机号码是否合法
            if (!$.checkPhone($("[name='mobile']").val())) {
                mui.toast('手机号不合法', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }
            
            //判断密码是否为空
            if ($("[name='pwd']").val() == "") {
                mui.toast('请填密码', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }

            //初步检验都有填写之后，发送ajax请求进行登录
            $.post("login",{
                username:mobile_txt,
                password:pwd_txt
            },function (ret) {
                console.log(ret);
                var msg = ret.meta.msg;
                if (ret.meta.status!=200) {
                    mui.toast(msg, {
                        duration: 'short',
                        type: 'div'
                    })
                    return;
                } else {
                    mui.toast(msg, {
                        duration: 'short',
                        type: 'div'
                    })
                    setTimeout(function () {
                        location.href = "/index.html";
                    },1000);
                }
            });
        });
    }
});