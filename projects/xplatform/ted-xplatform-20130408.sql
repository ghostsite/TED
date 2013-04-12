/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50096
Source Host           : localhost:3306
Source Database       : tedxplatform

Target Server Type    : MYSQL
Target Server Version : 50096
File Encoding         : 65001

Date: 2013-04-12 13:29:37
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
/*!50003 AUTO_INCREMENT=109 */

;

-- ----------------------------
-- Records of acl
-- ----------------------------
BEGIN;
INSERT INTO `acl` VALUES ('1', '0', null, null, null, null, '1', '1'), ('2', '0', null, null, null, null, '1', '2'), ('3', '0', null, null, null, null, '1', '3'), ('4', '0', null, null, null, null, '1', '4'), ('5', '0', null, null, null, null, '1', '5'), ('6', '0', null, null, null, null, '1', '6'), ('7', '0', null, null, null, null, '1', '7'), ('8', '0', null, null, null, null, '1', '8'), ('33', '0', null, null, null, null, '2', '9'), ('34', '0', null, null, null, null, '1', '9'), ('40', '0', null, null, null, null, '4', '8'), ('43', '0', null, null, null, null, '3', '7'), ('81', null, null, null, null, null, '1', '52'), ('82', null, null, null, null, null, '1', '10'), ('83', null, null, null, null, null, '1', '53'), ('84', null, null, null, null, null, '1', '54'), ('85', null, null, null, null, null, '1', '55'), ('86', null, null, null, null, null, '1', '56'), ('88', null, null, null, null, null, '1', '69'), ('89', null, null, null, null, null, '1', '66'), ('90', null, null, null, null, null, '1', '70'), ('91', null, null, null, null, null, '1', '77'), ('92', null, null, null, null, null, '1', '78'), ('98', null, null, null, null, null, '1', '83'), ('99', null, null, null, null, null, '2', '85'), ('100', null, null, null, null, null, '1', '85'), ('101', null, null, null, null, null, '1', '86'), ('102', null, null, null, null, null, '1', '87'), ('106', null, null, null, null, null, '1', '82'), ('107', null, null, null, null, null, '1', '84'), ('108', null, null, null, null, null, '2', '84');
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
/*!50003 AUTO_INCREMENT=23 */

;

-- ----------------------------
-- Records of attachment
-- ----------------------------
BEGIN;
INSERT INTO `attachment` VALUES ('1', 'defaults', null, '2013-03-24 20:01:23', '1', '2013-03-24 20:01:23', '1', '0', '201303', 'custom.jpg', 'efd2cc94-a6e1-45a7-94b4-2ba0146e7e1e.jpg', '92336', '.jpg'), ('2', 'defaults', null, '2013-03-24 20:02:45', '1', '2013-03-24 20:02:45', '1', '0', '201303', 'd4c2e4a3297fe25a71d030b67eb83bfc.012.jpg', '26bb7ee6-56e3-4d84-91d4-b749daf183b0.jpg', '36330', '.jpg'), ('3', 'defaults', null, '2013-03-24 20:02:54', '1', '2013-03-24 20:02:54', '1', '0', '201303', 'FSKK.jpg', 'e031b01b-fbfe-45c8-b8ee-f9e683d25bae.jpg', '44688', '.jpg'), ('4', 'defaults', null, '2013-03-24 20:03:10', '1', '2013-03-24 20:03:10', '1', '0', '201303', '14I7Yq.jpg', '6c508ef7-4e93-479d-b71c-87e3c4856baa.jpg', '74064', '.jpg'), ('5', 'defaults', null, '2013-03-25 14:04:26', '1', '2013-03-25 14:04:26', '1', '0', '201303', '26165548_46860.jpg', '780a6e55-0cc5-4acc-a83d-b0e61f2be21a.jpg', '150349', '.jpg'), ('6', 'defaults', null, '2013-03-25 14:08:56', '1', '2013-03-25 14:08:56', '1', '0', '201303', '11n7KH.jpg', 'bb9c3866-a3ff-4bd0-863d-80d2aadf0f64.jpg', '75682', '.jpg'), ('7', 'defaults', null, '2013-03-25 14:14:42', '1', '2013-03-25 14:14:42', '1', '0', '201303', '11n7KH.jpg', 'fc17b2fb-6d9f-4c24-a232-b1fdab159397.jpg', '75682', '.jpg'), ('8', 'defaults', null, '2013-03-25 14:15:44', '1', '2013-03-25 14:15:44', '1', '0', '201303', '14I7Yq.jpg', '63ad9058-69b4-4b1d-851e-912db9374e53.jpg', '74064', '.jpg'), ('9', 'defaults', null, '2013-03-25 14:31:05', '1', '2013-03-25 14:31:05', '1', '0', '201303', 'ai.jpg', '3e3746eb-5b99-4f46-b1a9-0d18f5d3a4e7.jpg', '55504', '.jpg'), ('10', 'defaults', null, '2013-03-25 14:32:33', '1', '2013-03-25 14:32:33', '1', '0', '201303', '11n7KH.jpg', '91b1a13f-da42-4162-8b41-3e29f1ebb832.jpg', '75682', '.jpg'), ('11', 'defaults', null, '2013-03-25 14:34:08', '1', '2013-03-25 14:34:08', '1', '0', '201303', '11n7KH.jpg', '2a4e28d8-fe43-4b6a-91c4-c3556e752b1e.jpg', '75682', '.jpg'), ('12', 'defaults', null, '2013-03-25 14:37:06', '1', '2013-03-25 14:37:06', '1', '0', '201303', '11n7KH.jpg', '6df8af57-0124-4a4f-a27d-9cde13071eef.jpg', '75682', '.jpg'), ('13', 'defaults', null, '2013-03-25 15:02:48', '1', '2013-03-25 15:02:48', '1', '0', '201303', '11n7KH.jpg', 'dceecfe4-1a38-4436-9a48-032ec901d5fe.jpg', '75682', '.jpg'), ('14', 'defaults', null, '2013-03-25 15:02:50', '1', '2013-03-25 15:02:50', '1', '0', '201303', '14I7Yq.jpg', 'ef6ec30a-d649-4468-a98e-7e30b1395c8b.jpg', '74064', '.jpg'), ('15', 'defaults', null, '2013-03-25 15:02:52', '1', '2013-03-25 15:02:52', '1', '0', '201303', '26165548_46860.jpg', '59815fab-4ee1-42ac-9afd-32b39f839be2.jpg', '150349', '.jpg'), ('16', 'defaults', null, '2013-03-25 15:02:54', '1', '2013-03-25 15:02:54', '1', '0', '201303', 'd4c2e4a3297fe25a71d030b67eb83bfc.012.jpg', '17117843-2263-46a3-a7cf-e2a878758066.jpg', '36330', '.jpg'), ('17', 'defaults', null, '2013-03-25 15:02:56', '1', '2013-03-25 15:02:56', '1', '0', '201303', '19300001312922131184304412661.jpg', 'e143d46e-da94-4bae-9040-128e51ba1ab2.jpg', '75837', '.jpg'), ('18', 'defaults', null, '2013-03-25 15:02:58', '1', '2013-03-25 15:02:58', '1', '0', '201303', '19300001312922131184304412661.jpg', '75136c97-8e4b-4ad2-be96-8a5b3ece4269.jpg', '75837', '.jpg'), ('19', 'defaults', null, '2013-03-25 15:03:01', '1', '2013-03-25 15:03:01', '1', '0', '201303', '未命名3.jpg', '31901bd7-6705-45dc-a891-9a211e0514d7.jpg', '263585', '.jpg'), ('20', 'defaults', null, '2013-04-05 20:59:14', '1', '2013-04-05 20:59:14', '1', '0', '201304', '未命名3.jpg', 'd2b8a9ad-3383-4a42-83cf-48e5d40639d4.jpg', '263585', '.jpg'), ('21', 'defaults', null, '2013-04-05 20:59:52', '1', '2013-04-05 20:59:52', '1', '0', '201304', '未命名1.jpg', '01ae7877-cb26-4f3e-95f3-3aea448ea66d.jpg', '177626', '.jpg'), ('22', 'defaults', null, '2013-04-05 21:18:49', '1', '2013-04-05 21:18:49', '1', '0', '201304', 'FSKK.jpg', 'cccea954-4b1b-46f8-ae44-f215aa28952b.jpg', '44688', '.jpg');
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
/*!50003 AUTO_INCREMENT=32140 */

;

-- ----------------------------
-- Records of logs
-- ----------------------------
BEGIN;
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
/*!50003 AUTO_INCREMENT=5 */

;

-- ----------------------------
-- Records of operation
-- ----------------------------
BEGIN;
INSERT INTO `operation` VALUES ('1', 'view', null, '查看'), ('2', 'add', null, '新增'), ('3', 'update', null, '修改'), ('4', 'delete', null, '删除');
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
`category`  varchar(31) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`id`  bigint(20) NOT NULL AUTO_INCREMENT ,
`version_lock`  bigint(20) NULL DEFAULT NULL ,
`created_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`created_date`  datetime NULL DEFAULT NULL ,
`last_modified_by`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`last_modified_date`  datetime NULL DEFAULT NULL ,
`deleted`  bigint(20) NULL DEFAULT NULL ,
`code`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`description`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`button_icon_cls`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`icon_cls`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`idx`  int(11) NULL DEFAULT NULL ,
`leaf`  tinyint(1) NULL DEFAULT NULL ,
`parent_id`  bigint(20) NULL DEFAULT NULL ,
`path`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`qtip`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`cls`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`icon`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`button_icon_align`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`button_scale`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`button_width`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
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
/*!50003 AUTO_INCREMENT=91 */

;

-- ----------------------------
-- Records of resource
-- ----------------------------
BEGIN;
INSERT INTO `resource` VALUES ('menu', '1', '2', null, null, null, null, null, 'systemmanage', 'a', '系统管理', null, 'settings', '99', '0', null, 'systemmanage', '', null, 'image/menuIcon/0082_16.png', '', null, '144', 'image/menuIcon/0082_16.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '2', '0', null, null, null, null, null, 'SYS.view.org.OrgManage', '', '组织机构管理', null, 'settings', '2', '1', '1', 'SYS.view.org.OrgManage', '组织机构管理', null, 'image/menuIcon/0099_16.png', '', null, '144', 'image/menuIcon/0067_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '3', '1', null, null, null, null, null, 'SYS.view.type.TypeManage', '', '基础数据管理', null, 'settings', '4', '1', '1', 'SYS.view.type.TypeManage', '基础数据管理', null, 'image/menuIcon/0071_16.png', '', null, '144', 'image/menuIcon/0004_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '4', '0', null, null, null, null, null, 'SYS.view.menuresource.MenuResourceManage', '', '菜单管理', null, 'blist', '4', '1', '1', 'SYS.view.menuresource.MenuResourceManage', '菜单管理', null, 'image/menuIcon/0061_16.png', '', null, '144', 'image/menuIcon/0045_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '5', '0', null, null, null, null, null, 'SYS.view.role.RoleManage', '', '角色管理', null, 'settings', '5', '1', '1', 'SYS.view.role.RoleManage', '角色管理', null, 'image/menuIcon/0048_16.png', '', null, '144', 'image/menuIcon/0011_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '6', '2', null, null, null, null, null, 'SYS.view.user.UserManage', 'aa', '用户管理', null, 'navi', '6', '1', '1', 'SYS.view.user.UserManage', '用户管理', null, 'image/menuIcon/0005_16.png', '', null, '144', 'image/menuIcon/0045_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '7', '4', null, null, null, null, null, 'SYS.view.user2role.User2RoleManage', '', '角色分配', null, 'add8', '7', '1', '1', 'SYS.view.user2role.User2RoleManage', '角色分配', null, 'image/menuIcon/0004_16.png', '', null, '144', 'image/menuIcon/0045_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '8', '6', null, null, null, null, null, 'SYS.view.authority.AuthorityManage', '', '分级授权', null, 'settings', '9', '1', '1', 'SYS.view.authority.AuthorityManage', '分级授权', null, 'image/menuIcon/0003_16.png', '', null, '144', 'image/menuIcon/0045_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '9', '7', null, null, null, null, '0', 'SYS.view.workday.WorkDayManage', '', '工作日管理', null, 'navi', '15', '1', '1', 'SYS.view.workday.WorkDayManage', '工作日管理', null, 'image/menuIcon/0002_16.png', '', null, '144', 'image/menuIcon/0045_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '10', '1', null, null, null, null, null, 'SYS.view.log.LogManage', '', '日志管理', null, 'navi', '12', '1', '1', 'SYS.view.log.LogManage', '日志管理', null, 'image/menuIcon/0001_16.png', '', null, '144', 'image/menuIcon/0002_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '52', null, null, null, null, null, '0', 'SYS.view.attachment.AttachmentManage', '附件管理', '附件管理', null, 'settings', '13', '1', '1', 'SYS.view.attachment.AttachmentManage', '附件管理', null, 'image/menuIcon/0077_16.png', '', null, '144', 'image/menuIcon/0077_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '53', null, null, null, null, null, '0', 'test', '', '例子', null, '', '100', '0', null, 'test', '', null, 'image/menuIcon/0082_16.png', '', null, '144', 'image/menuIcon/0082_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '54', null, null, null, null, null, '0', 'TES.view.Notification', '', '提醒文字', null, '', '1', '1', '53', 'TES.view.Notification', '', null, 'image/menuIcon/0080_16.png', '', null, '144', 'image/menuIcon/0080_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '55', null, null, null, null, null, '0', 'TES.view.TinyMce', '', '编辑器', null, '', '2', '1', '53', 'TES.view.TinyMce', '', null, 'image/menuIcon/0097_16.png', '', null, '144', 'image/menuIcon/0097_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '56', null, null, null, null, null, '0', 'TES.view.BoxSelect', '', '多选框', null, '', '3', '1', '53', 'TES.view.BoxSelect', '', null, 'image/menuIcon/0098_16.png', '', null, '144', 'image/menuIcon/0098_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '61', null, null, null, null, null, '0', 'TES.view.SegmentedButtons', '', '分组按钮', null, '', '4', '1', '53', 'TES.view.SegmentedButtons', '', null, 'image/menuIcon/0099_16.png', '', null, '144', 'image/menuIcon/0099_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '62', null, null, null, null, null, '0', 'TES.view.SwitchSegmentedButtons', '', 'Switch按钮', null, '', '5', '1', '53', 'TES.view.SwitchSegmentedButtons', '', null, 'image/menuIcon/0100_16.png', '', null, '144', 'image/menuIcon/0100_32.png', '0', null, null, null, null, null, null, null, null, null), ('menu', '63', null, null, null, null, null, '0', 'TES.view.StarRating', '', '打分数', null, '', '6', '1', '53', 'TES.view.StarRating', '', null, 'image/menuIcon/0050_16.png', '', null, '144', 'image/menuIcon/0050_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '64', null, null, null, null, null, '0', 'TES.view.ToggleSlide', '', 'ToggleSlide', null, '', '7', '1', '53', 'TES.view.ToggleSlide', '', null, 'image/menuIcon/0053_16.png', '', null, '144', 'image/menuIcon/0053_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '65', null, null, null, null, null, '0', 'TES.view.Exporter', '', '到处Excel', null, '', '8', '1', '53', 'TES.view.Exporter', '', null, 'image/menuIcon/0231_16.png', '', null, '144', 'image/menuIcon/0231_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '66', null, null, null, null, null, '0', 'TES.view.Printer', '', '打印机', null, '', '9', '1', '53', 'TES.view.Printer', '', null, 'image/menuIcon/5081_16.png', '', null, '144', 'image/menuIcon/5081_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '67', null, null, null, null, null, '0', 'TES.view.Pdf', '', '显示PDF', null, '', '10', '1', '53', 'TES.view.Pdf', '', null, 'image/menuIcon/0230_16.png', '', null, '144', 'image/menuIcon/0230_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '69', null, null, null, null, null, '0', 'TES.view.GIS', '', 'GIS', null, '', '12', '1', '53', 'TES.view.GIS', '', null, 'image/menuIcon/0181_16.png', '', null, '144', 'image/menuIcon/0181_32.png', '1', null, null, null, null, null, null, null, null, null), ('menu', '70', null, null, null, null, null, '0', 'SYS.view.fileresource.FileResourceManage', '主要是文案等保密文件，需要分权管理。', '文件管理', null, '', '11', '1', '1', 'SYS.view.fileresource.FileResourceManage', '', null, 'image/menuIcon/5131_16.png', '', null, '144', 'image/menuIcon/5131_32.png', '1', null, null, null, null, null, null, null, null, null), ('file', '71', null, '1', '2013-04-09 17:09:42', '1', '2013-04-09 17:09:42', '0', 'ffb6b288-75bd-4b00-9d1e-3a77513a01c0.jpg', null, '14I7Yq.jpg', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'defaults', null, '14I7Yq.jpg', '201304', 'ffb6b288-75bd-4b00-9d1e-3a77513a01c0.jpg', '74064', '.jpg'), ('file', '72', null, '1', '2013-04-09 21:40:39', '1', '2013-04-09 21:40:39', '0', 'ec2f02da-2003-4db1-9ea5-71c59e01e661.jpg', null, 'chunqiu.jpg', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'defaults', null, 'chunqiu.jpg', '201304', 'ec2f02da-2003-4db1-9ea5-71c59e01e661.jpg', '287311', '.jpg'), ('file', '73', null, '1', '2013-04-09 21:40:51', '1', '2013-04-09 21:40:51', '0', '4b1da71b-6ec7-4b41-ad30-3ba892973808.jpg', null, 'psb.jpg', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'defaults', null, 'psb.jpg', '201304', '4b1da71b-6ec7-4b41-ad30-3ba892973808.jpg', '85265', '.jpg'), ('file', '74', null, '1', '2013-04-10 12:31:10', '1', '2013-04-10 12:31:10', '0', '1dea4f37-c24c-4af5-a092-6b36dc9c360d.jpg', null, 'custom.jpg', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'defaults', null, 'custom.jpg', '201304', '1dea4f37-c24c-4af5-a092-6b36dc9c360d.jpg', '92336', '.jpg'), ('file', '75', null, '1', '2013-04-10 12:31:23', '1', '2013-04-10 12:31:23', '0', 'd385732e-cf63-491a-9ea4-4cd989cdc8da.jpg', null, 'FSKK.jpg', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'defaults', null, 'FSKK.jpg', '201304', 'd385732e-cf63-491a-9ea4-4cd989cdc8da.jpg', '44688', '.jpg'), ('file', '76', null, '1', '2013-04-10 12:31:34', '1', '2013-04-10 12:31:34', '0', 'cea10d83-7809-4c6a-8bb0-f589fa82dd41.jpg', null, 'ai.jpg', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'defaults', null, 'ai.jpg', '201304', 'cea10d83-7809-4c6a-8bb0-f589fa82dd41.jpg', '55504', '.jpg'), ('file', '77', null, '1', '2013-04-10 16:11:42', '1', '2013-04-10 16:11:42', '0', '8547773a-7c2b-4721-bc88-7541c0d3a87a.jpg', null, 'ai.jpg', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'defaults', null, 'ai.jpg', '201304', '8547773a-7c2b-4721-bc88-7541c0d3a87a.jpg', '55504', '.jpg'), ('menu', '78', null, null, null, null, null, '0', 'SYS.view.pageresource.PageResourceManage', '', '页面管理', null, '', '10', '1', '1', 'SYS.view.pageresource.PageResourceManage', '页面管理', null, 'image/menuIcon/0060_16.png', '', null, '144', 'image/menuIcon/0060_32.png', '1', null, null, null, null, null, null, null, null, null), ('page', '82', null, null, null, null, null, '0', 'ww', null, 'ww2', null, null, '1', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('widget', '83', null, null, null, null, null, '0', 'd', null, 'd', null, null, '1', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('widget', '84', null, null, null, null, null, '0', 'cc', null, 'cc789', null, null, '16', null, null, null, null, null, null, null, null, null, null, null, null, '82', null, null, null, null, null, null, null), ('widget', '85', null, null, null, null, null, '0', 'uuu', null, 'uu', null, null, '7', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('widget', '86', null, null, null, null, null, '0', 'yy', null, 'yy', null, null, '5', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('widget', '87', null, null, null, null, null, '0', 'ttty', null, '111', null, null, '111', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
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
INSERT INTO `role_acl` VALUES ('2', '5'), ('2', '91'), ('1', '91'), ('1', '2'), ('1', '106'), ('1', '107'), ('1', '108');
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
/*!50003 AUTO_INCREMENT=10232386 */

;

-- ----------------------------
-- Records of type
-- ----------------------------
BEGIN;
INSERT INTO `type` VALUES ('10232383', '类型1', '1', '类型1', null, '类型1', '0'), ('10232384', '类型1-1', '1', '类型1-1', '10232383', '类型1-1', '0'), ('10232385', 'd', '1', 'd', '10232384', 'd', '0');
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
INSERT INTO `user_role` VALUES ('2', '4'), ('3', '4'), ('3', '3'), ('1', '1'), ('1', '2'), ('1', '3'), ('1', '4');
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
`telephone`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`user_name`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
`organization_id`  bigint(20) NULL DEFAULT NULL ,
`password_key`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
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
INSERT INTO `users` VALUES ('1', '20', null, null, null, null, '0', 'uf', null, 'manager', 'uuuu', '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'ucffsdf123123dfs', '1', '1', 'uu', '777', '4', '4790bcd08418a7d9'), ('2', '2', null, null, null, null, '0', '', null, 'admin', '', '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'vv', '0', '1', '', '张群', '4', '4790bcd08418a7d9'), ('3', '2', null, null, null, null, '0', 'dg', null, 'zwz3', '', '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'sfg', '0', '1', '', '西语', '4', '4790bcd08418a7d9'), ('4', '1', null, null, null, null, null, null, null, 'zwz4', null, '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'a', null, '0', null, '陆斌', '4', '4790bcd08418a7d9'), ('11', '3', null, null, null, null, '0', '', null, 'a1', '', '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'a', '1', '1', '', '', '3', '4790bcd08418a7d9'), ('12', '3', null, null, '1', '2013-03-18 10:42:46', '0', 'yy', null, 'a11', '7uu', '0f4412e2e15d7c154f152fdd4f51e60ed885de5f', 'a', '1', '1', '', 'a11222yyy', null, '4790bcd08418a7d9'), ('13', '0', null, null, '1', '2013-04-09 10:07:59', '0', '', null, 'c1', '', 'b96ad32f6dd1f9645f0953fca54c9b10edaa11f6', 'a', '1', '1', '', '', '2', 'ba8c6a07680d86e4'), ('15', '0', '1', '2013-03-15 21:51:09', null, null, '0', '', null, 'cfa', '', 'e9f2703815acbc814e85868359a916f802ebcf0b', 'a', '1', '1', '', '', '7', 'ecb35abb0b0be4ed'), ('17', '0', '1', '2013-03-15 21:52:18', null, null, '0', '', null, 'iiif', '', 'f639f39edc2c5040302ba58c474ef874ac1c2099', 'a', '1', '1', '', '', '7', '751fbc054d1546f6'), ('18', '0', '1', '2013-03-15 21:52:55', null, null, '0', '', null, 'cad', '', '2e07ff96d7b83e154a284aaccf6d82ec8d2cadf1', 'a', '1', '1', '', '', '7', '16b5030f7c4e4603'), ('19', '0', '1', '2013-03-15 22:10:53', null, null, '0', '', null, 'adc', '', '6ff55e82afb7e25c12c071214d0a26e7aa800db9', 'aa', '1', '1', '', '', '4', '50fce0639b1220ac'), ('20', '0', '1', '2013-03-15 22:30:49', null, null, '0', '', null, 'd1', '', '65add03a2587dcdcc35ba782696337cfcb51167d', 'a', '1', '1', '', '', '4', '20e59c6ea626224b'), ('21', '0', '1', '2013-03-15 23:33:08', null, null, '0', '', null, 'fa', '', '32b02d8ab87b536863796bd47a168a6a67021a82', 'a', '1', '1', '', '', '7', 'a2a0c7551311d6d7'), ('22', '0', '1', '2013-03-15 23:34:17', null, null, '0', '', null, 'fa1', '', '048e04561a13ac24db85645d842623197d3b1410', 'a', '1', '1', '', '', '7', '0f2b33a1621a55c4'), ('23', '0', '1', '2013-03-15 23:34:29', null, null, '0', '', null, 'fa11', '', '6839b1b3fc294487cf49bfa56f79a522c32d288d', 'a', '1', '1', '', '', '7', '345feea51805e390'), ('24', '0', '1', '2013-03-15 23:34:58', null, null, '0', '', null, 'aff1', '', '405ebbc91cace75330e598e51769338b096bcf4d', 'a', '1', '1', '', '', '7', '3bc8b6e58bbe72e4'), ('25', '0', '1', '2013-03-15 23:45:47', null, null, '0', '', null, 'aa1', '', 'd9570de051ae18b543bfaef756f7923dd9a24b39', 'a', '1', '1', '', '', '7', '6e74389400ca54c8'), ('26', '0', null, null, '1', '2013-04-05 20:01:17', '0', 'd', null, 'bb1', '', '0d33b3437555a0206dc9ced505965310c7679bea', 'a', '1', '1', '', '', '4', '34a2a63a8910ac4b'), ('28', '0', null, null, '1', '2013-03-18 10:42:30', '0', '', null, 'cc1', '', '7bbd9e64ab113067386fc8284ce46ef7cfc23a61', 'a', '1', '1', '', '1122', null, '0931dc30ee2802d8'), ('29', null, null, null, '1', '2013-03-18 10:33:27', '0', '', null, 'a12222', '', '7d34289c52281b5ad97a80d68ad4db14e94e9ca3', 'd', '1', '1', '', '', null, '02767cf74a24ea64'), ('30', null, null, '2013-03-17 11:58:52', null, '2013-03-17 11:58:52', '0', '', null, 'tttt1', '', '6f4533c9ed47e0a8f421c6911d6eb512c929cfef', '', '1', '1', '', '', null, '134de7d9d5245ec5'), ('31', null, '1', '2013-03-17 12:22:42', '1', '2013-03-17 12:22:42', '0', '', null, 'xx111', '', '99d7b7f150c67df665772ba44f7253bf521674f2', '', '1', '1', '', '', null, 'c97c3892ba4833c9'), ('32', null, '1', '2013-04-05 20:02:05', '1', '2013-04-05 20:02:05', '0', 'f', null, 'asdf', 'sdf', 'a58fe706a3980742e4eb9d860d067090772f90ff', 'f', '1', '1', 'sadf', 'asdf', '4', 'e725c9692ec05ad5'), ('33', null, '1', '2013-04-05 20:02:15', '1', '2013-04-05 20:02:15', '0', '1', null, '111111111', '1', 'b0e4b7281a827dab9168e5cd8110a721171bed70', '1', '1', '1', '1', '1', '4', '2e02174e6b10e270'), ('34', null, '1', '2013-04-05 20:02:59', '1', '2013-04-05 20:02:59', '0', 'f', null, 'abc1123', 'sdf', '7c7e99ea7f41ad2fc4e815b08888c7422c031e95', 'f', '1', '1', '', 'asdf', '4', '62b9d32ee823ab8b'), ('61', null, '1', '2013-04-06 19:55:18', '1', '2013-04-06 19:55:18', '0', '', null, 'dddddd', '', '08cb4d6bcc38195c7a952bfc31b219e36b901a64', '', '1', '1', '', 'dd', '12', 'ed893ba8a966851a'), ('62', null, '1', '2013-04-06 19:56:07', '1', '2013-04-06 19:56:07', '0', '', null, 'ddw', '', '71f9ed94eb6c70b0517d73f23f86378b252c378c', '', '1', '1', '', '', '12', 'e1f147325cad57c3'), ('63', null, '1', '2013-04-06 19:56:36', '1', '2013-04-06 19:56:36', '0', '', null, 'ddwddd', '', '2f92166bfa45c981de35129369c8673b75e35e9a', '', '1', '1', '', '', '12', 'e5d97d78a96773d9'), ('64', null, '1', '2013-04-06 19:56:44', '1', '2013-04-06 19:56:44', '0', '', null, 'ab123123', '', '4a3737f8b66c68bedb54a6bf9d1d4d83fb5fc77c', '', '1', '1', '', '', '12', '867738924058c4fd'), ('65', null, '1', '2013-04-06 19:56:50', '1', '2013-04-06 19:56:50', '0', '', null, 'ff12312', '', '5123cc2b35093f8e660801746d1aaa1113ccb500', '', '1', '1', '', '', '12', '9354b584990437ed'), ('66', null, '1', '2013-04-06 20:04:50', '1', '2013-04-06 20:04:50', '0', '', null, '2222', '', '1d8cd60beb114c5caf646d97aed4f09a7a34bc06', '', '1', '1', '', '', '12', '92dd5a15797e3ae3');
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
ALTER TABLE `acl` AUTO_INCREMENT=109;

-- ----------------------------
-- Auto increment value for `attachment`
-- ----------------------------
ALTER TABLE `attachment` AUTO_INCREMENT=23;

-- ----------------------------
-- Auto increment value for `fieldtype`
-- ----------------------------
ALTER TABLE `fieldtype` AUTO_INCREMENT=1;

-- ----------------------------
-- Auto increment value for `logs`
-- ----------------------------
ALTER TABLE `logs` AUTO_INCREMENT=32140;

-- ----------------------------
-- Auto increment value for `operation`
-- ----------------------------
ALTER TABLE `operation` AUTO_INCREMENT=5;

-- ----------------------------
-- Auto increment value for `organization`
-- ----------------------------
ALTER TABLE `organization` AUTO_INCREMENT=13;

-- ----------------------------
-- Auto increment value for `resource`
-- ----------------------------
ALTER TABLE `resource` AUTO_INCREMENT=91;

-- ----------------------------
-- Auto increment value for `role`
-- ----------------------------
ALTER TABLE `role` AUTO_INCREMENT=5;

-- ----------------------------
-- Auto increment value for `type`
-- ----------------------------
ALTER TABLE `type` AUTO_INCREMENT=10232386;

-- ----------------------------
-- Auto increment value for `users`
-- ----------------------------
ALTER TABLE `users` AUTO_INCREMENT=67;

-- ----------------------------
-- Auto increment value for `workday`
-- ----------------------------
ALTER TABLE `workday` AUTO_INCREMENT=71;
