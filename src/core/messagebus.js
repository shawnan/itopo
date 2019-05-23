class MessageBus {
  /**
   * 
   * @param {*} name 
   */
  constructor(name) {
    this.name = name;
    this.messageMap = {};
    this.messageCount = 0;
    this.arrayHandler();
  }

  subscribe(subscribeId, callback) {
    let currentSubscribe = this.messageMap[subscribeId];
    if (!currentSubscribe) {
      this.messageMap[subscribeId] = [];
    }
    this.messageMap[subscribeId].push(callback);
    this.messageCount++;
  }

  unsubscribe(subscribeId) {
    let item = this.messageMap[subscribeId];
    if (item) {
      this.messageMap[subscribeId] = null;
      delete this.messageMap[subscribeId];
      this.messageCount--;
    }
  }
  
  /**
   * 发布
   * @param {*} subscribeId 
   * @param {*} callback 
   * @param {*} isAsync 是否异步，异步10毫秒秒执行方法调用（多线程异步处理）否则直接执行调用
   */
  publish(subscribeId, callback, isAsync) {
    let item = this.messageMap[subscribeId];
    if (null != item) {
      for (let i = 0; i < item.length; i++) {
        if (isAsync) {
          (function (receiveFunc, connector) {
            setTimeout(function () {
              receiveFunc(connector);
            }, 10);
          })(item[i], callback);
        } else {
          item[i](callback);
        }
      }
    }
  }
}

export default MessageBus;