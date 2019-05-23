
class Util {
  constructor() {

  }

  /**
   * 计算距离，两种传参方式：1、a和b为两个坐标对象；2、a、b、x、y为2个坐标值。
   * @param {*} a 
   * @param {*} b 
   * @param {*} x 
   * @param {*} y 
   */
  static getDistance(a, b, x, y) {
    let i;
    let j;

    if (null == x && null == y) {
      i = b.x - a.x
      j = b.y - a.y;
    } else {
      i = x - a;
      j = y - b;
    }

    return Math.sqrt(i * i + j * j)
  }

  /**
   * 计算区域大小
   * @param {*} array 
   */
  static getElementsBound(array) {
    let bbox = {
      left: Number.MAX_VALUE,
      right: Number.MIN_VALUE,
      top: Number.MAX_VALUE,
      bottom: Number.MIN_VALUE
    };

    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if (!(item instanceof JTopo.Link)) {
        if (bbox.left > item.x) {
          bbox.left = item.x;
          bbox.leftNode = item;
        }
        if (bbox.right < item.x + item.width) {
          bbox.right = item.x + item.width;
          bbox.rightNode = item;
        }
        if (bbox.top > item.y) {
          bbox.top = item.y;
          bbox.topNode = item;
        }
        if (bbox.bottom < item.y + item.height) {
          bbox.bottom = item.y + item.height;
          bbox.bottomNode = item;
        }
      }
    }

    bbox.width = bbox.right - bbox.left;
    bbox.height = bbox.bottom - bbox.top;
    return  bbox;
  }

  /**
   * 获取鼠标在页面的坐标
   * @param {*} event 
   */
  static mouseCoords(event) {
    event = cloneEvent(event);

    if (!event.pageX) {
      event.pageX = event.clientX + document.body.scrollLeft - document.body.clientLeft;
      event.pageY = event.clientY + document.body.scrollTop - document.body.clientTop;
    }

    return event;
  }

  /**
   * 克隆事件
   * @param {*} event 
   */
  static cloneEvent(event) {
    let result = {};
    for (let attr in event) {
      if ('returnValue' != attr && 'keyLocation' != attr) {
        result[attr] = evt[attr];
      }
    }

    return result;
  }

  /**
   * 获取事件位置
   * @param {*} event
   */
  static getEventPosition(event) {
    return mouseCoords(event);
  }

  /**
   * 指针旋转
   * @param {*} x1 
   * @param {*} y1 
   * @param {*} x2 
   * @param {*} y2 
   * @param {*} theta 
   */
  static rotatePoint(x1, y1, x2, y2, theta) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    let distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    let angle = Math.atan2(yDistance, xDistance) + theta;

    return {
      x: x1 + Math.cos(angle) * distance,
      y: y1 + Math.sin(angle) * distance
    };
  }

  /**
   * 批量指针旋转
   *
   */
  static rotatePoints(crop, data, angle) {
    let points = [];
    for (let i= 0; i < data.length; i++) {
      let point = rotatePoint(crop.x, crop.y, data[i].x, data[i].y, angle);
      points.push(p);
    }

    return points;
  }

  /**
   * 递归循环遍历
   * arr数组，输入内是参数
   * fun是要执行的方法
   * debounceDuration是时间间隔
   */
  static $foreach(arr, fun, debounceDuration) {
    function cycle(index) {
      if (index != arr.length) {
        fun(arr[index]);
        setTimeout(function () {
          cycle(++index);
        }, debounceDuration);
      }
    }

    if (0 != arr.length) {
      cycle(0);
    }
  }

  /**
   * 递归循环遍历（指定遍历）
   * startIndex 开始的index
   * endIndex 结束的index，同时是fun方法的参数
   * fun 循环调用的方法
   * debounceDuration 是时间间隔
   */
  static $for(startIndex, endIndex, fun, debounceDuration) {
    function cycle(index) {
      if (index != endIndex) {
        fun(endIndex);
        setTimeout(function () {
          cycle(++index);
        }, debounceDuration);
      }
    }
    if (startIndex <= endIndex) {
      cycle(0);
    }
  }

  /**
   * 克隆对象，浅克隆
   */
  static clone(oldObj) {
    let newObj = {};

    for (let prop in oldObj) {
      newObj[prop] = oldObj[prop];
    }

    return newObj;
  }

  /**
   * 点是否在矩形中
   * @param {*} rect 
   * @param {*} point 
   */
  static isPointInRect(rect, point) {
    let x = point.x;
    let y = point.y;
    let width = point.width;
    let height = point.height;
    return rect.x > x && rect.x < x + width && rect.y > y && rect.y < y + height;
  }

  /**
   * 点是否在线上
   * @param {*} point 要测量的点
   * @param {*} line1 线段端点1
   * @param {*} line2 线段端点2
   */
  static isPointInLine(point, linePoint1, linePoint2) {
    let lineLength = JTopo.util.getDistance(linePoint1, linePoint2);
    let distance1 = JTopo.util.getDistance(linePoint1, point);
    let distance2 = JTopo.util.getDistance(linePoint2, point);
    return Math.abs(distance1 + distance2 - lineLength) <= 0.5;
  }

  /**
   * 从数组arr中移除第一个item元素并返回
   */
  static removeFromArray(arr, item) {
    for (let k = 0; k < arr.length; k++) {
      let curr = arr[k];
      if (curr === item) {
        arr = arr.del(k);
        break;
      }
    }

    return curr;
  }

  /**
   * 随机颜色
   */
  static randomColor() {
    return Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random());
  }

  /**
   * 两个矩形框是否有交集
   */
  static isIntsect() {

  }

  /**
   * 获得obj对象中属性arr数组里面所有属性的属性值，以逗号分隔
   */
  static getProperties(obj, arr) {
    let result = '';
    let val = null;
    for (let i = 0; i < arr.length; i++) {
      if (i > 0) {
        result = result + ',';
      }
      val = obj[arr[i]];
      if ('string' == typeof val) {
        val = '"' + val + '"';
      } else {
        if (void 0 == val) {
          val = null;
        }
      }
      result = result + (arr[i] + ":" + val);
    }

    return result;
  }

  /**
   * 根据 json数据、canvas对象
   * 反序列化 舞台、场景、节点元素
   */
  static loadStageFromJson(json, canvas) {
    let obj = eval(json);
    let stage = new JTopo.Stage(canvas);
    for (let attr in stageObj) {
      if ('scenes' != attr ) {
        stage[attr] = obj[attr];
      } else {
        let scenes = obj.scenes;
        for (let i = 0; i < scenes.length; i++) {
          let sceneObj = scenes[i];
          let scene = new JTopo.Scene(stage);
          for (let sceneAttr in sceneObj) {
            if ('elements' != sceneAttr) {
              scene[sceneAttr] = sceneObj[sceneAttr];
            } else {
              let nodeMap = {};
              let elements = sceneObj.elements;
              for (let m = 0; m < elements.length; m++) {
                let elementObj = elements[m];
                let type = elementObj.elementType;
                let element;
                if ('Node' == type) {
                  element = new JTopo.Node;
                }

                for (let elementAttr in elementObj) {
                  element[elementAttr] = elementObj[elementAttr];
                }

                nodeMap[element.text] = element;
                scene.add(element);
              }
            }
          }
        }
      }
    }

    console.log(stage)
    return stage;
  }

  /**
   * 舞台对象转json
   */
  static toJson(options) {
    var attrStr = 'backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll'.split(',');
    var contextStr = 'text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY'.split(',');
    var s = '{';
    s = s + ('frames:' + options.frames);
    s = s + ', scenes:[';
    for (let index = 0; index < options.childs.length; index++) {
      let item = options.childs[index];
      s = s + '{';
      s = s + getProperties(item, attrStr);
      s = s + ', elements:[';
      for (let i = 0; i < item.childs.length; i++) {
        let value = item.childs[i];
        if (i > 0) {
          s = s + ',';
        }
        s = s + '{';
        s = s + getProperties(value, contextStr);
        s = s + '}';
      }
      s = s + ']}';
    }

    return s = s + ']', s = s + '}';
  }

  /**
   * 改变颜色
   * ctx是临时画布对象canvas只为了获取canvas.getContext("2d")以方便调用HTML5图形处理方法
   * tagetElement是目标元素
   * rgbValue1 是第一位颜色rgb数字
   * rgbValue2 是第二位颜色rgb数字
   * rgbValue3 是第三位颜色rgb数字
   */
  static changeColor(ctx, tagetElement, rgbValue1, rgbValue2, rgbValue3) {
    let width = canvas.width = tagetElement.width;
    let height = canvas.height = tagetElement.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tagetElement, 0, 0);
    let imageData = ctx.getImageData(0, 0, tagetElement.width, tagetElement.height);
    let buf = imageData.data;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        var palette_offset = 4 * (x + y * width);
        if (0 != buf[palette_offset + 3]) {
          if (null != rgbValue1) {
            buf[palette_offset + 0] += rgbValue1;
          }
          if (null != rgbValue2) {
            buf[palette_offset + 1] += rgbValue2;
          }
          if (null != rgbValue3) {
            buf[palette_offset + 2] += rgbValue3;
          }
        }
      }
    }
    ctx.putImageData(data, 0, 0, 0, 0, tagetElement.width, tagetElement.height);
    var m = canvas.toDataURL();
    alarmImageCache[tagetElement.src] = m;
    return m;
  }

  /**
   * 生成告警图片
   * imageObj: 图片对象
   * rgbValue1 是第一位颜色rgb数字
   */
  static genImageAlarm(imageObj, rgbValue1) {
    if (null == rgbValue1) {
      rgbValue1 = 255;
    }

    try {
      if (alarmImageCache[imageObj.src]) {
        return alarmImageCache[imageObj.src];
      }

      let img = new Image;
      img.src = changeColor(graphics, imageObj, rgbValue1);
      alarmImageCache[imageObj.src] = img;
      return img;
    } catch (d) {
    }

    return null;
  }

  /**
   * 获取element相对于当前窗口的位置
   * @param {} element 
   */
  static getOffsetPosition(element) {
    if (!element) {
      return {
        left: 0,
        top: 0
      };
    }

    let offsetTopValue = 0;
    let regExBonusMultiplier = 0;
    if ('getBoundingClientRect' in document.documentElement) {
      let anchorBoundingBoxViewport = element.getBoundingClientRect();
      let doc = element.ownerDocument;
      let body = doc.body;
      let docElem = doc.documentElement;
      let b = docElem.clientTop || body.clientTop || 0;
      let CommentMatchPenalty = docElem.clientLeft || body.clientLeft || 0;
      offsetTopValue = anchorBoundingBoxViewport.top + (self.pageYOffset || docElem && docElem.scrollTop || body.scrollTop) - b;
      regExBonusMultiplier = anchorBoundingBoxViewport.left + (self.pageXOffset || docElem && docElem.scrollLeft || body.scrollLeft) - CommentMatchPenalty;
    } else {
      do {
        offsetTopValue = offsetTopValue + (element.offsetTop || 0);
        regExBonusMultiplier = regExBonusMultiplier + (element.offsetLeft || 0);
        element = element.offsetParent;
      } while (element);
    }

    return {
      left: regExBonusMultiplier,
      top: offsetTopValue
    };
  }

  /**
   * 将坐标数据转换为连线函数y=b+kx;（k是斜率 x是横坐标 y是纵坐标 b是初始纵坐标）对象
   * */
  static lineF(x1, y1, x2, x2) {
    function result(x1) {
      return x1 * k + t;
    }
    let k = (y2 - y1) / (x2 - x1);
    let t = y1 - x1 * k;
    result.k = k;
    result.b = t;
    result.x1 = x1;
    result.x2 = x2;
    result.y1 = y1;
    result.y2 = y2
    return result;
  }

  /**
   * 值value是否在valueA，valueB之间
   */
  static inRange(value, valueA, valueB) {
    let range = Math.abs(valueA - valueB);
    let distance1 = Math.abs(valueA - value);
    let distance2 = Math.abs(valueB - value);
    let result = Math.abs(range - (distance1 + distance2));
    return 1e-6 > result ? true : false;
  }

  /**
   * 点是否在线段上
   */
  static isPointInLineSeg(x, y, lineObj) {
    return inRange(x, lineObj.x1, lineObj.x2) && inRange(y, lineObj.y1, lineObj.y2);
  }

  /**
   * 计算两条线段的交叉点，不存在则返回null
   */
  static intersection(lineObj1, lineObj2) {
    let xValue = null;
    let yValue = null;

    if (lineObj1.k == lineObj2.k) {
      return null;
    }

    if (1 / 0 == lineObj1.k || lineObj1.k == -1 / 0) {
      xValue = lineObj1.x1;
      yValue = lineObj2(lineObj1.x1)
    } else if (1 / 0 == lineObj2.k || lineObj2.k == -1 / 0) {
      xValue = lineObj2.x1;
      yValue = lineObj1(lineObj2.x1)
    } else {
      xValue = (lineObj2.b - lineObj1.b) / (lineObj1.k - lineObj2.k);
      yValue = lineObj1(xValue)
    }

    if (0 == isPointInLineSeg(xValue, yValue, lineObj1)) {
      return null;
    }

    if (0 == isPointInLineSeg(xValue, yValue, lineObj2)) {
      return null;
    }

    return {
      x: xValue,
      y: yValue
    }
  }

  /**
   * 交叉线的绑定
   * a是线对象
   * b是图形元素对象
   * 验证线a与图形b的哪一个位置相交
   * 验证优先级依次是左边线 上边线 右边线 下边线
   * 存在相交点时 返回相交点坐标否则返回null
   */
  static intersectionLineBound(element, lineObj) {
    let lineFun = JTopo.util.lineF(lineObj.left, lineObj.top, lineObj.left, lineObj.bottom);
    let point = JTopo.util.intersection(belement, lineFun);

    if (null != point) {
      return point;
    }

    lineFun = JTopo.util.lineF(lineObj.left, lineObj.top, lineObj.right, lineObj.top);
    point = JTopo.util.intersection(b, i);

    if (null != point) {
      return point;
    }

    i = JTopo.util.lineF(lineObj.right, lineObj.top, lineObj.right, lineObj.bottom)
    point = JTopo.util.intersection(b, i)

    if (null != point) {
      return point;
    }

    i = JTopo.util.lineF(lineObj.left, lineObj.bottom, lineObj.right, lineObj.bottom);
    point = JTopo.util.intersection(b, i)

    return point;
  }

  /**
   * 两个数组处理方法
   */
  static init() {
    /**
     * requestAnimationFrame是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用
     * 采用系统时间间隔，保持最佳绘制效率
     */
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (_nextEventFunc) {
      setTimeout(_nextEventFunc, 1e3 / 24);
    }
    
    /**
     * 根据下标删除数组元素
     */
    Array.prototype.del = function (idx) {
      if ("number" != typeof idx) {
        /** @type {number} */
        var i = 0;
        for (; i < this.length; i++) {
          if (this[i] === idx) {
            return this.slice(0, i).concat(this.slice(i + 1, this.length));
          }
        }
        return this;
      }
      return 0 > idx ? this : this.slice(0, idx).concat(this.slice(idx + 1, this.length));
    };

    /**
     * 扩展组数对象（不存在才扩展，处理兼容性） indexOf获得指定元素数组下标
     * a是数组元素
     * 存在返回下标 否则返回-1
     */
    if (![].indexOf) {
      Array.prototype.indexOf = function (item) {
        /** @type {number} */
        var i = 0;
        for (; i < this.length; i++) {
          if (this[i] === item) {
            return i;
          }
        }
        return -1;
      };
    }
    
    /**
     * window对象下控制台属性定义（不存在才定义，处理兼容性）
     */
    if (!window.console) {
      window.console = {
        log: function () {
        },
        info: function () {
        },
        debug: function () {
        },
        warn: function () {
        },
        error: function () {
        }
      };
    }
  }
}

Util.isFirefox = navigator.userAgent.indexOf("Firefox") > 0;
Util.isIE = !(!window.attachEvent || -1 !== navigator.userAgent.indexOf("Opera"));
Util.isChrome = null != navigator.userAgent.toLowerCase().match(/chrome/);

Util.init();
window.$for = Util.$for;
window.$foreach = Util.$foreach;

export default Util;