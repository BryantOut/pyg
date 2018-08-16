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
                console.log("触发编辑按钮");

            } else {
                $(this).text("编辑");
                console.log("触发完成按钮");
                //先获取所有商品的li
                var goodsList = $(".cart_forms li");
                // console.log(goodsList);
                //如果没有任何一个商品,提醒用户
                if (goodsList.length == 0) {
                    mui.toast('你还没有选择宝贝哦', {
                        duration: 'short',
                        type: 'div'
                    })
                    return;
                }
                //准备一个需要发送到后台的infos对象
                var infos = {};
                for (var i = 0; i < goodsList.length; i++) {
                    //获取每个li的自定义属性data
                    var retdata = $(goodsList[i]).data("retdata");
                    // console.log(retdata);
                    //获取每一项商品的goods_id
                    var goods_id = retdata.goods_id;
                    //获取当前的amount，并赋值给对象
                    retdata.amount = $(".mui-numbox-input").val();
                    // console.log(goods_id);
                    infos[goods_id] = retdata;
                }
                //同步购物车
                updateData(infos);
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
                if (e.index == 0) {
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
                    updateData(infos);
                    console.log("删除事件完成");
                } else {
                    console.log("删除事件失败");
                    return;
                }
            });


        });

        //为生成订单按钮注册点击事件
        $(".createOrder").on("tap", function () {
            //假如购物车中没有一个商品。则不往下执行
            var goodsList = $(".cart_forms li");
            if (goodsList.length == 0) {
                mui.toast("你的购物车中还没有宝贝哦", {
                    duration: 'short',
                    type: 'div'
                });
                return;
            }
            console.log("触发生成订单按钮");
            //获取所有商品中价格
            var order_price = $(".order_form .totalPrice>span").text();
            // console.log(amount);
            //当前自定义收获地址
            var consignee_addr = "广东省潮州市湘桥区新乡新名巷15号501";
            //先自定义一个空的数组，用于存储商品列表中的数据
            var goods = [];
             //循环遍历购物车中每一项商品，获取每一项li中的自定义属性存储的值
            for (var i = 0; i < goodsList.length; i++) {
                var retdata = $(goodsList[i]).data("retdata");
                // console.log(retdata);
                //先定义一个空对象
                var obj = {};
                obj.goods_id = retdata.goods_id;
                obj.goods_price = retdata.goods_price;
                //获取当前amount
                var amount = $(goodsList[i]).find(".mui-numbox-input").val();
                obj.goods_number = amount;

                goods.push(obj);
            }

            var data = {
                order_price:order_price,
                order_price:order_price,
                goods:goods
            }

            //执行封装的方法，生成订单 
            generateOrder(data);           
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
                // console.log(ret);
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

    //封装同步数据代码块
    function updateData(infos) {
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
    }

    //生成订单按钮
    function generateOrder(data) {
        $.ajax({
            dataType:"json",
            type:"post",
            data:data,
            headers: {
                "Authorization": $.getToken()
            },
            url:"my/orders/create",
            success:function(ret){
                var msg = ret.meta.msg;
                var status = ret.meta.status;
                if (status == 200) {
                    mui.toast(msg, {
                        duration: 'short',
                        type: 'div'
                    })
                    setTimeout(function(){
                        location.href = "/pages/orders.html";
                    },1000);
                } else {
                    mui.toast(msg, {
                        duration: 'short',
                        type: 'div'
                    });
                    return;
                }
            }
        });
    }
});