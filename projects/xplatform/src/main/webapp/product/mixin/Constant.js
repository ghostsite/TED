/*
 * TODO 이 Mixin은 MES 모듈로 이동하여야 한다.
 */
Ext.define('mixin.Constant', {
	MAX_INT : Math.pow(2, 31) - 1, //C# max_int 2147483647이므로 -1
	
	stepCreate : 'I',
	stepUpdate : 'U',
	stepDelete : 'D',
	stepConfirm : 'F',
	stepDeleteForce : 'X',
	stepCopy : 'C',
	stepUndelete : 'R',
	stepApproval : 'A',
	stepRelease : 'E',
	stepCancelApproval : 'P',
	stepScrap : 'S',
	stepReturn : 'N',
	stepRegenerate : 'G',
	stepVersionUp : 'V',
	stepTerminate : 'M',
	stepTran : 'T',
	
	failStatus : '1',
	warnStatus : '2',
	trblStatus : '3',
	successStatus : '0',

	page : {
		pageSize : 20,
		maxSize : 10000 //最大数
	},
	
	cmf : {
        //CMF
		flow : "CMF_FLOW",
        material : "CMF_MATERIAL",
        operation : "CMF_OPER",
        step : "CMF_STEP",
        character : "CMF_CHARACTER",
        resource : "CMF_RESOURCE",
        colSet : "CMF_COL_SET",
        user : "CMF_USER",
        bomSet : "CMF_BOM_SET",
        recipe : "CMF_RECIPE",
        inspSet : "CMF_INSP_SET",
        chartSet : "CMF_CHART_SET",
        chart : "CMF_CHART",
        
        port : "CMF_PORT",
        carrier : "CMF_CARRIER",
        subresource : "CMF_SUBRESOURCE",
        order : "CMF_ORDER",
        part : "CMF_PART",
        label : "CMF_LABEL",
        queuetime : "CMF_QUEUETIME",
        service : "CMF_SERVICE",
        inputOperValue : "CMF_INPUT_OPER_VALUE",
        sproc : "CMF_SPROC",
        inspItem : "CMF_INSP_ITEM",
        
        lot : "CMF_LOT",
        sublot : "CMF_SUBLOT",
        
        trnAdapt : "CMF_TRN_ADAPT",
        trnBonus : "CMF_TRN_BONUS",
        trnLoss : "CMF_TRN_LOSS",
        trnCreate : "CMF_TRN_CREATE",
        trnStart : "CMF_TRN_START",
        trnEnd : "CMF_TRN_END",
        trnMove : "CMF_TRN_MOVE",
        trnSkip : "CMF_TRN_SKIP",
        trnRework : "CMF_TRN_REWORK",
        trnRepair : "CMF_TRN_REPAIR",
        trnRepairEnd : "CMF_TRN_REPAIR_END",
        trnLocalRepair : "CMF_TRN_LOCAL_REPAIR",
        trnSplit : "CMF_TRN_SPLIT",
        trnCombine : "CMF_TRN_COMBINE",
        trnMerge : "CMF_TRN_MERGE",
        trnHold : "CMF_TRN_HOLD",
        trnRelease : "CMF_TRN_RELEASE",
        trnShip : "CMF_TRN_SHIP",
        trnRecieve : "CMF_TRN_RECEIVE",
        trnAssembly : "CMF_TRN_ASSEMBLY",
        trnDisassemble : "CMF_TRN_DISASSEMBLE",
        trnReplace : "CMF_TRN_REPLACE",
        trnLotedc : "CMF_TRN_LOTEDC",
        trnEvent : "CMF_TRN_EVENT",
        trnTrouble : "CMF_TRN_TROUBLE",
        trnRmaOpen : "CMF_TRN_RMA_OPEN",
        trnRmaClose : "CMF_TRN_RMA_CLOSE",
        trnSort : "CMF_TRN_SORT",
        trnStore : "CMF_TRN_STORE",
        trnUnstore : "CMF_TRN_UNSTORE",
        trnTerminate : "CMF_TRN_TERMINATE",
        trnChangeCmf : "CMF_TRN_CHANGE_CMF",
        trnReserve : "CMF_TRN_RESERVE",
        trnUnreserve : "CMF_TRN_UNRESERVE",
        trnScribe : "CMF_TRN_SCRIBE",
        trnCv : "CMF_TRN_CV",
        trnRegenerate : "CMF_TRN_REGENERATE",
        trnStartStep : "CMF_TRN_START_STEP",
        trnEndStep : "CMF_TRN_END_STEP",

        //change port status
        trnChangePort : "CMF_TRN_CHANGE_PORT",
        trnCollectDft : "CMF_TRN_COLLECT_DFT",
        TrnCleanDft : "CMF_TRN_CLEAN_DFT",
        
        //Inventory CMF
        trnInInv : "CMF_TRN_IN_INV",
        trnOutInv : "CMF_TRN_OUT_INV",
        trnTransInv : "CMF_TRN_TRANS_INV",
        trnConvToLot : "CMF_TRN_CONV_TO_LOT",
        trnConvToInv : "CMF_TRN_CONV_TO_INV",
        trnConsume : "CMF_TRN_CONSUME",
        trnScrap : "CMF_TRN_SCRAP",
        
        trnQcmBatch : "CMF_TRN_QCM_BATCH",
        trnQcmResult : "CMF_TRN_QCM_RESULT",
        trnQcmFinal : "CMF_TRN_QCM_FINAL",
        trnQcmMerge : "CMF_TRN_QCM_MERGE",
        trnQcmSplit : "CMF_TRN_QCM_SPLIT",


        ruleRelation : "CMF_RULE_RELATION",
        ruleSeqKey : "CMF_RULE_SEQ_KEY"
    },
    /* CMF GROUP */
    grp : {
        //Group
        flow : "GRP_FLOW",
        material : "GRP_MATERIAL",
        operation : "GRP_OPER",
        step : "GRP_STEP",        
        character : "GRP_CHARACTER",
        resource : "GRP_RESOURCE",
        colSet : "GRP_COL_SET",
        user : "GRP_USER",
        event : "GRP_EVENT",
        bomSet : "GRP_BOM_SET",
        recipe : "GRP_RECIPE",
        inspSet : "GRP_INSP_SET",
        chart : "GRP_CHART",
        chartSet : "GRP_CHART_SET"
	},
	/*GCM Group Table*/
	gcmGrp : {
		 //System GCM Table
        messageGroup : "MESSAGE_GROUP",
        
      //Flow Group Table 1~10
        flow : "FLOW_GRP_",
      //Material Group Table 1~10
        material : "MATERIAL_GRP_",
      //Operation Group Table 1~10
        operation : "OPER_GRP_",
      //Step Group Table 1~10
        step : "STEP_GRP_",
      //Character Group Table 1~10
        char : "CHAR_GRP_",
      //Resource Group Table 1~10
        resource : "RES_GRP_",
      //Collection Set Group Table 1~10
        colSet : "COL_GRP_",
      //User Group Table 1~10
        user : "USER_GRP_",
      //Event Group Table 1~10
        event : "EVN_GRP_",
      //BOM Set Group Table 1~10
        bomSet : "BOM_GRP_",
        //Recipe Group Table 1~10
        recipe : "RECIPE_GRP_",
        //Inspection Set Group Table 1~10
        inspSet : "INSP_SET_GRP_",
        //SPC Chart Group Table 1~10
        chart : "CHT_GRP_",
        //SPC Chart Group Table 1~10
        chartSet : "CHTSET_GRP_"
	},
	/*TRAN CODE*/
	tranCode : {
		lotEdc : "LOTEDC"
	}
	
});