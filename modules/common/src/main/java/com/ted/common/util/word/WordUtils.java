package com.ted.common.util.word;

import java.io.ByteArrayOutputStream;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.rtf.RtfWriter2;

/**
 * needs 3 jars:iText2.1.7.jar, iText-rtf2.1.7.jar, iTextArea.jar
 * iText高版本不支持word，只能暂时用老版本。
 */
public abstract class WordUtils {
    public static final byte[] write(String title, String content) throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        RtfWriter2.getInstance(document, out);
        document.open();

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
    };
}
