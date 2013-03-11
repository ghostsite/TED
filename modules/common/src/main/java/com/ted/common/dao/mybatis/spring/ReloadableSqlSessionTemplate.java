package com.ted.common.dao.mybatis.spring;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;

import com.ted.common.dao.mybatis.session.ReloadableSqlSessionFactory;

public class ReloadableSqlSessionTemplate extends SqlSessionTemplate {

    public ReloadableSqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        super(sqlSessionFactory);
    }

    public ReloadableSqlSessionFactory getReloadableSqlSessionFactory() {
        return (ReloadableSqlSessionFactory) this.getSqlSessionFactory();//this must be true
    }
    
    /**
     * 需要在每个有String statement的接口前刷新一下 or Reload一下xml配置文件 
     */
    protected void refreshInternal(){
        getReloadableSqlSessionFactory().getReloadableSqlSessionFactoryBean().refresh();
    }
    
    /**
     * Retrieve a single row mapped from the statement key
     * @param <T> the returned object type
     * @param statement
     * @return Mapped object
     */
    @Override
    //<T> T selectOne(String statement){
    public <T> T selectOne(String statement) {
        refreshInternal();
        return super.selectOne(statement);
    }

    /**
     * Retrieve a single row mapped from the statement key and parameter.
     * @param <T> the returned object type
     * @param statement Unique identifier matching the statement to use.
     * @param parameter A parameter object to pass to the statement.
     * @return Mapped object
     */
    public <T> T selectOne(String statement, Object parameter){
        refreshInternal();
        return super.selectOne(statement, parameter);
    }

    /**
     * Retrieve a list of mapped objects from the statement key and parameter.
     * @param <E> the returned list element type
     * @param statement Unique identifier matching the statement to use.
     * @return List of mapped object
     */
    public <E> List<E> selectList(String statement){
        refreshInternal();
        return super.selectList(statement);
    }

    /**
     * Retrieve a list of mapped objects from the statement key and parameter.
     * @param <E> the returned list element type
     * @param statement Unique identifier matching the statement to use.
     * @param parameter A parameter object to pass to the statement.
     * @return List of mapped object
     */
    public <E> List<E> selectList(String statement, Object parameter){
        refreshInternal();
        return super.selectList(statement, parameter);
    }

    /**
     * Retrieve a list of mapped objects from the statement key and parameter,
     * within the specified row bounds.
     * @param <E> the returned list element type
     * @param statement Unique identifier matching the statement to use.
     * @param parameter A parameter object to pass to the statement.
     * @param rowBounds  Bounds to limit object retrieval
     * @return List of mapped object
     */
    public <E> List<E> selectList(String statement, Object parameter, RowBounds rowBounds){
        refreshInternal();
        return super.selectList(statement, parameter, rowBounds);
    }

    /**
     * The selectMap is a special case in that it is designed to convert a list
     * of results into a Map based on one of the properties in the resulting
     * objects.
     * Eg. Return a of Map[Integer,Author] for selectMap("selectAuthors","id")
     * @param <K> the returned Map keys type
     * @param <V> the returned Map values type
     * @param statement Unique identifier matching the statement to use.
     * @param mapKey The property to use as key for each value in the list.
     * @return Map containing key pair data.
     */
    public <K, V> Map<K, V> selectMap(String statement, String mapKey){
        refreshInternal();
        return super.selectMap(statement, mapKey);
    }

    /**
     * The selectMap is a special case in that it is designed to convert a list
     * of results into a Map based on one of the properties in the resulting
     * objects.
     * @param <K> the returned Map keys type
     * @param <V> the returned Map values type
     * @param statement Unique identifier matching the statement to use.
     * @param parameter A parameter object to pass to the statement.
     * @param mapKey The property to use as key for each value in the list.
     * @return Map containing key pair data.
     */
    public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey){
        refreshInternal();
        return super.selectMap(statement, parameter, mapKey);
    }

    /**
     * The selectMap is a special case in that it is designed to convert a list
     * of results into a Map based on one of the properties in the resulting
     * objects.
     * @param <K> the returned Map keys type
     * @param <V> the returned Map values type
     * @param statement Unique identifier matching the statement to use.
     * @param parameter A parameter object to pass to the statement.
     * @param mapKey The property to use as key for each value in the list.
     * @param rowBounds  Bounds to limit object retrieval
     * @return Map containing key pair data.
     */
    public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey, RowBounds rowBounds){
        refreshInternal();
        return super.selectMap(statement, parameter, mapKey, rowBounds);
    }

    /**
     * Retrieve a single row mapped from the statement key and parameter
     * using a {@code ResultHandler}.
     * @param statement Unique identifier matching the statement to use.
     * @param parameter A parameter object to pass to the statement.
     * @param handler ResultHandler that will handle each retrieved row
     * @return Mapped object
     */
    public void select(String statement, Object parameter, ResultHandler handler){
        refreshInternal();
        super.select(statement, parameter, handler);
    }

    /**
     * Retrieve a single row mapped from the statement
     * using a {@code ResultHandler}.
     * @param statement Unique identifier matching the statement to use.
     * @param handler ResultHandler that will handle each retrieved row
     * @return Mapped object
     */
    public void select(String statement, ResultHandler handler){
        refreshInternal();
        super.select(statement, handler);
    }

    /**
     * Retrieve a single row mapped from the statement key and parameter
     * using a {@code ResultHandler} and {@code RowBounds}
     * @param statement Unique identifier matching the statement to use.
     * @param rowBounds RowBound instance to limit the query results
     * @param handler ResultHandler that will handle each retrieved row
     * @return Mapped object
     */
    public void select(String statement, Object parameter, RowBounds rowBounds, ResultHandler handler){
        refreshInternal();
         super.select(statement, parameter, rowBounds, handler);
    }

    /**
     * Execute an insert statement.
     * @param statement Unique identifier matching the statement to execute.
     * @return int The number of rows affected by the insert.
     */
    public int insert(String statement){
        refreshInternal();
        return super.insert(statement);
    }

    /**
     * Execute an insert statement with the given parameter object. Any generated
     * autoincrement values or selectKey entries will modify the given parameter
     * object properties. Only the number of rows affected will be returned.
     * @param statement Unique identifier matching the statement to execute.
     * @param parameter A parameter object to pass to the statement.
     * @return int The number of rows affected by the insert.
     */
    public int insert(String statement, Object parameter){
        refreshInternal();
        return super.insert(statement, parameter);
    }

    /**
     * Execute an update statement. The number of rows affected will be returned.
     * @param statement Unique identifier matching the statement to execute.
     * @return int The number of rows affected by the update.
     */
    public int update(String statement){
        refreshInternal();
        return super.insert(statement);
    }

    /**
     * Execute an update statement. The number of rows affected will be returned.
     * @param statement Unique identifier matching the statement to execute.
     * @param parameter A parameter object to pass to the statement.
     * @return int The number of rows affected by the update.
     */
    public int update(String statement, Object parameter){
        refreshInternal();
        return super.update(statement, parameter);
    }

    /**
     * Execute a delete statement. The number of rows affected will be returned.
     * @param statement Unique identifier matching the statement to execute.
     * @return int The number of rows affected by the delete.
     */
    public int delete(String statement){
        refreshInternal();
        return super.delete(statement);
    }

    /**
     * Execute a delete statement. The number of rows affected will be returned.
     * @param statement Unique identifier matching the statement to execute.
     * @param parameter A parameter object to pass to the statement.
     * @return int The number of rows affected by the delete.
     */
    public int delete(String statement, Object parameter){
        refreshInternal();
        return super.delete(statement, parameter);
    }
}
