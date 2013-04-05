这个一个模拟window的系统
架构在springside4+spring3+hibernate4-jpa+extjs4基础上
借鉴了mesplus的前台和部分后台。
数据库用mysql，自己设计。

注意：不再支持extjs3
由于插件的不支持4.2,故先用4.1 

===============
登陆用户名/密码：manager/123

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
6 
