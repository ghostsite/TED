/**
 * 
 */
package com.ted.xplatform.pojo.common;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ted.xplatform.pojo.base.LogicAuditEntity;

/**
 * @author ghost
 * 附件表。所有的附件都存放在这里,基类。需要继承.
 */
@Entity
@Table(name = "attachment")
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
//@DiscriminatorColumn(name = "table_name", discriminatorType = DiscriminatorType.STRING)
//@DiscriminatorValue("attachment")
@EntityListeners({ org.springframework.data.jpa.domain.support.AuditingEntityListener.class })
public class Attachment extends LogicAuditEntity {
    public enum Type {//this is for typeCode property
        defaults, users
    }

    private static final long serialVersionUID = 7857055935114900696L;

    //    @Id
    //    @GeneratedValue(strategy = GenerationType.AUTO)
    //    //@GenericGenerator(name = "system-uuid", strategy = "native")
    //    @Column(name = "attach_id", length = 32, nullable = false, updatable = false)
    //    protected Long            attachId;                               //唯一主键

    @Column(name = "type_code", length = 32, nullable = false, updatable = false)
    protected String          typeCode         = Type.defaults.name(); //种类,对应属于谁的附件

    @Column(name = "foreign_id")
    protected Long            foreignId;                              //外键

    @Column(name = "origin_name", length = 90)
    protected String          originName;                             //文件的原名

    @Column(name = "file_path", length = 255)
    protected String          filePath;                               //实际保存路径,相对路径,不带文件名的

    protected String          fileName;                               //保存的文件名,带扩展名

    @Column(name = "file_size")
    protected Long            fileSize;                               //文件大小

    @Column(name = "file_type")
    protected String          fileType;                               //种类,png jpg txt doc xls ....

    @Transient
    protected byte[]          bytes;                                  // 临时存放文件的地方

    @Transient
    @JsonIgnore
    public byte[] getBytes() {
        return bytes;
    }

    public void setBytes(byte[] bytes) {
        this.bytes = bytes;
    }

    public String getOriginName() {
        return originName;
    }

    public void setOriginName(String originName) {
        this.originName = originName;
    }

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public Long getForeignId() {
        return foreignId;
    }

    public void setForeignId(Long foreignId) {
        this.foreignId = foreignId;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

}
