package com.ted.common.test;

import java.io.ByteArrayOutputStream;
import java.net.URI;

import org.apache.camel.Exchange;
import org.apache.camel.component.file.FileComponent;
import org.apache.camel.component.file.GenericFile;
import org.apache.camel.component.file.remote.FtpConfiguration;
import org.apache.camel.component.file.remote.FtpEndpoint;
import org.apache.camel.component.file.remote.FtpOperations;
import org.apache.camel.component.file.remote.RemoteFileConfiguration;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.DefaultExchange;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPFile;

public class FtpTest {
    public static void main(String[] args) throws Exception {
        FTPClient ftpClient = new FTPClient();
        ftpClient.setControlEncoding("GBK");
        //ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
        
        FtpOperations ftpOperations = new FtpOperations(ftpClient, new FTPClientConfig());

        URI url = new URI("ftp://ftpadmin:samsung11@109.52.21.7");
        RemoteFileConfiguration configuration = new FtpConfiguration(url);
        configuration.setBinary(true);

        FtpEndpoint endPoint = new FtpEndpoint();
        endPoint.setConfiguration(configuration);
        ftpOperations.setEndpoint(endPoint);

        ftpOperations.connect(configuration);

        //GenericFile<FTPFile>
        
//        DefaultCamelContext context = new DefaultCamelContext();
//        Exchange exchange = new DefaultExchange(context);
//
//        DefaultMessage fileMessage = new DefaultMessage();
//        fileMessage.setBody(new String("bbbb").getBytes());
//        exchange.setIn(fileMessage);
//
//        ftpOperations.changeCurrentDirectory("/sandbox/");
//        List<FTPFile> listFiles = ftpOperations.listFiles();
//        for (FTPFile a : listFiles) {
//            System.out.println(a.getName());
//        }
//
//        ftpOperations.storeFile("abc1.txt", exchange);

        ftpOperations.changeCurrentDirectory("sandbox");
        
        DefaultCamelContext context = new DefaultCamelContext();
        Exchange exchange = new DefaultExchange(context);
        
        GenericFile<FTPFile> gfile = new GenericFile<FTPFile>();
        exchange.setProperty(FileComponent.FILE_EXCHANGE_FILE, gfile);
        
        ftpOperations.retrieveFile("abc", exchange);
        //byte[] bytes = (byte[])exchange.getOut().getBody();
        
        ByteArrayOutputStream o = (ByteArrayOutputStream)gfile.getBody();
        System.out.println(new String(o.toByteArray()));
        
        ftpOperations.disconnect();
    }
}
