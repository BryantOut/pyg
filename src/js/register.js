$(function ($) {
    init();

    function init() {

        eventListener();
    }


    function eventListener() {

        getCodeOnTap();

        onBlurListener();

        //为注册按钮注册点击事件
        $(".btn_register").on("tap", function () {
            //获取文本框中的值
            // var dataObj = $("form").serialize();--只能用于get
            var mobile_txt = $("[name='mobile']").val().trim();
            var code_txt = $("[name='code']").val().trim();
            var email_txt = $("[name='email']").val().trim();
            var pwd_txt = $("[name='pwd']").val().trim();
            var gender_txt = $("[name='gender']").val().trim();
            $.post("users/reg", {
                mobile: mobile_txt,
                code: code_txt,
                email: email_txt,
                pwd: pwd_txt,
                gender: gender_txt
            }, function (ret) {
                console.log(ret);
                var msg = ret.meta.msg;
                if (ret.meta.status != 200) {
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
                        //跳转到登录页面
                        location.href = "/pages/login.html";
                    }, 1000);

                }
            });
        });

        // $.ajax();待优化

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
        //为验证码文本框注册失去焦点事件
        $("[name='code']").on("blur", function () {
            if ($(this).val() == "") {
                mui.toast('请填验证码', {
                    duration: 'short',
                    type: 'div'
                })
            }
        });
        //为邮箱文本框注册失去焦点事件
        $("[name='email']").on("blur", function () {
            if ($(this).val() == "") {
                mui.toast('请填邮箱', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }
            //判断邮箱是否合法
            if (!$.checkEmail($(this).val())) {
                mui.toast('邮箱不合法', {
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
        //为确认密码文本框注册失去焦点事件
        $("[name='pwdAgain']").on("blur", function () {
            if ($(this).val() == "") {
                mui.toast('请填确认密码', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }

            //判断两次输入的密码是否一致
            if ($(this).val() != $("[name='pwd']").val()) {
                mui.toast('两次输入的密码不一致', {
                    duration: 'short',
                    type: 'div'
                })
            }
        });
    }

    function getCodeOnTap() {
        //为获取验证码按钮注册点击事件
        $(".getCode").on("tap", function () {
            //获取手机号码
            var inputPhoneNum = $("[name='mobile']").val().trim();
            $.post("users/get_reg_code", {
                mobile: inputPhoneNum
            }, function (ret) {
                console.log(ret);
                if (ret.meta.status != 200) {
                    var alertInfo = ret.meta.msg;
                    mui.toast(alertInfo, {
                        duration: 'long',
                        type: 'div'
                    })
                }

                //为按钮添加禁用于激活事件
                $(".getCode").attr("disabled", "disabled");
                //自定义几秒后重新发送
                var times = 2;
                $(".getCode").text(times + "后重新发送");
                //设置定时器
                var timeId = setInterval(function () {
                    if (times <= 1) {
                        clearInterval(timeId);
                        $(".getCode").removeAttr("disabled");
                        $(".getCode").text("获取验证码");
                        return;
                    }
                    times--;
                    $(".getCode").text(times + "后重新发送");
                }, 1000);
            });
        });
    }
});