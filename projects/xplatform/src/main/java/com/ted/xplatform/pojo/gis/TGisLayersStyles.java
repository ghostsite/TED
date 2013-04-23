package com.ted.xplatform.pojo.gis;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Proxy;

/**
 * 图层样式
 */
//@Entity
//@Table(name = "T_GIS_LAYERS_STYLES")  zhang 暂时先屏蔽数据库
//@Proxy(lazy = false)
public class TGisLayersStyles implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private String styleId;
	private String layerId;
	private String styleGroup;
	private String fill;
	private String fillColor;
	private Double fillOpacity;
	private String stroke;
	private String strokeColor;
	private Double strokeOpacity;
	private Long strokeWidth;
	private String strokeLinecap;
	private String strokeDashstyle;
	private String graphic;
	private String graphicName;
	private Long pointRadius;
	private String externalGraphic;
	private Long graphicWidth;
	private Long graphicHeight;
	private Double graphicOpacity;
	private Long graphicXOffset;
	private Long graphicYOffset;
	private Long rotation;
	private Long graphicZIndex;
	private String graphicTitle;
	private String backgroundGraphic;
	private Long backgroundGraphicZIndex;
	private Long backgroundWidth;
	private Long backgroundHeight;
	private Long backgroundXOffset;
	private Long backgroundYOffset;
	private String labelText;
	private String labelAlign;
	private Long labelXOffset;
	private Long labelYOffset;
	private String labelSelect;
	private String fontColor;
	private Double fontOpacity;
	private String fontFamily;
	private Long fontSize;
	private String fontWeight;
	private String labelOutlineColor;
	private Long labelOutlineWidth;
	private Long labelPadding;
	private String labelBackgroundColor;
	private Double labelBackgroundOpacity;
	private String labelBorderColor;
	private Double labelBorderWidth;
	private String display;
	private String createDate;
	private String createUser;
	private String updateDate;
	private String updateUser;
	private String remark;

	// Constructors

	/** default constructor */
	public TGisLayersStyles() {
	}

	/** minimal constructor */
	public TGisLayersStyles(String styleId, String layerId, String styleGroup) {
		this.styleId = styleId;
		this.layerId = layerId;
		this.styleGroup = styleGroup;
	}

	/** full constructor */
	public TGisLayersStyles(String styleId, String layerId, String styleGroup,
			String fill, String fillColor, Double fillOpacity, String stroke,
			String strokeColor, Double strokeOpacity, Long strokeWidth,
			String strokeLinecap, String strokeDashstyle, String graphic,
			String graphicName, Long pointRadius, String externalGraphic,
			Long graphicWidth, Long graphicHeight, Double graphicOpacity,
			Long graphicXOffset, Long graphicYOffset, Long rotation,
			Long graphicZIndex, String graphicTitle, String backgroundGraphic,
			Long backgroundGraphicZIndex, Long backgroundWidth,
			Long backgroundHeight, Long backgroundXOffset,
			Long backgroundYOffset, String labelText, String labelAlign,
			Long labelXOffset, Long labelYOffset, String labelSelect,
			String fontColor, Double fontOpacity, String fontFamily,
			Long fontSize, String fontWeight, String labelOutlineColor,
			Long labelOutlineWidth, Long labelPadding,
			String labelBackgroundColor, Double labelBackgroundOpacity,
			String labelBorderColor, Double labelBorderWidth, String display,
			String createDate, String createUser, String updateDate,
			String updateUser, String remark) {
		this.styleId = styleId;
		this.layerId = layerId;
		this.styleGroup = styleGroup;
		this.fill = fill;
		this.fillColor = fillColor;
		this.fillOpacity = fillOpacity;
		this.stroke = stroke;
		this.strokeColor = strokeColor;
		this.strokeOpacity = strokeOpacity;
		this.strokeWidth = strokeWidth;
		this.strokeLinecap = strokeLinecap;
		this.strokeDashstyle = strokeDashstyle;
		this.graphic = graphic;
		this.graphicName = graphicName;
		this.pointRadius = pointRadius;
		this.externalGraphic = externalGraphic;
		this.graphicWidth = graphicWidth;
		this.graphicHeight = graphicHeight;
		this.graphicOpacity = graphicOpacity;
		this.graphicXOffset = graphicXOffset;
		this.graphicYOffset = graphicYOffset;
		this.rotation = rotation;
		this.graphicZIndex = graphicZIndex;
		this.graphicTitle = graphicTitle;
		this.backgroundGraphic = backgroundGraphic;
		this.backgroundGraphicZIndex = backgroundGraphicZIndex;
		this.backgroundWidth = backgroundWidth;
		this.backgroundHeight = backgroundHeight;
		this.backgroundXOffset = backgroundXOffset;
		this.backgroundYOffset = backgroundYOffset;
		this.labelText = labelText;
		this.labelAlign = labelAlign;
		this.labelXOffset = labelXOffset;
		this.labelYOffset = labelYOffset;
		this.labelSelect = labelSelect;
		this.fontColor = fontColor;
		this.fontOpacity = fontOpacity;
		this.fontFamily = fontFamily;
		this.fontSize = fontSize;
		this.fontWeight = fontWeight;
		this.labelOutlineColor = labelOutlineColor;
		this.labelOutlineWidth = labelOutlineWidth;
		this.labelPadding = labelPadding;
		this.labelBackgroundColor = labelBackgroundColor;
		this.labelBackgroundOpacity = labelBackgroundOpacity;
		this.labelBorderColor = labelBorderColor;
		this.labelBorderWidth = labelBorderWidth;
		this.display = display;
		this.createDate = createDate;
		this.createUser = createUser;
		this.updateDate = updateDate;
		this.updateUser = updateUser;
		this.remark = remark;
	}

	// Property accessors
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid")
	@Column(name = "STYLE_ID", unique = true, nullable = false, length = 32)
	public String getStyleId() {
		return this.styleId;
	}

	public void setStyleId(String styleId) {
		this.styleId = styleId;
	}

	@Column(name = "LAYER_ID", nullable = false, length = 32)
	public String getLayerId() {
		return this.layerId;
	}

	public void setLayerId(String layerId) {
		this.layerId = layerId;
	}

	@Column(name = "STYLE_GROUP", nullable = false, length = 32)
	public String getStyleGroup() {
		return this.styleGroup;
	}

	public void setStyleGroup(String styleGroup) {
		this.styleGroup = styleGroup;
	}

	@Column(name = "FILL", length = 1)
	public String getFill() {
		return this.fill;
	}

	public void setFill(String fill) {
		this.fill = fill;
	}

	@Column(name = "FILL_COLOR", length = 8)
	public String getFillColor() {
		return this.fillColor;
	}

	public void setFillColor(String fillColor) {
		this.fillColor = fillColor;
	}

	@Column(name = "FILL_OPACITY", precision = 2, scale = 1)
	public Double getFillOpacity() {
		return this.fillOpacity;
	}

	public void setFillOpacity(Double fillOpacity) {
		this.fillOpacity = fillOpacity;
	}

	@Column(name = "STROKE", length = 1)
	public String getStroke() {
		return this.stroke;
	}

	public void setStroke(String stroke) {
		this.stroke = stroke;
	}

	@Column(name = "STROKE_COLOR", length = 8)
	public String getStrokeColor() {
		return this.strokeColor;
	}

	public void setStrokeColor(String strokeColor) {
		this.strokeColor = strokeColor;
	}

	@Column(name = "STROKE_OPACITY", precision = 2, scale = 1)
	public Double getStrokeOpacity() {
		return this.strokeOpacity;
	}

	public void setStrokeOpacity(Double strokeOpacity) {
		this.strokeOpacity = strokeOpacity;
	}

	@Column(name = "STROKE_WIDTH", precision = 2, scale = 0)
	public Long getStrokeWidth() {
		return this.strokeWidth;
	}

	public void setStrokeWidth(Long strokeWidth) {
		this.strokeWidth = strokeWidth;
	}

	@Column(name = "STROKE_LINECAP", length = 16)
	public String getStrokeLinecap() {
		return this.strokeLinecap;
	}

	public void setStrokeLinecap(String strokeLinecap) {
		this.strokeLinecap = strokeLinecap;
	}

	@Column(name = "STROKE_DASHSTYLE", length = 32)
	public String getStrokeDashstyle() {
		return this.strokeDashstyle;
	}

	public void setStrokeDashstyle(String strokeDashstyle) {
		this.strokeDashstyle = strokeDashstyle;
	}

	@Column(name = "GRAPHIC", length = 1)
	public String getGraphic() {
		return this.graphic;
	}

	public void setGraphic(String graphic) {
		this.graphic = graphic;
	}

	@Column(name = "GRAPHIC_NAME", length = 32)
	public String getGraphicName() {
		return this.graphicName;
	}

	public void setGraphicName(String graphicName) {
		this.graphicName = graphicName;
	}

	@Column(name = "POINT_RADIUS", precision = 10, scale = 0)
	public Long getPointRadius() {
		return this.pointRadius;
	}

	public void setPointRadius(Long pointRadius) {
		this.pointRadius = pointRadius;
	}

	@Column(name = "EXTERNAL_GRAPHIC", length = 256)
	public String getExternalGraphic() {
		return this.externalGraphic;
	}

	public void setExternalGraphic(String externalGraphic) {
		this.externalGraphic = externalGraphic;
	}

	@Column(name = "GRAPHIC_WIDTH", precision = 10, scale = 0)
	public Long getGraphicWidth() {
		return this.graphicWidth;
	}

	public void setGraphicWidth(Long graphicWidth) {
		this.graphicWidth = graphicWidth;
	}

	@Column(name = "GRAPHIC_HEIGHT", precision = 10, scale = 0)
	public Long getGraphicHeight() {
		return this.graphicHeight;
	}

	public void setGraphicHeight(Long graphicHeight) {
		this.graphicHeight = graphicHeight;
	}

	@Column(name = "GRAPHIC_OPACITY", precision = 2, scale = 1)
	public Double getGraphicOpacity() {
		return this.graphicOpacity;
	}

	public void setGraphicOpacity(Double graphicOpacity) {
		this.graphicOpacity = graphicOpacity;
	}

	@Column(name = "GRAPHIC_X_OFFSET", precision = 10, scale = 0)
	public Long getGraphicXOffset() {
		return this.graphicXOffset;
	}

	public void setGraphicXOffset(Long graphicXOffset) {
		this.graphicXOffset = graphicXOffset;
	}

	@Column(name = "GRAPHIC_Y_OFFSET", precision = 10, scale = 0)
	public Long getGraphicYOffset() {
		return this.graphicYOffset;
	}

	public void setGraphicYOffset(Long graphicYOffset) {
		this.graphicYOffset = graphicYOffset;
	}

	@Column(name = "ROTATION", precision = 10, scale = 0)
	public Long getRotation() {
		return this.rotation;
	}

	public void setRotation(Long rotation) {
		this.rotation = rotation;
	}

	@Column(name = "GRAPHIC_Z_INDEX", precision = 10, scale = 0)
	public Long getGraphicZIndex() {
		return this.graphicZIndex;
	}

	public void setGraphicZIndex(Long graphicZIndex) {
		this.graphicZIndex = graphicZIndex;
	}

	@Column(name = "GRAPHIC_TITLE", length = 256)
	public String getGraphicTitle() {
		return this.graphicTitle;
	}

	public void setGraphicTitle(String graphicTitle) {
		this.graphicTitle = graphicTitle;
	}

	@Column(name = "BACKGROUND_GRAPHIC", length = 256)
	public String getBackgroundGraphic() {
		return this.backgroundGraphic;
	}

	public void setBackgroundGraphic(String backgroundGraphic) {
		this.backgroundGraphic = backgroundGraphic;
	}

	@Column(name = "BACKGROUND_GRAPHIC_Z_INDEX", precision = 10, scale = 0)
	public Long getBackgroundGraphicZIndex() {
		return this.backgroundGraphicZIndex;
	}

	public void setBackgroundGraphicZIndex(Long backgroundGraphicZIndex) {
		this.backgroundGraphicZIndex = backgroundGraphicZIndex;
	}

	@Column(name = "BACKGROUND_WIDTH", precision = 10, scale = 0)
	public Long getBackgroundWidth() {
		return this.backgroundWidth;
	}

	public void setBackgroundWidth(Long backgroundWidth) {
		this.backgroundWidth = backgroundWidth;
	}

	@Column(name = "BACKGROUND_HEIGHT", precision = 10, scale = 0)
	public Long getBackgroundHeight() {
		return this.backgroundHeight;
	}

	public void setBackgroundHeight(Long backgroundHeight) {
		this.backgroundHeight = backgroundHeight;
	}

	@Column(name = "BACKGROUND_X_OFFSET", precision = 10, scale = 0)
	public Long getBackgroundXOffset() {
		return this.backgroundXOffset;
	}

	public void setBackgroundXOffset(Long backgroundXOffset) {
		this.backgroundXOffset = backgroundXOffset;
	}

	@Column(name = "BACKGROUND_Y_OFFSET", precision = 10, scale = 0)
	public Long getBackgroundYOffset() {
		return this.backgroundYOffset;
	}

	public void setBackgroundYOffset(Long backgroundYOffset) {
		this.backgroundYOffset = backgroundYOffset;
	}

	@Column(name = "LABEL_TEXT", length = 128)
	public String getLabelText() {
		return this.labelText;
	}

	public void setLabelText(String labelText) {
		this.labelText = labelText;
	}

	@Column(name = "LABEL_ALIGN", length = 8)
	public String getLabelAlign() {
		return this.labelAlign;
	}

	public void setLabelAlign(String labelAlign) {
		this.labelAlign = labelAlign;
	}

	@Column(name = "LABEL_X_OFFSET", precision = 10, scale = 0)
	public Long getLabelXOffset() {
		return this.labelXOffset;
	}

	public void setLabelXOffset(Long labelXOffset) {
		this.labelXOffset = labelXOffset;
	}

	@Column(name = "LABEL_Y_OFFSET", precision = 10, scale = 0)
	public Long getLabelYOffset() {
		return this.labelYOffset;
	}

	public void setLabelYOffset(Long labelYOffset) {
		this.labelYOffset = labelYOffset;
	}

	@Column(name = "LABEL_SELECT", length = 1)
	public String getLabelSelect() {
		return this.labelSelect;
	}

	public void setLabelSelect(String labelSelect) {
		this.labelSelect = labelSelect;
	}

	@Column(name = "FONT_COLOR", length = 8)
	public String getFontColor() {
		return this.fontColor;
	}

	public void setFontColor(String fontColor) {
		this.fontColor = fontColor;
	}

	@Column(name = "FONT_OPACITY", precision = 2, scale = 1)
	public Double getFontOpacity() {
		return this.fontOpacity;
	}

	public void setFontOpacity(Double fontOpacity) {
		this.fontOpacity = fontOpacity;
	}

	@Column(name = "FONT_FAMILY", length = 32)
	public String getFontFamily() {
		return this.fontFamily;
	}

	public void setFontFamily(String fontFamily) {
		this.fontFamily = fontFamily;
	}

	@Column(name = "FONT_SIZE", precision = 10, scale = 0)
	public Long getFontSize() {
		return this.fontSize;
	}

	public void setFontSize(Long fontSize) {
		this.fontSize = fontSize;
	}

	@Column(name = "FONT_WEIGHT", length = 32)
	public String getFontWeight() {
		return this.fontWeight;
	}

	public void setFontWeight(String fontWeight) {
		this.fontWeight = fontWeight;
	}

	@Column(name = "LABEL_OUTLINE_COLOR", length = 8)
	public String getLabelOutlineColor() {
		return this.labelOutlineColor;
	}

	public void setLabelOutlineColor(String labelOutlineColor) {
		this.labelOutlineColor = labelOutlineColor;
	}

	@Column(name = "LABEL_OUTLINE_WIDTH", precision = 10, scale = 0)
	public Long getLabelOutlineWidth() {
		return this.labelOutlineWidth;
	}

	public void setLabelOutlineWidth(Long labelOutlineWidth) {
		this.labelOutlineWidth = labelOutlineWidth;
	}

	@Column(name = "LABEL_PADDING", precision = 10, scale = 0)
	public Long getLabelPadding() {
		return this.labelPadding;
	}

	public void setLabelPadding(Long labelPadding) {
		this.labelPadding = labelPadding;
	}

	@Column(name = "LABEL_BACKGROUND_COLOR", length = 8)
	public String getLabelBackgroundColor() {
		return this.labelBackgroundColor;
	}

	public void setLabelBackgroundColor(String labelBackgroundColor) {
		this.labelBackgroundColor = labelBackgroundColor;
	}

	@Column(name = "LABEL_BACKGROUND_OPACITY", precision = 2, scale = 1)
	public Double getLabelBackgroundOpacity() {
		return this.labelBackgroundOpacity;
	}

	public void setLabelBackgroundOpacity(Double labelBackgroundOpacity) {
		this.labelBackgroundOpacity = labelBackgroundOpacity;
	}

	@Column(name = "LABEL_BORDER_COLOR", length = 8)
	public String getLabelBorderColor() {
		return this.labelBorderColor;
	}

	public void setLabelBorderColor(String labelBorderColor) {
		this.labelBorderColor = labelBorderColor;
	}

	@Column(name = "LABEL_BORDER_WIDTH", precision = 2, scale = 1)
	public Double getLabelBorderWidth() {
		return this.labelBorderWidth;
	}

	public void setLabelBorderWidth(Double labelBorderWidth) {
		this.labelBorderWidth = labelBorderWidth;
	}

	@Column(name = "DISPLAY", length = 32)
	public String getDisplay() {
		return this.display;
	}

	public void setDisplay(String display) {
		this.display = display;
	}

	@Column(name = "CREATE_DATE", length = 19)
	public String getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	@Column(name = "CREATE_USER", length = 32)
	public String getCreateUser() {
		return this.createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	@Column(name = "UPDATE_DATE", length = 19)
	public String getUpdateDate() {
		return this.updateDate;
	}

	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}

	@Column(name = "UPDATE_USER", length = 32)
	public String getUpdateUser() {
		return this.updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	@Column(name = "REMARK", length = 1000)
	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}