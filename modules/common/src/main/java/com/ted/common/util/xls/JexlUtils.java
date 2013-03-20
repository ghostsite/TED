package com.ted.common.util.xls;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Map;

import net.sf.jxls.exception.ParsePropertyException;
import net.sf.jxls.transformer.XLSTransformer;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Workbook;

/**
 * 这个依赖jexl.jar 这是一个Excel模板的工具。
 */
public abstract class JexlUtils {
    public static final Workbook transformXLS(File file, Map beanParams) throws FileNotFoundException, ParsePropertyException, InvalidFormatException {
        InputStream is = new BufferedInputStream(new FileInputStream(file));
        Workbook wb = new XLSTransformer().transformXLS(is, beanParams);
        return wb;
    };
}
