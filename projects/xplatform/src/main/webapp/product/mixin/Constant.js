/*
 * TODO 이 Mixin은 MES 모듈로 이동하여야 한다.
 */
Ext.define('mixin.Constant', {
	MAX_INT : Math.pow(2, 31) - 1, //C# max_int 2147483647이므로 -1
	
	page : {
		pageSize : 20,
		maxSize : 10000 //最大数
	}
	
});