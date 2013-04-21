/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50096
Source Host           : localhost:3306
Source Database       : tedxplatform

Target Server Type    : MYSQL
Target Server Version : 50096
File Encoding         : 65001

Date: 2013-04-21 21:04:20
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `acl`
-- ----------------------------
DROP TABLE IF EXISTS `acl`;
CREATE TABLE `acl` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`version_lock`  bigint(20) NULL DEFAULT NULL ,
`created_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`created_date`  datetime NULL DEFAULT NULL ,
`last_modified_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`last_modified_date`  datetime NULL DEFAULT NULL ,
`acl_operationid`  bigint(20) NULL DEFAULT NULL ,
`acl_resourceid`  bigint(20) NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
FOREIGN KEY (`acl_operationid`) REFERENCES `operation` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
FOREIGN KEY (`acl_resourceid`) REFERENCES `resource` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
INDEX `FKFC6A2FAEC51B` USING BTREE (`acl_operationid`),
INDEX `FKFC6A5FBFD885` USING BTREE (`acl_resourceid`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=149 */

;

-- ----------------------------
-- Records of acl
-- ----------------------------
BEGIN;
INSERT INTO `acl` VALUES ('1', '0', null, null, null, null, '1', '1'), ('2', '0', null, null, null, null, '1', '2'), ('3', '0', null, null, null, null, '1', '3'), ('4', '0', null, null, null, null, '1', '4'), ('5', '0', null, null, null, null, '1', '5'), ('6', '0', null, null, null, null, '1', '6'), ('7', '0', null, null, null, null, '1', '7'), ('8', '0', null, null, null, null, '1', '8'), ('33', '0', null, null, null, null, '2', '9'), ('34', '0', null, null, null, null, '1', '9'), ('40', '0', null, null, null, null, '4', '8'), ('43', '0', null, null, null, null, '3', '7'), ('81', null, null, null, null, null, '1', '52'), ('82', null, null, null, null, null, '1', '10'), ('83', null, null, null, null, null, '1', '53'), ('84', null, null, null, null, null, '1', '54'), ('85', null, null, null, null, null, '1', '55'), ('86', null, null, null, null, null, '1', '56'), ('88', null, null, null, null, null, '1', '69'), ('89', null, null, null, null, null, '1', '66'), ('90', null, null, null, null, null, '1', '70'), ('92', null, null, null, null, null, '1', '78'), ('98', null, null, null, null, null, '1', '83'), ('99', null, null, null, null, null, '2', '85'), ('100', null, null, null, null, null, '1', '85'), ('101', null, null, null, null, null, '1', '86'), ('102', null, null, null, null, null, '1', '87'), ('106', null, null, null, null, null, '1', '82'), ('107', null, null, null, null, null, '1', '84'), ('108', null, null, null, null, null, '2', '84'), ('115', null, null, null, null, null, '1', '91'), ('116', null, null, null, null, null, '6', '92'), ('117', null, null, null, null, null, '1', '93'), ('118', null, null, null, null, null, '6', '94'), ('124', null, null, null, null, null, '8', '92'), ('125', null, null, null, null, null, '8', '94'), ('126', null, null, null, null, null, '1', '96'), ('127', null, null, null, null, null, '1', '97'), ('137', null, null, null, null, null, '7', '100'), ('138', null, null, null, null, null, '4', '100'), ('139', null, null, null, null, null, '1', '100'), ('140', null, null, null, null, null, '7', '101'), ('141', null, null, null, null, null, '4', '101'), ('142', null, null, null, null, null, '1', '101'), ('143', null, null, null, null, null, '1', '102'), ('145', null, null, null, null, null, '9', '104'), ('146', null, null, null, null, null, '1', '105'), ('148', null, null, null, null, null, '1', '106');
COMMIT;

-- ----------------------------
-- Table structure for `attachment`
-- ----------------------------
DROP TABLE IF EXISTS `attachment`;
CREATE TABLE `attachment` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`type_code`  varchar(31) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`foreign_id`  bigint(20) NULL DEFAULT NULL ,
`created_date`  datetime NULL DEFAULT NULL ,
`created_by`  varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`last_modified_date`  datetime NULL DEFAULT NULL ,
`last_modified_by`  varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`deleted`  tinyint(4) NULL DEFAULT NULL ,
`file_path`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`origin_name`  varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`file_name`  varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`file_size`  bigint(20) NULL DEFAULT NULL ,
`file_type`  varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=31 */

;

-- ----------------------------
-- Records of attachment
-- ----------------------------
BEGIN;
INSERT INTO `attachment` VALUES ('1', 'defaults', null, '2013-03-24 20:01:23', '1', '2013-03-24 20:01:23', '1', '0', '201303', 'custom.jpg', 'efd2cc94-a6e1-45a7-94b4-2ba0146e7e1e.jpg', '92336', '.jpg'), ('2', 'defaults', null, '2013-03-24 20:02:45', '1', '2013-03-24 20:02:45', '1', '0', '201303', 'd4c2e4a3297fe25a71d030b67eb83bfc.012.jpg', '26bb7ee6-56e3-4d84-91d4-b749daf183b0.jpg', '36330', '.jpg'), ('3', 'defaults', null, '2013-03-24 20:02:54', '1', '2013-03-24 20:02:54', '1', '0', '201303', 'FSKK.jpg', 'e031b01b-fbfe-45c8-b8ee-f9e683d25bae.jpg', '44688', '.jpg'), ('4', 'defaults', null, '2013-03-24 20:03:10', '1', '2013-03-24 20:03:10', '1', '0', '201303', '14I7Yq.jpg', '6c508ef7-4e93-479d-b71c-87e3c4856baa.jpg', '74064', '.jpg'), ('5', 'defaults', null, '2013-03-25 14:04:26', '1', '2013-03-25 14:04:26', '1', '0', '201303', '26165548_46860.jpg', '780a6e55-0cc5-4acc-a83d-b0e61f2be21a.jpg', '150349', '.jpg'), ('6', 'defaults', null, '2013-03-25 14:08:56', '1', '2013-03-25 14:08:56', '1', '0', '201303', '11n7KH.jpg', 'bb9c3866-a3ff-4bd0-863d-80d2aadf0f64.jpg', '75682', '.jpg'), ('7', 'defaults', null, '2013-03-25 14:14:42', '1', '2013-03-25 14:14:42', '1', '0', '201303', '11n7KH.jpg', 'fc17b2fb-6d9f-4c24-a232-b1fdab159397.jpg', '75682', '.jpg'), ('8', 'defaults', null, '2013-03-25 14:15:44', '1', '2013-03-25 14:15:44', '1', '0', '201303', '14I7Yq.jpg', '63ad9058-69b4-4b1d-851e-912db9374e53.jpg', '74064', '.jpg'), ('9', 'defaults', null, '2013-03-25 14:31:05', '1', '2013-03-25 14:31:05', '1', '0', '201303', 'ai.jpg', '3e3746eb-5b99-4f46-b1a9-0d18f5d3a4e7.jpg', '55504', '.jpg'), ('10', 'defaults', null, '2013-03-25 14:32:33', '1', '2013-03-25 14:32:33', '1', '0', '201303', '11n7KH.jpg', '91b1a13f-da42-4162-8b41-3e29f1ebb832.jpg', '75682', '.jpg'), ('11', 'defaults', null, '2013-03-25 14:34:08', '1', '2013-03-25 14:34:08', '1', '0', '201303', '11n7KH.jpg', '2a4e28d8-fe43-4b6a-91c4-c3556e752b1e.jpg', '75682', '.jpg'), ('12', 'defaults', null, '2013-03-25 14:37:06', '1', '2013-03-25 14:37:06', '1', '0', '201303', '11n7KH.jpg', '6df8af57-0124-4a4f-a27d-9cde13071eef.jpg', '75682', '.jpg'), ('13', 'defaults', null, '2013-03-25 15:02:48', '1', '2013-03-25 15:02:48', '1', '0', '201303', '11n7KH.jpg', 'dceecfe4-1a38-4436-9a48-032ec901d5fe.jpg', '75682', '.jpg'), ('14', 'defaults', null, '2013-03-25 15:02:50', '1', '2013-03-25 15:02:50', '1', '0', '201303', '14I7Yq.jpg', 'ef6ec30a-d649-4468-a98e-7e30b1395c8b.jpg', '74064', '.jpg'), ('15', 'defaults', null, '2013-03-25 15:02:52', '1', '2013-03-25 15:02:52', '1', '0', '201303', '26165548_46860.jpg', '59815fab-4ee1-42ac-9afd-32b39f839be2.jpg', '150349', '.jpg'), ('16', 'defaults', null, '2013-03-25 15:02:54', '1', '2013-03-25 15:02:54', '1', '0', '201303', 'd4c2e4a3297fe25a71d030b67eb83bfc.012.jpg', '17117843-2263-46a3-a7cf-e2a878758066.jpg', '36330', '.jpg'), ('17', 'defaults', null, '2013-03-25 15:02:56', '1', '2013-03-25 15:02:56', '1', '0', '201303', '19300001312922131184304412661.jpg', 'e143d46e-da94-4bae-9040-128e51ba1ab2.jpg', '75837', '.jpg'), ('18', 'defaults', null, '2013-03-25 15:02:58', '1', '2013-03-25 15:02:58', '1', '0', '201303', '19300001312922131184304412661.jpg', '75136c97-8e4b-4ad2-be96-8a5b3ece4269.jpg', '75837', '.jpg'), ('19', 'defaults', null, '2013-03-25 15:03:01', '1', '2013-03-25 15:03:01', '1', '0', '201303', '未命名3.jpg', '31901bd7-6705-45dc-a891-9a211e0514d7.jpg', '263585', '.jpg'), ('20', 'defaults', null, '2013-04-05 20:59:14', '1', '2013-04-05 20:59:14', '1', '0', '201304', '未命名3.jpg', 'd2b8a9ad-3383-4a42-83cf-48e5d40639d4.jpg', '263585', '.jpg'), ('21', 'defaults', null, '2013-04-05 20:59:52', '1', '2013-04-05 20:59:52', '1', '0', '201304', '未命名1.jpg', '01ae7877-cb26-4f3e-95f3-3aea448ea66d.jpg', '177626', '.jpg'), ('22', 'defaults', null, '2013-04-05 21:18:49', '1', '2013-04-05 21:18:49', '1', '0', '201304', 'FSKK.jpg', 'cccea954-4b1b-46f8-ae44-f215aa28952b.jpg', '44688', '.jpg'), ('23', 'defaults', null, '2013-04-14 22:31:47', '1', '2013-04-14 22:31:47', '1', '0', '201304', 'FSKK.jpg', 'c12ab7f1-1488-4bb7-bb8b-f08d314629e1.jpg', '44688', '.jpg'), ('27', 'users', '1', '2013-04-15 16:15:01', '1', '2013-04-15 16:15:01', '1', '0', '201304', 'ai.jpg', 'acece069-db4c-4087-8475-acc8e1ea58d5.jpg', '55504', '.jpg'), ('28', 'defaults', null, '2013-04-17 09:05:01', '1', '2013-04-17 09:05:01', '1', '0', '201304', 'chunqiu.jpg', 'fa247313-8404-4b10-bbfd-40115fd254e8.jpg', '287311', '.jpg'), ('29', 'defaults', null, '2013-04-17 09:05:12', '1', '2013-04-17 09:05:12', '1', '0', '201304', '未命名3.jpg', '9667a2c9-6237-42c4-a3de-42de1e97271e.jpg', '263585', '.jpg'), ('30', 'defaults', null, '2013-04-17 09:05:23', '1', '2013-04-17 09:05:23', '1', '0', '201304', '未命名1.jpg', '4562fc99-fabb-4301-b7ca-87b6693751c4.jpg', '177626', '.jpg');
COMMIT;

-- ----------------------------
-- Table structure for `fieldtype`
-- ----------------------------
DROP TABLE IF EXISTS `fieldtype`;
CREATE TABLE `fieldtype` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`version_lock`  bigint(20) NULL DEFAULT NULL ,
`created_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`created_date`  datetime NULL DEFAULT NULL ,
`last_modified_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`last_modified_date`  datetime NULL DEFAULT NULL ,
`class_name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`description`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`remark`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`root_id`  bigint(20) NULL DEFAULT NULL ,
`type`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=1 */

;

-- ----------------------------
-- Records of fieldtype
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for `logs`
-- ----------------------------
DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
`id`  int(10) NOT NULL AUTO_INCREMENT ,
`user_id`  varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`user_name`  varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`clazz`  varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`method`  varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`create_time`  varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`log_level`  varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`msg`  mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL ,
`type`  tinyint(1) NULL DEFAULT NULL ,
`error_code`  varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=49302 */

;

-- ----------------------------
-- Records of logs
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for `name_rule`
-- ----------------------------
DROP TABLE IF EXISTS `name_rule`;
CREATE TABLE `name_rule` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`code`  varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`name`  varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`valid`  tinyint(4) NULL DEFAULT NULL ,
`remark`  varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=2 */

;

-- ----------------------------
-- Records of name_rule
-- ----------------------------
BEGIN;
INSERT INTO `name_rule` VALUES ('1', 'contractno', '合同号', '0', '这个是产生合同号的，举例： ABC2011-01-910001');
COMMIT;

-- ----------------------------
-- Table structure for `name_rule_item`
-- ----------------------------
DROP TABLE IF EXISTS `name_rule_item`;
CREATE TABLE `name_rule_item` (
`id`  int(11) NOT NULL AUTO_INCREMENT ,
`rule_id`  varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`category`  varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`idx`  int(11) NULL DEFAULT NULL ,
`prefix`  varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`date_format`  varchar(18) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`seq_format`  varchar(18) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`init_value`  tinyint(10) NULL DEFAULT NULL ,
`current_value`  tinyint(10) NULL DEFAULT NULL ,
`step`  tinyint(4) NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=13 */

;

-- ----------------------------
-- Records of name_rule_item
-- ----------------------------
BEGIN;
INSERT INTO `name_rule_item` VALUES ('1', '1', 'prefix', '1', 'ABC', null, null, null, null, null), ('6', '1', 'datetime', '2', null, 'yyyy-MM-dd', null, null, null, null), ('10', '1', 'sequence', '3', null, null, '0000', '1', '17', '2'), ('11', '1', 'userdef', '4', null, null, null, null, null, null), ('12', '1', 'userdef', '5', null, null, null, null, null, null);
COMMIT;

-- ----------------------------
-- Table structure for `operation`
-- ----------------------------
DROP TABLE IF EXISTS `operation`;
CREATE TABLE `operation` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`code`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`idx`  int(11) NULL DEFAULT NULL ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=10 */

;

-- ----------------------------
-- Records of operation
-- ----------------------------
BEGIN;
INSERT INTO `operation` VALUES ('1', 'view', null, '查看'), ('2', 'add', null, '新增'), ('3', 'update', null, '修改'), ('4', 'delete', null, '删除'), ('5', 'readonly', null, '只读'), ('6', 'disabled', null, '只见'), ('7', 'download', null, '下载'), ('8', 'hide', null, '隐藏'), ('9', 'execute', null, '执行');
COMMIT;

-- ----------------------------
-- Table structure for `organization`
-- ----------------------------
DROP TABLE IF EXISTS `organization`;
CREATE TABLE `organization` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`version_lock`  bigint(20) NULL DEFAULT NULL ,
`created_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`created_date`  datetime NULL DEFAULT NULL ,
`last_modified_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`last_modified_date`  datetime NULL DEFAULT NULL ,
`deleted`  bigint(20) NULL DEFAULT NULL ,
`address`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`fax`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`home_page`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`idx`  int(11) NULL DEFAULT NULL ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`parent_id`  bigint(20) NULL DEFAULT NULL ,
`postal_code`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`remark`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`short_name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`telephone`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`type_id`  bigint(20) NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
FOREIGN KEY (`parent_id`) REFERENCES `organization` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
FOREIGN KEY (`type_id`) REFERENCES `type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
INDEX `FK50104153DC705FF3` USING BTREE (`type_id`),
INDEX `FK50104153DB27057C` USING BTREE (`parent_id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=13 */

;

-- ----------------------------
-- Records of organization
-- ----------------------------
BEGIN;
INSERT INTO `organization` VALUES ('1', '1', null, null, null, null, '0', '', '', '', '1', '总部', null, null, null, null, '198281722', null), ('2', '1', null, null, null, null, '0', '', '', '', '2', '人事部', '1', null, null, null, '1982817226', null), ('3', '1', null, null, null, null, '0', '', '', '', '3', '刑侦部', '1', null, null, null, '1982817227', null), ('4', '2', null, null, null, null, '0', '', 'h', '', '4', '财务部', '1', null, null, null, '1982817228', null), ('5', '2', null, null, null, null, '0', '33', '', '', '5', '人事一部', '2', null, null, null, '1982817221', null), ('6', '4', null, null, null, null, '0', 'adf', '3', '3', '7', '人事二部', '2', null, null, null, '1982817222', null), ('7', '2', null, null, null, null, '0', 'aaa', 'aa', 'a', '1', 'testa', '4', null, null, null, 'abc', null), ('8', '0', null, null, null, null, '0', 'h', '2', 'h', '2', 'hh', '3', null, null, null, '2', null), ('11', '1', null, null, null, null, '0', 'aa', '1', 'aa2', '1', 'abc', '7', null, null, null, '1', null), ('12', null, null, null, null, null, '0', '测试真的', '测试真的', '测试真的', '11', '测试真的', null, null, null, null, '测试真的', null);
COMMIT;

-- ----------------------------
-- Table structure for `resource`
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`category`  varchar(31) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`version_lock`  bigint(20) NULL DEFAULT NULL ,
`created_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`created_date`  datetime NULL DEFAULT NULL ,
`last_modified_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`last_modified_date`  datetime NULL DEFAULT NULL ,
`deleted`  bigint(20) NULL DEFAULT NULL ,
`code`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`description`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`icon_cls`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`idx`  int(11) NULL DEFAULT NULL ,
`leaf`  tinyint(1) NULL DEFAULT NULL ,
`parent_id`  bigint(20) NULL DEFAULT NULL ,
`path`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`qtip`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`cls`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`icon`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`icon2`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`favorite`  tinyint(1) NULL DEFAULT NULL ,
`icon3`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`page_id`  bigint(20) NULL DEFAULT NULL ,
`type_code`  varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`foreign_id`  bigint(20) NULL DEFAULT NULL ,
`origin_name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`file_path`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`file_name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`file_size`  bigint(20) NULL DEFAULT NULL ,
`file_type`  varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
FOREIGN KEY (`page_id`) REFERENCES `resource` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
FOREIGN KEY (`parent_id`) REFERENCES `resource` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
UNIQUE INDEX `code` USING BTREE (`code`),
INDEX `FKEBABC40E441B86D6` USING BTREE (`parent_id`),
INDEX `FKEBABC40EB4835ECC` USING BTREE (`page_id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=107 */

;

-- ----------------------------
-- Records of resource
-- ----------------------------
BEGIN;
INSERT INTO `resource` VALUES ('1', 'menu', '2', null, null, null, null, null, 'systemmanage', 'a', '系统管理', 'settings', '99', '0', null, 'systemmanage', '', null, 'image/menuIcon/0082_16.png', 'image/menuIcon/0082_16.png', '0', null, null, null, null, null, null, null, null, null), ('2', 'menu', '0', null, null, null, null, null, 'SYS.view.org.OrgManage', '', '组织机构管理', 'settings', '2', '1', '1', 'SYS.view.org.OrgManage', '组织机构管理', null, 'image/menuIcon/0099_16.png', 'image/menuIcon/0067_32.png', '1', null, null, null, null, null, null, null, null, null), ('3', 'menu', '1', null, null, null, null, null, 'SYS.view.type.TypeManage', '', '基础数据管理', 'settings', '4', '1', '1', 'SYS.view.type.TypeManage', '基础数据管理', null, 'image/menuIcon/0071_16.png', 'image/menuIcon/0004_32.png', '1', null, null, null, null, null, null, null, null, null), ('4', 'menu', '0', null, null, null, null, null, 'SYS.view.menuresource.MenuResourceManage', '', '菜单管理', 'blist', '11', '1', '1', 'SYS.view.menuresource.MenuResourceManage', '菜单管理', null, 'image/menuIcon/0061_16.png', 'image/menuIcon/0045_32.png', '1', null, null, null, null, null, null, null, null, null), ('5', 'menu', '0', null, null, null, null, null, 'SYS.view.role.RoleManage', '', '角色管理', 'settings', '5', '1', '1', 'SYS.view.role.RoleManage', '角色管理', null, 'image/menuIcon/0048_16.png', 'image/menuIcon/0011_32.png', '1', null, null, null, null, null, null, null, null, null), ('6', 'menu', '2', null, null, null, null, null, 'SYS.view.user.UserManage', 'aa', '用户管理', 'navi', '6', '1', '1', 'SYS.view.user.UserManage', '用户管理', null, 'image/menuIcon/0005_16.png', 'image/menuIcon/0045_32.png', '0', null, null, null, null, null, null, null, null, null), ('7', 'menu', '4', null, null, null, null, null, 'SYS.view.user2role.User2RoleManage', '', '角色分配', 'add8', '7', '1', '1', 'SYS.view.user2role.User2RoleManage', '角色分配', null, 'image/menuIcon/0004_16.png', 'image/menuIcon/0045_32.png', '0', null, null, null, null, null, null, null, null, null), ('8', 'menu', '6', null, null, null, null, null, 'SYS.view.authority.AuthorityManage', '', '分级授权', 'settings', '9', '1', '1', 'SYS.view.authority.AuthorityManage', '分级授权', null, 'image/menuIcon/0003_16.png', 'image/menuIcon/0045_32.png', '0', null, null, null, null, null, null, null, null, null), ('9', 'menu', '7', null, null, null, null, '0', 'SYS.view.workday.WorkDayManage', '', '工作日管理', 'navi', '15', '1', '1', 'SYS.view.workday.WorkDayManage', '工作日管理', null, 'image/menuIcon/0002_16.png', 'image/menuIcon/0045_32.png', '0', null, null, null, null, null, null, null, null, null), ('10', 'menu', '1', null, null, null, null, null, 'SYS.view.log.LogManage', '', '日志管理', 'navi', '12', '1', '1', 'SYS.view.log.LogManage', '日志管理', null, 'image/menuIcon/0001_16.png', 'image/menuIcon/0002_32.png', '1', null, null, null, null, null, null, null, null, null), ('52', 'menu', null, null, null, null, null, '0', 'SYS.view.attachment.AttachmentManage', '附件管理', '附件管理', 'settings', '13', '1', '1', 'SYS.view.attachment.AttachmentManage', '附件管理', null, 'image/menuIcon/0077_16.png', 'image/menuIcon/0077_32.png', '0', null, null, null, null, null, null, null, null, null), ('53', 'menu', null, null, null, null, null, '0', 'test', '', '例子', '', '100', '0', null, 'test', '', null, 'image/menuIcon/0082_16.png', 'image/menuIcon/0082_32.png', '0', null, null, null, null, null, null, null, null, null), ('54', 'menu', null, null, null, null, null, '0', 'TES.view.Notification', '', '提醒文字', '', '1', '1', '53', 'TES.view.Notification', '', null, 'image/menuIcon/0080_16.png', 'image/menuIcon/0080_32.png', '0', null, null, null, null, null, null, null, null, null), ('55', 'menu', null, null, null, null, null, '0', 'TES.view.TinyMce', '', '编辑器', '', '2', '1', '53', 'TES.view.TinyMce', '', null, 'image/menuIcon/0097_16.png', 'image/menuIcon/0097_32.png', '0', null, null, null, null, null, null, null, null, null), ('56', 'menu', null, null, null, null, null, '0', 'TES.view.BoxSelect', '', '多选框', '', '3', '1', '53', 'TES.view.BoxSelect', '', null, 'image/menuIcon/0098_16.png', 'image/menuIcon/0098_32.png', '0', null, null, null, null, null, null, null, null, null), ('61', 'menu', null, null, null, null, null, '0', 'TES.view.SegmentedButtons', '', '分组按钮', '', '4', '1', '53', 'TES.view.SegmentedButtons', '', null, 'image/menuIcon/0099_16.png', 'image/menuIcon/0099_32.png', '0', null, null, null, null, null, null, null, null, null), ('62', 'menu', null, null, null, null, null, '0', 'TES.view.SwitchSegmentedButtons', '', 'Switch按钮', '', '5', '1', '53', 'TES.view.SwitchSegmentedButtons', '', null, 'image/menuIcon/0100_16.png', 'image/menuIcon/0100_32.png', '0', null, null, null, null, null, null, null, null, null), ('63', 'menu', null, null, null, null, null, '0', 'TES.view.StarRating', '', '打分数', '', '6', '1', '53', 'TES.view.StarRating', '', null, 'image/menuIcon/0050_16.png', 'image/menuIcon/0050_32.png', '1', null, null, null, null, null, null, null, null, null), ('64', 'menu', null, null, null, null, null, '0', 'TES.view.ToggleSlide', '', 'ToggleSlide', '', '7', '1', '53', 'TES.view.ToggleSlide', '', null, 'image/menuIcon/0053_16.png', 'image/menuIcon/0053_32.png', '1', null, null, null, null, null, null, null, null, null), ('65', 'menu', null, null, null, null, null, '0', 'TES.view.Exporter', '', '到处Excel', '', '8', '1', '53', 'TES.view.Exporter', '', null, 'image/menuIcon/0231_16.png', 'image/menuIcon/0231_32.png', '1', null, null, null, null, null, null, null, null, null), ('66', 'menu', null, null, null, null, null, '0', 'TES.view.Printer', '', '打印机', '', '9', '1', '53', 'TES.view.Printer', '', null, 'image/menuIcon/5081_16.png', 'image/menuIcon/5081_32.png', '1', null, null, null, null, null, null, null, null, null), ('67', 'menu', null, null, null, null, null, '0', 'TES.view.Pdf', '', '显示PDF', '', '10', '1', '53', 'TES.view.Pdf', '', null, 'image/menuIcon/0230_16.png', 'image/menuIcon/0230_32.png', '1', null, null, null, null, null, null, null, null, null), ('69', 'menu', null, null, null, null, null, '0', 'TES.view.GIS', '', 'GIS', '', '12', '1', '53', 'TES.view.GIS', '', null, 'image/menuIcon/0181_16.png', 'image/menuIcon/0181_32.png', '1', null, null, null, null, null, null, null, null, null), ('70', 'menu', null, null, null, null, null, '0', 'SYS.view.fileresource.FileResourceManage', '主要是文案等保密文件，需要分权管理。', '文件管理', '', '11', '1', '1', 'SYS.view.fileresource.FileResourceManage', '', null, 'image/menuIcon/5131_16.png', 'image/menuIcon/5131_32.png', '1', null, null, null, null, null, null, null, null, null), ('78', 'menu', null, null, null, null, null, '0', 'SYS.view.pageresource.PageResourceManage', '', '页面管理', '', '10', '1', '1', 'SYS.view.pageresource.PageResourceManage', '页面管理', null, 'image/menuIcon/0060_16.png', 'image/menuIcon/0060_32.png', '1', null, null, null, null, null, null, null, null, null), ('82', 'page', null, null, null, null, null, '0', 'page|CMN.view.common.ViewLogInfo', null, 'Log日志信息', null, '1', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('83', 'widget', null, null, null, null, null, '0', 'd', null, 'd', null, '1', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('84', 'widget', null, null, null, null, null, '0', 'cc', null, 'cc789', null, '16', null, null, null, null, null, null, null, null, null, '82', null, null, null, null, null, null, null), ('85', 'widget', null, null, null, null, null, '0', 'uuu', null, 'uu', null, '7', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('86', 'widget', null, null, null, null, null, '0', 'yy', null, 'yy', null, '5', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('87', 'widget', null, null, null, null, null, '0', 'ttty', null, '111', null, '111', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('88', 'page', null, null, null, null, null, '0', 'page|SEC.view.setup.UserProfile', null, '用户配置', null, '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('91', 'page', null, null, null, null, null, '0', 'page|SYS.view.log.LogManage', null, '日志管理', null, '3', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('92', 'widget', null, null, null, null, null, '0', 'SYS.view.log.LogManage|btnClose', null, '关闭按钮', null, '1', null, null, null, null, null, null, null, null, null, '91', null, null, null, null, null, null, null), ('93', 'page', null, null, null, null, null, '0', 'page|SYS.view.role.RoleManage', null, '角色管理', null, '4', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('94', 'widget', null, null, null, null, null, '0', 'SYS.view.role.RoleManage|btnClose', null, '关闭按钮', null, '1', null, null, null, null, null, null, null, null, null, '93', null, null, null, null, null, null, null), ('96', 'menu', null, null, null, null, null, '0', 'frontbusiness', 'frontbusiness', '前台展现', '', '1', '0', null, 'frontbusiness', '', null, 'image/menuIcon/0082_16.png', 'image/menuIcon/0082_32.png', '0', null, null, null, null, null, null, null, null, null), ('97', 'menu', null, null, null, null, null, '0', 'BUS.view.fileresource.FileResourceList', '展现当前用户的文件列表。', '文件列表', '', '1', '1', '96', 'BUS.view.fileresource.FileResourceList', '文件列表', null, 'image/menuIcon/0144_16.png', 'image/menuIcon/0144_32.png', '1', null, null, null, null, null, null, null, null, null), ('100', 'file', null, '1', '2013-04-17 14:35:12', '1', '2013-04-17 14:35:12', '0', '3fd78025-1bc4-47a5-b8a7-dffc62cbecea.jpg', null, '11n7KH.jpg', null, null, null, null, null, null, null, null, null, null, null, null, 'defaults', null, '11n7KH.jpg', '201304', '3fd78025-1bc4-47a5-b8a7-dffc62cbecea.jpg', '75682', '.jpg'), ('101', 'file', null, '1', '2013-04-17 14:35:14', '1', '2013-04-17 14:35:14', '0', '3133d891-f497-4e08-a976-0fc451c4e50d.jpg', null, 'ai.jpg', null, null, null, null, null, null, null, null, null, null, null, null, 'defaults', null, 'ai.jpg', '201304', '3133d891-f497-4e08-a976-0fc451c4e50d.jpg', '55504', '.jpg'), ('102', 'menu', null, null, null, null, null, '0', 'SYS.view.urlresource.UrlResourceManage', 'URL管理', 'URL管理', '', '11', '1', '1', 'SYS.view.urlresource.UrlResourceManage', 'URL管理', null, 'image/menuIcon/0128_16.png', 'image/menuIcon/0128_32.png', '1', null, null, null, null, null, null, null, null, null), ('104', 'url', null, null, null, null, null, '0', '/**', null, '所有', null, '1', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('105', 'menu', null, null, null, null, null, '0', 'SYS.view.namerule.NameRuleManage', 'NameRule管理', 'NameRule管理', '', '15', '1', '1', 'SYS.view.namerule.NameRuleManage', 'NameRule管理', null, 'image/menuIcon/0362_16.png', 'image/menuIcon/0362_32.png', '1', null, null, null, null, null, null, null, null, null), ('106', 'menu', null, null, null, null, null, '0', 'BUS.view.codeview.CodeViewShow', 'CodeView展现', 'CodeView展现', '', '2', '1', '96', 'BUS.view.codeview.CodeViewShow', 'CodeView展现', null, 'image/menuIcon/0323_16.png', 'image/menuIcon/0323_32.png', '1', null, null, null, null, null, null, null, null, null);
COMMIT;

-- ----------------------------
-- Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`code`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`idx`  int(11) NULL DEFAULT NULL ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`parent_id`  bigint(20) NULL DEFAULT NULL ,
`remark`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
FOREIGN KEY (`parent_id`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
INDEX `FK26F4968AAF21BF` USING BTREE (`parent_id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=5 */

;

-- ----------------------------
-- Records of role
-- ----------------------------
BEGIN;
INSERT INTO `role` VALUES ('1', 'adminrole', null, '系统管理员', null, null), ('2', 'lingdao', '0', '领导', '1', ''), ('3', 'keshi', '0', '科室人员', '2', ''), ('4', 'mishu', '1', '秘书', '2', 'a');
COMMIT;

-- ----------------------------
-- Table structure for `role_acl`
-- ----------------------------
DROP TABLE IF EXISTS `role_acl`;
CREATE TABLE `role_acl` (
`role_id`  bigint(20) NOT NULL ,
`acl_id`  bigint(20) NOT NULL ,
FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
FOREIGN KEY (`acl_id`) REFERENCES `acl` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
INDEX `FKF020FD41BC2DC5E1` USING BTREE (`acl_id`),
INDEX `FKF020FD41615A0673` USING BTREE (`role_id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci

;

-- ----------------------------
-- Records of role_acl
-- ----------------------------
BEGIN;
INSERT INTO `role_acl` VALUES ('1', '2'), ('1', '106'), ('1', '107'), ('1', '108'), ('2', '1'), ('2', '2'), ('2', '3'), ('2', '5'), ('2', '83'), ('2', '85'), ('2', '117'), ('2', '118'), ('2', '125'), ('2', '126'), ('2', '127'), ('2', '139'), ('2', '140'), ('2', '142'), ('3', '85');
COMMIT;

-- ----------------------------
-- Table structure for `type`
-- ----------------------------
DROP TABLE IF EXISTS `type`;
CREATE TABLE `type` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`code`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`idx`  int(11) NULL DEFAULT NULL ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`parent_id`  bigint(20) NULL DEFAULT NULL ,
`remark`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`leaf`  tinyint(1) NULL DEFAULT NULL ,
PRIMARY KEY (`id`),
FOREIGN KEY (`parent_id`) REFERENCES `type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
INDEX `FK28035A8AB03083` USING BTREE (`parent_id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=10232404 */

;

-- ----------------------------
-- Records of type
-- ----------------------------
BEGIN;
INSERT INTO `type` VALUES ('10232383', 'notebook', '1', '笔记本', null, '笔记本', '0'), ('10232386', 'booktype', '1', '书的种类', null, '书的种类', '0'), ('10232387', 'province', '1', '省市', null, '省市', '0'), ('10232388', 'company', '3', '公司', null, '公司', '0'), ('10232389', 'xiaoshuo', '1', '小说', '10232386', '小说', '1'), ('10232390', 'juben', '2', '剧本', '10232386', '剧本', '1'), ('10232391', 'sanwen', '3', '散文', '10232386', '散文', '1'), ('10232392', 'tonghua', '4', '童话', '10232386', '童话', '1'), ('10232393', 'beijing', '1', '北京', '10232387', '北京', '1'), ('10232394', 'tianjin', '2', '天津', '10232387', '天津', '1'), ('10232395', 'shanghai', '3', '上海', '10232387', '上海', '1'), ('10232396', 'samsung', '1', '三星', '10232388', '三星', '1'), ('10232397', 'ibm', '2', 'IBM', '10232388', 'IBM', '1'), ('10232398', 'microsoft', '3', '微软', '10232388', '微软', '1'), ('10232399', 'oracle', '4', '甲骨文', '10232388', '甲骨文', '1'), ('10232400', 'google', '5', '谷歌', '10232388', '谷歌', '1'), ('10232401', 'macbookair', '1', 'macbookair', '10232383', 'mackbookair', '1'), ('10232402', 'thinkpad', '2', 'thinkpad', '10232383', 'thinkpad', '1'), ('10232403', 'vaio', '3', 'vaio', '10232383', 'vaio', '1');
COMMIT;

-- ----------------------------
-- Table structure for `user_role`
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
`role_id`  bigint(20) NOT NULL ,
`user_id`  bigint(20) NOT NULL ,
FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
INDEX `FK143BF46A615A0673` USING BTREE (`role_id`),
INDEX `FK143BF46A684CA53` USING BTREE (`user_id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci

;

-- ----------------------------
-- Records of user_role
-- ----------------------------
BEGIN;
INSERT INTO `user_role` VALUES ('3', '4'), ('2', '4'), ('2', '3'), ('1', '1'), ('1', '2'), ('1', '4');
COMMIT;

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`version_lock`  bigint(20) NULL DEFAULT NULL ,
`created_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`created_date`  datetime NULL DEFAULT NULL ,
`last_modified_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`last_modified_date`  datetime NULL DEFAULT NULL ,
`deleted`  bigint(20) NULL DEFAULT NULL ,
`address`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`email`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`login_name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`mobile`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`password`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`remark`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`sex`  int(11) NULL DEFAULT NULL ,
`state`  int(11) NULL DEFAULT NULL ,
`user_name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`organization_id`  bigint(20) NULL DEFAULT NULL ,
`password_key`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`phone_home`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`phone_work`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`phone_other`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`birthday`  date NULL DEFAULT NULL COMMENT '出生日期' ,
`enter_date`  date NULL DEFAULT NULL COMMENT '入职日期' ,
PRIMARY KEY (`id`),
FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
UNIQUE INDEX `loginName` USING BTREE (`login_name`),
INDEX `FK6A68E08AED0E853` USING BTREE (`organization_id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=67 */

;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES ('1', '20', null, null, '1', '2013-04-14 14:15:27', '0', 'uf', 'sdf', 'manager', 'uuuu', '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'ucffsdf123123dfs', '1', '1', '西楚霸王', '4', '4790bcd08418a7d9', 'fds', 'uu', 'afds', '2013-04-04', '2013-04-03'), ('2', '2', null, null, null, null, '0', '', null, 'admin', '', '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'vv', '0', '1', '张群', '4', '4790bcd08418a7d9', null, null, null, null, null), ('3', '2', null, null, null, null, '0', 'dg1', 'a@sina.com', 'zwz3', '1391882711', 'afe2b40bb735a237a87f3a37f36a013e2a16f5e2', 'sfg1', '1', '1', '西语', '4', '7586264af819590e', '2918271', '828828281', '8282821', '2013-04-04', '2013-04-11'), ('4', '1', null, null, null, null, null, null, null, 'zwz4', null, '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'a', null, '0', '陆斌', '4', '4790bcd08418a7d9', null, null, null, null, null), ('11', '3', null, null, null, null, '0', '', null, 'a1', '', '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'a', '1', '1', '', '3', '4790bcd08418a7d9', null, null, null, null, null), ('12', '3', null, null, '1', '2013-03-18 10:42:46', '0', 'yy', null, 'a11', '7uu', '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'a', '1', '1', 'a11222yyy', null, '4790bcd08418a7d9', null, null, null, null, null), ('13', '0', null, null, '1', '2013-04-09 10:07:59', '0', '', null, 'c1', '', 'b96ad32f6dd1f9645f0953fca54c9b10edaa11f6', 'a', '1', '1', '', '2', 'ba8c6a07680d86e4', null, null, null, null, null), ('15', '0', '1', '2013-03-15 21:51:09', null, null, '0', '', null, 'cfa', '', 'e9f2703815acbc814e85868359a916f802ebcf0b', 'a', '1', '1', '', '7', 'ecb35abb0b0be4ed', null, null, null, null, null), ('17', '0', '1', '2013-03-15 21:52:18', null, null, '0', '', null, 'iiif', '', 'f639f39edc2c5040302ba58c474ef874ac1c2099', 'a', '1', '1', '', '7', '751fbc054d1546f6', null, null, null, null, null), ('18', '0', '1', '2013-03-15 21:52:55', null, null, '0', '', null, 'cad', '', '2e07ff96d7b83e154a284aaccf6d82ec8d2cadf1', 'a', '1', '1', '', '7', '16b5030f7c4e4603', null, null, null, null, null), ('19', '0', '1', '2013-03-15 22:10:53', null, null, '0', '', null, 'adc', '', '6ff55e82afb7e25c12c071214d0a26e7aa800db9', 'aa', '1', '1', '', '4', '50fce0639b1220ac', null, null, null, null, null), ('20', '0', '1', '2013-03-15 22:30:49', null, null, '0', '', null, 'd1', '', '65add03a2587dcdcc35ba782696337cfcb51167d', 'a', '1', '1', '', '4', '20e59c6ea626224b', null, null, null, null, null), ('21', '0', '1', '2013-03-15 23:33:08', null, null, '0', '', null, 'fa', '', '32b02d8ab87b536863796bd47a168a6a67021a82', 'a', '1', '1', '', '7', 'a2a0c7551311d6d7', null, null, null, null, null), ('22', '0', '1', '2013-03-15 23:34:17', null, null, '0', '', null, 'fa1', '', '048e04561a13ac24db85645d842623197d3b1410', 'a', '1', '1', '', '7', '0f2b33a1621a55c4', null, null, null, null, null), ('23', '0', '1', '2013-03-15 23:34:29', null, null, '0', '', null, 'fa11', '', '6839b1b3fc294487cf49bfa56f79a522c32d288d', 'a', '1', '1', '', '7', '345feea51805e390', null, null, null, null, null), ('24', '0', '1', '2013-03-15 23:34:58', null, null, '0', '', null, 'aff1', '', '405ebbc91cace75330e598e51769338b096bcf4d', 'a', '1', '1', '', '7', '3bc8b6e58bbe72e4', null, null, null, null, null), ('25', '0', '1', '2013-03-15 23:45:47', null, null, '0', '', null, 'aa1', '', 'd9570de051ae18b543bfaef756f7923dd9a24b39', 'a', '1', '1', '', '7', '6e74389400ca54c8', null, null, null, null, null), ('26', '0', null, null, '1', '2013-04-05 20:01:17', '0', 'd', null, 'bb1', '', '0d33b3437555a0206dc9ced505965310c7679bea', 'a', '1', '1', '', '4', '34a2a63a8910ac4b', null, null, null, null, null), ('28', '0', null, null, '1', '2013-03-18 10:42:30', '0', '', null, 'cc1', '', '7bbd9e64ab113067386fc8284ce46ef7cfc23a61', 'a', '1', '1', '1122', null, '0931dc30ee2802d8', null, null, null, null, null), ('29', null, null, null, '1', '2013-03-18 10:33:27', '0', '', null, 'a12222', '', '7d34289c52281b5ad97a80d68ad4db14e94e9ca3', 'd', '1', '1', '', null, '02767cf74a24ea64', null, null, null, null, null), ('30', null, null, '2013-03-17 11:58:52', null, '2013-03-17 11:58:52', '0', '', null, 'tttt1', '', '6f4533c9ed47e0a8f421c6911d6eb512c929cfef', '', '1', '1', '', null, '134de7d9d5245ec5', null, null, null, null, null), ('31', null, '1', '2013-03-17 12:22:42', '1', '2013-03-17 12:22:42', '0', '', null, 'xx111', '', '99d7b7f150c67df665772ba44f7253bf521674f2', '', '1', '1', '', null, 'c97c3892ba4833c9', null, null, null, null, null), ('32', null, '1', '2013-04-05 20:02:05', '1', '2013-04-05 20:02:05', '0', 'f', null, 'asdf', 'sdf', 'a58fe706a3980742e4eb9d860d067090772f90ff', 'f', '1', '1', 'asdf', '4', 'e725c9692ec05ad5', null, null, null, null, null), ('33', null, '1', '2013-04-05 20:02:15', '1', '2013-04-05 20:02:15', '0', '1', null, '111111111', '1', 'b0e4b7281a827dab9168e5cd8110a721171bed70', '1', '1', '1', '1', '4', '2e02174e6b10e270', null, null, null, null, null), ('34', null, '1', '2013-04-05 20:02:59', '1', '2013-04-05 20:02:59', '0', 'f', null, 'abc1123', 'sdf', '71aba1bfa4f0d8aaa794095d1d49c55c02752a76', 'f', '1', '1', 'asdf', '4', 'ed6529fee8261efe', null, null, null, null, null), ('61', null, '1', '2013-04-06 19:55:18', '1', '2013-04-06 19:55:18', '0', '', null, 'dddddd', '', '08cb4d6bcc38195c7a952bfc31b219e36b901a64', '', '1', '1', 'dd', '12', 'ed893ba8a966851a', null, null, null, null, null), ('62', null, '1', '2013-04-06 19:56:07', '1', '2013-04-06 19:56:07', '0', '', null, 'ddw', '', '71f9ed94eb6c70b0517d73f23f86378b252c378c', '', '1', '1', '', '12', 'e1f147325cad57c3', null, null, null, null, null), ('63', null, '1', '2013-04-06 19:56:36', '1', '2013-04-06 19:56:36', '0', '', null, 'ddwddd', '', '2f92166bfa45c981de35129369c8673b75e35e9a', '', '1', '1', '', '12', 'e5d97d78a96773d9', null, null, null, null, null), ('64', null, '1', '2013-04-06 19:56:44', '1', '2013-04-06 19:56:44', '0', '', null, 'ab123123', '', '4a3737f8b66c68bedb54a6bf9d1d4d83fb5fc77c', '', '1', '1', '', '12', '867738924058c4fd', null, null, null, null, null), ('65', null, '1', '2013-04-06 19:56:50', '1', '2013-04-06 19:56:50', '0', '', null, 'ff12312', '', '5123cc2b35093f8e660801746d1aaa1113ccb500', '', '1', '1', '', '12', '9354b584990437ed', null, null, null, null, null), ('66', null, '1', '2013-04-06 20:04:50', '1', '2013-04-06 20:04:50', '0', '', null, '2222', '', '1d8cd60beb114c5caf646d97aed4f09a7a34bc06', '', '1', '1', '', '12', '92dd5a15797e3ae3', null, null, null, null, null);
COMMIT;

-- ----------------------------
-- Table structure for `workday`
-- ----------------------------
DROP TABLE IF EXISTS `workday`;
CREATE TABLE `workday` (
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`version_lock`  bigint(20) NULL DEFAULT NULL ,
`created_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`created_date`  datetime NULL DEFAULT NULL ,
`last_modified_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`last_modified_date`  datetime NULL DEFAULT NULL ,
`deleted`  bigint(20) NULL DEFAULT NULL ,
`day_date`  datetime NULL DEFAULT NULL ,
`end_date`  datetime NULL DEFAULT NULL ,
`sequence`  int(11) NOT NULL ,
`start_date`  datetime NULL DEFAULT NULL ,
`week_day`  int(11) NOT NULL ,
`work_day`  tinyint(1) NULL DEFAULT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
/*!50003 AUTO_INCREMENT=71 */

;

-- ----------------------------
-- Records of workday
-- ----------------------------
BEGIN;
INSERT INTO `workday` VALUES ('53', null, null, null, null, null, null, '2013-04-01 00:00:00', null, '0', null, '1', '1'), ('54', null, null, null, null, null, null, '2013-04-02 00:00:00', null, '0', null, '2', '1'), ('55', null, null, null, null, null, null, '2013-04-03 00:00:00', null, '0', null, '3', '1'), ('56', null, null, null, null, null, null, '2013-04-04 00:00:00', null, '0', null, '4', '1'), ('57', null, null, null, null, null, null, '2013-04-05 00:00:00', null, '0', null, '5', '1'), ('58', null, null, null, null, null, null, '2013-04-06 00:00:00', null, '0', null, '6', '0'), ('59', null, null, null, null, null, null, '2013-04-07 00:00:00', null, '0', null, '7', '0'), ('60', null, null, null, null, null, null, '2013-04-08 00:00:00', null, '0', null, '1', '1'), ('61', null, null, null, null, null, null, '2013-04-09 00:00:00', null, '0', null, '2', '1'), ('62', null, null, null, null, null, null, '2013-04-10 00:00:00', null, '0', null, '3', '1'), ('63', null, null, null, null, null, null, '2013-04-11 00:00:00', null, '0', null, '4', '1'), ('64', null, null, null, null, null, null, '2013-04-11 16:00:00', null, '0', null, '5', '0'), ('65', null, null, null, null, null, null, '2013-04-13 00:00:00', null, '0', null, '6', '0'), ('66', null, null, null, null, null, null, '2013-04-14 00:00:00', null, '0', null, '7', '0'), ('67', null, null, null, null, null, null, '2013-04-15 00:00:00', null, '0', null, '1', '1'), ('68', null, null, null, null, null, null, '2013-04-16 00:00:00', null, '0', null, '2', '1'), ('69', null, null, null, null, null, null, '2013-04-17 00:00:00', null, '0', null, '3', '1'), ('70', null, null, null, null, null, null, '2013-04-18 00:00:00', null, '0', null, '4', '1');
COMMIT;

-- ----------------------------
-- Auto increment value for `acl`
-- ----------------------------
ALTER TABLE `acl` AUTO_INCREMENT=149;

-- ----------------------------
-- Auto increment value for `attachment`
-- ----------------------------
ALTER TABLE `attachment` AUTO_INCREMENT=31;

-- ----------------------------
-- Auto increment value for `fieldtype`
-- ----------------------------
ALTER TABLE `fieldtype` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `logs`
-- ----------------------------
ALTER TABLE `logs` AUTO_INCREMENT=49302;

-- ----------------------------
-- Auto increment value for `name_rule`
-- ----------------------------
ALTER TABLE `name_rule` AUTO_INCREMENT=2;

-- ----------------------------
-- Auto increment value for `name_rule_item`
-- ----------------------------
ALTER TABLE `name_rule_item` AUTO_INCREMENT=13;

-- ----------------------------
-- Auto increment value for `operation`
-- ----------------------------
ALTER TABLE `operation` AUTO_INCREMENT=10;

-- ----------------------------
-- Auto increment value for `organization`
-- ----------------------------
ALTER TABLE `organization` AUTO_INCREMENT=13;

-- ----------------------------
-- Auto increment value for `resource`
-- ----------------------------
ALTER TABLE `resource` AUTO_INCREMENT=107;

-- ----------------------------
-- Auto increment value for `role`
-- ----------------------------
ALTER TABLE `role` AUTO_INCREMENT=5;

-- ----------------------------
-- Auto increment value for `type`
-- ----------------------------
ALTER TABLE `type` AUTO_INCREMENT=10232404;

-- ----------------------------
-- Auto increment value for `users`
-- ----------------------------
ALTER TABLE `users` AUTO_INCREMENT=67;

-- ----------------------------
-- Auto increment value for `workday`
-- ----------------------------
ALTER TABLE `workday` AUTO_INCREMENT=71;
