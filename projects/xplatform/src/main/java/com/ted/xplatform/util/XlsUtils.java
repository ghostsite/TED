package com.ted.xplatform.util;

import java.io.OutputStream;
import java.util.List;
import java.util.Map;

import jxl.Sheet;
import jxl.Workbook;
import jxl.write.WritableWorkbook;

import com.ted.xplatform.vo.grid.GridData;

/**
 * Excel的帮助类,暂时先放到xplatform中，以后估计会放到common中
 * use jxl.jar 2.6.12
 * @author ghostzhang
 * @date 20130303
 */
public abstract class XlsUtils {
    public static final WritableWorkbook createWorkbook(OutputStream os) throws Exception{
        return Workbook.createWorkbook(os);
    }
    
    public static final Sheet createWorkbookSheet(OutputStream os) throws Exception{
        WritableWorkbook workbook = Workbook.createWorkbook(os);
        return workbook.getSheet(0);
    }
    
    
    public static final void writeObjectList2Xls(Sheet sheet, List<Object> list, GridData gridData) {
        
    }

    public static final void writeMapList2Xls(Sheet sheet, List<Map<String, Object>> list, GridData gridData) {

    }
}
