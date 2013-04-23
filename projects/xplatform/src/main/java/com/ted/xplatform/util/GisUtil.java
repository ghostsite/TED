package com.ted.xplatform.util;

import com.ted.xplatform.pojo.gis.TGisLayersStyles;

/**
 * @作者：庞华
 * @创建时间：2012-06-19
 * @说明：GIS工具
 */
public abstract class GisUtil {
    /**
     * 获取图层样式
     */
    @SuppressWarnings("unused")
    public static String getLayerStyles(TGisLayersStyles _E) {
        StringBuffer styles = new StringBuffer("{");
        if (_E != null) {
            String styleOption = null;
            styles.append("graphicName : \"" + _E.getGraphicName() + "\"");
            styles.append(", pointRadius : " + _E.getPointRadius() + "");
            styles.append(", hoverPointRadius : 1");
            styles.append(", hoverPointUnit : \"%\"");
            styles.append(", pointerEvents : \"visiblePainted\"");
            styles.append(", cursor : \"inherit\"");
            // 填充
            if (_E.getFill().equals("1")) {
                if (styleOption == null)
                    styleOption = "fill";
                else
                    styleOption += ",fill";
                if (_E.getFillColor() != null && !_E.getFillColor().equals(""))
                    styles.append(", fillColor : \"" + _E.getFillColor() + "\"");
                if (_E.getFillOpacity() != null)
                    styles.append(", fillOpacity : " + _E.getFillOpacity() + "");
            }
            // 边框
            if (_E.getStroke().equals("1")) {
                if (styleOption == null)
                    styleOption = "stroke";
                else
                    styleOption += ",stroke";
                if (_E.getStrokeColor() != null && !_E.getStrokeColor().equals(""))
                    styles.append(", strokeColor : \"" + _E.getStrokeColor() + "\"");
                if (_E.getStrokeOpacity() != null)
                    styles.append(", strokeOpacity : " + _E.getStrokeOpacity() + "");
                if (_E.getStrokeWidth() != null)
                    styles.append(", strokeWidth : " + _E.getStrokeWidth() + "");
                if (_E.getStrokeLinecap() != null && !_E.getStrokeLinecap().equals(""))
                    styles.append(", strokeLinecap : \"" + _E.getStrokeLinecap() + "\"");
                if (_E.getStrokeDashstyle() != null && !_E.getStrokeDashstyle().equals(""))
                    styles.append(", strokeDashstyle : \"" + _E.getStrokeDashstyle() + "\"");
            }
            // 图形和背景
            if (_E.getGraphic().equals("1")) {
                if (styleOption == null)
                    styleOption = "graphic";
                else
                    styleOption += ",graphic";
                // 图形
                if (_E.getExternalGraphic() != null && !_E.getExternalGraphic().equals(""))
                    styles.append(", externalGraphic : \"" + _E.getExternalGraphic() + "\"");
                if (_E.getGraphicWidth() != null)
                    styles.append(", graphicWidth : " + _E.getGraphicWidth() + "");
                if (_E.getGraphicHeight() != null)
                    styles.append(", graphicHeight : " + _E.getGraphicHeight() + "");
                if (_E.getGraphicOpacity() != null)
                    styles.append(", graphicOpacity : " + _E.getGraphicOpacity() + "");
                if (_E.getGraphicXOffset() != null)
                    styles.append(", graphicXOffset : " + _E.getGraphicXOffset() + "");
                if (_E.getGraphicYOffset() != null)
                    styles.append(", graphicYOffset : " + _E.getGraphicYOffset() + "");
                if (_E.getRotation() != null)
                    styles.append(", rotation : " + _E.getRotation() + "");
                if (_E.getGraphicZIndex() != null)
                    styles.append(", graphicZIndex : " + _E.getGraphicZIndex() + "");
                if (_E.getGraphicTitle() != null && !_E.getGraphicTitle().equals(""))
                    styles.append(", graphicTitle : \"" + _E.getGraphicTitle() + "\"");
                // 背景
                if (_E.getBackgroundGraphic() != null && !_E.getBackgroundGraphic().equals(""))
                    styles.append(", backgroundGraphic : \"" + _E.getBackgroundGraphic() + "\"");
                if (_E.getBackgroundGraphicZIndex() != null)
                    styles.append(", backgroundGraphicZIndex : " + _E.getBackgroundGraphicZIndex() + "");
                if (_E.getBackgroundXOffset() != null)
                    styles.append(", backgroundXOffset : " + _E.getBackgroundXOffset() + "");
                if (_E.getBackgroundYOffset() != null)
                    styles.append(", backgroundYOffset : " + _E.getBackgroundYOffset() + "");
                if (_E.getBackgroundHeight() != null)
                    styles.append(", backgroundHeight : " + _E.getBackgroundHeight() + "");
                if (_E.getBackgroundWidth() != null)
                    styles.append(", backgroundWidth : " + _E.getBackgroundWidth() + "");
            }
            // 文本
            if (_E.getLabelText() != null && !_E.getLabelText().equals("")) {
                styles.append(", labelText : \"" + _E.getLabelText() + "\"");
                styles.append(", label : \"" + _E.getLabelText() + "\"");
                if (_E.getLabelAlign() != null && !_E.getLabelAlign().equals(""))
                    styles.append(", labelAlign : \"" + _E.getLabelAlign() + "\"");
                if (_E.getLabelXOffset() != null)
                    styles.append(", labelXOffset : " + _E.getLabelXOffset() + "");
                if (_E.getLabelYOffset() != null)
                    styles.append(", labelYOffset : " + _E.getLabelYOffset() + "");
                if (_E.getLabelSelect() != null && !_E.getLabelSelect().equals(""))
                    styles.append(", labelSelect : " + (_E.getLabelSelect().equals("1") ? true : false) + "");
                if (_E.getFontColor() != null && !_E.getFontColor().equals(""))
                    styles.append(", fontColor : \"" + _E.getFontColor() + "\"");
                if (_E.getFontOpacity() != null)
                    styles.append(", fontOpacity : " + _E.getFontOpacity() + "");
                if (_E.getFontFamily() != null && !_E.getFontFamily().equals(""))
                    styles.append(", fontFamily : \"" + _E.getFontFamily() + "\"");
                if (_E.getFontSize() != null && !_E.getFontSize().equals(""))
                    styles.append(", fontSize : \"" + _E.getFontSize() + "\"");
                if (_E.getFontWeight() != null && !_E.getFontWeight().equals(""))
                    styles.append(", fontWeight : \"" + _E.getFontWeight() + "\"");
                if (_E.getLabelOutlineColor() != null && !_E.getLabelOutlineColor().equals(""))
                    styles.append(", labelOutlineColor : \"" + _E.getLabelOutlineColor() + "\"");
                if (_E.getLabelOutlineWidth() != null)
                    styles.append(", labelOutlineWidth : " + _E.getLabelOutlineWidth() + "");
                if (_E.getLabelPadding() != null)
                    styles.append(", labelPadding : " + _E.getLabelPadding() + "");
                if (_E.getLabelBackgroundColor() != null && !_E.getLabelBackgroundColor().equals(""))
                    styles.append(", labelBackgroundColor : \"" + _E.getLabelBackgroundColor() + "\"");
                if (_E.getLabelBackgroundOpacity() != null)
                    styles.append(", labelBackgroundOpacity : " + _E.getLabelBackgroundOpacity() + "");
                if (_E.getLabelBorderColor() != null && !_E.getLabelBorderColor().equals(""))
                    styles.append(", labelBorderColor : \"" + _E.getLabelBorderColor() + "\"");
                if (_E.getLabelBorderWidth() != null)
                    styles.append(", labelBorderWidth : " + _E.getLabelBorderWidth() + "");
            }
            styles.append(", styleOption : \"" + styleOption + "\"");
        }
        styles.append("}");
        return styles.toString();
    }
}
