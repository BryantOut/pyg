$(function ($) {
    init();

    function init() {
        getData();
    }

    function getData() {
        $.ajax({
            dataType: "json",
            type: "get",
            data: {
                type: 1
            },
            headers: {
                "Authorization": $.getToken()
            },
            url: "my/orders/all",
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
        $("#item1 ul").html(html);
    }
});