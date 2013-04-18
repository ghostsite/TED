package com.ted.xplatform.service;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Maps;
import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.util.CollectionUtils;
import com.ted.common.util.DateUtils;
import com.ted.xplatform.pojo.common.NameRule;
import com.ted.xplatform.pojo.common.NameRuleDefine;
import com.ted.xplatform.pojo.common.NameRuleDefine.GenType;
import com.ted.xplatform.pojo.common.NameRuleGenerate;

@Transactional
@Service("nameRuleService")
public class NameRuleService {
    private final static Map<String, String> MONTHES = Maps.newHashMap();
    private static byte[]                    LOCK    = new byte[0];

    final Logger                             logger  = LoggerFactory.getLogger(NameRuleService.class);

    static {
        MONTHES.put("01", "1");
        MONTHES.put("02", "2");
        MONTHES.put("03", "3");
        MONTHES.put("04", "4");
        MONTHES.put("05", "5");
        MONTHES.put("06", "6");
        MONTHES.put("07", "7");
        MONTHES.put("08", "8");
        MONTHES.put("09", "9");
        MONTHES.put("10", "10");
        MONTHES.put("11", "11");
        MONTHES.put("12", "12");
    }

    @Inject
    JdbcTemplateDao                          jdbcTemplateDao;

    @Inject
    JpaSupportDao                            jpaSupportDao;

    @Inject
    JpaTemplateDao                           jpaTemplateDao;

    public void setJdbcTemplateDao(JdbcTemplateDao jdbcTemplateDao) {
        this.jdbcTemplateDao = jdbcTemplateDao;
    }

    public void setJpaSupportDao(JpaSupportDao jpaSupportDao) {
        this.jpaSupportDao = jpaSupportDao;
    }

    public void setJpaTemplateDao(JpaTemplateDao jpaTemplateDao) {
        this.jpaTemplateDao = jpaTemplateDao;
    }

    //============包括NameRule的CRUD，NameRuleDefine CRUD，and NameRuleGenerate==========//
    /**
     * NameRule 保存，包括新增和修改
     */
    @Transactional
    public NameRule save(NameRule nameRule) {
        //判断是add还是update
        return jpaSupportDao.getEntityManager().merge(nameRule);
    };

    /**
     * NameRule删除
     */
    @Transactional
    public void delete(Long ruleId) {
        NameRule nameRule = (NameRule) jpaSupportDao.getEntityManager().find(NameRule.class, ruleId);
        jpaSupportDao.getEntityManager().remove(nameRule);
    }

    /**
     * NameRule获得所有，不分页.
     */
    @Transactional(readOnly = true)
    public List<NameRule> getNameRuleList() {
        return jpaSupportDao.getAll(NameRule.class);
    };

    @Transactional(readOnly = true)
    public NameRule getNameRuleById(Long ruleId) {
        if (null == ruleId) {
            return null;
        }
        return jpaSupportDao.getEntityManager().find(NameRule.class, ruleId);
    };

    @Transactional(readOnly = true)
    public NameRule getNameRuleByCode(String ruleCode) {
        if (StringUtils.isBlank(ruleCode)) {
            return null;
        }
        return jpaSupportDao.findSingleByProperty(NameRule.class, "code", ruleCode);
    };

    //-----------------------------//
    /**
     * NameRuleDefine 保存，包括新增和修改
     */
    @Transactional
    public NameRuleDefine save(NameRuleDefine nameRuleDefine) { //如果用户属于一个PageResource
        if (nameRuleDefine.getRule() != null && nameRuleDefine.getRule().getId() != null) {
            NameRule nameRule = (NameRule) jpaSupportDao.getEntityManager().find(NameRule.class, nameRuleDefine.getRule().getId());
            nameRuleDefine.setRule(nameRule);
        } else {//没有机构的用户,不设置为空，则抛错。
            nameRuleDefine.setRule(null);
        }

        //判断是add还是update
        if (nameRuleDefine.isNew()) {//add
            jpaSupportDao.getEntityManager().persist(nameRuleDefine);
        } else {//update
            jpaSupportDao.getEntityManager().merge(nameRuleDefine);
        }
        return nameRuleDefine;
    };

    /**
     * NameRuleDefine删除
     */
    @Transactional
    public void deleteNameRuleDefine(Long ruleDefineId) {
        NameRuleDefine nameRuleDef = (NameRuleDefine) jpaSupportDao.getEntityManager().find(NameRuleDefine.class, ruleDefineId);
        jpaSupportDao.getEntityManager().remove(nameRuleDef);
    }

    /**
     * NameRuleDefine获得所有，不分页.
     */
    @Transactional(readOnly = true)
    public List<NameRuleDefine> getNameRuleDefineListByRuleCode(String ruleCode) {
        NameRule rule = getNameRuleByCode(ruleCode);
        if (null != null) {
            return rule.getRuleDefines();
        } else {
            return null;
        }
    };
    
    @Transactional(readOnly = true)
    public List<NameRuleDefine> getNameRuleDefineListByRuleId(Long ruleId) {
        NameRule rule = getNameRuleById(ruleId);
        if (null != rule) {
            return rule.getRuleDefines();
        } else {
            return null;
        }
    };

    //工具方法,在事务内
    @SuppressWarnings("all")
    private NameRuleDefine getNameRuleDefineById(Long ruleDefineId) {
        if (null == ruleDefineId) {
            return null;
        } else {
            return jpaSupportDao.getEntityManager().find(NameRuleDefine.class, ruleDefineId);
        }
    };

    //工具方法,在事务内
    @SuppressWarnings("all")
    private List<NameRuleGenerate> getNameRuleGenerateListByRuleId(Long ruleId) {
        NameRule rule = getNameRuleById(ruleId);
        if (null != null) {
            return rule.getRuleGenerates();
        } else {
            return null;
        }
    };

    //工具方法,在事务内
    @SuppressWarnings("all")
    private List<NameRuleGenerate> getNameRuleGenerateListByRuleId(String ruleCode) {
        NameRule nameRule = this.getNameRuleByCode(ruleCode);
        if (null != nameRule) {
            return nameRule.getRuleGenerates();
        } else {
            return null;
        }
    };

    //工具方法,在事务内
    /**
     *     #{genId}
          , #{genUdf1}
          , #{genUdf2}
          , #{genUdf3}
          , #{genUdf4}
          , #{genUdf5}
          , #{genYear}
          , #{genMonth}
          , #{genDay}
          , #{genSeq}
     */
    @SuppressWarnings("all")
    private void saveNameRuleGenerate(NameRuleGenerate ruleGenerate) {
        jpaSupportDao.getEntityManager().persist(ruleGenerate);
    };

    //工具方法,在事务内
    /**
     *   GEN_YEAR = #{genYear}
         , GEN_MONTH = #{genMonth}
         , GEN_DAY = #{genDay}
         , GEN_SEQ = #{genSeq}
        where userDef1,2,3,4,5
     */
    @SuppressWarnings("all")
    private void updateNameRuleGenerate(String year, String month, String day, Integer sequence, String userDef1, String userDef2, String userDef3, String userDef4, String userDef5) {
        Map<String, Object> params = CollectionUtils.newMap("year", year, "month", month, "day", day, "sequence", sequence, "userDef1", userDef1, "userDef2", userDef2, "userDef3", userDef3, "userDef4", userDef4, "userDef5", userDef5);
        jpaTemplateDao.executeJPQLUpdate("admin-jpql-updateNameRuleGenerate", params);
    };

    @SuppressWarnings("all")
    private void updateNameRuleGenerate(NameRuleGenerate nameRuleGenerate) {
        //Map<String, Object> params = CollectionUtils.newMap("year", year, "month", month, "day", day, "sequence", sequence, "userDef1", userDef1, "userDef2", userDef2, "userDef3", userDef3, "userDef4", userDef4, "userDef5", userDef5);
        try {
            Map params = PropertyUtils.describe(nameRuleGenerate);
            jpaTemplateDao.executeJPQLUpdate("admin-jpql-updateNameRuleGenerate", params);
        } catch (Exception e) {
            e.printStackTrace();
        }
    };

    //工具方法,在事务内
    @SuppressWarnings("all")
    private NameRuleGenerate queryOneNameRuleGenerateByUserDefs(String ruleCode, String userDef1, String userDef2, String userDef3, String userDef4, String userDef5) {
        Map<String, Object> params = CollectionUtils.newMap("ruleCode", ruleCode, "userDef1", userDef1, "userDef2", userDef2, "userDef3", userDef3, "userDef4", userDef4, "userDef5", userDef5);
        List<NameRuleGenerate> genList = jpaTemplateDao.findByJPQLList("admin-jpql-queryNameRuleGenerate", params, NameRuleGenerate.class);
        if (org.apache.commons.collections.CollectionUtils.isNotEmpty(genList)) {
            return genList.get(0);
        } else {
            return null;
        }
    }

    //=================真正的对外提供的业务方法=================//
    /**
     * 生成流水号
     * @param genId 流水号生成规则号
     * @param genUdfs 可变参数，用户定义类型字段值
     * @return 流水号
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
    public String generate(String ruleCode, String userDef1, String userDef2, String userDef3, String userDef4, String userDef5) {
        StringBuilder serialNumber = new StringBuilder();
        //查询流水号生成规则
        //List<Map<String, Object>> nmRuleDfnMaps = tcmNmRuleDao.selectTcmNmRuleDfnList(genId);
        List<NameRuleDefine> ruleDefineList = this.getNameRuleDefineListByRuleCode(ruleCode);
        NameRule rule = this.getNameRuleByCode(ruleCode);
        if (org.apache.commons.collections.CollectionUtils.isEmpty(ruleDefineList) || rule == null) {
            throw new RuntimeException("rule not found error: " + ruleCode);
        }
        //获取数据库当前时间
        DateTime now = new DateTime();
        String strYear = DateUtils.date2Str(now, "yyyy"), strMonth = DateUtils.date2Str(now, "MM"), strDay = DateUtils.date2Str(now, "dd");
        int calCount = 0, seqCount = 0, seqLength = 0, seqInitValue = 0, seqStep = 1;
        //依流水号生成规则拼接流水号
        for (NameRuleDefine ruleDef : ruleDefineList) {
            GenType genType = ruleDef.getGenType();
            switch (genType) {
            case prefix:
                serialNumber.append(ruleDef.getValue());
                break;
            case calendar:
                String defName = (String) ruleDef.getName();//get("genPosNm"); defName
                Integer len = ruleDef.getLength();//.get("genLen");
                if ("year".equalsIgnoreCase(defName)) {
                    if (len < 4) {
                        strYear = strYear.substring(4 - len);
                    }
                    serialNumber.append(strYear);
                } else if ("month".equalsIgnoreCase(defName)) {//defName posNm
                    if (len == 1) {
                        strMonth = MONTHES.get(strMonth);
                    }
                    serialNumber.append(strMonth);
                } else if ("day".equalsIgnoreCase(defName)) {
                    serialNumber.append(strDay);
                } else {
                    throw new RuntimeException("rule position name error: " + defName);
                }
                calCount += 1;
                break;
            case userdefine:
                if (isUserDefAllBlank(userDef1, userDef2, userDef3, userDef4, userDef5)) {
                    throw new RuntimeException("argument quantity error");
                }
                appendNotNull(serialNumber, userDef1, userDef2, userDef3, userDef4, userDef5);
                break;
            case sequence:
                String genVal = ruleDef.getValue();//(String) nmRuleDfnMap.get("genVal");
                if (StringUtils.isBlank(genVal)) {
                    seqInitValue = 0;
                } else {
                    seqInitValue = Integer.parseInt(genVal);
                }
                seqLength = ruleDef.getLength();//.get("genLen");
                seqStep = ruleDef.getStep();
                seqCount += 1;
                break;
            }
        }
        if (calCount > 3) {
            throw new RuntimeException("rule type 'calendar' quantity error: " + calCount);
        }
        if (seqCount != 1) {
            throw new RuntimeException("rule type 'sequence' quantity error: " + seqCount);
        }
        String pattern = "%0" + seqLength + "d";
        synchronized (LOCK) {
            //查找流水号记录
            NameRuleGenerate ruleGenerate = this.queryOneNameRuleGenerateByUserDefs(ruleCode, userDef1, userDef2, userDef3, userDef4, userDef5);//tcmNmRuleDao.selectTcmNmRuleCrt(genId, genUdfs);
            String strSeq = String.format(pattern, (seqInitValue + seqStep));
            if (ruleGenerate == null) {
                //不存在流水号记录，生成并插入流水号记录
                serialNumber.append(strSeq);
                ruleGenerate = new NameRuleGenerate();
                ruleGenerate.setRule(rule);
                ruleGenerate.setUserdef1(userDef1);
                ruleGenerate.setUserdef2(userDef2);
                ruleGenerate.setUserdef3(userDef3);
                ruleGenerate.setUserdef4(userDef4);
                ruleGenerate.setUserdef5(userDef5);
                ruleGenerate.setYear(strYear);
                ruleGenerate.setMonth(strMonth);
                ruleGenerate.setDay(strDay);

                ruleGenerate.setSequence(NumberUtils.createInteger(strSeq));
                this.saveNameRuleGenerate(ruleGenerate);
            } else {
                //存在流水号记录，比较日期字段是否相等
                String ostrYear = ruleGenerate.getYear();//(String) nmRuleGenMap.get("genYear");
                String ostrMonth = ruleGenerate.getMonth();//(String) nmRuleGenMap.get("genMonth");
                String ostrDay = ruleGenerate.getDay();//(String) nmRuleGenMap.get("genDay");
                Integer sequence = (Integer) ruleGenerate.getSequence();//.get("genSeq");
                if (strYear.equals(ostrYear) && strMonth.equals(ostrMonth) && strDay.equals(ostrDay)) {
                    //日期字段相等，序号增加步长后更新序号
                    sequence += seqStep;
                    strSeq = String.format(pattern, sequence);
                    serialNumber.append(strSeq);
                    ruleGenerate.setSequence(NumberUtils.createInteger(strSeq));//.put("genSeq", strSeq);
                    this.updateNameRuleGenerate(ruleGenerate);
                } else {
                    //日期字段不相等，序号重置为默认值，更新日期字段及序号
                    serialNumber.append(strSeq);
                    ruleGenerate.setYear(strYear);
                    ruleGenerate.setMonth(strMonth);
                    //nmRuleGenMap.put("genYear", strYear);
                    //nmRuleGenMap.put("genMonth", strMonth);
                    ruleGenerate.setDay(strDay);
                    //nmRuleGenMap.put("genDay", strDay);
                    ruleGenerate.setSequence(NumberUtils.createInteger(strSeq));
                    //nmRuleGenMap.put("genSeq", strSeq);
                    this.updateNameRuleGenerate(ruleGenerate);
                }
            }
        }
        return serialNumber.toString();
    }

    //辅助方法
    public boolean isUserDefAllBlank(String userDef1, String userDef2, String userDef3, String userDef4, String userDef5) {
        if (StringUtils.isBlank(userDef1) && StringUtils.isBlank(userDef2) && StringUtils.isBlank(userDef3) && StringUtils.isBlank(userDef4) && StringUtils.isBlank(userDef5)) {
            return true;
        } else {
            return false;
        }
    };

    //辅助方法
    public void appendNotNull(StringBuilder sb, String userDef1, String userDef2, String userDef3, String userDef4, String userDef5) {
        if (StringUtils.isNotBlank(userDef1)) {
            sb.append(userDef1);
        }
        if (StringUtils.isNotBlank(userDef2)) {
            sb.append(userDef2);
        }
        if (StringUtils.isNotBlank(userDef3)) {
            sb.append(userDef3);
        }
        if (StringUtils.isNotBlank(userDef4)) {
            sb.append(userDef4);
        }
        if (StringUtils.isNotBlank(userDef5)) {
            sb.append(userDef5);
        }
    }

    //辅助方法
    public String generate(String ruleId, String userDef1, String userDef2, String userDef3, String userDef4) {
        return generate(ruleId, userDef1, userDef2, userDef3, userDef4, null);
    }

    //辅助方法
    public String generate(String ruleId, String userDef1, String userDef2, String userDef3) {
        return generate(ruleId, userDef1, userDef2, userDef3, null);
    }

    //辅助方法
    public String generate(String ruleId, String userDef1, String userDef2) {
        return generate(ruleId, userDef1, userDef2, null);
    }

    //辅助方法
    public String generate(String ruleId, String userDef1) {
        return generate(ruleId, userDef1, null);
    }

    //辅助方法
    public String generate(String ruleId) {
        return generate(ruleId, null);
    }
}
