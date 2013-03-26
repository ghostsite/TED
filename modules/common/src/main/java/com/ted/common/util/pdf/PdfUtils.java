package com.ted.common.util.pdf;

import java.io.ByteArrayOutputStream;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.lowagie.text.Element;

/**
 * 简单的util
 * 复杂的以后再说
 * 目前存在2个版本.5.4.0(for pdf) and 2.1.7(for word)
 */
public abstract class PdfUtils {

    public static final byte[] write(String title, String content) throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        // step2
        PdfWriter.getInstance(document, out);
        // step3
        document.open();

        // step 4：添加内容  
        Paragraph titleParagraph = new Paragraph(title);
        // 设置标题格式对齐方式  
        titleParagraph.setAlignment(Element.ALIGN_CENTER);
        document.add(titleParagraph);

        Paragraph context = new Paragraph(content);
        // 正文格式左对齐  
        context.setAlignment(Element.ALIGN_LEFT);
        // 离上一段落（标题）空的行数  
        context.setSpacingBefore(20);
        // 设置第一行空的列数  
        context.setFirstLineIndent(20);
        document.add(context);

        //在表格末尾添加图片  
        //Image png = Image.getInstance("E:\\图片\\abc.jpg");
        //document.add(png);

        document.close();
        return out.toByteArray();
    }
}
