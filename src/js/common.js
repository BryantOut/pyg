$(function () {
  var BaseUrl = " http://api.pyg.ak48.xyz/";
  template.defaults.imports.url = BaseUrl;
  // 修改接口的使用方式
  // 拦截器
  // 在每一次发送请求 之前对请求做一些处理 
  // 发送请求之前,提前对于 接口的url进行处理 
  // var oobj={};
  // $.ajax(oobj);
  // http://api.pyg.ak48.xyz/api/public/v1/  +   home/swiperdata

  //发送请求的个数
  var ajaxNums = 0;

  $.ajaxSettings.beforeSend = function (xhr, obj) {
    obj.url = BaseUrl + "api/public/v1/" + obj.url;
    ajaxNums++;
    $("body").addClass("wait");
  }

  //获得返回值之后调用一次
  $.ajaxSettings.complete = function () {
    //同时发送了3个请求，要求=>最后一个请求，再去隐藏！！
    //否则第一个请求回来就做隐藏，可能还会有其他请求还没有回来
    ajaxNums--;
    if (ajaxNums == 0) {
      //最后一个请求了！！！
      $("body").removeClass("wait");
    }
  }

  // 拓展zepto-> 给$对象添加自定义的属性或者方法 
  $.extend($, {
    getUrlValue:function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    checkPhone: function (phone) {
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        return false;
      } else {
        return true;
      }
    },
    checkEmail: function (myemail) {　　
      var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
      if (myReg.test(myemail)) {　　　　
        return true;　　
      } else {　　　　
        return false;
      }
    },
    checkUserInfo:function () {
      return localStorage.getItem("userInfo");
    },
    getToken:function () {
      if (!localStorage.getItem("userInfo")) {
        console.log("未登录");
        token = "";
      }else {
        var userInfo = JSON.parse(localStorage.getItem("userInfo"));
        var token = userInfo.token;
        // console.log(userInfo.token);
      }
      return token;
    }
  });


})