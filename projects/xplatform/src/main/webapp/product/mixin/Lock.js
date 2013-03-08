/*
 * Mixin Lock은 동기화된 처리를 위한 방법을 제공한다.
 * TODO 단위테스트 코드 작성.
 * 예시.		
 * - 아래 예시는 모든 Lock된 Function들이 처리된 다음에, ready에 등록한 Function이 실행되는 것을 보장한다.
		// 1. Lock 객체를 생성한다.
		var lock = SF.createLock();
		
		// 2. Array 형태의 대상에 대해서, 순차적으로 Lock을 적용하여 처리할 수 있다.
		lock.each([1, 2, 3, 4, 5], function(n, l) {
			setTimeout(function() {
				Ext.log(n);
				l.release();
			}, 1000);
		});

		// 3. 개별 Function에 대해서 Lock을 적용할 수 있다.
		lock.lock();
		setTimeout(function() {
			Ext.log('3000');
			lock.release();
		}, 3000);
		
		// 4. 앞에서 적용된 Lock이 모두 릴리즈 되는 시점에 처리될 Function은 ready 메쏘드에 등록한다.
		lock.ready(function() {
			Ext.log('Executed');
		});

 */

Ext.define('mixin.Lock', function() {
	function Lock() {
		this.count = 0;
		this.valid = true;
	}

	Lock.prototype.invalidate = function() {
		this.valid = false;
	};

	Lock.prototype.lock = function() {
		if (!this.valid)
			return;

		this.count++;
	};

	/*
	 * Lock.release(..) Lock을 release 시키면서, 계속 진행할 것인지 또는, 더 이상 진행하지 않을 것인지를
	 * argument로 결정할 수 있다.
	 */
	Lock.prototype.release = function(keepGoing) {
		if (!this.valid)
			return;

		if (keepGoing === false) {
			if (this.doneFn)
				this.doneFn();
			this.invalidate();

			return;
		}

		this.count = this.count - 1;
		if (0 < this.count)
			return;

		try {
			if (this.readyFn) {
				this.readyFn();
			}
		} finally {
			if (this.doneFn) {
				this.doneFn();
			}
		}
	};

	/*
	 * Lock release(true/false)에 관계없이 항상 실행되는 로직. ready()에 등록된 function이 실행된 후에
	 * 실행된다.
	 */
	Lock.prototype.done = function(fn, scope, args) {
		if (!this.valid)
			return;

		this.doneFn = function() {
			fn.apply(scope || this, args || []);
		};
	};

	/*
	 * Lock release(false)인 경우에는 실행되지 않는 로직임.
	 */
	Lock.prototype.ready = function(fn, scope, args) {
		if (!this.valid)
			return;

		if (this.count > 0) {
			this.readyFn = function() {
				fn.apply(scope || this, args || []);
			};

			return;
		}

		try {
			fn.apply(scope || this, args || []);
		} finally {
			if (this.doneFn)
				this.doneFn();
		}
	};

	Lock.prototype.reset = function() {
		this.count = 0;
		this.valid = true;

		delete this.readyFn;
		delete this.doneFn;
	};

	Lock.prototype.each = function(array, fn, scope, args) {
		if (!this.valid)
			return;

		this.lock();
		if (array.length === 0) {
			this.release();
			return;
		}

		var lock = new Lock();
		lock.lock();

		try {
			fn.call(scope || this, array[0], lock, args || []);
		} finally {
			/*
			 * fn 내에서 바로 lock.release(false) 한 경우에 대한 처리.
			 */
			if (!lock.valid) {
				this.release();
				return;
			}
		}

		var self = this;
		lock.done(function() {
			self.release();
		});

		lock.ready(function() {
			self.each(array.slice(1), fn, scope, args);
		}, this, args);
	};

	return {
		createLock : function() {
			return new Lock();
		}
	};
}());
