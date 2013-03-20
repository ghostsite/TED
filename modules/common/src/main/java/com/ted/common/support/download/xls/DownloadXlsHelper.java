package com.ted.common.support.download.xls;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springside.modules.utils.Reflections;

import com.ted.common.util.DateUtils;
import com.ted.common.util.xls.PoiXlsUtils;

/**
 * 下载Excel
 */
public abstract class DownloadXlsHelper {
    /**
     * 把list数据结合GridInfo填充到workbook中.这种注释写到public
     */
    public static final void list2Excel(List<?> list, GridInfo gridInfo, Workbook wb) {
        Sheet sheet = wb.createSheet();
        setColumnWidth(wb, gridInfo);
       
        //test(sheet);
        writeTitle(gridInfo, wb, sheet);
        writeHeader(gridInfo, wb, sheet);
        writeBody(list, wb, sheet, gridInfo);
    }
    
    //设置宽度
    private static void setColumnWidth(Workbook wb, GridInfo gridInfo) {
        List<ColumnInfo> colInfos = gridInfo.getColumns();
        for(int colIndex = 0; colIndex < colInfos.size(); colIndex++){
            int defaultWidth = 100 * 15;
            //int width = 
        }
    }

    //写数据Body部分,针对List<Object>,这种注释写到private
    private static final void writeBody(List<?> list, Workbook wb, Sheet sheet, GridInfo gridInfo) {
        int startRowIndex = StringUtils.isBlank(gridInfo.getTitle()) ? 1 : 2;
        for (int i = 0; i < list.size(); i++) {
            Object data = list.get(i);
            writeData(data, wb, sheet, gridInfo, i + startRowIndex);
        }
    };

    //写一个对象数据到excel
    private static void writeData(Object data, Workbook wb, Sheet sheet, GridInfo gridInfo, int rowIndex) {
        List<ColumnInfo> columnInfos = gridInfo.getColumns();
        Row row = sheet.createRow(rowIndex);
        for (int colIndex = 0; colIndex < columnInfos.size(); colIndex++) {
            ColumnInfo colInfo = columnInfos.get(colIndex);
            writeData2Cell(data, colInfo, wb, row, colIndex);
        }
    };

    //写data 对应的field 数据到excel cell
    private static void writeData2Cell(Object data, ColumnInfo colInfo, Workbook wb, Row row, int colIndex) {
        row.setHeightInPoints(20.0F);
        if (colInfo.getHeight() != null && colInfo.getHeight().intValue() > 0) {
            row.setHeightInPoints(colInfo.getHeight().intValue());
        }
        Cell cell = row.createCell(colIndex);
        String value = getValue(data, colInfo);
        System.out.println(row.getRowNum() +","+ colIndex+","+value);
        cell.setCellValue(value);

        CellStyle style = PoiXlsUtils.dataStyle(wb);
        cell.setCellStyle(style);
        if (colInfo.getBgcolor() != null && colInfo.getBgcolor() > 0) {
            style.setFillForegroundColor(colInfo.getBgcolor().shortValue());
        }
        Font font = wb.createFont();
        font.setFontName("Arial");
        font.setBoldweight((short) 300);
        //font.setUnderline((byte) 1);
        font.setFontHeightInPoints((short) 15);

        if (StringUtils.isNotBlank(colInfo.getFont())) {
            font.setFontName(colInfo.getFont());
        }

        if (colInfo.getColor() != null && colInfo.getColor() > 0) {
            font.setColor(colInfo.getColor().shortValue());
        }

        if (colInfo.getFontSize() != null && colInfo.getFontSize() > 0) {
            font.setFontHeight(colInfo.getFontSize().shortValue());
        }
        style.setFont(font);
    };

    //获得data对应的ColumnInfo值,字符串，日期，数字的格式化需要注意.
    private static String getValue(Object data, ColumnInfo colInfo) {
        if(colInfo.getDataIndex() == null){
            return "";
        }
        Object obj = Reflections.getFieldValue(data, colInfo.getDataIndex());
        if (null == obj) {
            return "";
        }
        if (DateUtils.isDate(obj)) {
            return DateUtils.date2Str(obj, colInfo.getFormat());
        } else {
            return obj.toString();
        }
    };

    //写头by GridInfo
    private static final void writeHeader(GridInfo gridInfo, Workbook wb, Sheet sheet) {
        List<ColumnInfo> columnInfos = gridInfo.getColumns();
        int headerRowIndex = StringUtils.isBlank(gridInfo.getTitle()) ? 0 : 1;
        Row row = sheet.createRow(headerRowIndex);
        for (int colIndex = 0; colIndex < columnInfos.size(); colIndex++) {
            ColumnInfo colInfo = columnInfos.get(colIndex);
            row.setHeightInPoints(20.0F);
            if (colInfo.getHeight() != null && colInfo.getHeight().intValue() > 0) {
                row.setHeightInPoints(gridInfo.getHeight().intValue());
            }
            Cell cell = row.createCell(colIndex, 1);
            cell.setCellValue(colInfo.getHeader());
            CellStyle style = PoiXlsUtils.headerStyle(wb);
            cell.setCellStyle(style);
            if (colInfo.getBgcolor() != null && colInfo.getBgcolor() > 0) {
                style.setFillForegroundColor(colInfo.getBgcolor().shortValue());
            }
            
            Font font = wb.createFont();
            font.setFontName("Arial");
            font.setBoldweight((short) 300);
            font.setUnderline((byte) 1);
            font.setFontHeightInPoints((short) 15);

            if (StringUtils.isNotBlank(colInfo.getFont())) {
                font.setFontName(colInfo.getFont());
            }

            if (colInfo.getColor() != null && colInfo.getColor() > 0) {
                font.setColor(colInfo.getColor().shortValue());
            }

            if (colInfo.getFontSize() != null && colInfo.getFontSize() > 0) {
                font.setFontHeight(colInfo.getFontSize().shortValue());
            }

            style.setFont(font);
        }
    };

    //write title
    private static final void writeTitle(GridInfo gridInfo, Workbook wb, Sheet sheet) {
        if (StringUtils.isNotBlank(gridInfo.getTitle())) {
            Row row = sheet.createRow(0);
            row.setHeightInPoints(40.0F);
            if (gridInfo.getHeight() != null && gridInfo.getHeight().intValue() > 0) {
                row.setHeightInPoints(gridInfo.getHeight().intValue());
            }
            Cell cell = row.createCell(0, 1);
            cell.setCellValue(gridInfo.getTitle());
            if (gridInfo.getColspan() != null && gridInfo.getColspan() > 1) {
                sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, gridInfo.getColspan() - 1));
            }
            CellStyle style = PoiXlsUtils.titleStyle(wb);
            cell.setCellStyle(style);
            if (gridInfo.getBgcolor() != null && gridInfo.getBgcolor() > 0) {
                style.setFillForegroundColor(gridInfo.getBgcolor().shortValue());
            }

            Font font = wb.createFont();
            font.setFontName("Arial");
            font.setBoldweight((short) 700);
            font.setUnderline((byte) 1);
            font.setFontHeightInPoints((short) 15);

            if (StringUtils.isNotBlank(gridInfo.getFont())) {
                font.setFontName(gridInfo.getFont());
            }

            if (gridInfo.getColor() != null && gridInfo.getColor() > 0) {
                font.setColor(gridInfo.getColor().shortValue());
            }

            if (gridInfo.getFontSize() != null && gridInfo.getFontSize() > 0) {
                font.setFontHeight(gridInfo.getFontSize().shortValue());
            }

            style.setFont(font);
        }
    };
}
