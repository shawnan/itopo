import Element from './core/element/index';

(function(window){
  CanvasRenderingContext2D.prototype.JTopoRoundRect = function (x, y, width, height, radius) {
    if ('undefined' == typeof radius) {
      /** @type {number} */
      radius = 5;
    }
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
  };
  /**
   * @param {number} x
   * @param {number} y
   * @param {string} tx
   * @param {string} ty
   * @param {number} v
   * @return {undefined}
   */
  CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function (x, y, tx, ty, v) {
    if ('undefined' == typeof v) {
      /** @type {number} */
      v = 5;
    }
    /** @type {number} */
    var dx = tx - x;
    /** @type {number} */
    var dy = ty - y;
    /** @type {number} */
    var s = Math.floor(Math.sqrt(dx * dx + dy * dy));
    /** @type {number} */
    var boundswidth = 0 >= v ? s : s / v;
    /** @type {number} */
    var k = dy / s * v;
    /** @type {number} */
    var t = dx / s * v;
    this.beginPath();
    /** @type {number} */
    var width = 0;
    for (; boundswidth > width; width++) {
      if (width % 2) {
        this.lineTo(x + width * t, y + width * k);
      } else {
        this.moveTo(x + width * t, y + width * k);
      }
    }
    this.stroke();
  };

  const JTopo = {
    version: '0.4.8',
    zIndex_Container: 1,
    zIndex_Link: 2,
    zIndex_Node: 3,
    SceneMode: {
      normal: 'normal',
      drag: 'drag',
      edit: 'edit',
      select: 'select'
    },
    MouseCursor: {
      normal: 'default',
      pointer: 'pointer',
      top_left: 'nw-resize',
      top_center: 'n-resize',
      top_right: 'ne-resize',
      middle_left: 'e-resize',
      middle_right: 'e-resize',
      bottom_left: 'ne-resize',
      bottom_center: 'n-resize',
      bottom_right: 'nw-resize',
      move: 'move',
      open_hand: 'url(./img/cur/openhand.cur) 8 8, default',
      closed_hand: 'url(./img/cur/closedhand.cur) 8 8, default'
    },
    createStageFromJson: function (jsonStr$jscomp$1, canvas$jscomp$0) {
      eval('var jsonObj = ' + jsonStr$jscomp$1);
      var stage$jscomp$0 = new JTopo.Stage(canvas$jscomp$0);
      var k$jscomp$1;
      for (k$jscomp$1 in jsonObj) {
        if ('childs' != k$jscomp$1) {
          stage$jscomp$0[k$jscomp$1] = jsonObj[k$jscomp$1];
        }
      }
      var scenes$jscomp$0 = jsonObj.childs;
      return scenes$jscomp$0.forEach(function (data) {
        var view = new JTopo.Scene(stage$jscomp$0);
        var i;
        for (i in data) {
          if ('childs' != i) {
            view[i] = data[i];
          }
          if ('background' == i) {
            view.background = data[i];
          }
        }
        var body = data.childs;
        body.forEach(function (target) {
          /** @type {null} */
          var result = null;
          var parentNode = target.elementType;
          if ('node' == parentNode) {
            result = new JTopo.Node;
          } else {
            if ('CircleNode' == parentNode) {
              result = new JTopo.CircleNode;
            }
          }
          var propertyName;
          for (propertyName in target) {
            result[propertyName] = target[propertyName];
          }
          view.add(result);
        });
      }), stage$jscomp$0;
    }
  };
  /** @type {function(): undefined} */
  JTopo.Element = Element;
  window.JTopo = JTopo;
})(window);