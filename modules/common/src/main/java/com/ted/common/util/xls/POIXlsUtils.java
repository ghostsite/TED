package com.ted.common.util.xls;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * POI xls部分的util
 */
public abstract class PoiXlsUtils {
    public static final Workbook createWorkBook(ExcelType type) {
        if (type == ExcelType.XLS) {
            return new HSSFWorkbook();
        } else {
            return new XSSFWorkbook();
        }
    };

    public static void main(String[] args) throws IOException {
        HSSFWorkbook wb = new HSSFWorkbook();
        Cell c = wb.createSheet().createRow(0).createCell(0);
        c.setCellValue("a");
        FileOutputStream fOut = new FileOutputStream("d:\\temp2\\a.xls");
        // 把相应的Excel 工作簿存盘
        wb.write(fOut);
        fOut.flush();
        // 操作结束，关闭文件
        fOut.close();
    }

    /**
     * workbook to byte[]
     */
    public static byte[] wb2bytes(Workbook wb) throws IOException {
        ByteArrayOutputStream ous = new ByteArrayOutputStream();
        wb.write(ous);
        return ous.toByteArray();
    };

    /**
     * 注意，一下都是HSSF的，至于XSSF的还没有，暂时空缺.
     */
    public static CellStyle linkStyle(Workbook work) {
        HSSFCellStyle linkStyle = (HSSFCellStyle) work.createCellStyle();
        linkStyle.setBorderBottom((short) 1);
        linkStyle.setBorderLeft((short) 1);
        linkStyle.setBorderRight((short) 1);
        linkStyle.setBorderTop((short) 1);
        linkStyle.setFillForegroundColor(HSSFColor.SKY_BLUE.index);
        linkStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        Font font = work.createFont();
        font.setFontName(HSSFFont.FONT_ARIAL);
        font.setUnderline((byte) 1);
        font.setColor(HSSFColor.BLUE.index);
        linkStyle.setFont(font);
        return linkStyle;
    }

    /**
     * 数据样式
     */
    public static CellStyle dataStyle(Workbook work) {
        HSSFCellStyle dataStyle = (HSSFCellStyle) work.createCellStyle();
        dataStyle.setBorderBottom((short) 1);
        dataStyle.setBorderLeft((short) 1);
        dataStyle.setBorderRight((short) 1);
        dataStyle.setBorderTop((short) 1);
        dataStyle.setFillForegroundColor(HSSFColor.WHITE.index);
        dataStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        dataStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        return dataStyle;
    }

    /**
     * 表头样式
     * @return HSSFCellStyle
     */
    public static HSSFCellStyle headerStyle(Workbook work) {
        HSSFCellStyle style = (HSSFCellStyle) work.createCellStyle();
        style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style.setFillForegroundColor(HSSFColor.PALE_BLUE.index);
        style.setBorderLeft((short) 1);
        style.setBorderTop((short) 1);
        style.setBorderRight((short) 1);
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        //HSSFFont font = (HSSFFont) work.createFont();
        return style;
    }

    /**
     * Title样式
     * @return HSSFCellStyle
     */
    public static HSSFCellStyle titleStyle(Workbook work) {
        HSSFCellStyle style = (HSSFCellStyle) work.createCellStyle();
        style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style.setFillForegroundColor(HSSFColor.WHITE.index);
        style.setBorderBottom((short) 1);
        style.setBorderLeft((short) 1);
        style.setBorderRight((short) 1);
        style.setBorderTop((short) 1);
        style.setAlignment(CellStyle.ALIGN_CENTER);
        //HSSFFont font = (HSSFFont) work.createFont();
        return style;
    }
}
