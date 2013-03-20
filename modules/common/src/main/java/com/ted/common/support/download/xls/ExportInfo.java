package com.ted.common.support.download.xls;

import java.io.Serializable;

/**
 * 妥协于mes,Exporter.js,传参里面params = {export:{title, columns:[{},{}]}}
 */
public class ExportInfo implements Serializable {
    private GridInfo export;

    public GridInfo getExport() {
        return export;
    }

    public void setExport(GridInfo export) {
        this.export = export;
    }

}
