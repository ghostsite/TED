package com.ted.common.util.xls;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import jxl.Workbook;
import jxl.read.biff.BiffException;

public abstract class JxlUtils {
    public static final Workbook getWorkBookFromBytes(byte[] bytes) throws BiffException, IOException {
        return getWorkBookFromStream(new ByteArrayInputStream(bytes));
    };

    public static final Workbook getWorkBookFromStream(InputStream is) throws BiffException, IOException {
        Workbook workbook = Workbook.getWorkbook(is);
        return workbook;
    };

    public static final Workbook getWorkBookFromFile(File file) throws BiffException, IOException {
        Workbook workbook = Workbook.getWorkbook(file);
        return workbook;
    };
}
