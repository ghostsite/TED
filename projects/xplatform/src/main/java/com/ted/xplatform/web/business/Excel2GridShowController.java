package com.ted.xplatform.web.business;

import java.util.Map;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.common.collect.Maps;
import com.ted.common.support.extjs4.grid.Column;
import com.ted.common.support.extjs4.grid.DynamicGrid;
import com.ted.common.support.extjs4.grid.Field;
import com.ted.common.util.xls.JxlUtils;
import com.ted.xplatform.util.AttachmentUtils;

/**
 * 前台业务Controller
 * @author ghostzhang
 * @created 2013-04-21
 * 这个是上传Excel到Extjs 动态Grid的Controller
 */
@Controller
@RequestMapping(value = "/business/excel2grid/*")
public class Excel2GridShowController {
    @RequestMapping(value = "/uploadAndShow")
    public @ResponseBody
    DynamicGrid uploadAndShow(MultipartHttpServletRequest multipartRequest) throws Exception {
        MultipartFile multipartFile = AttachmentUtils.getMultipartFile(multipartRequest);
        Workbook workbook = JxlUtils.getWorkBookFromBytes(multipartFile.getBytes());
        Sheet sheet = workbook.getSheet(0);
        int rows = sheet.getRows();

        DynamicGrid gridInfo = new DynamicGrid();
        gridInfo.setNumberOfElements(rows - 1);

        //设置Grid的Field
        setGridFields(sheet, gridInfo);

        //设置Grid的Columns
        setGridColumns(sheet, gridInfo);

        //设置Grid的Content
        setGridContent(sheet, gridInfo);

        return gridInfo;
    }

    private void setGridContent(Sheet sheet, DynamicGrid gridInfo) {
        int rows = sheet.getRows();
        int columnCount = sheet.getColumns();
        for (int i = 1; i < rows; i++) {
            setRow(sheet.getRow(i), gridInfo, columnCount);
        }
    };

    private void setRow(Cell[] row, DynamicGrid gridInfo, int columnCount) {
        Map<String, Object> data = Maps.newHashMap();
        for (int j = 0; j < columnCount; j++) {
            data.put("column"+j, row[j].getContents());
        }
        gridInfo.getContent().add(data);
    };

    private void setGridColumns(Sheet sheet, DynamicGrid gridInfo) {
        int column = sheet.getColumns();
        Cell[] headerCells = sheet.getRow(0);
        for (int i = 0; i < column; i++) {
            Column col = new Column();
            col.setDataIndex("column" + i);
            col.setHeader(headerCells[i].getContents());

            gridInfo.getColumns().add(col);
        }
    };

    private void setGridFields(Sheet sheet, DynamicGrid gridInfo) {
        int column = sheet.getColumns();
        for (int i = 0; i < column; i++) {
            Field field = new Field();
            field.setName("column" + i);
            field.setType("string");

            gridInfo.getFields().add(field);
        }
    };
}
