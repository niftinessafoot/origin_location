/**
 * originLocation
 * @moduule originLocation
 * @param {string} ele     OPTION the node to query.
 *                         returns false, clears existing
 *                         if blank
 * @param {object} config Configuration options for a variety of things.
 * @author Matthew Smith
 * @version 0.0.1
 * @todo Account for vendor-prefixed origin locations.
 * @todo Finish config options.
 * @todo crosshairID getter/setter
 */
 (function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.originLocation = factory();
  }
}(this, function () {
  'use strict';
  function originLocation(ele, config){
    var SETTINGS = {
      className : 'originLocation',
      linePrefix : 'originLocation',
      stylesheetId : 'originLocationStyles',
      defaultLineColor: '#fff',
      defaultFontColor: '#fff',
      lineColor : null,
      fontColor : null
    };

/**
 * Initializer for originLocation. Verifies ele is passed in. Configures
 * settings. Invokes rendering crosshairs and writing `transform-origin`
 * coordinates.
 * @param {string} ele Can be a string or a DOM node, reflecting the element
 * being measured.
 * @return {array} Array containing two strings, the x/y of the
 * `transform-origin` on the specified DOM element. Returns pixel values
 * ending in "px".
 */
  function init(ele){
    var style, offset, node, coords;

    //If nothing passed, clear all visuals.
    if(typeof(ele) === 'undefined'){
      removeAll();
      return false;
    }

    node = parseDom(ele);

    if(node){
      SETTINGS = mergeSettings(SETTINGS, config);
      SETTINGS.crosshairID = SETTINGS.linePrefix + '_' + (+new Date());

      style = getComputedStyle(node);
      coords = style.transformOrigin.split(' ');

      offset = calculateOffset(node);
      generateStyleSheet(offset, coords);
      generateLines(offset, coords);
    }
    return coords;
  }

/**
 * Shallow merge of options. Only merges keys that exist in base. If either
 * `base` or `custom` are not objects, returns `base`.
 * @param  {object} base   Default settings. The options being modified.
 * @param  {object} custom New settings.
 * @return {object}        New object. A copy of base, updated as specified by
 * `custom`.
 */
 function mergeSettings(base, custom){
  var toStr = Object.prototype.toString,
    objStr = '[object Object]',
    obj = {},
    key;

  if(toStr.call(base) !== objStr || toStr.call(custom) !== objStr){
    return base;
  }

  for(key in base){
    if(base.hasOwnProperty(key)){
      obj[key] = (key in custom) ? custom[key] : base[key];
    }
  }

  return obj;
}

/**
 * Verifies in the `ele` param is either a string or a DOM node. If a string,
 * will attempt to run `querySelector` to return the calculated node.
 * @param  {node} ele Can be a string or a DOM node. The element being
 *                    measured.
 * @return {node}     Passes the verified DOM node to the parent for further
 *                    action. Returns `false` if not a valid node.
 */
function parseDom(ele){
    //If a string, try matching to an element.
    if(typeof(ele) === 'string'){
      try {
        ele = document.body.querySelector(ele);
      } catch(err){
        return false;
      }
    }
    //Ensure ele is a valid element.
    if(!ele || !ele.nodeType){
      return false;
    }

    return ele;
  }

/**
 * Cycles through DOM nodes, appending offsets until there's no more parent.
 * @param  {node} ele   DOM node being calculated.
 * @return {object}     Object literal with two keys, `top` and `left`, each
 *                      returning integers reflecting the total pixels from the top/left of the
 *                      page.
 */
  function calculateOffset(ele){
    var offset = {top: 0, left:0},
      offsetEle = ele;

    while(offsetEle.offsetParent){
      offset.left += offsetEle.offsetLeft;
      offset.top += offsetEle.offsetTop;
      offsetEle = offsetEle.offsetParent;
    }
    return offset;
  }

/**
 * Remove generated stylesheet and all crosshairs from page.
 */
  function removeAll(){
    var style = document.getElementById(SETTINGS.stylesheetId),
      lines = document.getElementsByClassName(SETTINGS.class),
      len = lines.length,
      cur;

    if(style){
      style.parentNode.removeChild(style);
    }

    while(len--){
      cur = lines[len];
      cur.parentNode.removeChild(cur);
    }
  }

  /**
   * Generates dynamic stylesheet for styling crosshairs.
   * @param  {object} offset x/y coordinates of the DOM elemen't offset.
   * @param  {array} coords calculated `origin-location` of the queried DOM element.
   */
  function generateStyleSheet(offset, coords){
    var baseStyles = [
      'background:' + SETTINGS.defaultLineColor,
      'color: #fff',
      'height: 1px',
      'left: 0',
      'min-width: 100vw',
      'position: absolute',
      'top: 0',
      'width: 100%'
    ],
    xStyles = [
      'background: ' + SETTINGS.lineColor,
      'color: ' + SETTINGS.fontColor
    ],
    baseStylesBefore = [
      'background-color: inherit',
      'content:""',
      'display:block',
      'min-height: 100vh',
      'position: absolute',
      'width: 1px'
    ],
    baseStylesAfter = [
      'color: currentColor',
      'content: attr(data-info)',
      'display: inline-block',
      'font: italic 12px/1 monospace',
      'padding: 5px',
      'position: relative'
    ],
    styleCount = -1,
    styleSheet = document.getElementById(SETTINGS.stylesheetId),
    selectorClass = '.' + SETTINGS.className,
    selectorID = '#' + SETTINGS.crosshairID,
    sheetInventory,
    sheet;

    if(!styleSheet){
      styleSheet = document.createElement('style');
      styleSheet.id = SETTINGS.stylesheetId;
      //Insert style to top of head; allows easy cascade/style overrides.
      document.head.insertBefore(styleSheet, document.head.firstChild);
    }

    sheet = styleSheet.sheet;
    sheetInventory = [].map.call(sheet.rules, function(ele){
      return ele.selectorText;
    });

    if(sheetInventory.indexOf(selectorClass) < 0){
      sheet.insertRule(selectorClass + '{'+baseStyles.join(';')+'}', ++styleCount);
      sheet.insertRule(selectorClass + ':before{'+baseStylesBefore.join(';')+'}', ++styleCount);
      sheet.insertRule(selectorClass + ':after{'+baseStylesAfter.join(';')+'}', ++styleCount);
    }

    sheet.insertRule(selectorID + '{'+xStyles.join(';')+'}',++styleCount);
    sheet.insertRule(selectorID + ':before {' +
      'left:' + offset.left + 'px;' +
      'top:' + (offset.top * -1) + 'px;' +
      'height:' + document.body.scrollHeight + 'px;' +
        //Coords returned as a string with `px` suffix. Need to inverse this.
        //Find cleaner way to fix.
      'transform: translate(' + coords[0] + ', ' + (parseInt(coords[1]) * -1) + 'px);' +        // 'transform: translate(' + coords[0] + ', ' + coords[1] + ');' +
    '}', ++styleCount);
    sheet.insertRule(selectorID + ':after {' +
      'left:' + offset.left + 'px;' +
      'transform: translateX(' + coords[0] + ');' +
    '}', ++styleCount);

    return styleSheet;
  }

/**
 * Append crosshairs to the DOM.
   * @param  {object} offset x/y coordinates of the DOM elemen't offset.
   * @param  {array} coords calculated `origin-location` of the queried DOM element.
 */
  function generateLines(offset, coords){
    var line = document.createElement('div');

    line.classList.add(SETTINGS.className);
    line.id = SETTINGS.crosshairID;
    line.style.top = offset.top+"px";
    line.style.transform = "translateY("+coords[1]+")";
    line.setAttribute('data-info', coords.join(' / '));

    document.body.appendChild(line);
  }

  return init(ele);
}

return originLocation;
}));
