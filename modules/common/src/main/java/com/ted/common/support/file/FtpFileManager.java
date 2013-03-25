package com.ted.common.support.file;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.apache.camel.Exchange;
import org.apache.camel.component.file.FileComponent;
import org.apache.camel.component.file.GenericFile;
import org.apache.camel.component.file.remote.FtpConfiguration;
import org.apache.camel.component.file.remote.FtpEndpoint;
import org.apache.camel.component.file.remote.FtpOperations;
import org.apache.camel.component.file.remote.RemoteFileConfiguration;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.DefaultExchange;
import org.apache.camel.impl.DefaultMessage;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPFile;

import com.ted.common.exception.BusinessException;

/**
 * @TODO FTP文件管理
 */
public class FtpFileManager implements FileManager {
    static final FTPClient ftpClient = new FTPClient();
    static {
        ftpClient.setControlEncoding("GBK");
    }

    private String         uri;                        //config 

    public void setUri(String uri) {
        this.uri = uri;
    }

    //注意：是打开了connection
    public FtpOperations getFtpOperations() {
        FtpOperations ftpOperations = new FtpOperations(ftpClient, new FTPClientConfig());
        URI url;
        try {
            url = new URI(uri);
        } catch (URISyntaxException e) {
            e.printStackTrace();
            throw BusinessException.wrap(e);
        }
        RemoteFileConfiguration configuration = new FtpConfiguration(url);
        configuration.setBinary(true);
        FtpEndpoint endPoint = new FtpEndpoint();
        endPoint.setConfiguration(configuration);
        ftpOperations.setEndpoint(endPoint);
        ftpOperations.connect(configuration);
        return ftpOperations;
    }

    @Override
    public void save(String dir, String name, byte[] bytes) {
        FtpOperations ftpOperations = getFtpOperations();
        DefaultCamelContext context = new DefaultCamelContext();
        Exchange exchange = new DefaultExchange(context);
        DefaultMessage fileMessage = new DefaultMessage();
        fileMessage.setBody(bytes);
        exchange.setIn(fileMessage);

        checkAttachFileDir(dir ,ftpOperations);
        ftpOperations.changeCurrentDirectory(dir);
        ftpOperations.storeFile(name, exchange);
        ftpOperations.disconnect();
    }

    @Override
    public byte[] load(String dir, String name) {
        FtpOperations ftpOperations = getFtpOperations();
        ftpOperations.changeCurrentDirectory(dir);
        
        DefaultCamelContext context = new DefaultCamelContext();
        Exchange exchange = new DefaultExchange(context);
        GenericFile<FTPFile> gfile = new GenericFile<FTPFile>();
        exchange.setProperty(FileComponent.FILE_EXCHANGE_FILE, gfile);
        
        ftpOperations.retrieveFile(name, exchange);
        //byte[] bytes = (byte[])exchange.getOut().getBody();
        ByteArrayOutputStream o = (ByteArrayOutputStream)gfile.getBody();
        ftpOperations.disconnect();
        return o.toByteArray();
    }

    @Override
    public void remove(String dir, String name) {
        // TODO Auto-generated method stub

    }
    
    //检验文件夹是否存在
    public static final void checkAttachFileDir(String dir, FtpOperations ftpOperations) {
        ftpOperations.buildDirectory(dir, false);
    }

}
