# 项目介绍

目录

[1  项目背景](#1--项目背景)

[2  架构介绍](#2--架构介绍)

[3  技术在线](#3--技术在线)

[4  技术详解](#4--技术详解)

- [4.1  mui轮播图](#41--mui轮播图)
- [4.2  代码优化之--拦截器](#42--代码优化之--拦截器)
- [4.3  模板引擎](https://github.com/BryantOut/bx#1--%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E%E7%9A%84%E4%BD%BF%E7%94%A8)

## 1  项目背景

​	品优购网上商城是一个综合性的**B2B2C**平台，类似京东商城，

天猫商城。网站采用商家入驻的模式，商家入驻平台提交申请，有平台资质审核，审核过后，商家拥有独立管理后台，录入商品信息。商品经过平台审核后即可发布。

​	品优购网上商城主要分为网站前台，运营商、商家管理后台三个子系统。

> **B2B2C**

​	B2B2C是一种电子商务类型的[网络购物](https://baike.baidu.com/item/%E7%BD%91%E7%BB%9C%E8%B4%AD%E7%89%A9/1521810)商业模式，B是BUSINESS的简称，C是CUSTOMER的简称，第一个B指的是商品或服务的供应商，第二个B指的是从事电子商务的企业，C则是表示消费者。

## 2  架构介绍

​	目前企业中开发的项目，大部分是使用前后端分离的架构。

如图：

![](./mdImg/架构图.png)

## 3  技术在线


​	可能需要用得到的网站

| 名称           | 网址                                       | 备注          |
| ------------ | ---------------------------------------- | ----------- |
| zepto        | http://www.css88.com/doc/zeptojs_api/    | zepto的中文api |
| art-template | http://aui.github.io/art-template/zh-cn/docs/ | 模版引擎        |
| fontawesome  | http://fontawesome.dashgame.com/         | 字体图标        |
| mui官网        | http://dev.dcloud.net.cn/mui/            | 官方网站        |
| hello-mui    | http://www.dcloud.io/hellomui/           | 在线案例        |
| mui-辅助类      | http://www.mubrand.com/?post=19          | mui的辅助类     |
| 品优购在线        | http://pyg.ak48.xyz/                     | 上课参照的案例     |
| 上课源代码        | https://gitee.com/ukSir/gz20-pyg.git     | 上课的源代码的地址   |
| api接口文档      | [api.md](api.md)                         |             |

## 4  技术详解

### 4.1  mui轮播图

> 轮播图如果是动态生成，则需要在渲染完毕之后，手动执行初始化。



**html代码**

```html
<!-- 轮播图部分开始 -->
<div class="mui-slider">
  <div class="mui-slider-group mui-slider-loop">
    <!--支持循环，需要重复图片节点-->
    <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="4.jpg" /></a>	  </div>
    <div class="mui-slider-item"><a href="#"><img src="1.jpg" /></a></div>
    <div class="mui-slider-item"><a href="#"><img src="2.jpg" /></a></div>
    <div class="mui-slider-item"><a href="#"><img src="3.jpg" /></a></div>
    <div class="mui-slider-item"><a href="#"><img src="4.jpg" /></a></div>
    <!--支持循环，需要重复图片节点-->
    <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="1.jpg" /></a>	  </div>
  </div>
</div>
<!-- 轮播图部分结束 -->
```



**js代码**

```js
//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
});
```



### 4.2  代码优化之--拦截器



**js代码**

```js
$(function () {
    var BaseUrl=" http://api.pyg.ak48.xyz/api/public/v1/";
    // 修改接口的使用方式
    // 拦截器
    // 在每一次发送请求 之前对请求做一些处理 
    // 发送请求之前,提前对于 接口的url进行处理 
    // var oobj={};
    // $.ajax(oobj);
    // http://api.pyg.ak48.xyz/api/public/v1/  +   home/swiperdata
    $.ajaxSettings.beforeSend=function (xhr,obj) {
      obj.url=BaseUrl+ obj.url;
    }
})
```

![](./mdImg/拦截器.png)



### 4.3  模板引擎

[模板引擎笔记地址](https://github.com/BryantOut/bx#1--%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E%E7%9A%84%E4%BD%BF%E7%94%A8)



### 4.4  rem

[rem有关笔记]()