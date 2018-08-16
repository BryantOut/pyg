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

        setHTML();

        // 为了在pc端更好的去调试
        onresize = function () {
            setHTML();
        }

        evenListenerList();

        getData();

    }

    function evenListenerList() {
        //为编辑按钮注册点击事件
        $("#edit_btn").on("tap", function () {
            $("body").toggleClass("edit");
            if ($(this).text() == "编辑") {
                $(this).text("完成");
            } else {
                $(this).text("编辑");
            }
        });

        //为数字编辑框注册点击事件，每次点击触发重新计算总价格
        $(".cart_forms ul").on("tap", "button", function () {
            CountAllGoodsPrice();
        });

        //为删除按钮注册点击事件
        $("#del_btn").on("tap", function () {
            console.log("触发删除按钮");
            //1、获取被勾选的复选框的个数
            var checkedList = $(".cf_content [name='checkbox']:checked");
            //2、加入被勾选的个数为0，说明没有选择任何一项，弹出提示框
            if (checkedList.length == 0) {
                mui.toast('你还没有选择宝贝哦', {
                    duration: 'short',
                    type: 'div'
                })
                return;
            }

            //弹出对话框，查询用户是否确认删除
            mui.confirm("是否确定删除该宝贝", "删除提示", ["确定", "取消"], function (e) {
                if (e.index = 0) {
                    //3、同步购物车
                    //3.1、获取未被勾选的复选框的父元素li的数组集合
                    var currGoodsList = $(".cf_content [type='checkbox']").not(":checked").parents("li");
                    // console.log(currGoodsList);
                    //3.2、定义一个空的对象，用于存储商品对象
                    var infos = {};
                    for (var i = 0; i < currGoodsList.length; i++) {
                        //获取每一个li中自定义属性中的goods_id
                        var obj = $(currGoodsList[i]).data("retdata");
                        var goods_id = obj.goods_id;
                        infos[goods_id] = obj;
                    }
                    //3.3、发送ajax请求，同步购物车
                    $.ajax({
                        dataType: "json",
                        type: "post",
                        headers: {
                            "Authorization": $.getToken()
                        },
                        data: {
                            infos: JSON.stringify(infos)
                        },
                        url: "my/cart/sync",
                        success: function (ret) {
                            console.log(ret);
                            //重新渲染页面
                            getData();
                        }
                    });
                } else {
                    return;
                }
            });


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
                console.log(ret);
                if (ret.meta.status == 200) {
                    //判断是否有商品，没有的话不用继续往下执行
                    if (ret.data.cart_info) {
                        var data = JSON.parse(ret.data.cart_info);

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
                    } else {
                        return;
                    }
                } else {
                    mui.toast(ret.meta.msg, {
                        duration: 'short',
                        type: 'div'
                    })
                    return;
                }

            }
        });
    }

    function initNumbox() {
        mui(".mui-numbox").numbox();

        //初始化总价
        CountAllGoodsPrice();
    }

    /* 统计购物车中所有商品的价格总和 */
    function CountAllGoodsPrice() {
        //获取商品列表的所有li标签
        var lists = $(".cart_forms li");
        // console.log(lists);
        var totalPrice = 0;
        //循环遍历获取每一项的单价及所选商品数目累加
        for (var i = 0; i < lists.length; i++) {
            var retData = $(lists[i]).data("retdata");
            //每一项的单价
            var price = retData.goods_price;
            var amount = $(lists[i]).find(".mui-numbox-input").val();
            totalPrice += price * amount;
        }
        console.log(totalPrice);
        //为总价赋值
        $(".order_form .totalPrice>span").text(totalPrice);
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
});