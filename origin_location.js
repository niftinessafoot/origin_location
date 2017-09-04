/**
 * @module originLocation
 * @description Deeper descriptions of what this thing is supposed to do, I guess?
 * @param {string} [ele]   The node to query.
 *                         returns false, clears existing
 *                         if blank
 * @param {object} [config] Configuration options.
 * @author Matthew Smith
 * @version 0.0.1
 * @todo Account for vendor-prefixed origin locations.
 * @todo Finish config options.
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
  var CONST = {
      STYLESHEETID : 'originLocationStyles',
      CLASS : 'originLocation',
      CLASSX : 'originLocationX',
      CLASSY : 'originLocationY'
    },
    offset = {top:0, left:0},
    coords = false,
    S = config || {};

  function init(ele){
    var style, offsetEle;

    //If nothing passed, clear all visuals.
    if(typeof(ele) === 'undefined'){
      removeAll();
      return false;
    }
    //If a string, try matching to an element.
    else if(typeof(ele) === 'string'){
      try {
        ele = document.body.querySelector(ele);
      } catch(err){
        return false;
      }
    }

    //Finally, ensure ele is a valid element.
    if(!ele || !ele.nodeType){
      return false;
    }

    style = getComputedStyle(ele);
    coords = style.transformOrigin.split(' ');

    offsetEle = ele;
    while(offsetEle.offsetParent){
      offset.left += offsetEle.offsetLeft;
      offset.top += offsetEle.offsetTop;
      offsetEle = offsetEle.offsetParent;
    }

    return coords;
  }

  function removeAll(){
    var style = document.getElementById(CONST.STYLESHEETID),
      lines = document.getElementsByClassName(CONST.CLASS),
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

  function generateStyleSheet(){
    var baseStyles = [
      'position: absolute',
      'background: #c00',
      'z-index: 2'
    ],
    xStyles = [
      'height: 1px',
      'left: 0',
      'min-width: 100vw'
    ],
    xStylesAfter = [
      'content:attr(data-info)',
      'display: inline-block',
      'position: relative',
      'font: italic 12px/1 monospace',
      'padding: 5px'
    ],
    yStyles = [
      'min-height: 100vh',
      'top: 0',
      'width: 1px'
    ],styleSheet, sheet;

    if(document.getElementById(CONST.STYLESHEETID)){
      return false;
    }

    styleSheet = document.createElement('style');
    styleSheet.id = CONST.STYLESHEETID;
    document.head.appendChild(styleSheet);

    sheet = styleSheet.sheet;
    sheet.insertRule('.'+CONST.CLASS + '{'+baseStyles.join(';')+'}',0);
    sheet.insertRule('.'+CONST.CLASSX + '{'+xStyles.join(';')+'}',1);
    sheet.insertRule('.'+CONST.CLASSX + ':after{' +
      'left:' + offset.left + 'px;' +
      'transform: translateX(' + coords[0] + ');' +
      xStylesAfter.join(';') +
      '}',2);
    sheet.insertRule('.'+CONST.CLASSY + '{'+yStyles.join(';')+'}',3);
  }

/**
 * generateLines: Append crosshairs to DOM.
 * @memberof originLocation
 * @function
 * @todo  User-selectable dom elements?
 *
*/
  function generateLines(){
    var frag = document.createDocumentFragment(),
      x = document.createElement('div'),
      y = document.createElement('div');

    x.classList.add(CONST.CLASS, CONST.CLASSX);
    x.style.top = offset.top+"px";
    x.style.transform = "translateY("+coords[1]+")";
    x.setAttribute('data-info', coords.join(' / '));

    y.classList.add(CONST.CLASS, CONST.CLASSY);
    y.style.left = offset.left+"px";
    y.style.transform = "translateX("+coords[0]+")";

    frag.appendChild(x);
    frag.appendChild(y);
    document.body.appendChild(frag);

    //Change to *if* coords are heigher/wider than body…
    y.style.height = document.body.scrollHeight + 'px';
    x.style.width = document.body.scrollWidth + 'px';
  }

  coords = init(ele);

  if(coords){
    generateStyleSheet();
    generateLines();
  }

  return coords;
}
return originLocation;
}));