package com.ted.common.freemarker.methodExt;

import java.util.Date;
import java.util.List;

import freemarker.template.TemplateMethodModelEx;
import freemarker.template.TemplateModelException;

/**
 * @author tsw
 * 如果在spring里面 定义freemarker的方法 两个办法 继承 TemplateMethodModelEx  或者 TemplateMethodModel 
 * 但是有一个问题，继承 TemplateMethodModelEx的时候 可以识别自定义的方法，此时不会报错，
 * 如果继承TemplateMethodModel的方法 用在模板里面就会报错，原因暂时没有充分的理由不好说文档说可以用
 * 下面是猜测：
 * freemarker MethodCall(Expression target, ListLiteral arguments) 里面会判断
 *   method instanceof TemplateMethodModelEx 来判断是否是 外部自定义方法
 * 如果不继承这个就按照内部方法使用，就会会发现告诉你 这个方法找不到引起的问题
 * java.util.Date =>freemarker.template.SimpleDate 其他的timestamp 就不会
 * freemarker的数据类型可以自行定义freemarker.template.SimpleDate 参考这个就可以
 */
public class JsDateTemplateMethodModelExt  implements TemplateMethodModelEx  {

	/* (non-Javadoc)
	 * @see freemarker.template.TemplateMethodModel#exec(java.util.List)
	 * 此方法为了返回的时间字符串 能给前端 js 生成js的  date 对象使用  
	 * alert(new Date("Fri Feb 03 16:08:09 CST 2012")); == System.out.println(new Date().toGMTString());
	 * alert(new Date("3 Feb 2012 08:20:18 GMT")); == System.out.println(new Date().toGMTString());
	 * 这个方法在模板中的使用 和在模板中定义宏的使用类似
	 */
	@Override
	public Object exec(List arguments) throws TemplateModelException {
		String return_DateStr_4_jsDate="";
		if(arguments!=null && arguments.size()>0){
			Object _1 = arguments.get(0);
			
			if(_1 instanceof java.util.Date  ){
				return_DateStr_4_jsDate = ((Date)_1).toGMTString() ;
			}else if(_1  instanceof  java.util.Calendar){
				return_DateStr_4_jsDate = ((java.util.Calendar)_1).getTime().toGMTString();
			}else if(_1 instanceof  freemarker.template.SimpleDate){
				return_DateStr_4_jsDate = ((freemarker.template.SimpleDate)_1).getAsDate().toGMTString();
			}else{
				return _1==null?"null":_1.toString();
			}
		}
		return return_DateStr_4_jsDate;
	}

}
