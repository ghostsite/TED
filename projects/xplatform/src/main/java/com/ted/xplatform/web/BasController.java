package com.ted.xplatform.web;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.context.MessageSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ted.common.Constants;
import com.ted.common.util.SpringUtils;
import com.ted.xplatform.vo.grid.Field;
import com.ted.xplatform.vo.grid.GridData;

/**
 * @create at 2012.12.05
 * 由于是查询，故没有service，只查询。
 */
@Controller
@RequestMapping(value = "/bas/*")
@SuppressWarnings("all")
public class BasController {
	@Inject
	private NamedParameterJdbcTemplate namedJdbcTemplate;

	@Inject
	MessageSource messageSource;

	public void setMessageSource(MessageSource messageSource) {
		this.messageSource = messageSource;
	}

	public void setNamedJdbcTemplate(NamedParameterJdbcTemplate namedJdbcTemplate) {
		this.namedJdbcTemplate = namedJdbcTemplate;
	}

	@RequestMapping(value = "/sqlQuery")
	public @ResponseBody
	Map sqlQuery(@RequestParam String sql) {
		SqlRowSet sqlRowSet = namedJdbcTemplate.queryForRowSet(sql,  new HashMap());
        List<Map<String, Object>> list = SpringUtils.convert(sqlRowSet);
        GridData gridData = new GridData();
        gridData.setData(list);
        SqlRowSetMetaData metaData = sqlRowSet.getMetaData();
        String[] columnNames = metaData.getColumnNames();
        for(String columnName: columnNames){
        	Field field = new Field();
        	field.setType("string");
        	field.setName(columnName); //应该是大写 for Oracle
        	gridData.getFields().add(field);
        }
        Map map = new HashMap();
        map.put("success",true);
        map.put("columns", gridData.getFields());//适配前端js
        map.put("rows", gridData.getData());
        return map;
	};

	@RequestMapping(value = "/viewCodeList")
	public @ResponseBody
	String viewCodeList(@RequestParam Collection<Long> attachIds) {
		return Constants.SUCCESS_JSON;
	};
}
