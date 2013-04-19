package com.ted.xplatform.service;

import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ted.common.dao.jdbc.JdbcTemplateDao;
import com.ted.common.dao.jpa.JpaSupportDao;
import com.ted.common.dao.jpa.JpaTemplateDao;
import com.ted.common.util.DateUtils;
import com.ted.xplatform.pojo.common.NameRule;
import com.ted.xplatform.pojo.common.NameRuleDateTime;
import com.ted.xplatform.pojo.common.NameRuleItem;
import com.ted.xplatform.pojo.common.NameRulePrefix;
import com.ted.xplatform.pojo.common.NameRuleSequence;
import com.ted.xplatform.pojo.common.NameRuleUserDef;

@Transactional
@Service("nameRuleService")
public class NameRuleService {
    private static byte[] LOCK   = new byte[0];

    final Logger          logger = LoggerFactory.getLogger(NameRuleService.class);

    @Inject
    JdbcTemplateDao       jdbcTemplateDao;

    @Inject
    JpaSupportDao         jpaSupportDao;

    @Inject
    JpaTemplateDao        jpaTemplateDao;

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
    public NameRuleItem save(NameRuleItem nameRuleItem) { //如果用户属于一个PageResource
        if (nameRuleItem.getRule() != null && nameRuleItem.getRule().getId() != null) {
            NameRule nameRule = (NameRule) jpaSupportDao.getEntityManager().find(NameRule.class, nameRuleItem.getRule().getId());
            nameRuleItem.setRule(nameRule);
        } else {//没有机构的用户,不设置为空，则抛错。
            nameRuleItem.setRule(null);
        }

        //判断是add还是update
        if (nameRuleItem.isNew()) {//add
            jpaSupportDao.getEntityManager().persist(nameRuleItem);
        } else {//update
            jpaSupportDao.getEntityManager().merge(nameRuleItem);
        }
        return nameRuleItem;
    };

    /**
     * NameRuleDefine删除
     */
    @Transactional
    public void deleteNameRuleItem(Long nameRuleItemId) {
        NameRuleItem nameRuleItem = (NameRuleItem) jpaSupportDao.getEntityManager().find(NameRuleItem.class, nameRuleItemId);
        jpaSupportDao.getEntityManager().remove(nameRuleItem);
    }

    /**
     * NameRuleDefine获得所有，不分页.
     */
    @Transactional(readOnly = true)
    public List<NameRuleItem> getNameRuleItemListByRuleCode(String ruleCode) {
        NameRule rule = getNameRuleByCode(ruleCode);
        if (null != rule) {
            return rule.getRuleItems();
        } else {
            return null;
        }
    };

    @Transactional(readOnly = true)
    public List<NameRuleItem> getNameRuleItemListByRuleId(Long ruleId) {
        NameRule rule = getNameRuleById(ruleId);
        if (null != rule) {
            return rule.getRuleItems();
        } else {
            return null;
        }
    };

    @Transactional(readOnly = true)
    @SuppressWarnings("all")
    public NameRuleItem getNameRuleItemById(Long ruleItemId) {
        if (null == ruleItemId) {
            return null;
        } else {
            return jpaSupportDao.getEntityManager().find(NameRuleItem.class, ruleItemId);
        }
    };

    //=================真正的对外提供的业务方法=================//
    /**
     * 生成流水号
     */
    @Transactional
    public String generate(String ruleCode, String... userDefs) {
        StringBuilder serialNumber = new StringBuilder();
        //查询流水号生成规则
        List<NameRuleItem> ruleDefineList = this.getNameRuleItemListByRuleCode(ruleCode);
        NameRule rule = this.getNameRuleByCode(ruleCode);
        if (org.apache.commons.collections.CollectionUtils.isEmpty(ruleDefineList) || rule == null) {
            throw new RuntimeException("rule not found error: " + ruleCode);
        }

        List<String> userDefList = Arrays.asList(userDefs);
        Iterator<String> userDefIter = userDefList.iterator();

        //依流水号生成规则拼接流水号
        for (NameRuleItem ruleItem : ruleDefineList) {
            if (ruleItem instanceof NameRulePrefix) { //用户前缀
                serialNumber.append(((NameRulePrefix) ruleItem).getPrefix());
            } else if (ruleItem instanceof NameRuleDateTime) { //时间
                NameRuleDateTime ruleDateTime = (NameRuleDateTime) ruleItem;
                LocalDateTime now = new LocalDateTime();
                serialNumber.append(DateUtils.date2Str(now, ruleDateTime.getDateFormat()));
            } else if (ruleItem instanceof NameRuleUserDef) { //用户定义
                if (userDefIter.hasNext()) {
                    String userDef = userDefIter.next();
                    serialNumber.append(userDef);
                }
            } else if (ruleItem instanceof NameRuleSequence) {//sequence
                NameRuleSequence ruleSeq = (NameRuleSequence) ruleItem;
                Integer currentVal = ruleSeq.getCurrentValue();
                Integer step = ruleSeq.getStep();
                Integer newValue = currentVal + step;
                updateCurrentValue(ruleSeq, newValue);

                DecimalFormat decimalFormat = new DecimalFormat(ruleSeq.getSeqFormat()); //such as:000000 固定6位长，前面补0
                serialNumber.append(decimalFormat.format(newValue));
            }
        }
        return serialNumber.toString();
    }

    //更新currentValue for ruleItem, 我觉得Requeires_new没啥用，for有同步锁。
    //@Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
    private void updateCurrentValue(NameRuleSequence ruleSeq, Integer newValue) {
        synchronized (LOCK) {
            ruleSeq.setCurrentValue(newValue);
            this.save(ruleSeq);
        }
    };

}
