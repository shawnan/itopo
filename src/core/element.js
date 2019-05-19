
class Element {
    constructor() {
      
    }
  
    initialize() {
      this.elementType = 'element';
      this.serializedProperties = ['elementType'];
      this.propertiesStack = [];
      this._id = '' + (new Date).getTime();
    }
  
    distroy() {
  
    }
  
    removeHandler() {
    }
  
    /**
     * 
     * @param {*} key 
     * @param {*} name 
     */
    attr(key, name) {
      if (null != key && null != name) {
        this[key] = name;
      } else {
        if (null != key) {
          return this[key];
        }
      }
      return this;
    }
  
    save() {
      var suggestionToBeAdded = this;
      var res = {};
      this.serializedProperties.forEach(function (k) {
        res[k] = suggestionToBeAdded[k];
      });
      this.propertiesStack.push(res);
    }
  
    restore() {
      if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
        var ncfg = this;
        var cfg = this.propertiesStack.pop();
        this.serializedProperties.forEach(function (key) {
          ncfg[key] = cfg[key];
        });
      }
    }
  
    toJson() {
      var eventTypes = this;
      /** @type {string} */
      var typeModule = '{';
      var datesCount = this.serializedProperties.length;
      return this.serializedProperties.forEach(function (event, dateIndex) {
        var type = eventTypes[event];
        if ('string' == typeof type) {
          /** @type {string} */
          type = '"' + type + '"';
        }
        typeModule = typeModule + ('"' + event + '":' + type);
        if (datesCount > dateIndex + 1) {
          /** @type {string} */
          typeModule = typeModule + ',';
        }
      }), typeModule = typeModule + '}';
    }  
  }
  
  export default Element;
  
  