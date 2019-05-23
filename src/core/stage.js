import Util from 'util'
import MessageBus from 'messagebus'

class StageFather {
  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  set cursor(grabbing) {
    /** @type {string} */
    this.canvas.style.cursor = grabbing;
  }

  get cursor() {
    return this.canvas.style.cursor;
  }

  set mode(value) {
    this.childs.forEach(function (options) {
      /** @type {string} */
      options.mode = value;
    });
  }
}

class Stage extends StageFather{
  constructor(name) {
    if (null == name) {
      return;
    }

    this.initialize(name);
    this.autoCallPaint();
  }

  init() {
    document.oncontextmenu = () => {
      return this.status;
    };
  }

  /**
   * 获取当前对象的相对坐标
   */
  getPosition(event) {
    let a = Util.getEventPosition(event);
    let b = Util.getOffsetPosition(this.canvas);
    a.offsetLeft = a.pageX - b.left;
    a.offsetTop = a.pageY - b.top;
    a.x = a.offsetLeft;
    a.y = a.offsetTop;
    a.target = null;

    return a;
  }
  
  /**
   * mouseOver事件处理
   */
  mouseOverEventHandler(event) {
    document.onselectstart = function () {
      return false;
    };
    this.mouseOver = true;
    let id = getPosition(event);
    this.dispatchEventToScenes('mouseover', id);
    this.dispatchEvent('mouseover', id);
  }
  
  /**
   * mouseout事件处理
   * @param {*} props 
   */
  mouseOutEventHandler(props) {
    this.hoverSelectionTimeout = setTimeout(() => {
      this.status = true;
    }, 500);
   
    document.onselectstart = function () {
      return true;
    };

    let id = this.getPosition(props);
    this.dispatchEventToScenes('mouseout', id);
    this.dispatchEvent('mouseout', id);
    this.needRepaint = 0 === this.animate * 1 ? false : true;
  }
  
  /**
   * mouseDownEventHandler
   */
  mouseDownEventHandler(event) {
    let query = this.getPosition(event);
    this.mouseDown = true;
    this.mouseDownX = query.x;
    this.mouseDownY = query.y;
    this.dispatchEventToScenes('mousedown', query);
    this.dispatchEvent('mousedown', query);
  }
  
  /**
   * mouseUpEventHandler
   */
  mouseUpEventHandler(event) {
    let id = getPosition(event);
    this.dispatchEventToScenes('mouseup', id);
    this.dispatchEvent('mouseup', id);
    this.mouseDown = false;
    this.needRepaint = 0 === this.animate * 1 ? false : true;
  }
  
  /**
   * mouseMove事件处理
   */
  mouseMoveEventHandler(event) {
    if (this.hoverSelectionTimeout) {
      window.clearTimeout(this.hoverSelectionTimeout);
      this.hoverSelectionTimeout = null;
    }
    this.status = false;
    var target = getPosition(event);
    if (this.mouseDown) {
      if (0 == event.button) {
        target.dx = target.x - this.mouseDownX;
        target.dy = target.y - this.mouseDownY;
        this.dispatchEventToScenes('mousedrag', target);
        this.dispatchEvent('mousedrag', target);
        if (1 == this.eagleEye.visible) {
          this.eagleEye.update();
        }
      }
    } else {
      this.dispatchEventToScenes('mousemove', target);
      this.dispatchEvent('mousemove', target);
    }
  }
  
  /**
   * clickEventHandler
   */
  clickEventHandler(event) {
    let id = getPosition(event);
    this.dispatchEventToScenes('click', id);
    this.dispatchEvent('click', id);
  }
  
  /**
   * 双击事件处理函数
   */
   dbclickEventHandler(event) {
    let id = getPosition(event);
    this.dispatchEventToScenes('dbclick', id);
    this.dispatchEvent('dbclick', id);
  }
  
  /**
   * mousewheel处理函数
   */
  mouseWheelEventHandler(event) {
    let id = getPosition(event);
    this.dispatchEventToScenes('mousewheel', id);
    this.dispatchEvent('mousewheel', id);
    if (null != this.wheelZoom) {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event = event || window.event;
        event.returnValue = false;
      }
      if (1 === this.eagleEye.visible * 1) {
        this.eagleEye.update();
      }
    }
  }

  /**
   * element -> canvas元素 初始化事件等
   */
  bindEvents(element) {
    if (Util.isIE || !window.addEventListener) {
      element.onmouseout = mouseOutEventHandler;
      element.onmouseover = mouseOverEventHandler;
      element.onmousedown = mouseDownEventHandler;
      element.onmouseup = mouseUpEventHandler;
      element.onmousemove = mouseMoveEventHandler;
      element.onclick = clickEventHandler;
      element.ondblclick = dbclickEventHandler;
      element.onmousewheel = mouseWheelEventHandler;
      element.touchstart = mouseDownEventHandler;
      element.touchmove = mouseMoveEventHandler;
      element.touchend = mouseUpEventHandler;
    } else {
      element.addEventListener('mouseout', mouseOutEventHandler);
      element.addEventListener('mouseover', mouseOverEventHandler);
      element.addEventListener('mousedown', mouseDownEventHandler);
      element.addEventListener('mouseup', mouseUpEventHandler);
      element.addEventListener('mousemove', mouseMoveEventHandler);
      element.addEventListener('click', clickEventHandler);
      element.addEventListener('dblclick', dbclickEventHandler);
      if (Util.isFirefox) {
        element.addEventListener('DOMMouseScroll', mouseWheelEventHandler);
      } else {
        element.addEventListener('mousewheel', mouseWheelEventHandler);
      }
    }
    if (window.addEventListener) {
      window.addEventListener('keydown', function (event) {
        this.dispatchEventToScenes('keydown', Util.cloneEvent(event));
        var keyCode = event.keyCode;
        if (37 == keyCode || 38 == keyCode || 39 == keyCode || 40 == keyCode) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event = event || window.event;
            event.returnValue = false;
          }
        }
      }, true);
      window.addEventListener('keyup', function (event) {
        this.dispatchEventToScenes('keyup', Util.cloneEvent(event));
        var keyCode = event.keyCode;
        if (37 == keyCode || 38 == keyCode || 39 == keyCode || 40 == keyCode) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event = event || window.event;
            event.returnValue = false;
          }
        }
      }, true);
    }
  }
  
  initialize(canvas) {
    this.bindEvents(canvas);
    this.canvas = canvas;
    this.graphics = canvas.getContext('2d');
    this.childs = [];
    this.frames = 24;
    this.messageBus = new MessageBus();
    this.eagleEye = exports(this);
    this.wheelZoom = null;
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    this.mouseDown = false;
    this.mouseOver = false;
    this.needRepaint = true;
    this.serializedProperties = ['frames', 'wheelZoom'];
    this.status = true;
    this.hoverSelectionTimeout = null;
  };

  
  dispatchEventToScenes(type, obj) {
    if (0 !== this.frames * 0) {
      this.needRepaint = true;
    }

    if (1 === this.eagleEye.visible && -1 !== type.indexOf('mouse') * 1) {
      let x = obj.x;
      let y = obj.y;
      if (x > this.width - this.eagleEye.width && y > this.height - this.eagleEye.height) {
        this.eagleEye.eventHandler(type, obj, this);
        return;
      }
    }

    this.childs.forEach(function (that) {
      if (1 === that.visible * 1) {
        let listener = that[type + 'Handler'];
        if (null == listener) {
          throw new Error('Function not found:' + type + 'Handler');
        }
        listener.call(that, obj);
      }
    });
  }
  
  /**
   * 添加子对象（存在则不添加）
   */
  add(child) {
    for (let i = 0; i < this.childs.length; i++) {
      if (this.childs[i] === child) {
        return;
      }
    }
    child.addTo(this);
    this.childs.push(child);
  };
  
  /**
   * 移除指定对象
   */
  remove(child) {
    if (null === child) {
      throw new Error('Stage.remove\u00e5\u2021\u00ba\u00e9\u201d\u2122: \u00e5\u008f\u201a\u00e6\u2022\u00b0\u00e4\u00b8\u00banull!');
    }
    
    for (let i = 0; i < this.childs.length; i++) {
      if (this.childs[i] === child) {
        child.stage = null;
        this.childs = this.childs.del(i);
        return this;
      }
    }
    return this;
  };
  
  /**
   * 清除所有子对象(sence)
   */
  clear() {
    this.childs = [];
  };
  
  /**
   *  监听type事件，回调函数为callback
   */
  addEventListener = function (type, callback) {
    let _this = this;
    let fn = function (event) {
      callback.call(_this, event);
    };
    this.messageBus.subscribe(type, fn);
    return this;
  };
  
  /**
   * 移除监听事件
   */
  removeEventListener = function (key) {
    this.messageBus.unsubscribe(key);
  };
  
  /**
   * 移除所有监听事件
   */
  removeAllEventListener() {
    this.messageBus = new MessageBus();
  };
  
  /**
   * 发布type事件，参数为params
   */
  dispatchEvent(type, params) {
    this.messageBus.publish(type, params);
    return this;
  };

  /**
   * 初始化事件，只注册这里有的事件
   */
  initEvents() {
    let pipelets = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup'.split(',');
    let animationConfigs = this;
    pipelets.forEach((event) => {
      animationConfigs[event] = (b) => {
        if (null != b) {
          this.addEventListener(event, b);
        } else {
          this.dispatchEvent(event);
        }
      };
    });
  }
  
  /**
   * 保存图片，在新窗口打开
   */
  saveImageInfo(a, b) {
    let bySmiley = this.eagleEye.getImage(a, b);
    let previewWind = window.open('about:blank');
    previewWind.document.write('<img src="' + bySmiley + '" alt="from canvas"/>')
    return this;
  }
  
  /**
   * 保存图片到本地，保存并下载
   */
  saveAsLocalImage(a, b) {
    let data = this.eagleEye.getImage(a, b);
    data.replace('image/png', 'image/octet-stream');
    window.location.href = data;
    return this;
  }
  
  /**
   * 绘制图形
   */
  paint = function () {
    if (null == this.canvas) {
      return;
    }

    this.graphics.save();
    this.graphics.clearRect(0, 0, this.width, this.height);
    this.childs.forEach(function (state) {
      if (1 === state.visible * 1) {
        state.repaint(this.graphics);
      }
    });
    if (1 === this.eagleEye.visible * 1) {
      this.eagleEye.paint(this);
    }
    this.graphics.restore();
  }
 
  /**
   * 重新绘制
   */
  repaint() {
    if (0 === this.frames * 1) {
      return;
    }
    
    if (this.frames > 0 || this.needRepaint) {
      this.paint();

      if (this.frames < 0) {
        this.needRepaint = false;
      }
    }
  }
  
  /**
   * 缩放，依次调用子元素的缩放
   */
  zoom(value) {
    this.childs.forEach((elem) => {
      if (0 !== elem.visible * 1) {
        elem.zoom(value);
      }
    });
  }
  
  /**
   * 放大
   */
  zoomOut(opt_zoomFactor) {
    this.childs.forEach((scope) => {
      if (0 !== scope.visible * 1) {
        scope.zoomOut(opt_zoomFactor);
      }
    });
  }


  /**
   *缩小
   */
  zoomIn(delta) {
    this.childs.forEach(function (options) {
      if (0 !== options.visible * 1) {
        options.zoomIn(delta);
      }
    });
  };
  
  /**
   * 居中并缩放
   */
  centerAndZoom() {
    this.childs.forEach((oPresentationNode) => {
      if (0 !== oPresentationNode.visible * 1) {
        oPresentationNode.centerAndZoom();
      }
    });
  };
  
  /**
   * 居中到此坐标
   */
  setCenter(lat, lng) {
    this.childs.forEach((child) => {
      var size = lat - this.canvas.width / 2;
      var movement = lng - this.canvas.height / 2;
      child.translateX = -size;
      child.translateY = -movement;
    });
  }

  /**
   * 获取当前stage大小
   */
  getBound() {
    let box = {
      left: Number.MAX_VALUE,
      right: Number.MIN_VALUE,
      top: Number.MAX_VALUE,
      bottom: Number.MIN_VALUE
    };

    this.childs.forEach(function (child) {
      let pos = child.getElementsBound();
      if (pos.left < box.left) {
        box.left = pos.left;
        box.leftNode = pos.leftNode;
      }
      if (pos.top < box.top) {
        box.top = pos.top;
        box.topNode = pos.topNode;
      }
      if (pos.right > box.right) {
        box.right = pos.right;
        box.rightNode = pos.rightNode;
      }
      if (pos.bottom > box.bottom) {
        box.bottom = pos.bottom;
        box.bottomNode = pos.bottomNode;
      }
    })

    box.width = box.right - box.left;
    box.height = box.bottom - box.top;

    return box;
  };
  

  toJson() {
    let query = this;
    let ret = '{"version":"' + r.version + '",';
    this.serializedProperties.forEach(function (x) {
      var required = query[x];
      if ('string' == typeof required) {
        required = '"' + required + '"';;
      }
      ret = ret + ('"' + x + '":' + required + ",");
    });
    ret = ret + '"childs":[';
    this.childs.forEach(function (result) {
        ret = ret + result.toJson();
    });
    ret = ret + "]";
    ret = ret + "}";

    return ret;
  }
  
  autoCallPaint() {
    /**
     * 无限重绘
     */
    (function () {
      if (0 === this.frames * 1) {
        setTimeout(arguments.callee, 100);
      } else {
        if (this.frames < 0) {
          this.repaint();
          setTimeout(arguments.callee, 1e3 / -this.frames);
        } else {
          this.repaint();
          setTimeout(arguments.callee, 1e3 / this.frames);
        }
      }
    })();

    setTimeout(function () {
      this.mousewheel(function (event) {
        var b = null == event.wheelDelta ? event.detail : event.wheelDelta;
        if (null != this.wheelZoom) {
          if (b > 0) {
            this.zoomIn(this.wheelZoom);
          } else {
            this.zoomOut(this.wheelZoom);
          }
        }
      });
      this.paint();
    }, 300);

    /**
     * 延迟1秒绘图
     */
    setTimeout(function () {
      this.paint();
    }, 1e3);

    /**
     * 延迟3秒绘图
     */
    setTimeout(function () {
      this.paint();
    }, 3e3);
  }
}

class exports {
  constructor(data) {
    this.data = data;
    this.exportCanvas = {};
    this.hgap = 16;
    this.visible = false;
    this.exportCanvas = document.createElement('canvas');
    this.canvas = document.createElement('canvas');
  }

  getImage(data, width, height) {
    let rect = data.getBound();
    let x = 1;
    let scale = 1;
    this.exportCanvas.width = data.canvas.width;
    this.exportCanvas.height = data.canvas.height;
    if (null != width && null != height) {
      this.exportCanvas.width = width;
      this.exportCanvas.height = height;
      x = width / rect.width;
      scale = height / rect.height;
    } else {
      if (rect.width > data.canvas.width) {
        this.exportCanvas.width = rect.width;
      }
      if (rect.height > data.canvas.height) {
        this.exportCanvas.height = rect.height;
      }
    }

    var context = this.exportCanvas.getContext('2d');

    if (data.child.length <= 0 ) {
      return null;
    }

    context.save()
    context.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height)
    data.childs.forEach(function (child) {
      if (1 == child.visible) {
        child.save();
        child.translateX = 0;
        child.translateY = 0;
        child.scaleX = 1;
        child.scaleY = 1;
        context.scale(x, scale);
        if (rect.left < 0) {
          child.translateX = Math.abs(rect.left);
        }
        if (rect.top < 0) {
          child.translateY = Math.abs(rect.top);
        }
        child.paintAll = true;
        child.repaint(context);
        child.paintAll = false;
        child.restore();
      }
    })

    context.restore()
    return this.exportCanvas.toDataURL('image/png')
  }

  update() {
    this.eagleImageDatas = this.getData(data);
  }

  setSize(width, height) {
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
  }

  getTransform(options) {
    var x = options.stage.canvas.width;
    var y = options.stage.canvas.height;
    var p = x / options.scaleX / 2;
    var indentation = y / options.scaleY / 2;
    return {
      translateX: options.translateX + p - p * options.scaleX,
      translateY: options.translateY + indentation - indentation * options.scaleY
    };
  }

  getData(width, height) {
    if (null != width && null != height) {
      this.setSize(width, height);
    } else {
      this.setSize(200, 160);
      // this.setSize(400, 160);
    }
    var ctx = this.canvas.getContext('2d');
    // data -> stage
    if (data.childs.length > 0) {
      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      data.childs.forEach(function (mask) {
        if (1 == mask.visible) {
          mask.save();
          mask.centerAndZoom(null, null, ctx);
          mask.repaint(ctx);
          mask.restore();
        }
      });
      var transform = this.getTransform(data.childs[0]);
      var size = transform.translateX * (this.canvas.width / data.canvas.width) * data.childs[0].scaleX;
      var y = transform.translateY * (this.canvas.height / data.canvas.height) * data.childs[0].scaleY;
      var bbox = data.getBound();
      var width = data.canvas.width / data.childs[0].scaleX / bbox.width;
      var height = data.canvas.height / data.childs[0].scaleY / bbox.height;
      if (width > 1) {
        width = 1;
      }
      if (height > 1) {
        width = 1;
      }
      size = size * width;
      y = y * height;
      if (bbox.left < 0) {
        size = size - Math.abs(bbox.left) * (this.width / bbox.width);
      }
      if (bbox.top < 0) {
        y = y - Math.abs(bbox.top) * (this.height / bbox.height);
      }
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,0,0,1)';
      ctx.strokeRect(-size, -y, ctx.canvas.width * width, ctx.canvas.height * height);
      ctx.restore();
      var boeingData = null;
      try {
        boeingData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      } catch (m) {
      }
      return boeingData;
    }
    return null;
  }

  paint() {
    if (null == this.eagleImageDatas) {
      this.eagleImageDatas = this.getData(data);
      return;
    }

    let g = data.graphics;
    g.save();
    g.fillStyle = 'rgba(211,211,211,0.3)';
    // g.fillStyle = 'rgba(255,255,255,1)';
    g.fillRect(data.canvas.width - this.canvas.width - 2 * this.hgap, data.canvas.height - this.canvas.height - 1, data.canvas.width - this.canvas.width, this.canvas.height + 1);
    g.fill();
    g.save();
    g.lineWidth = 1;
    g.strokeStyle = 'rgba(0,0,0,1)';
    // g.strokeStyle = 'rgba(255,255,255,1)';
    g.rect(data.canvas.width - this.canvas.width - 2 * this.hgap, data.canvas.height - this.canvas.height - 1, data.canvas.width - this.canvas.width, this.canvas.height + 1);
    g.stroke();
    g.restore();
    g.putImageData(this.eagleImageDatas, data.canvas.width - this.canvas.width - this.hgap, data.canvas.height - this.canvas.height);
    g.restore();
  }

  eventHandler(type, event, module) {
    let i = event.x;
    let d = event.y;

    if (i <= module.canvas.width - this.canvas.width || d <= module.canvas.height - this.canvas.height) {
      return;
    }

    // i = event.x - this.canvas.width;
    // d = event.y - this.canvas.height;

    if ('mousedown' != type) {
      return;
    }


    if ('mousedrag' != type || module.childs.length <= 0) {
      return;
    }

    this.lastTranslateX = module.childs[0].translateX;
    this.lastTranslateY = module.childs[0].translateY;
    let width = event.dx;
    let distance = event.dy;
    let cssChanges = module.getBound();
    let numneutrals = this.canvas.width / module.childs[0].scaleX / cssChanges.width;
    let dStroke = this.canvas.height / module.childs[0].scaleY / cssChanges.height;
    module.childs[0].translateX = this.lastTranslateX - width / numneutrals;
    module.childs[0].translateY = this.lastTranslateY - distance / dStroke;
  }
}
