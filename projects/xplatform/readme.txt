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
