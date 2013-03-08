package com.ted.xplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ted.xplatform.pojo.common.Operation;

/**
 * Operation Resource ACL = this DAO
 *
 */
@Repository("operationDao")
public interface OperationDao extends JpaRepository<Operation, Long> {
    public Operation getByCode(String code);
    
}
