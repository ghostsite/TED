这个一个模拟window的系统
架构在springside4+spring3+hibernate4-jpa+extjs4基础上
借鉴了mesplus的前台和部分后台。
数据库用mysql，自己设计。

注意：不再支持extjs3
由于插件的不支持4.2,故先用4.1 

===============
登陆用户名/密码：manager/123(系统管理员)  zwz3/123(领导)

===============
关于exjs版本的兼容性问题：
不兼容ext4.2的插件有：
1 BoxSelect
2 GeoExt2
3 MES.view.form.field.MultiFileUploader

===================
update to extjs4.2:
1 Ext.ux.grid.RowExpander rename to Ext.grid.plugin.RowExpaner (seach all js)
2 remove uux/grid/RowExpander
3 remove extjs-4.1.1 dir
4 change main.ftl from extjs-4.1.1 to extjs
5 UserInterface , getController().init() to getController().
6 新建用户，调用save called 2次，导致insert Failed //extjs 4.2才有这个问题，4.1好着呢。到时候升级4.2的时候再debug看看
7 extjs4.2.0 下的日期控件都是YYYY //bug for extjs4.2,en的是好的。

==================
登陆zwz3,总是出现个错误。 //logout 页面到底掉logout方法没。 //登陆、退出、再登陆就有问题。跳转不到main方法。F5就进去了。nnd，总是这个现象。//tomcat 7 出现这个错误，，tomcat 6 出现8192的问题，http://hi.baidu.com/xghrbc1001/item/fa439cce70d81f0ac710b293
<Connector port="8080" protocol="HTTP/1.1" 
               connectionTimeout="20000" maxHttpHeaderSize="81920"  
               redirectPort="8443" />

			   
=============================
写文档
陆斌熟悉保险的事，问下。


辅助页面出现白斑。
兼容性：
上传空间在IE8下出现问题。//TODO fix it , for IE,实在不行就读取返回值，不用浏览器本地功能读取name and size MultiFileUploader.js
IE6下，文本框都是橘黄色 //fixed
centerone try //IE8下还可以。
tree IE8，抖动，examples不抖动。//我怀疑是 parentId循环加载导致的，要是一次读取children估计就不会有这个现象了。//不对啊，点展开按钮，不会读取后台，可还是抖动现象出现啊。//animate的问题，取消animate就不抖动了。
日志管理，时间都为NNNNNN//fixed

--------------------------------
extjs 性能：
1 尽量用抽象级别的。用DataView就不用component,Ext.container.Container rather than an Ext.panel.Panel
2 少用tabpanel , cardlayout, 如果用，可以lazy
3 animate=fale
4 尽量用原生的：autoEl, html, tpl & data.
5 mon instead of on, 
http://www.sencha.com/blog/optimizing-ext-js-4-1-based-applications
http://www.sencha.com/forum/showthread.php?153565-ExtJS-Performance-Best-Practices

Ext.define('MyClass', {
    ...

    constructor: function(config) {
        ...

        this.store.on('load', function() {
            ...
        }, this);
    }
});
The thing to realize is that a new listener function is created each time this constructor runs. This not only takes time but could potentially leak loads of memory though a closure. The preferred pattern looks like this:

Ext.define('MyClass', {
    ...

    constructor: function(config) {
        ...

        this.store.on('load', this.onStoreLoad, this);
    },

    onStoreLoad: function() {
        ...
    }
});

-----------------------

http://localhost:8080/xp/main#BUS.view.codeview.CodeViewShow:icon=image%2FmenuIcon%2F0323_16.png 在centerone下，F5刷新，就没有了。



clean time 4 clock: 
1 clean disk
2 chrome clean
2.5 uninstall programs
3 磁盘整理
4 休假申请
5 email to part cell长，关于休假
6 mail to 同事，轻轻的走了。
7 mail to lulu ，流程 //done
8 笔记本给禄禄，工卡给禄禄，single密码给禄禄。

