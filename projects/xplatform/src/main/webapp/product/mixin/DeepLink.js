Ext.define('mixin.DeepLink', function(){
	function getKeys() {
		return this._keys;
	}

	/*
	 * 브라우저 히스토리로 인식될 사용자 화면에게 데이타의 Key가 변경되었음을 알려주는 메쏘드이다.
	 * silent 파라미터는 화면의 Key는 변경하되, 브라우저 히스토리는 추가하지 말 것을 알려주는 것으로, 디폴트는 false 이다.
	 * Key가 실제로 변경되지 않았다고 하더라도, setKeys 메쏘드가 호출되면, keychange 이벤트가 발생한다.
	 * 
	 * FIXME 혹시 실제로 키가 변경된 경우에만 이벤트가 호출되어야 한다면..
	 * if(Ext.JSON.encode(this.getKeys()) !== Ext.JSON.encode(keys)) { ... } 으로 확인 후 발생토록 한다. 
	 */
	function setKeys(keys, silent) {
		this._keys = keys;
		
		this.fireEvent('keychange', this, keys);

		if(!silent)
			SF.history.add(this, keys);
	}
	
	return {
		getKeys : getKeys,
		setKeys : setKeys
	};
}());
