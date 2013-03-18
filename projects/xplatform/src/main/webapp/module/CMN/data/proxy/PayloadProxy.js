Ext.define('CMN.data.proxy.PayloadProxy', {
	extend : 'Ext.data.proxy.Ajax',
	alias : 'proxy.payload',

	doRequest : function(operation, callback, scope) {
		// buildRequest에서 params에 filter이 없을경우 store에 지정된 filter로 덮어쓰기전에 저장해둠.
		var paramFilter = '';
		var paramSort = '';
		var paramGroup = '';
		if (operation.params) {
			if (operation.params.extjsFilter) {
				paramFilter = Ext.clone(operation.params.extjsFilter);
			}

			if (operation.params.extjsSort) {
				paramSort = Ext.clone(operation.params.extjsSort);
			}

			if (operation.params.extjsGroup) {
				paramGroup = Ext.clone(operation.params.extjsGroup);
			}
		}

		var writer = this.getWriter(), request = this.buildRequest(operation, callback, scope);

		if (operation.allowWrite()) {
			request = writer.write(request);
		}

		// Filter local이고 설정한 params가 없을경우 자동으로 설정되는 store filter은
		// 삭제한다.(remoter이면 추가)
		if (operation.remoteFilter === false) {
			if (!paramFilter) {
				Ext.destroyMembers(request.params, 'extjsFilter');
			}
		}

		// Sort local이고 설정한 params가 없을경우 자동으로 설정되는 store filter은 삭제한다.(remoter이면
		// 추가)
		if (operation.remoteSort === false) {
			if (!paramSort) {
				Ext.destroyMembers(request.params, 'extjsSort');
			}
		}

		// Group local이고 설정한 params가 없을경우 자동으로 설정되는 store filter은
		// 삭제한다.(remoter이면 추가)
		if (operation.remoteGroup === false) {
			if (!paramGroup) {
				Ext.destroyMembers(request.params, 'extjsGroup');
			}
		}

		// TreeStore에서 임의로 넘어가는 node값 제거
		Ext.destroyMembers(request.params, 'node');
		var params = request.params;
		Ext.destroyMembers(request, 'params');

		//  json 형식의 string값으로 변환되어 넘어온값을 object으로 변환함.
		if(typeof(params.extjsFilter) == 'string')
			params.extjsFilter = Ext.JSON.decode(params.extjsFilter);
		if(typeof(params.extjsSort) == 'string')
			params.extjsSort = Ext.JSON.decode(params.extjsSort);
		if(typeof(params.extjsGroup) == 'string')
			params.extjsGroup = Ext.JSON.decode(params.extjsGroup);
				
		// params -> jsonData 형식으로 전송(rRequest-Payload 방식을 사용하여 request 하기위해
		// 변경한다.)
		Ext.apply(request, {
			headers : this.headers,
			timeout : this.timeout,
			scope : this,
			callback : this.createRequestCallback(request, operation, callback, scope),
			method : this.getMethod(request),
			disableCaching : false, //explicitly set it to false, ServerProxy handles caching
			jsonData : params // rRequest-Payload 형식의 parameter 추가
		});
		
		Ext.Ajax.request(request);

		return request;
	}
});