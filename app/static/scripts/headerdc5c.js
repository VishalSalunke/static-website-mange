/*!
 * jQuery JavaScript Library v1.5.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Mar 31 15:28:23 2011 -0400
 */
(function(a,b){function ci(a){return d.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cf(a){if(!b_[a]){var b=d("<"+a+">").appendTo("body"),c=b.css("display");b.remove();if(c==="none"||c==="")c="block";b_[a]=c}return b_[a]}function ce(a,b){var c={};d.each(cd.concat.apply([],cd.slice(0,b)),function(){c[this]=a});return c}function b$(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function bZ(){try{return new a.XMLHttpRequest}catch(b){}}function bY(){d(a).unload(function(){for(var a in bW)bW[a](0,1)})}function bS(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var e=a.dataTypes,f={},g,h,i=e.length,j,k=e[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h==="string"&&(f[h.toLowerCase()]=a.converters[h]);l=k,k=e[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=f[m]||f["* "+k];if(!n){p=b;for(o in f){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=f[j[1]+" "+k];if(p){o=f[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&d.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function bR(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function bQ(a,b,c,e){if(d.isArray(b)&&b.length)d.each(b,function(b,f){c||bs.test(a)?e(a,f):bQ(a+"["+(typeof f==="object"||d.isArray(f)?b:"")+"]",f,c,e)});else if(c||b==null||typeof b!=="object")e(a,b);else if(d.isArray(b)||d.isEmptyObject(b))e(a,"");else for(var f in b)bQ(a+"["+f+"]",b[f],c,e)}function bP(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bJ,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l==="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bP(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bP(a,c,d,e,"*",g));return l}function bO(a){return function(b,c){typeof b!=="string"&&(c=b,b="*");if(d.isFunction(c)){var e=b.toLowerCase().split(bD),f=0,g=e.length,h,i,j;for(;f<g;f++)h=e[f],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bq(a,b,c){var e=b==="width"?bk:bl,f=b==="width"?a.offsetWidth:a.offsetHeight;if(c==="border")return f;d.each(e,function(){c||(f-=parseFloat(d.css(a,"padding"+this))||0),c==="margin"?f+=parseFloat(d.css(a,"margin"+this))||0:f-=parseFloat(d.css(a,"border"+this+"Width"))||0});return f}function bc(a,b){b.src?d.ajax({url:b.src,async:!1,dataType:"script"}):d.globalEval(b.text||b.textContent||b.innerHTML||""),b.parentNode&&b.parentNode.removeChild(b)}function bb(a){return"getElementsByTagName"in a?a.getElementsByTagName("*"):"querySelectorAll"in a?a.querySelectorAll("*"):[]}function ba(a,b){if(b.nodeType===1){var c=b.nodeName.toLowerCase();b.clearAttributes(),b.mergeAttributes(a);if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(d.expando)}}function _(a,b){if(b.nodeType===1&&d.hasData(a)){var c=d.expando,e=d.data(a),f=d.data(b,e);if(e=e[c]){var g=e.events;f=f[c]=d.extend({},e);if(g){delete f.handle,f.events={};for(var h in g)for(var i=0,j=g[h].length;i<j;i++)d.event.add(b,h+(g[h][i].namespace?".":"")+g[h][i].namespace,g[h][i],g[h][i].data)}}}}function $(a,b){return d.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function Q(a,b,c){if(d.isFunction(b))return d.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return d.grep(a,function(a,d){return a===b===c});if(typeof b==="string"){var e=d.grep(a,function(a){return a.nodeType===1});if(L.test(b))return d.filter(b,e,!c);b=d.filter(b,e)}return d.grep(a,function(a,e){return d.inArray(a,b)>=0===c})}function P(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function H(a,b){return(a&&a!=="*"?a+".":"")+b.replace(t,"`").replace(u,"&")}function G(a){var b,c,e,f,g,h,i,j,k,l,m,n,o,p=[],q=[],s=d._data(this,"events");if(a.liveFired!==this&&s&&s.live&&!a.target.disabled&&(!a.button||a.type!=="click")){a.namespace&&(n=new RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)")),a.liveFired=this;var t=s.live.slice(0);for(i=0;i<t.length;i++)g=t[i],g.origType.replace(r,"")===a.type?q.push(g.selector):t.splice(i--,1);f=d(a.target).closest(q,a.currentTarget);for(j=0,k=f.length;j<k;j++){m=f[j];for(i=0;i<t.length;i++){g=t[i];if(m.selector===g.selector&&(!n||n.test(g.namespace))&&!m.elem.disabled){h=m.elem,e=null;if(g.preType==="mouseenter"||g.preType==="mouseleave")a.type=g.preType,e=d(a.relatedTarget).closest(g.selector)[0];(!e||e!==h)&&p.push({elem:h,handleObj:g,level:m.level})}}}for(j=0,k=p.length;j<k;j++){f=p[j];if(c&&f.level>c)break;a.currentTarget=f.elem,a.data=f.handleObj.data,a.handleObj=f.handleObj,o=f.handleObj.origHandler.apply(f.elem,arguments);if(o===!1||a.isPropagationStopped()){c=f.level,o===!1&&(b=!1);if(a.isImmediatePropagationStopped())break}}return b}}function E(a,c,e){var f=d.extend({},e[0]);f.type=a,f.originalEvent={},f.liveFired=b,d.event.handle.call(c,f),f.isDefaultPrevented()&&e[0].preventDefault()}function y(){return!0}function x(){return!1}function i(a){for(var b in a)if(b!=="toJSON")return!1;return!0}function h(a,c,e){if(e===b&&a.nodeType===1){e=a.getAttribute("data-"+c);if(typeof e==="string"){try{e=e==="true"?!0:e==="false"?!1:e==="null"?null:d.isNaN(e)?g.test(e)?d.parseJSON(e):e:parseFloat(e)}catch(f){}d.data(a,c,e)}else e=b}return e}var c=a.document,d=function(){function G(){if(!d.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(G,1);return}d.ready()}}var d=function(a,b){return new d.fn.init(a,b,g)},e=a.jQuery,f=a.$,g,h=/^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,i=/\S/,j=/^\s+/,k=/\s+$/,l=/\d/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=navigator.userAgent,w,x,y,z=Object.prototype.toString,A=Object.prototype.hasOwnProperty,B=Array.prototype.push,C=Array.prototype.slice,D=String.prototype.trim,E=Array.prototype.indexOf,F={};d.fn=d.prototype={constructor:d,init:function(a,e,f){var g,i,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!e&&c.body){this.context=c,this[0]=c.body,this.selector="body",this.length=1;return this}if(typeof a==="string"){g=h.exec(a);if(!g||!g[1]&&e)return!e||e.jquery?(e||f).find(a):this.constructor(e).find(a);if(g[1]){e=e instanceof d?e[0]:e,k=e?e.ownerDocument||e:c,j=m.exec(a),j?d.isPlainObject(e)?(a=[c.createElement(j[1])],d.fn.attr.call(a,e,!0)):a=[k.createElement(j[1])]:(j=d.buildFragment([g[1]],[k]),a=(j.cacheable?d.clone(j.fragment):j.fragment).childNodes);return d.merge(this,a)}i=c.getElementById(g[2]);if(i&&i.parentNode){if(i.id!==g[2])return f.find(a);this.length=1,this[0]=i}this.context=c,this.selector=a;return this}if(d.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return d.makeArray(a,this)},selector:"",jquery:"1.5.2",length:0,size:function(){return this.length},toArray:function(){return C.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var e=this.constructor();d.isArray(a)?B.apply(e,a):d.merge(e,a),e.prevObject=this,e.context=this.context,b==="find"?e.selector=this.selector+(this.selector?" ":"")+c:b&&(e.selector=this.selector+"."+b+"("+c+")");return e},each:function(a,b){return d.each(this,a,b)},ready:function(a){d.bindReady(),x.done(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(C.apply(this,arguments),"slice",C.call(arguments).join(","))},map:function(a){return this.pushStack(d.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:B,sort:[].sort,splice:[].splice},d.fn.init.prototype=d.fn,d.extend=d.fn.extend=function(){var a,c,e,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i==="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!=="object"&&!d.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){e=i[c],f=a[c];if(i===f)continue;l&&f&&(d.isPlainObject(f)||(g=d.isArray(f)))?(g?(g=!1,h=e&&d.isArray(e)?e:[]):h=e&&d.isPlainObject(e)?e:{},i[c]=d.extend(l,h,f)):f!==b&&(i[c]=f)}return i},d.extend({noConflict:function(b){a.$=f,b&&(a.jQuery=e);return d},isReady:!1,readyWait:1,ready:function(a){a===!0&&d.readyWait--;if(!d.readyWait||a!==!0&&!d.isReady){if(!c.body)return setTimeout(d.ready,1);d.isReady=!0;if(a!==!0&&--d.readyWait>0)return;x.resolveWith(c,[d]),d.fn.trigger&&d(c).trigger("ready").unbind("ready")}},bindReady:function(){if(!x){x=d._Deferred();if(c.readyState==="complete")return setTimeout(d.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",y,!1),a.addEventListener("load",d.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",y),a.attachEvent("onload",d.ready);var b=!1;try{b=a.frameElement==null}catch(e){}c.documentElement.doScroll&&b&&G()}}},isFunction:function(a){return d.type(a)==="function"},isArray:Array.isArray||function(a){return d.type(a)==="array"},isWindow:function(a){return a&&typeof a==="object"&&"setInterval"in a},isNaN:function(a){return a==null||!l.test(a)||isNaN(a)},type:function(a){return a==null?String(a):F[z.call(a)]||"object"},isPlainObject:function(a){if(!a||d.type(a)!=="object"||a.nodeType||d.isWindow(a))return!1;if(a.constructor&&!A.call(a,"constructor")&&!A.call(a.constructor.prototype,"isPrototypeOf"))return!1;var c;for(c in a){}return c===b||A.call(a,c)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw a},parseJSON:function(b){if(typeof b!=="string"||!b)return null;b=d.trim(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return a.JSON&&a.JSON.parse?a.JSON.parse(b):(new Function("return "+b))();d.error("Invalid JSON: "+b)},parseXML:function(b,c,e){a.DOMParser?(e=new DOMParser,c=e.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b)),e=c.documentElement,(!e||!e.nodeName||e.nodeName==="parsererror")&&d.error("Invalid XML: "+b);return c},noop:function(){},globalEval:function(a){if(a&&i.test(a)){var b=c.head||c.getElementsByTagName("head")[0]||c.documentElement,e=c.createElement("script");d.support.scriptEval()?e.appendChild(c.createTextNode(a)):e.text=a,b.insertBefore(e,b.firstChild),b.removeChild(e)}},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,e){var f,g=0,h=a.length,i=h===b||d.isFunction(a);if(e){if(i){for(f in a)if(c.apply(a[f],e)===!1)break}else for(;g<h;)if(c.apply(a[g++],e)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(var j=a[0];g<h&&c.call(j,g,j)!==!1;j=a[++g]){}return a},trim:D?function(a){return a==null?"":D.call(a)}:function(a){return a==null?"":(a+"").replace(j,"").replace(k,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var e=d.type(a);a.length==null||e==="string"||e==="function"||e==="regexp"||d.isWindow(a)?B.call(c,a):d.merge(c,a)}return c},inArray:function(a,b){if(b.indexOf)return b.indexOf(a);for(var c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length==="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,b,c){var d=[],e;for(var f=0,g=a.length;f<g;f++)e=b(a[f],f,c),e!=null&&(d[d.length]=e);return d.concat.apply([],d)},guid:1,proxy:function(a,c,e){arguments.length===2&&(typeof c==="string"?(e=a,a=e[c],c=b):c&&!d.isFunction(c)&&(e=c,c=b)),!c&&a&&(c=function(){return a.apply(e||this,arguments)}),a&&(c.guid=a.guid=a.guid||c.guid||d.guid++);return c},access:function(a,c,e,f,g,h){var i=a.length;if(typeof c==="object"){for(var j in c)d.access(a,j,c[j],f,g,e);return a}if(e!==b){f=!h&&f&&d.isFunction(e);for(var k=0;k<i;k++)g(a[k],c,f?e.call(a[k],k,g(a[k],c)):e,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}d.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.subclass=this.subclass,a.fn.init=function b(b,c){c&&c instanceof d&&!(c instanceof a)&&(c=a(c));return d.fn.init.call(this,b,c,e)},a.fn.init.prototype=a.fn;var e=a(c);return a},browser:{}}),d.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){F["[object "+b+"]"]=b.toLowerCase()}),w=d.uaMatch(v),w.browser&&(d.browser[w.browser]=!0,d.browser.version=w.version),d.browser.webkit&&(d.browser.safari=!0),E&&(d.inArray=function(a,b){return E.call(b,a)}),i.test(" ")&&(j=/^[\s\xA0]+/,k=/[\s\xA0]+$/),g=d(c),c.addEventListener?y=function(){c.removeEventListener("DOMContentLoaded",y,!1),d.ready()}:c.attachEvent&&(y=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",y),d.ready())});return d}(),e="then done fail isResolved isRejected promise".split(" "),f=[].slice;d.extend({_Deferred:function(){var a=[],b,c,e,f={done:function(){if(!e){var c=arguments,g,h,i,j,k;b&&(k=b,b=0);for(g=0,h=c.length;g<h;g++)i=c[g],j=d.type(i),j==="array"?f.done.apply(f,i):j==="function"&&a.push(i);k&&f.resolveWith(k[0],k[1])}return this},resolveWith:function(d,f){if(!e&&!b&&!c){f=f||[],c=1;try{while(a[0])a.shift().apply(d,f)}finally{b=[d,f],c=0}}return this},resolve:function(){f.resolveWith(this,arguments);return this},isResolved:function(){return c||b},cancel:function(){e=1,a=[];return this}};return f},Deferred:function(a){var b=d._Deferred(),c=d._Deferred(),f;d.extend(b,{then:function(a,c){b.done(a).fail(c);return this},fail:c.done,rejectWith:c.resolveWith,reject:c.resolve,isRejected:c.isResolved,promise:function(a){if(a==null){if(f)return f;f=a={}}var c=e.length;while(c--)a[e[c]]=b[e[c]];return a}}),b.done(c.cancel).fail(b.cancel),delete b.cancel,a&&a.call(b,b);return b},when:function(a){function i(a){return function(c){b[a]=arguments.length>1?f.call(arguments,0):c,--g||h.resolveWith(h,f.call(b,0))}}var b=arguments,c=0,e=b.length,g=e,h=e<=1&&a&&d.isFunction(a.promise)?a:d.Deferred();if(e>1){for(;c<e;c++)b[c]&&d.isFunction(b[c].promise)?b[c].promise().then(i(c),h.reject):--g;g||h.resolveWith(h,b)}else h!==a&&h.resolveWith(h,e?[a]:[]);return h.promise()}}),function(){d.support={};var b=c.createElement("div");b.style.display="none",b.innerHTML="   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";var e=b.getElementsByTagName("*"),f=b.getElementsByTagName("a")[0],g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=b.getElementsByTagName("input")[0];if(e&&e.length&&f){d.support={leadingWhitespace:b.firstChild.nodeType===3,tbody:!b.getElementsByTagName("tbody").length,htmlSerialize:!!b.getElementsByTagName("link").length,style:/red/.test(f.getAttribute("style")),hrefNormalized:f.getAttribute("href")==="/a",opacity:/^0.55$/.test(f.style.opacity),cssFloat:!!f.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,deleteExpando:!0,optDisabled:!1,checkClone:!1,noCloneEvent:!0,noCloneChecked:!0,boxModel:null,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableHiddenOffsets:!0,reliableMarginRight:!0},i.checked=!0,d.support.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,d.support.optDisabled=!h.disabled;var j=null;d.support.scriptEval=function(){if(j===null){var b=c.documentElement,e=c.createElement("script"),f="script"+d.now();try{e.appendChild(c.createTextNode("window."+f+"=1;"))}catch(g){}b.insertBefore(e,b.firstChild),a[f]?(j=!0,delete a[f]):j=!1,b.removeChild(e)}return j};try{delete b.test}catch(k){d.support.deleteExpando=!1}!b.addEventListener&&b.attachEvent&&b.fireEvent&&(b.attachEvent("onclick",function l(){d.support.noCloneEvent=!1,b.detachEvent("onclick",l)}),b.cloneNode(!0).fireEvent("onclick")),b=c.createElement("div"),b.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";var m=c.createDocumentFragment();m.appendChild(b.firstChild),d.support.checkClone=m.cloneNode(!0).cloneNode(!0).lastChild.checked,d(function(){var a=c.createElement("div"),b=c.getElementsByTagName("body")[0];if(b){a.style.width=a.style.paddingLeft="1px",b.appendChild(a),d.boxModel=d.support.boxModel=a.offsetWidth===2,"zoom"in a.style&&(a.style.display="inline",a.style.zoom=1,d.support.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",d.support.shrinkWrapBlocks=a.offsetWidth!==2),a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";var e=a.getElementsByTagName("td");d.support.reliableHiddenOffsets=e[0].offsetHeight===0,e[0].style.display="",e[1].style.display="none",d.support.reliableHiddenOffsets=d.support.reliableHiddenOffsets&&e[0].offsetHeight===0,a.innerHTML="",c.defaultView&&c.defaultView.getComputedStyle&&(a.style.width="1px",a.style.marginRight="0",d.support.reliableMarginRight=(parseInt(c.defaultView.getComputedStyle(a,null).marginRight,10)||0)===0),b.removeChild(a).style.display="none",a=e=null}});var n=function(a){var b=c.createElement("div");a="on"+a;if(!b.attachEvent)return!0;var d=a in b;d||(b.setAttribute(a,"return;"),d=typeof b[a]==="function");return d};d.support.submitBubbles=n("submit"),d.support.changeBubbles=n("change"),b=e=f=null}}();var g=/^(?:\{.*\}|\[.*\])$/;d.extend({cache:{},uuid:0,expando:"jQuery"+(d.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?d.cache[a[d.expando]]:a[d.expando];return!!a&&!i(a)},data:function(a,c,e,f){if(d.acceptData(a)){var g=d.expando,h=typeof c==="string",i,j=a.nodeType,k=j?d.cache:a,l=j?a[d.expando]:a[d.expando]&&d.expando;if((!l||f&&l&&!k[l][g])&&h&&e===b)return;l||(j?a[d.expando]=l=++d.uuid:l=d.expando),k[l]||(k[l]={},j||(k[l].toJSON=d.noop));if(typeof c==="object"||typeof c==="function")f?k[l][g]=d.extend(k[l][g],c):k[l]=d.extend(k[l],c);i=k[l],f&&(i[g]||(i[g]={}),i=i[g]),e!==b&&(i[c]=e);if(c==="events"&&!i[c])return i[g]&&i[g].events;return h?i[c]:i}},removeData:function(b,c,e){if(d.acceptData(b)){var f=d.expando,g=b.nodeType,h=g?d.cache:b,j=g?b[d.expando]:d.expando;if(!h[j])return;if(c){var k=e?h[j][f]:h[j];if(k){delete k[c];if(!i(k))return}}if(e){delete h[j][f];if(!i(h[j]))return}var l=h[j][f];d.support.deleteExpando||h!=a?delete h[j]:h[j]=null,l?(h[j]={},g||(h[j].toJSON=d.noop),h[j][f]=l):g&&(d.support.deleteExpando?delete b[d.expando]:b.removeAttribute?b.removeAttribute(d.expando):b[d.expando]=null)}},_data:function(a,b,c){return d.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=d.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),d.fn.extend({data:function(a,c){var e=null;if(typeof a==="undefined"){if(this.length){e=d.data(this[0]);if(this[0].nodeType===1){var f=this[0].attributes,g;for(var i=0,j=f.length;i<j;i++)g=f[i].name,g.indexOf("data-")===0&&(g=g.substr(5),h(this[0],g,e[g]))}}return e}if(typeof a==="object")return this.each(function(){d.data(this,a)});var k=a.split(".");k[1]=k[1]?"."+k[1]:"";if(c===b){e=this.triggerHandler("getData"+k[1]+"!",[k[0]]),e===b&&this.length&&(e=d.data(this[0],a),e=h(this[0],a,e));return e===b&&k[1]?this.data(k[0]):e}return this.each(function(){var b=d(this),e=[k[0],c];b.triggerHandler("setData"+k[1]+"!",e),d.data(this,a,c),b.triggerHandler("changeData"+k[1]+"!",e)})},removeData:function(a){return this.each(function(){d.removeData(this,a)})}}),d.extend({queue:function(a,b,c){if(a){b=(b||"fx")+"queue";var e=d._data(a,b);if(!c)return e||[];!e||d.isArray(c)?e=d._data(a,b,d.makeArray(c)):e.push(c);return e}},dequeue:function(a,b){b=b||"fx";var c=d.queue(a,b),e=c.shift();e==="inprogress"&&(e=c.shift()),e&&(b==="fx"&&c.unshift("inprogress"),e.call(a,function(){d.dequeue(a,b)})),c.length||d.removeData(a,b+"queue",!0)}}),d.fn.extend({queue:function(a,c){typeof a!=="string"&&(c=a,a="fx");if(c===b)return d.queue(this[0],a);return this.each(function(b){var e=d.queue(this,a,c);a==="fx"&&e[0]!=="inprogress"&&d.dequeue(this,a)})},dequeue:function(a){return this.each(function(){d.dequeue(this,a)})},delay:function(a,b){a=d.fx?d.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(){var c=this;setTimeout(function(){d.dequeue(c,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])}});var j=/[\n\t\r]/g,k=/\s+/,l=/\r/g,m=/^(?:href|src|style)$/,n=/^(?:button|input)$/i,o=/^(?:button|input|object|select|textarea)$/i,p=/^a(?:rea)?$/i,q=/^(?:radio|checkbox)$/i;d.props={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder"},d.fn.extend({attr:function(a,b){return d.access(this,a,b,!0,d.attr)},removeAttr:function(a,b){return this.each(function(){d.attr(this,a,""),this.nodeType===1&&this.removeAttribute(a)})},addClass:function(a){if(d.isFunction(a))return this.each(function(b){var c=d(this);c.addClass(a.call(this,b,c.attr("class")))});if(a&&typeof a==="string"){var b=(a||"").split(k);for(var c=0,e=this.length;c<e;c++){var f=this[c];if(f.nodeType===1)if(f.className){var g=" "+f.className+" ",h=f.className;for(var i=0,j=b.length;i<j;i++)g.indexOf(" "+b[i]+" ")<0&&(h+=" "+b[i]);f.className=d.trim(h)}else f.className=a}}return this},removeClass:function(a){if(d.isFunction(a))return this.each(function(b){var c=d(this);c.removeClass(a.call(this,b,c.attr("class")))});if(a&&typeof a==="string"||a===b){var c=(a||"").split(k);for(var e=0,f=this.length;e<f;e++){var g=this[e];if(g.nodeType===1&&g.className)if(a){var h=(" "+g.className+" ").replace(j," ");for(var i=0,l=c.length;i<l;i++)h=h.replace(" "+c[i]+" "," ");g.className=d.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,e=typeof b==="boolean";if(d.isFunction(a))return this.each(function(c){var e=d(this);e.toggleClass(a.call(this,c,e.attr("class"),b),b)});return this.each(function(){if(c==="string"){var f,g=0,h=d(this),i=b,j=a.split(k);while(f=j[g++])i=e?i:!h.hasClass(f),h[i?"addClass":"removeClass"](f)}else if(c==="undefined"||c==="boolean")this.className&&d._data(this,"__className__",this.className),this.className=this.className||a===!1?"":d._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ";for(var c=0,d=this.length;c<d;c++)if((" "+this[c].className+" ").replace(j," ").indexOf(b)>-1)return!0;return!1},val:function(a){if(!arguments.length){var c=this[0];if(c){if(d.nodeName(c,"option")){var e=c.attributes.value;return!e||e.specified?c.value:c.text}if(d.nodeName(c,"select")){var f=c.selectedIndex,g=[],h=c.options,i=c.type==="select-one";if(f<0)return null;for(var j=i?f:0,k=i?f+1:h.length;j<k;j++){var m=h[j];if(m.selected&&(d.support.optDisabled?!m.disabled:m.getAttribute("disabled")===null)&&(!m.parentNode.disabled||!d.nodeName(m.parentNode,"optgroup"))){a=d(m).val();if(i)return a;g.push(a)}}if(i&&!g.length&&h.length)return d(h[f]).val();return g}if(q.test(c.type)&&!d.support.checkOn)return c.getAttribute("value")===null?"on":c.value;return(c.value||"").replace(l,"")}return b}var n=d.isFunction(a);return this.each(function(b){var c=d(this),e=a;if(this.nodeType===1){n&&(e=a.call(this,b,c.val())),e==null?e="":typeof e==="number"?e+="":d.isArray(e)&&(e=d.map(e,function(a){return a==null?"":a+""}));if(d.isArray(e)&&q.test(this.type))this.checked=d.inArray(c.val(),e)>=0;else if(d.nodeName(this,"select")){var f=d.makeArray(e);d("option",this).each(function(){this.selected=d.inArray(d(this).val(),f)>=0}),f.length||(this.selectedIndex=-1)}else this.value=e}})}}),d.extend({attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,e,f){if(!a||a.nodeType===3||a.nodeType===8||a.nodeType===2)return b;if(f&&c in d.attrFn)return d(a)[c](e);var g=a.nodeType!==1||!d.isXMLDoc(a),h=e!==b;c=g&&d.props[c]||c;if(a.nodeType===1){var i=m.test(c);if(c==="selected"&&!d.support.optSelected){var j=a.parentNode;j&&(j.selectedIndex,j.parentNode&&j.parentNode.selectedIndex)}if((c in a||a[c]!==b)&&g&&!i){h&&(c==="type"&&n.test(a.nodeName)&&a.parentNode&&d.error("type property can't be changed"),e===null?a.nodeType===1&&a.removeAttribute(c):a[c]=e);if(d.nodeName(a,"form")&&a.getAttributeNode(c))return a.getAttributeNode(c).nodeValue;if(c==="tabIndex"){var k=a.getAttributeNode("tabIndex");return k&&k.specified?k.value:o.test(a.nodeName)||p.test(a.nodeName)&&a.href?0:b}return a[c]}if(!d.support.style&&g&&c==="style"){h&&(a.style.cssText=""+e);return a.style.cssText}h&&a.setAttribute(c,""+e);if(!a.attributes[c]&&(a.hasAttribute&&!a.hasAttribute(c)))return b;var l=!d.support.hrefNormalized&&g&&i?a.getAttribute(c,2):a.getAttribute(c);return l===null?b:l}h&&(a[c]=e);return a[c]}});var r=/\.(.*)$/,s=/^(?:textarea|input|select)$/i,t=/\./g,u=/ /g,v=/[^\w\s.|`]/g,w=function(a){return a.replace(v,"\\$&")};d.event={add:function(c,e,f,g){if(c.nodeType!==3&&c.nodeType!==8){try{d.isWindow(c)&&(c!==a&&!c.frameElement)&&(c=a)}catch(h){}if(f===!1)f=x;else if(!f)return;var i,j;f.handler&&(i=f,f=i.handler),f.guid||(f.guid=d.guid++);var k=d._data(c);if(!k)return;var l=k.events,m=k.handle;l||(k.events=l={}),m||(k.handle=m=function(a){return typeof d!=="undefined"&&d.event.triggered!==a.type?d.event.handle.apply(m.elem,arguments):b}),m.elem=c,e=e.split(" ");var n,o=0,p;while(n=e[o++]){j=i?d.extend({},i):{handler:f,data:g},n.indexOf(".")>-1?(p=n.split("."),n=p.shift(),j.namespace=p.slice(0).sort().join(".")):(p=[],j.namespace=""),j.type=n,j.guid||(j.guid=f.guid);var q=l[n],r=d.event.special[n]||{};if(!q){q=l[n]=[];if(!r.setup||r.setup.call(c,g,p,m)===!1)c.addEventListener?c.addEventListener(n,m,!1):c.attachEvent&&c.attachEvent("on"+n,m)}r.add&&(r.add.call(c,j),j.handler.guid||(j.handler.guid=f.guid)),q.push(j),d.event.global[n]=!0}c=null}},global:{},remove:function(a,c,e,f){if(a.nodeType!==3&&a.nodeType!==8){e===!1&&(e=x);var g,h,i,j,k=0,l,m,n,o,p,q,r,s=d.hasData(a)&&d._data(a),t=s&&s.events;if(!s||!t)return;c&&c.type&&(e=c.handler,c=c.type);if(!c||typeof c==="string"&&c.charAt(0)==="."){c=c||"";for(h in t)d.event.remove(a,h+c);return}c=c.split(" ");while(h=c[k++]){r=h,q=null,l=h.indexOf(".")<0,m=[],l||(m=h.split("."),h=m.shift(),n=new RegExp("(^|\\.)"+d.map(m.slice(0).sort(),w).join("\\.(?:.*\\.)?")+"(\\.|$)")),p=t[h];if(!p)continue;if(!e){for(j=0;j<p.length;j++){q=p[j];if(l||n.test(q.namespace))d.event.remove(a,r,q.handler,j),p.splice(j--,1)}continue}o=d.event.special[h]||{};for(j=f||0;j<p.length;j++){q=p[j];if(e.guid===q.guid){if(l||n.test(q.namespace))f==null&&p.splice(j--,1),o.remove&&o.remove.call(a,q);if(f!=null)break}}if(p.length===0||f!=null&&p.length===1)(!o.teardown||o.teardown.call(a,m)===!1)&&d.removeEvent(a,h,s.handle),g=null,delete t[h]}if(d.isEmptyObject(t)){var u=s.handle;u&&(u.elem=null),delete s.events,delete s.handle,d.isEmptyObject(s)&&d.removeData(a,b,!0)}}},trigger:function(a,c,e){var f=a.type||a,g=arguments[3];if(!g){a=typeof a==="object"?a[d.expando]?a:d.extend(d.Event(f),a):d.Event(f),f.indexOf("!")>=0&&(a.type=f=f.slice(0,-1),a.exclusive=!0),e||(a.stopPropagation(),d.event.global[f]&&d.each(d.cache,function(){var b=d.expando,e=this[b];e&&e.events&&e.events[f]&&d.event.trigger(a,c,e.handle.elem)}));if(!e||e.nodeType===3||e.nodeType===8)return b;a.result=b,a.target=e,c=d.makeArray(c),c.unshift(a)}a.currentTarget=e;var h=d._data(e,"handle");h&&h.apply(e,c);var i=e.parentNode||e.ownerDocument;try{e&&e.nodeName&&d.noData[e.nodeName.toLowerCase()]||e["on"+f]&&e["on"+f].apply(e,c)===!1&&(a.result=!1,a.preventDefault())}catch(j){}if(!a.isPropagationStopped()&&i)d.event.trigger(a,c,i,!0);else if(!a.isDefaultPrevented()){var k,l=a.target,m=f.replace(r,""),n=d.nodeName(l,"a")&&m==="click",o=d.event.special[m]||{};if((!o._default||o._default.call(e,a)===!1)&&!n&&!(l&&l.nodeName&&d.noData[l.nodeName.toLowerCase()])){try{l[m]&&(k=l["on"+m],k&&(l["on"+m]=null),d.event.triggered=a.type,l[m]())}catch(p){}k&&(l["on"+m]=k),d.event.triggered=b}}},handle:function(c){var e,f,g,h,i,j=[],k=d.makeArray(arguments);c=k[0]=d.event.fix(c||a.event),c.currentTarget=this,e=c.type.indexOf(".")<0&&!c.exclusive,e||(g=c.type.split("."),c.type=g.shift(),j=g.slice(0).sort(),h=new RegExp("(^|\\.)"+j.join("\\.(?:.*\\.)?")+"(\\.|$)")),c.namespace=c.namespace||j.join("."),i=d._data(this,"events"),f=(i||{})[c.type];if(i&&f){f=f.slice(0);for(var l=0,m=f.length;l<m;l++){var n=f[l];if(e||h.test(n.namespace)){c.handler=n.handler,c.data=n.data,c.handleObj=n;var o=n.handler.apply(this,k);o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()));if(c.isImmediatePropagationStopped())break}}}return c.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[d.expando])return a;var e=a;a=d.Event(e);for(var f=this.props.length,g;f;)g=this.props[--f],a[g]=e[g];a.target||(a.target=a.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(a.pageX==null&&a.clientX!=null){var h=c.documentElement,i=c.body;a.pageX=a.clientX+(h&&h.scrollLeft||i&&i.scrollLeft||0)-(h&&h.clientLeft||i&&i.clientLeft||0),a.pageY=a.clientY+(h&&h.scrollTop||i&&i.scrollTop||0)-(h&&h.clientTop||i&&i.clientTop||0)}a.which==null&&(a.charCode!=null||a.keyCode!=null)&&(a.which=a.charCode!=null?a.charCode:a.keyCode),!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==b&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);return a},guid:1e8,proxy:d.proxy,special:{ready:{setup:d.bindReady,teardown:d.noop},live:{add:function(a){d.event.add(this,H(a.origType,a.selector),d.extend({},a,{handler:G,guid:a.handler.guid}))},remove:function(a){d.event.remove(this,H(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,c){d.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}}},d.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},d.Event=function(a){if(!this.preventDefault)return new d.Event(a);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?y:x):this.type=a,this.timeStamp=d.now(),this[d.expando]=!0},d.Event.prototype={preventDefault:function(){this.isDefaultPrevented=y;var a=this.originalEvent;a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=y;var a=this.originalEvent;a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=y,this.stopPropagation()},isDefaultPrevented:x,isPropagationStopped:x,isImmediatePropagationStopped:x};var z=function(a){var b=a.relatedTarget;try{if(b&&b!==c&&!b.parentNode)return;while(b&&b!==this)b=b.parentNode;b!==this&&(a.type=a.data,d.event.handle.apply(this,arguments))}catch(e){}},A=function(a){a.type=a.data,d.event.handle.apply(this,arguments)};d.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){d.event.special[a]={setup:function(c){d.event.add(this,b,c&&c.selector?A:z,a)},teardown:function(a){d.event.remove(this,b,a&&a.selector?A:z)}}}),d.support.submitBubbles||(d.event.special.submit={setup:function(a,b){if(this.nodeName&&this.nodeName.toLowerCase()!=="form")d.event.add(this,"click.specialSubmit",function(a){var b=a.target,c=b.type;(c==="submit"||c==="image")&&d(b).closest("form").length&&E("submit",this,arguments)}),d.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,c=b.type;(c==="text"||c==="password")&&d(b).closest("form").length&&a.keyCode===13&&E("submit",this,arguments)});else return!1},teardown:function(a){d.event.remove(this,".specialSubmit")}});if(!d.support.changeBubbles){var B,C=function(a){var b=a.type,c=a.value;b==="radio"||b==="checkbox"?c=a.checked:b==="select-multiple"?c=a.selectedIndex>-1?d.map(a.options,function(a){return a.selected}).join("-"):"":a.nodeName.toLowerCase()==="select"&&(c=a.selectedIndex);return c},D=function D(a){var c=a.target,e,f;if(s.test(c.nodeName)&&!c.readOnly){e=d._data(c,"_change_data"),f=C(c),(a.type!=="focusout"||c.type!=="radio")&&d._data(c,"_change_data",f);if(e===b||f===e)return;if(e!=null||f)a.type="change",a.liveFired=b,d.event.trigger(a,arguments[1],c)}};d.event.special.change={filters:{focusout:D,beforedeactivate:D,click:function(a){var b=a.target,c=b.type;(c==="radio"||c==="checkbox"||b.nodeName.toLowerCase()==="select")&&D.call(this,a)},keydown:function(a){var b=a.target,c=b.type;(a.keyCode===13&&b.nodeName.toLowerCase()!=="textarea"||a.keyCode===32&&(c==="checkbox"||c==="radio")||c==="select-multiple")&&D.call(this,a)},beforeactivate:function(a){var b=a.target;d._data(b,"_change_data",C(b))}},setup:function(a,b){if(this.type==="file")return!1;for(var c in B)d.event.add(this,c+".specialChange",B[c]);return s.test(this.nodeName)},teardown:function(a){d.event.remove(this,".specialChange");return s.test(this.nodeName)}},B=d.event.special.change.filters,B.focus=B.beforeactivate}c.addEventListener&&d.each({focus:"focusin",blur:"focusout"},function(a,b){function f(a){var c=d.event.fix(a);c.type=b,c.originalEvent={},d.event.trigger(c,null,c.target),c.isDefaultPrevented()&&a.preventDefault()}var e=0;d.event.special[b]={setup:function(){e++===0&&c.addEventListener(a,f,!0)},teardown:function(){--e===0&&c.removeEventListener(a,f,!0)}}}),d.each(["bind","one"],function(a,c){d.fn[c]=function(a,e,f){if(typeof a==="object"){for(var g in a)this[c](g,e,a[g],f);return this}if(d.isFunction(e)||e===!1)f=e,e=b;var h=c==="one"?d.proxy(f,function(a){d(this).unbind(a,h);return f.apply(this,arguments)}):f;if(a==="unload"&&c!=="one")this.one(a,e,f);else for(var i=0,j=this.length;i<j;i++)d.event.add(this[i],a,h,e);return this}}),d.fn.extend({unbind:function(a,b){if(typeof a!=="object"||a.preventDefault)for(var e=0,f=this.length;e<f;e++)d.event.remove(this[e],a,b);else for(var c in a)this.unbind(c,a[c]);return this},delegate:function(a,b,c,d){return this.live(b,c,d,a)},undelegate:function(a,b,c){return arguments.length===0?this.unbind("live"):this.die(b,null,c,a)},trigger:function(a,b){return this.each(function(){d.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){var c=d.Event(a);c.preventDefault(),c.stopPropagation(),d.event.trigger(c,b,this[0]);return c.result}},toggle:function(a){var b=arguments,c=1;while(c<b.length)d.proxy(a,b[c++]);return this.click(d.proxy(a,function(e){var f=(d._data(this,"lastToggle"+a.guid)||0)%c;d._data(this,"lastToggle"+a.guid,f+1),e.preventDefault();return b[f].apply(this,arguments)||!1}))},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var F={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};d.each(["live","die"],function(a,c){d.fn[c]=function(a,e,f,g){var h,i=0,j,k,l,m=g||this.selector,n=g?this:d(this.context);if(typeof a==="object"&&!a.preventDefault){for(var o in a)n[c](o,e,a[o],m);return this}d.isFunction(e)&&(f=e,e=b),a=(a||"").split(" ");while((h=a[i++])!=null){j=r.exec(h),k="",j&&(k=j[0],h=h.replace(r,""));if(h==="hover"){a.push("mouseenter"+k,"mouseleave"+k);continue}l=h,h==="focus"||h==="blur"?(a.push(F[h]+k),h=h+k):h=(F[h]||h)+k;if(c==="live")for(var p=0,q=n.length;p<q;p++)d.event.add(n[p],"live."+H(h,m),{data:e,selector:m,handler:f,origType:h,origHandler:f,preType:l});else n.unbind("live."+H(h,m),f)}return this}}),d.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){d.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.bind(b,a,c):this.trigger(b)},d.attrFn&&(d.attrFn[b]=!0)}),function(){function u(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}if(i.nodeType===1){f||(i.sizcache=c,i.sizset=g);if(typeof b!=="string"){if(i===b){j=!0;break}}else if(k.filter(b,[i]).length>0){j=i;break}}i=i[a]}d[g]=j}}}function t(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}i.nodeType===1&&!f&&(i.sizcache=c,i.sizset=g);if(i.nodeName.toLowerCase()===b){j=i;break}i=i[a]}d[g]=j}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,e=0,f=Object.prototype.toString,g=!1,h=!0,i=/\\/g,j=/\W/;[0,0].sort(function(){h=!1;return 0});var k=function(b,d,e,g){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!=="string")return e;var i,j,n,o,q,r,s,t,u=!0,w=k.isXML(d),x=[],y=b;do{a.exec(""),i=a.exec(y);if(i){y=i[3],x.push(i[1]);if(i[2]){o=i[3];break}}}while(i);if(x.length>1&&m.exec(b))if(x.length===2&&l.relative[x[0]])j=v(x[0]+x[1],d);else{j=l.relative[x[0]]?[d]:k(x.shift(),d);while(x.length)b=x.shift(),l.relative[b]&&(b+=x.shift()),j=v(b,j)}else{!g&&x.length>1&&d.nodeType===9&&!w&&l.match.ID.test(x[0])&&!l.match.ID.test(x[x.length-1])&&(q=k.find(x.shift(),d,w),d=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]);if(d){q=g?{expr:x.pop(),set:p(g)}:k.find(x.pop(),x.length===1&&(x[0]==="~"||x[0]==="+")&&d.parentNode?d.parentNode:d,w),j=q.expr?k.filter(q.expr,q.set):q.set,x.length>0?n=p(j):u=!1;while(x.length)r=x.pop(),s=r,l.relative[r]?s=x.pop():r="",s==null&&(s=d),l.relative[r](n,s,w)}else n=x=[]}n||(n=j),n||k.error(r||b);if(f.call(n)==="[object Array]")if(u)if(d&&d.nodeType===1)for(t=0;n[t]!=null;t++)n[t]&&(n[t]===!0||n[t].nodeType===1&&k.contains(d,n[t]))&&e.push(j[t]);else for(t=0;n[t]!=null;t++)n[t]&&n[t].nodeType===1&&e.push(j[t]);else e.push.apply(e,n);else p(n,e);o&&(k(o,h,e,g),k.uniqueSort(e));return e};k.uniqueSort=function(a){if(r){g=h,a.sort(r);if(g)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},k.matches=function(a,b){return k(a,null,null,b)},k.matchesSelector=function(a,b){return k(b,null,null,[a]).length>0},k.find=function(a,b,c){var d;if(!a)return[];for(var e=0,f=l.order.length;e<f;e++){var g,h=l.order[e];if(g=l.leftMatch[h].exec(a)){var j=g[1];g.splice(1,1);if(j.substr(j.length-1)!=="\\"){g[1]=(g[1]||"").replace(i,""),d=l.find[h](g,b,c);if(d!=null){a=a.replace(l.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!=="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},k.filter=function(a,c,d,e){var f,g,h=a,i=[],j=c,m=c&&c[0]&&k.isXML(c[0]);while(a&&c.length){for(var n in l.filter)if((f=l.leftMatch[n].exec(a))!=null&&f[2]){var o,p,q=l.filter[n],r=f[1];g=!1,f.splice(1,1);if(r.substr(r.length-1)==="\\")continue;j===i&&(i=[]);if(l.preFilter[n]){f=l.preFilter[n](f,j,d,i,e,m);if(f){if(f===!0)continue}else g=o=!0}if(f)for(var s=0;(p=j[s])!=null;s++)if(p){o=q(p,f,s,j);var t=e^!!o;d&&o!=null?t?g=!0:j[s]=!1:t&&(i.push(p),g=!0)}if(o!==b){d||(j=i),a=a.replace(l.match[n],"");if(!g)return[];break}}if(a===h)if(g==null)k.error(a);else break;h=a}return j},k.error=function(a){throw"Syntax error, unrecognized expression: "+a};var l=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b==="string",d=c&&!j.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1){}a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&k.filter(b,a,!0)},">":function(a,b){var c,d=typeof b==="string",e=0,f=a.length;if(d&&!j.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&k.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=u;typeof b==="string"&&!j.test(b)&&(b=b.toLowerCase(),d=b,g=t),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=u;typeof b==="string"&&!j.test(b)&&(b=b.toLowerCase(),d=b,g=t),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!=="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!=="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!=="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(i,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(i,"")},TAG:function(a,b){return a[1].replace(i,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||k.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&k.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(i,"");!f&&l.attrMap[g]&&(a[1]=l.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(i,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=k(b[3],null,null,c);else{var g=k.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(l.match.POS.test(b[0])||l.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!k(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return"text"===c&&(b===c||b===null)},radio:function(a){return"radio"===a.type},checkbox:function(a){return"checkbox"===a.type},file:function(a){return"file"===a.type},password:function(a){return"password"===a.type},submit:function(a){return"submit"===a.type},image:function(a){return"image"===a.type},reset:function(a){return"reset"===a.type},button:function(a){return"button"===a.type||a.nodeName.toLowerCase()==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=l.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||k.getText([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}k.error(e)},CHILD:function(a,b){var c=b[1],d=a;switch(c){case"only":case"first":while(d=d.previousSibling)if(d.nodeType===1)return!1;if(c==="first")return!0;d=a;case"last":while(d=d.nextSibling)if(d.nodeType===1)return!1;return!0;case"nth":var e=b[2],f=b[3];if(e===1&&f===0)return!0;var g=b[0],h=a.parentNode;if(h&&(h.sizcache!==g||!a.nodeIndex)){var i=0;for(d=h.firstChild;d;d=d.nextSibling)d.nodeType===1&&(d.nodeIndex=++i);h.sizcache=g}var j=a.nodeIndex-f;return e===0?j===0:j%e===0&&j/e>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=l.attrHandle[c]?l.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=l.setFilters[e];if(f)return f(a,c,b,d)}}},m=l.match.POS,n=function(a,b){return"\\"+(b-0+1)};for(var o in l.match)l.match[o]=new RegExp(l.match[o].source+/(?![^\[]*\])(?![^\(]*\))/.source),l.leftMatch[o]=new RegExp(/(^(?:.|\r|\n)*?)/.source+l.match[o].source.replace(/\\(\d+)/g,n));var p=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(q){p=function(a,b){var c=0,d=b||[];if(f.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length==="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var r,s;c.documentElement.compareDocumentPosition?r=function(a,b){if(a===b){g=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(r=function(a,b){var c,d,e=[],f=[],h=a.parentNode,i=b.parentNode,j=h;if(a===b){g=!0;return 0}if(h===i)return s(a,b);if(!h)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return s(e[k],f[k]);return k===c?s(a,f[k],-1):s(e[k],b,1)},s=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),k.getText=function(a){var b="",c;for(var d=0;a[d];d++)c=a[d],c.nodeType===3||c.nodeType===4?b+=c.nodeValue:c.nodeType!==8&&(b+=k.getText(c.childNodes));return b},function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(l.find.ID=function(a,c,d){if(typeof c.getElementById!=="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!=="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},l.filter.ID=function(a,b){var c=typeof a.getAttributeNode!=="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(l.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!=="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(l.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=k,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){k=function(b,e,f,g){e=e||c;if(!g&&!k.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return p(e.getElementsByTagName(b),f);if(h[2]&&l.find.CLASS&&e.getElementsByClassName)return p(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return p([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return p([],f);if(i.id===h[3])return p([i],f)}try{return p(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var m=e,n=e.getAttribute("id"),o=n||d,q=e.parentNode,r=/^\s*[+~]/.test(b);n?o=o.replace(/'/g,"\\$&"):e.setAttribute("id",o),r&&q&&(e=e.parentNode);try{if(!r||q)return p(e.querySelectorAll("[id='"+o+"'] "+b),f)}catch(s){}finally{n||m.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)k[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}k.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(a))try{if(e||!l.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return k(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;l.order.splice(1,0,"CLASS"),l.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!=="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?k.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?k.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:k.contains=function(){return!1},k.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var v=function(a,b){var c,d=[],e="",f=b.nodeType?[b]:b;while(c=l.match.PSEUDO.exec(a))e+=c[0],a=a.replace(l.match.PSEUDO,"");a=l.relative[a]?a+"*":a;for(var g=0,h=f.length;g<h;g++)k(a,f[g],d);return k.filter(e,d)};d.find=k,d.expr=k.selectors,d.expr[":"]=d.expr.filters,d.unique=k.uniqueSort,d.text=k.getText,d.isXMLDoc=k.isXML,d.contains=k.contains}();var I=/Until$/,J=/^(?:parents|prevUntil|prevAll)/,K=/,/,L=/^.[^:#\[\.,]*$/,M=Array.prototype.slice,N=d.expr.match.POS,O={children:!0,contents:!0,next:!0,prev:!0};d.fn.extend({find:function(a){var b=this.pushStack("","find",a),c=0;for(var e=0,f=this.length;e<f;e++){c=b.length,d.find(a,this[e],b);if(e>0)for(var g=c;g<b.length;g++)for(var h=0;h<c;h++)if(b[h]===b[g]){b.splice(g--,1);break}}return b},has:function(a){var b=d(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(d.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(Q(this,a,!1),"not",a)},filter:function(a){return this.pushStack(Q(this,a,!0),"filter",a)},is:function(a){return!!a&&d.filter(a,this).length>0},closest:function(a,b){var c=[],e,f,g=this[0];if(d.isArray(a)){var h,i,j={},k=1;if(g&&a.length){for(e=0,f=a.length;e<f;e++)i=a[e],j[i]||(j[i]=d.expr.match.POS.test(i)?d(i,b||this.context):i);while(g&&g.ownerDocument&&g!==b){for(i in j)h=j[i],(h.jquery?h.index(g)>-1:d(g).is(h))&&c.push({selector:i,elem:g,level:k});g=g.parentNode,k++}}return c}var l=N.test(a)?d(a,b||this.context):null;for(e=0,f=this.length;e<f;e++){g=this[e];while(g){if(l?l.index(g)>-1:d.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b)break}}c=c.length>1?d.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a||typeof a==="string")return d.inArray(this[0],a?d(a):this.parent().children());return d.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a==="string"?d(a,b):d.makeArray(a),e=d.merge(this.get(),c);return this.pushStack(P(c[0])||P(e[0])?e:d.unique(e))},andSelf:function(){return this.add(this.prevObject)}}),d.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return d.dir(a,"parentNode")},parentsUntil:function(a,b,c){return d.dir(a,"parentNode",c)},next:function(a){return d.nth(a,2,"nextSibling")},prev:function(a){return d.nth(a,2,"previousSibling")},nextAll:function(a){return d.dir(a,"nextSibling")},prevAll:function(a){return d.dir(a,"previousSibling")},nextUntil:function(a,b,c){return d.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return d.dir(a,"previousSibling",c)},siblings:function(a){return d.sibling(a.parentNode.firstChild,a)},children:function(a){return d.sibling(a.firstChild)},contents:function(a){return d.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:d.makeArray(a.childNodes)}},function(a,b){d.fn[a]=function(c,e){var f=d.map(this,b,c),g=M.call(arguments);I.test(a)||(e=c),e&&typeof e==="string"&&(f=d.filter(e,f)),f=this.length>1&&!O[a]?d.unique(f):f,(this.length>1||K.test(e))&&J.test(a)&&(f=f.reverse());return this.pushStack(f,a,g.join(","))}}),d.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?d.find.matchesSelector(b[0],a)?[b[0]]:[]:d.find.matches(a,b)},dir:function(a,c,e){var f=[],g=a[c];while(g&&g.nodeType!==9&&(e===b||g.nodeType!==1||!d(g).is(e)))g.nodeType===1&&f.push(g),g=g[c];return f},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var R=/ jQuery\d+="(?:\d+|null)"/g,S=/^\s+/,T=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,U=/<([\w:]+)/,V=/<tbody/i,W=/<|&#?\w+;/,X=/<(?:script|object|embed|option|style)/i,Y=/checked\s*(?:[^=]|=\s*.checked.)/i,Z={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};Z.optgroup=Z.option,Z.tbody=Z.tfoot=Z.colgroup=Z.caption=Z.thead,Z.th=Z.td,d.support.htmlSerialize||(Z._default=[1,"div<div>","</div>"]),d.fn.extend({text:function(a){if(d.isFunction(a))return this.each(function(b){var c=d(this);c.text(a.call(this,b,c.text()))});if(typeof a!=="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return d.text(this)},wrapAll:function(a){if(d.isFunction(a))return this.each(function(b){d(this).wrapAll(a.call(this,b))});if(this[0]){var b=d(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(d.isFunction(a))return this.each(function(b){d(this).wrapInner(a.call(this,b))});return this.each(function(){var b=d(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){d(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){d.nodeName(this,"body")||d(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=d(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,d(arguments[0]).toArray());return a}},remove:function(a,b){for(var c=0,e;(e=this[c])!=null;c++)if(!a||d.filter(a,[e]).length)!b&&e.nodeType===1&&(d.cleanData(e.getElementsByTagName("*")),d.cleanData([e])),e.parentNode&&e.parentNode.removeChild(e);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&d.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return d.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(R,""):null;if(typeof a!=="string"||X.test(a)||!d.support.leadingWhitespace&&S.test(a)||Z[(U.exec(a)||["",""])[1].toLowerCase()])d.isFunction(a)?this.each(function(b){var c=d(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);else{a=a.replace(T,"<$1></$2>");try{for(var c=0,e=this.length;c<e;c++)this[c].nodeType===1&&(d.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(f){this.empty().append(a)}}return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(d.isFunction(a))return this.each(function(b){var c=d(this),e=c.html();c.replaceWith(a.call(this,b,e))});typeof a!=="string"&&(a=d(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;d(this).remove(),b?d(b).before(a):d(c).append(a)})}return this.length?this.pushStack(d(d.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,e){var f,g,h,i,j=a[0],k=[];if(!d.support.checkClone&&arguments.length===3&&typeof j==="string"&&Y.test(j))return this.each(function(){d(this).domManip(a,c,e,!0)});if(d.isFunction(j))return this.each(function(f){var g=d(this);a[0]=j.call(this,f,c?g.html():b),g.domManip(a,c,e)});if(this[0]){i=j&&j.parentNode,d.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?f={fragment:i}:f=d.buildFragment(a,this,k),h=f.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&d.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)e.call(c?$(this[l],g):this[l],f.cacheable||m>1&&l<n?d.clone(h,!0,!0):h)}k.length&&d.each(k,bc)}return this}}),d.buildFragment=function(a,b,e){var f,g,h,i=b&&b[0]?b[0].ownerDocument||b[0]:c;a.length===1&&typeof a[0]==="string"&&a[0].length<512&&i===c&&a[0].charAt(0)==="<"&&!X.test(a[0])&&(d.support.checkClone||!Y.test(a[0]))&&(g=!0,h=d.fragments[a[0]],h&&(h!==1&&(f=h))),f||(f=i.createDocumentFragment(),d.clean(a,i,f,e)),g&&(d.fragments[a[0]]=h?f:1);return{fragment:f,cacheable:g}},d.fragments={},d.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){d.fn[a]=function(c){var e=[],f=d(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&f.length===1){f[b](this[0]);return this}for(var h=0,i=f.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();d(f[h])[b](j),e=e.concat(j)}return this.pushStack(e,a,f.selector)}}),d.extend({clone:function(a,b,c){var e=a.cloneNode(!0),f,g,h;if((!d.support.noCloneEvent||!d.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!d.isXMLDoc(a)){ba(a,e),f=bb(a),g=bb(e);for(h=0;f[h];++h)ba(f[h],g[h])}if(b){_(a,e);if(c){f=bb(a),g=bb(e);for(h=0;f[h];++h)_(f[h],g[h])}}return e},clean:function(a,b,e,f){b=b||c,typeof b.createElement==="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var g=[];for(var h=0,i;(i=a[h])!=null;h++){typeof i==="number"&&(i+="");if(!i)continue;if(typeof i!=="string"||W.test(i)){if(typeof i==="string"){i=i.replace(T,"<$1></$2>");var j=(U.exec(i)||["",""])[1].toLowerCase(),k=Z[j]||Z._default,l=k[0],m=b.createElement("div");m.innerHTML=k[1]+i+k[2];while(l--)m=m.lastChild;if(!d.support.tbody){var n=V.test(i),o=j==="table"&&!n?m.firstChild&&m.firstChild.childNodes:k[1]==="<table>"&&!n?m.childNodes:[];for(var p=o.length-1;p>=0;--p)d.nodeName(o[p],"tbody")&&!o[p].childNodes.length&&o[p].parentNode.removeChild(o[p])}!d.support.leadingWhitespace&&S.test(i)&&m.insertBefore(b.createTextNode(S.exec(i)[0]),m.firstChild),i=m.childNodes}}else i=b.createTextNode(i);i.nodeType?g.push(i):g=d.merge(g,i)}if(e)for(h=0;g[h];h++)!f||!d.nodeName(g[h],"script")||g[h].type&&g[h].type.toLowerCase()!=="text/javascript"?(g[h].nodeType===1&&g.splice.apply(g,[h+1,0].concat(d.makeArray(g[h].getElementsByTagName("script")))),e.appendChild(g[h])):f.push(g[h].parentNode?g[h].parentNode.removeChild(g[h]):g[h]);return g},cleanData:function(a){var b,c,e=d.cache,f=d.expando,g=d.event.special,h=d.support.deleteExpando;for(var i=0,j;(j=a[i])!=null;i++){if(j.nodeName&&d.noData[j.nodeName.toLowerCase()])continue;c=j[d.expando];if(c){b=e[c]&&e[c][f];if(b&&b.events){for(var k in b.events)g[k]?d.event.remove(j,k):d.removeEvent(j,k,b.handle);b.handle&&(b.handle.elem=null)}h?delete j[d.expando]:j.removeAttribute&&j.removeAttribute(d.expando),delete e[c]}}}});var bd=/alpha\([^)]*\)/i,be=/opacity=([^)]*)/,bf=/-([a-z])/ig,bg=/([A-Z]|^ms)/g,bh=/^-?\d+(?:px)?$/i,bi=/^-?\d/,bj={position:"absolute",visibility:"hidden",display:"block"},bk=["Left","Right"],bl=["Top","Bottom"],bm,bn,bo,bp=function(a,b){return b.toUpperCase()};d.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return d.access(this,a,c,!0,function(a,c,e){return e!==b?d.style(a,c,e):d.css(a,c)})},d.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bm(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{zIndex:!0,fontWeight:!0,opacity:!0,zoom:!0,lineHeight:!0},cssProps:{"float":d.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,e,f){if(a&&a.nodeType!==3&&a.nodeType!==8&&a.style){var g,h=d.camelCase(c),i=a.style,j=d.cssHooks[h];c=d.cssProps[h]||h;if(e===b){if(j&&"get"in j&&(g=j.get(a,!1,f))!==b)return g;return i[c]}if(typeof e==="number"&&isNaN(e)||e==null)return;typeof e==="number"&&!d.cssNumber[h]&&(e+="px");if(!j||!("set"in j)||(e=j.set(a,e))!==b)try{i[c]=e}catch(k){}}},css:function(a,c,e){var f,g=d.camelCase(c),h=d.cssHooks[g];c=d.cssProps[g]||g;if(h&&"get"in h&&(f=h.get(a,!0,e))!==b)return f;if(bm)return bm(a,c,g)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]},camelCase:function(a){return a.replace(bf,bp)}}),d.curCSS=d.css,d.each(["height","width"],function(a,b){d.cssHooks[b]={get:function(a,c,e){var f;if(c){a.offsetWidth!==0?f=bq(a,b,e):d.swap(a,bj,function(){f=bq(a,b,e)});if(f<=0){f=bm(a,b,b),f==="0px"&&bo&&(f=bo(a,b,b));if(f!=null)return f===""||f==="auto"?"0px":f}if(f<0||f==null){f=a.style[b];return f===""||f==="auto"?"0px":f}return typeof f==="string"?f:f+"px"}},set:function(a,b){if(!bh.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),d.support.opacity||(d.cssHooks.opacity={get:function(a,b){return be.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style;c.zoom=1;var e=d.isNaN(b)?"":"alpha(opacity="+b*100+")",f=c.filter||"";c.filter=bd.test(f)?f.replace(bd,e):c.filter+" "+e}}),d(function(){d.support.reliableMarginRight||(d.cssHooks.marginRight={get:function(a,b){var c;d.swap(a,{display:"inline-block"},function(){b?c=bm(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bn=function(a,c,e){var f,g,h;e=e.replace(bg,"-$1").toLowerCase();if(!(g=a.ownerDocument.defaultView))return b;if(h=g.getComputedStyle(a,null))f=h.getPropertyValue(e),f===""&&!d.contains(a.ownerDocument.documentElement,a)&&(f=d.style(a,e));return f}),c.documentElement.currentStyle&&(bo=function(a,b){var c,d=a.currentStyle&&a.currentStyle[b],e=a.runtimeStyle&&a.runtimeStyle[b],f=a.style;!bh.test(d)&&bi.test(d)&&(c=f.left,e&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":d||0,d=f.pixelLeft+"px",f.left=c,e&&(a.runtimeStyle.left=e));return d===""?"auto":d}),bm=bn||bo,d.expr&&d.expr.filters&&(d.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!d.support.reliableHiddenOffsets&&(a.style.display||d.css(a,"display"))==="none"},d.expr.filters.visible=function(a){return!d.expr.filters.hidden(a)});var br=/%20/g,bs=/\[\]$/,bt=/\r?\n/g,bu=/#.*$/,bv=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bw=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bx=/^(?:about|app|app\-storage|.+\-extension|file|widget):$/,by=/^(?:GET|HEAD)$/,bz=/^\/\//,bA=/\?/,bB=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bC=/^(?:select|textarea)/i,bD=/\s+/,bE=/([?&])_=[^&]*/,bF=/(^|\-)([a-z])/g,bG=function(a,b,c){return b+c.toUpperCase()},bH=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bI=d.fn.load,bJ={},bK={},bL,bM;try{bL=c.location.href}catch(bN){bL=c.createElement("a"),bL.href="",bL=bL.href}bM=bH.exec(bL.toLowerCase())||[],d.fn.extend({load:function(a,c,e){if(typeof a!=="string"&&bI)return bI.apply(this,arguments);if(!this.length)return this;var f=a.indexOf(" ");if(f>=0){var g=a.slice(f,a.length);a=a.slice(0,f)}var h="GET";c&&(d.isFunction(c)?(e=c,c=b):typeof c==="object"&&(c=d.param(c,d.ajaxSettings.traditional),h="POST"));var i=this;d.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?d("<div>").append(c.replace(bB,"")).find(g):c)),e&&i.each(e,[c,b,a])}});return this},serialize:function(){return d.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?d.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bC.test(this.nodeName)||bw.test(this.type))}).map(function(a,b){var c=d(this).val();return c==null?null:d.isArray(c)?d.map(c,function(a,c){return{name:b.name,value:a.replace(bt,"\r\n")}}):{name:b.name,value:c.replace(bt,"\r\n")}}).get()}}),d.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){d.fn[b]=function(a){return this.bind(b,a)}}),d.each(["get","post"],function(a,c){d[c]=function(a,e,f,g){d.isFunction(e)&&(g=g||f,f=e,e=b);return d.ajax({type:c,url:a,data:e,success:f,dataType:g})}}),d.extend({getScript:function(a,c){return d.get(a,b,c,"script")},getJSON:function(a,b,c){return d.get(a,b,c,"json")},ajaxSetup:function(a,b){b?d.extend(!0,a,d.ajaxSettings,b):(b=a,a=d.extend(!0,d.ajaxSettings,b));for(var c in {context:1,url:1})c in b?a[c]=b[c]:c in d.ajaxSettings&&(a[c]=d.ajaxSettings[c]);return a},ajaxSettings:{url:bL,isLocal:bx.test(bM[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":"*/*"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":d.parseJSON,"text xml":d.parseXML}},ajaxPrefilter:bO(bJ),ajaxTransport:bO(bK),ajax:function(a,c){function v(a,c,l,n){if(r!==2){r=2,p&&clearTimeout(p),o=b,m=n||"",u.readyState=a?4:0;var q,t,v,w=l?bR(e,u,l):b,x,y;if(a>=200&&a<300||a===304){if(e.ifModified){if(x=u.getResponseHeader("Last-Modified"))d.lastModified[k]=x;if(y=u.getResponseHeader("Etag"))d.etag[k]=y}if(a===304)c="notmodified",q=!0;else try{t=bS(e,w),c="success",q=!0}catch(z){c="parsererror",v=z}}else{v=c;if(!c||a)c="error",a<0&&(a=0)}u.status=a,u.statusText=c,q?h.resolveWith(f,[t,c,u]):h.rejectWith(f,[u,c,v]),u.statusCode(j),j=b,s&&g.trigger("ajax"+(q?"Success":"Error"),[u,e,q?t:v]),i.resolveWith(f,[u,c]),s&&(g.trigger("ajaxComplete",[u,e]),--d.active||d.event.trigger("ajaxStop"))}}typeof a==="object"&&(c=a,a=b),c=c||{};var e=d.ajaxSetup({},c),f=e.context||e,g=f!==e&&(f.nodeType||f instanceof d)?d(f):d.event,h=d.Deferred(),i=d._Deferred(),j=e.statusCode||{},k,l={},m,n,o,p,q,r=0,s,t,u={readyState:0,setRequestHeader:function(a,b){r||(l[a.toLowerCase().replace(bF,bG)]=b);return this},getAllResponseHeaders:function(){return r===2?m:null},getResponseHeader:function(a){var c;if(r===2){if(!n){n={};while(c=bv.exec(m))n[c[1].toLowerCase()]=c[2]}c=n[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){r||(e.mimeType=a);return this},abort:function(a){a=a||"abort",o&&o.abort(a),v(0,a);return this}};h.promise(u),u.success=u.done,u.error=u.fail,u.complete=i.done,u.statusCode=function(a){if(a){var b;if(r<2)for(b in a)j[b]=[j[b],a[b]];else b=a[u.status],u.then(b,b)}return this},e.url=((a||e.url)+"").replace(bu,"").replace(bz,bM[1]+"//"),e.dataTypes=d.trim(e.dataType||"*").toLowerCase().split(bD),e.crossDomain==null&&(q=bH.exec(e.url.toLowerCase()),e.crossDomain=q&&(q[1]!=bM[1]||q[2]!=bM[2]||(q[3]||(q[1]==="http:"?80:443))!=(bM[3]||(bM[1]==="http:"?80:443)))),e.data&&e.processData&&typeof e.data!=="string"&&(e.data=d.param(e.data,e.traditional)),bP(bJ,e,c,u);if(r===2)return!1;s=e.global,e.type=e.type.toUpperCase(),e.hasContent=!by.test(e.type),s&&d.active++===0&&d.event.trigger("ajaxStart");if(!e.hasContent){e.data&&(e.url+=(bA.test(e.url)?"&":"?")+e.data),k=e.url;if(e.cache===!1){var w=d.now(),x=e.url.replace(bE,"$1_="+w);e.url=x+(x===e.url?(bA.test(e.url)?"&":"?")+"_="+w:"")}}if(e.data&&e.hasContent&&e.contentType!==!1||c.contentType)l["Content-Type"]=e.contentType;e.ifModified&&(k=k||e.url,d.lastModified[k]&&(l["If-Modified-Since"]=d.lastModified[k]),d.etag[k]&&(l["If-None-Match"]=d.etag[k])),l.Accept=e.dataTypes[0]&&e.accepts[e.dataTypes[0]]?e.accepts[e.dataTypes[0]]+(e.dataTypes[0]!=="*"?", */*; q=0.01":""):e.accepts["*"];for(t in e.headers)u.setRequestHeader(t,e.headers[t]);if(e.beforeSend&&(e.beforeSend.call(f,u,e)===!1||r===2)){u.abort();return!1}for(t in {success:1,error:1,complete:1})u[t](e[t]);o=bP(bK,e,c,u);if(o){u.readyState=1,s&&g.trigger("ajaxSend",[u,e]),e.async&&e.timeout>0&&(p=setTimeout(function(){u.abort("timeout")},e.timeout));try{r=1,o.send(l,v)}catch(y){status<2?v(-1,y):d.error(y)}}else v(-1,"No Transport");return u},param:function(a,c){var e=[],f=function(a,b){b=d.isFunction(b)?b():b,e[e.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=d.ajaxSettings.traditional);if(d.isArray(a)||a.jquery&&!d.isPlainObject(a))d.each(a,function(){f(this.name,this.value)});else for(var g in a)bQ(g,a[g],c,f);return e.join("&").replace(br,"+")}}),d.extend({active:0,lastModified:{},etag:{}});var bT=d.now(),bU=/(\=)\?(&|$)|\?\?/i;d.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return d.expando+"_"+bT++}}),d.ajaxPrefilter("json jsonp",function(b,c,e){var f=typeof b.data==="string";if(b.dataTypes[0]==="jsonp"||c.jsonpCallback||c.jsonp!=null||b.jsonp!==!1&&(bU.test(b.url)||f&&bU.test(b.data))){var g,h=b.jsonpCallback=d.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2",m=function(){a[h]=i,g&&d.isFunction(i)&&a[h](g[0])};b.jsonp!==!1&&(j=j.replace(bU,l),b.url===j&&(f&&(k=k.replace(bU,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},e.then(m,m),b.converters["script json"]=function(){g||d.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),d.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){d.globalEval(a);return a}}}),d.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),d.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var bV=d.now(),bW,bX;d.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&bZ()||b$()}:bZ,bX=d.ajaxSettings.xhr(),d.support.ajax=!!bX,d.support.cors=bX&&"withCredentials"in bX,bX=b,d.support.ajax&&d.ajaxTransport(function(a){if(!a.crossDomain||d.support.cors){var c;return{send:function(e,f){var g=a.xhr(),h,i;a.username?g.open(a.type,a.url,a.async,a.username,a.password):g.open(a.type,a.url,a.async);if(a.xhrFields)for(i in a.xhrFields)g[i]=a.xhrFields[i];a.mimeType&&g.overrideMimeType&&g.overrideMimeType(a.mimeType),!a.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(i in e)g.setRequestHeader(i,e[i])}catch(j){}g.send(a.hasContent&&a.data||null),c=function(e,i){var j,k,l,m,n;try{if(c&&(i||g.readyState===4)){c=b,h&&(g.onreadystatechange=d.noop,delete bW[h]);if(i)g.readyState!==4&&g.abort();else{j=g.status,l=g.getAllResponseHeaders(),m={},n=g.responseXML,n&&n.documentElement&&(m.xml=n),m.text=g.responseText;try{k=g.statusText}catch(o){k=""}j||!a.isLocal||a.crossDomain?j===1223&&(j=204):j=m.text?200:404}}}catch(p){i||f(-1,p)}m&&f(j,k,m,l)},a.async&&g.readyState!==4?(bW||(bW={},bY()),h=bV++,g.onreadystatechange=bW[h]=c):c()},abort:function(){c&&c(0,1)}}}});var b_={},ca=/^(?:toggle|show|hide)$/,cb=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cc,cd=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];d.fn.extend({show:function(a,b,c){var e,f;if(a||a===0)return this.animate(ce("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)e=this[g],f=e.style.display,!d._data(e,"olddisplay")&&f==="none"&&(f=e.style.display=""),f===""&&d.css(e,"display")==="none"&&d._data(e,"olddisplay",cf(e.nodeName));for(g=0;g<h;g++){e=this[g],f=e.style.display;if(f===""||f==="none")e.style.display=d._data(e,"olddisplay")||""}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ce("hide",3),a,b,c);for(var e=0,f=this.length;e<f;e++){var g=d.css(this[e],"display");g!=="none"&&!d._data(this[e],"olddisplay")&&d._data(this[e],"olddisplay",g)}for(e=0;e<f;e++)this[e].style.display="none";return this},_toggle:d.fn.toggle,toggle:function(a,b,c){var e=typeof a==="boolean";d.isFunction(a)&&d.isFunction(b)?this._toggle.apply(this,arguments):a==null||e?this.each(function(){var b=e?a:d(this).is(":hidden");d(this)[b?"show":"hide"]()}):this.animate(ce("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,e){var f=d.speed(b,c,e);if(d.isEmptyObject(a))return this.each(f.complete);return this[f.queue===!1?"each":"queue"](function(){var b=d.extend({},f),c,e=this.nodeType===1,g=e&&d(this).is(":hidden"),h=this;for(c in a){var i=d.camelCase(c);c!==i&&(a[i]=a[c],delete a[c],c=i);if(a[c]==="hide"&&g||a[c]==="show"&&!g)return b.complete.call(this);if(e&&(c==="height"||c==="width")){b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY];if(d.css(this,"display")==="inline"&&d.css(this,"float")==="none")if(d.support.inlineBlockNeedsLayout){var j=cf(this.nodeName);j==="inline"?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1)}else this.style.display="inline-block"}d.isArray(a[c])&&((b.specialEasing=b.specialEasing||{})[c]=a[c][1],a[c]=a[c][0])}b.overflow!=null&&(this.style.overflow="hidden"),b.curAnim=d.extend({},a),d.each(a,function(c,e){var f=new d.fx(h,b,c);if(ca.test(e))f[e==="toggle"?g?"show":"hide":e](a);else{var i=cb.exec(e),j=f.cur();if(i){var k=parseFloat(i[2]),l=i[3]||(d.cssNumber[c]?"":"px");l!=="px"&&(d.style(h,c,(k||1)+l),j=(k||1)/f.cur()*j,d.style(h,c,j+l)),i[1]&&(k=(i[1]==="-="?-1:1)*k+j),f.custom(j,k,l)}else f.custom(j,e,"")}});return!0})},stop:function(a,b){var c=d.timers;a&&this.queue([]),this.each(function(){for(var a=c.length-1;a>=0;a--)c[a].elem===this&&(b&&c[a](!0),c.splice(a,1))}),b||this.dequeue();return this}}),d.each({slideDown:ce("show",1),slideUp:ce("hide",1),slideToggle:ce("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){d.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),d.extend({speed:function(a,b,c){var e=a&&typeof a==="object"?d.extend({},a):{complete:c||!c&&b||d.isFunction(a)&&a,duration:a,easing:c&&b||b&&!d.isFunction(b)&&b};e.duration=d.fx.off?0:typeof e.duration==="number"?e.duration:e.duration in d.fx.speeds?d.fx.speeds[e.duration]:d.fx.speeds._default,e.old=e.complete,e.complete=function(){e.queue!==!1&&d(this).dequeue(),d.isFunction(e.old)&&e.old.call(this)};return e},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig||(b.orig={})}}),d.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(d.fx.step[this.prop]||d.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=d.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,b,c){function g(a){return e.step(a)}var e=this,f=d.fx;this.startTime=d.now(),this.start=a,this.end=b,this.unit=c||this.unit||(d.cssNumber[this.prop]?"":"px"),this.now=this.start,this.pos=this.state=0,g.elem=this.elem,g()&&d.timers.push(g)&&!cc&&(cc=setInterval(f.tick,f.interval))},show:function(){this.options.orig[this.prop]=d.style(this.elem,this.prop),this.options.show=!0,this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),d(this.elem).show()},hide:function(){this.options.orig[this.prop]=d.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b=d.now(),c=!0;if(a||b>=this.options.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),this.options.curAnim[this.prop]=!0;for(var e in this.options.curAnim)this.options.curAnim[e]!==!0&&(c=!1);if(c){if(this.options.overflow!=null&&!d.support.shrinkWrapBlocks){var f=this.elem,g=this.options;d.each(["","X","Y"],function(a,b){f.style["overflow"+b]=g.overflow[a]})}this.options.hide&&d(this.elem).hide();if(this.options.hide||this.options.show)for(var h in this.options.curAnim)d.style(this.elem,h,this.options.orig[h]);this.options.complete.call(this.elem)}return!1}var i=b-this.startTime;this.state=i/this.options.duration;var j=this.options.specialEasing&&this.options.specialEasing[this.prop],k=this.options.easing||(d.easing.swing?"swing":"linear");this.pos=d.easing[j||k](this.state,i,0,1,this.options.duration),this.now=this.start+(this.end-this.start)*this.pos,this.update();return!0}},d.extend(d.fx,{tick:function(){var a=d.timers;for(var b=0;b<a.length;b++)a[b]()||a.splice(b--,1);a.length||d.fx.stop()},interval:13,stop:function(){clearInterval(cc),cc=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){d.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit:a.elem[a.prop]=a.now}}}),d.expr&&d.expr.filters&&(d.expr.filters.animated=function(a){return d.grep(d.timers,function(b){return a===b.elem}).length});var cg=/^t(?:able|d|h)$/i,ch=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?d.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){d.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return d.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(e){}var f=b.ownerDocument,g=f.documentElement;if(!c||!d.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=f.body,i=ci(f),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||d.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||d.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:d.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){d.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return d.offset.bodyOffset(b);d.offset.initialize();var c,e=b.offsetParent,f=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(d.offset.supportsFixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===e&&(l+=b.offsetTop,m+=b.offsetLeft,d.offset.doesNotAddBorder&&(!d.offset.doesAddBorderForTableAndCells||!cg.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),f=e,e=b.offsetParent),d.offset.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;d.offset.supportsFixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},d.offset={initialize:function(){var a=c.body,b=c.createElement("div"),e,f,g,h,i=parseFloat(d.css(a,"marginTop"))||0,j="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";d.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"}),b.innerHTML=j,a.insertBefore(b,a.firstChild),e=b.firstChild,f=e.firstChild,h=e.nextSibling.firstChild.firstChild,this.doesNotAddBorder=f.offsetTop!==5,this.doesAddBorderForTableAndCells=h.offsetTop===5,f.style.position="fixed",f.style.top="20px",this.supportsFixedPosition=f.offsetTop===20||f.offsetTop===15,f.style.position=f.style.top="",e.style.overflow="hidden",e.style.position="relative",this.subtractsBorderForOverflowNotVisible=f.offsetTop===-5,this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==i,a.removeChild(b),d.offset.initialize=d.noop},bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;d.offset.initialize(),d.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(d.css(a,"marginTop"))||0,c+=parseFloat(d.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var e=d.css(a,"position");e==="static"&&(a.style.position="relative");var f=d(a),g=f.offset(),h=d.css(a,"top"),i=d.css(a,"left"),j=(e==="absolute"||e==="fixed")&&d.inArray("auto",[h,i])>-1,k={},l={},m,n;j&&(l=f.position()),m=j?l.top:parseInt(h,10)||0,n=j?l.left:parseInt(i,10)||0,d.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):f.css(k)}},d.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),e=ch.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(d.css(a,"marginTop"))||0,c.left-=parseFloat(d.css(a,"marginLeft"))||0,e.top+=parseFloat(d.css(b[0],"borderTopWidth"))||0,e.left+=parseFloat(d.css(b[0],"borderLeftWidth"))||0;return{top:c.top-e.top,left:c.left-e.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&(!ch.test(a.nodeName)&&d.css(a,"position")==="static"))a=a.offsetParent;return a})}}),d.each(["Left","Top"],function(a,c){var e="scroll"+c;d.fn[e]=function(c){var f=this[0],g;if(!f)return null;if(c!==b)return this.each(function(){g=ci(this),g?g.scrollTo(a?d(g).scrollLeft():c,a?c:d(g).scrollTop()):this[e]=c});g=ci(f);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:d.support.boxModel&&g.document.documentElement[e]||g.document.body[e]:f[e]}}),d.each(["Height","Width"],function(a,c){var e=c.toLowerCase();d.fn["inner"+c]=function(){return this[0]?parseFloat(d.css(this[0],e,"padding")):null},d.fn["outer"+c]=function(a){return this[0]?parseFloat(d.css(this[0],e,a?"margin":"border")):null},d.fn[e]=function(a){var f=this[0];if(!f)return a==null?null:this;if(d.isFunction(a))return this.each(function(b){var c=d(this);c[e](a.call(this,b,c[e]()))});if(d.isWindow(f)){var g=f.document.documentElement["client"+c];return f.document.compatMode==="CSS1Compat"&&g||f.document.body["client"+c]||g}if(f.nodeType===9)return Math.max(f.documentElement["client"+c],f.body["scroll"+c],f.documentElement["scroll"+c],f.body["offset"+c],f.documentElement["offset"+c]);if(a===b){var h=d.css(f,e),i=parseFloat(h);return d.isNaN(i)?h:i}return this.css(e,typeof a==="string"?a:a+"px")}}),a.jQuery=a.$=d})(window);(function ($) {
	if (jQuery.fn.jquery.indexOf('1.5') == -1) {
		alert('Remover o script jquery.fix.js do header.jsp para esta versão de jQuery');
		return;
	}
	
	/* 
	 * A correção abaixo, é devido ao bug http://bugs.jquery.com/ticket/8755
	 * Esse código foi copiado da versão do 1.5.2 e alterado apenas a linha desse commit: https://github.com/jquery/jquery/commit/adef5c3550141960089e2634619ef028931f4765
	 */
	$.event.add = function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// TODO :: Use a try/catch until it's safe to pull this out (likely 1.6)
		// Minor release fix for bug #8018
		try {
			// For whatever reason, IE has trouble passing the window object
			// around, causing it to be cloned in the process
			if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
				elem = window;
			}
		}
		catch ( e ) {}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	};
	
	/* 
	 * A correção abaixo, é devido ao bug http://dev.jquery.it/ticket/7071
	 * Esse código foi copiado da versão do 1.6.1 do jQuery 
	 */
	$.extend(jQuery.expr.filters, {
		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}

	});
	
})(jQuery);

/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version 1.09i
 */
var Cufon=(function(){var m=function(){return m.replace.apply(null,arguments)};var x=m.DOM={ready:(function(){var C=false,E={loaded:1,complete:1};var B=[],D=function(){if(C){return}C=true;for(var F;F=B.shift();F()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",D,false);window.addEventListener("pageshow",D,false)}if(!window.opera&&document.readyState){(function(){E[document.readyState]?D():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");D()}catch(F){setTimeout(arguments.callee,1)}})()}q(window,"load",D);return function(F){if(!arguments.length){D()}else{C?F():B.push(F)}}})(),root:function(){return document.documentElement||document.body}};var n=m.CSS={Size:function(C,B){this.value=parseFloat(C);this.unit=String(C).match(/[a-z%]*$/)[0]||"px";this.convert=function(D){return D/B*this.value};this.convertFrom=function(D){return D/this.value*B};this.toString=function(){return this.value+this.unit}},addClass:function(C,B){var D=C.className;C.className=D+(D&&" ")+B;return C},color:j(function(C){var B={};B.color=C.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(E,D,F){B.opacity=parseFloat(F);return"rgb("+D+")"});return B}),fontStretch:j(function(B){if(typeof B=="number"){return B}if(/%$/.test(B)){return parseFloat(B)/100}return{"ultra-condensed":0.5,"extra-condensed":0.625,condensed:0.75,"semi-condensed":0.875,"semi-expanded":1.125,expanded:1.25,"extra-expanded":1.5,"ultra-expanded":2}[B]||1}),getStyle:function(C){var B=document.defaultView;if(B&&B.getComputedStyle){return new a(B.getComputedStyle(C,null))}if(C.currentStyle){return new a(C.currentStyle)}return new a(C.style)},gradient:j(function(F){var G={id:F,type:F.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},C=F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var E=0,B=C.length,D;E<B;++E){D=C[E].split("=",2).reverse();G.stops.push([D[1]||E/(B-1),D[0]])}return G}),quotedList:j(function(E){var D=[],C=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,B;while(B=C.exec(E)){D.push(B[3]||B[1])}return D}),recognizesMedia:j(function(G){var E=document.createElement("style"),D,C,B;E.type="text/css";E.media=G;try{E.appendChild(document.createTextNode("/**/"))}catch(F){}C=g("head")[0];C.insertBefore(E,C.firstChild);D=(E.sheet||E.styleSheet);B=D&&!D.disabled;C.removeChild(E);return B}),removeClass:function(D,C){var B=RegExp("(?:^|\\s+)"+C+"(?=\\s|$)","g");D.className=D.className.replace(B,"");return D},supports:function(D,C){var B=document.createElement("span").style;if(B[D]===undefined){return false}B[D]=C;return B[D]===C},textAlign:function(E,D,B,C){if(D.get("textAlign")=="right"){if(B>0){E=" "+E}}else{if(B<C-1){E+=" "}}return E},textShadow:j(function(F){if(F=="none"){return null}var E=[],G={},B,C=0;var D=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(B=D.exec(F)){if(B[0]==","){E.push(G);G={};C=0}else{if(B[1]){G.color=B[1]}else{G[["offX","offY","blur"][C++]]=B[2]}}}E.push(G);return E}),textTransform:(function(){var B={uppercase:function(C){return C.toUpperCase()},lowercase:function(C){return C.toLowerCase()},capitalize:function(C){return C.replace(/\b./g,function(D){return D.toUpperCase()})}};return function(E,D){var C=B[D.get("textTransform")];return C?C(E):E}})(),whiteSpace:(function(){var D={inline:1,"inline-block":1,"run-in":1};var C=/^\s+/,B=/\s+$/;return function(H,F,G,E){if(E){if(E.nodeName.toLowerCase()=="br"){H=H.replace(C,"")}}if(D[F.get("display")]){return H}if(!G.previousSibling){H=H.replace(C,"")}if(!G.nextSibling){H=H.replace(B,"")}return H}})()};n.ready=(function(){var B=!n.recognizesMedia("all"),E=false;var D=[],H=function(){B=true;for(var K;K=D.shift();K()){}};var I=g("link"),J=g("style");function C(K){return K.disabled||G(K.sheet,K.media||"screen")}function G(M,P){if(!n.recognizesMedia(P||"all")){return true}if(!M||M.disabled){return false}try{var Q=M.cssRules,O;if(Q){search:for(var L=0,K=Q.length;O=Q[L],L<K;++L){switch(O.type){case 2:break;case 3:if(!G(O.styleSheet,O.media.mediaText)){return false}break;default:break search}}}}catch(N){}return true}function F(){if(document.createStyleSheet){return true}var L,K;for(K=0;L=I[K];++K){if(L.rel.toLowerCase()=="stylesheet"&&!C(L)){return false}}for(K=0;L=J[K];++K){if(!C(L)){return false}}return true}x.ready(function(){if(!E){E=n.getStyle(document.body).isUsable()}if(B||(E&&F())){H()}else{setTimeout(arguments.callee,10)}});return function(K){if(B){K()}else{D.push(K)}}})();function s(D){var C=this.face=D.face,B={"\u0020":1,"\u00a0":1,"\u3000":1};this.glyphs=D.glyphs;this.w=D.w;this.baseSize=parseInt(C["units-per-em"],10);this.family=C["font-family"].toLowerCase();this.weight=C["font-weight"];this.style=C["font-style"]||"normal";this.viewBox=(function(){var F=C.bbox.split(/\s+/);var E={minX:parseInt(F[0],10),minY:parseInt(F[1],10),maxX:parseInt(F[2],10),maxY:parseInt(F[3],10)};E.width=E.maxX-E.minX;E.height=E.maxY-E.minY;E.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return E})();this.ascent=-parseInt(C.ascent,10);this.descent=-parseInt(C.descent,10);this.height=-this.ascent+this.descent;this.spacing=function(L,N,E){var O=this.glyphs,M,K,G,P=[],F=0,J=-1,I=-1,H;while(H=L[++J]){M=O[H]||this.missingGlyph;if(!M){continue}if(K){F-=G=K[H]||0;P[I]-=G}F+=P[++I]=~~(M.w||this.w)+N+(B[H]?E:0);K=M.k}P.total=F;return P}}function f(){var C={},B={oblique:"italic",italic:"oblique"};this.add=function(D){(C[D.style]||(C[D.style]={}))[D.weight]=D};this.get=function(H,I){var G=C[H]||C[B[H]]||C.normal||C.italic||C.oblique;if(!G){return null}I={normal:400,bold:700}[I]||parseInt(I,10);if(G[I]){return G[I]}var E={1:1,99:0}[I%100],K=[],F,D;if(E===undefined){E=I>400}if(I==500){I=400}for(var J in G){if(!k(G,J)){continue}J=parseInt(J,10);if(!F||J<F){F=J}if(!D||J>D){D=J}K.push(J)}if(I<F){I=F}if(I>D){I=D}K.sort(function(M,L){return(E?(M>=I&&L>=I)?M<L:M>L:(M<=I&&L<=I)?M>L:M<L)?-1:1});return G[K[0]]}}function r(){function D(F,G){if(F.contains){return F.contains(G)}return F.compareDocumentPosition(G)&16}function B(G){var F=G.relatedTarget;if(!F||D(this,F)){return}C(this,G.type=="mouseover")}function E(F){C(this,F.type=="mouseenter")}function C(F,G){setTimeout(function(){var H=d.get(F).options;m.replace(F,G?h(H,H.hover):H,true)},10)}this.attach=function(F){if(F.onmouseenter===undefined){q(F,"mouseover",B);q(F,"mouseout",B)}else{q(F,"mouseenter",E);q(F,"mouseleave",E)}}}function u(){var C=[],D={};function B(H){var E=[],G;for(var F=0;G=H[F];++F){E[F]=C[D[G]]}return E}this.add=function(F,E){D[F]=C.push(E)-1};this.repeat=function(){var E=arguments.length?B(arguments):C,F;for(var G=0;F=E[G++];){m.replace(F[0],F[1],true)}}}function A(){var D={},B=0;function C(E){return E.cufid||(E.cufid=++B)}this.get=function(E){var F=C(E);return D[F]||(D[F]={})}}function a(B){var D={},C={};this.extend=function(E){for(var F in E){if(k(E,F)){D[F]=E[F]}}return this};this.get=function(E){return D[E]!=undefined?D[E]:B[E]};this.getSize=function(F,E){return C[F]||(C[F]=new n.Size(this.get(F),E))};this.isUsable=function(){return !!B}}function q(C,B,D){if(C.addEventListener){C.addEventListener(B,D,false)}else{if(C.attachEvent){C.attachEvent("on"+B,function(){return D.call(C,window.event)})}}}function v(C,B){var D=d.get(C);if(D.options){return C}if(B.hover&&B.hoverables[C.nodeName.toLowerCase()]){b.attach(C)}D.options=B;return C}function j(B){var C={};return function(D){if(!k(C,D)){C[D]=B.apply(null,arguments)}return C[D]}}function c(F,E){var B=n.quotedList(E.get("fontFamily").toLowerCase()),D;for(var C=0;D=B[C];++C){if(i[D]){return i[D].get(E.get("fontStyle"),E.get("fontWeight"))}}return null}function g(B){return document.getElementsByTagName(B)}function k(C,B){return C.hasOwnProperty(B)}function h(){var C={},B,F;for(var E=0,D=arguments.length;B=arguments[E],E<D;++E){for(F in B){if(k(B,F)){C[F]=B[F]}}}return C}function o(E,M,C,N,F,D){var K=document.createDocumentFragment(),H;if(M===""){return K}var L=N.separate;var I=M.split(p[L]),B=(L=="words");if(B&&t){if(/^\s/.test(M)){I.unshift("")}if(/\s$/.test(M)){I.push("")}}for(var J=0,G=I.length;J<G;++J){H=z[N.engine](E,B?n.textAlign(I[J],C,J,G):I[J],C,N,F,D,J<G-1);if(H){K.appendChild(H)}}return K}function l(D,M){var C=D.nodeName.toLowerCase();if(M.ignore[C]){return}var E=!M.textless[C];var B=n.getStyle(v(D,M)).extend(M);var F=c(D,B),G,K,I,H,L,J;if(!F){return}for(G=D.firstChild;G;G=I){K=G.nodeType;I=G.nextSibling;if(E&&K==3){if(H){H.appendData(G.data);D.removeChild(G)}else{H=G}if(I){continue}}if(H){D.replaceChild(o(F,n.whiteSpace(H.data,B,H,J),B,M,G,D),H);H=null}if(K==1){if(G.firstChild){if(G.nodeName.toLowerCase()=="cufon"){z[M.engine](F,null,B,M,G,D)}else{arguments.callee(G,M)}}J=G}}}var t=" ".split(/\s+/).length==0;var d=new A();var b=new r();var y=new u();var e=false;var z={},i={},w={autoDetect:false,engine:null,forceHitArea:false,hover:false,hoverables:{a:true},ignore:{applet:1,canvas:1,col:1,colgroup:1,head:1,iframe:1,map:1,optgroup:1,option:1,script:1,select:1,style:1,textarea:1,title:1,pre:1},printable:true,selector:(window.Sizzle||(window.jQuery&&function(B){return jQuery(B)})||(window.dojo&&dojo.query)||(window.Ext&&Ext.query)||(window.YAHOO&&YAHOO.util&&YAHOO.util.Selector&&YAHOO.util.Selector.query)||(window.$$&&function(B){return $$(B)})||(window.$&&function(B){return $(B)})||(document.querySelectorAll&&function(B){return document.querySelectorAll(B)})||g),separate:"words",textless:{dl:1,html:1,ol:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,ul:1},textShadow:"none"};var p={words:/\s/.test("\u00a0")?/[^\S\u00a0]+/:/\s+/,characters:"",none:/^/};m.now=function(){x.ready();return m};m.refresh=function(){y.repeat.apply(y,arguments);return m};m.registerEngine=function(C,B){if(!B){return m}z[C]=B;return m.set("engine",C)};m.registerFont=function(D){if(!D){return m}var B=new s(D),C=B.family;if(!i[C]){i[C]=new f()}i[C].add(B);return m.set("fontFamily",'"'+C+'"')};m.replace=function(D,C,B){C=h(w,C);if(!C.engine){return m}if(!e){n.addClass(x.root(),"cufon-active cufon-loading");n.ready(function(){n.addClass(n.removeClass(x.root(),"cufon-loading"),"cufon-ready")});e=true}if(C.hover){C.forceHitArea=true}if(C.autoDetect){delete C.fontFamily}if(typeof C.textShadow=="string"){C.textShadow=n.textShadow(C.textShadow)}if(typeof C.color=="string"&&/^-/.test(C.color)){C.textGradient=n.gradient(C.color)}else{delete C.textGradient}if(!B){y.add(D,arguments)}if(D.nodeType||typeof D=="string"){D=[D]}n.ready(function(){for(var F=0,E=D.length;F<E;++F){var G=D[F];if(typeof G=="string"){m.replace(C.selector(G),C,true)}else{l(G,C)}}});return m};m.set=function(B,C){w[B]=C;return m};return m})();Cufon.registerEngine("vml",(function(){var e=document.namespaces;if(!e){return}e.add("cvml","urn:schemas-microsoft-com:vml");e=null;var b=document.createElement("cvml:shape");b.style.behavior="url(#default#VML)";if(!b.coordsize){return}b=null;var h=(document.documentMode||0)<8;document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:'+(h?"middle":"text-bottom")+";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g,"!important;"));function c(i,j){return a(i,/(?:em|ex|%)$|^[a-z-]+$/i.test(j)?"1em":j)}function a(l,m){if(m==="0"){return 0}if(/px$/i.test(m)){return parseFloat(m)}var k=l.style.left,j=l.runtimeStyle.left;l.runtimeStyle.left=l.currentStyle.left;l.style.left=m.replace("%","em");var i=l.style.pixelLeft;l.style.left=k;l.runtimeStyle.left=j;return i}function f(l,k,j,n){var i="computed"+n,m=k[i];if(isNaN(m)){m=k.get(n);k[i]=m=(m=="normal")?0:~~j.convertFrom(a(l,m))}return m}var g={};function d(p){var q=p.id;if(!g[q]){var n=p.stops,o=document.createElement("cvml:fill"),i=[];o.type="gradient";o.angle=180;o.focus="0";o.method="sigma";o.color=n[0][1];for(var m=1,l=n.length-1;m<l;++m){i.push(n[m][0]*100+"% "+n[m][1])}o.colors=i.join(",");o.color2=n[l][1];g[q]=o}return g[q]}return function(ac,G,Y,C,K,ad,W){var n=(G===null);if(n){G=K.alt}var I=ac.viewBox;var p=Y.computedFontSize||(Y.computedFontSize=new Cufon.CSS.Size(c(ad,Y.get("fontSize"))+"px",ac.baseSize));var y,q;if(n){y=K;q=K.firstChild}else{y=document.createElement("cufon");y.className="cufon cufon-vml";y.alt=G;q=document.createElement("cufoncanvas");y.appendChild(q);if(C.printable){var Z=document.createElement("cufontext");Z.appendChild(document.createTextNode(G));y.appendChild(Z)}if(!W){y.appendChild(document.createElement("cvml:shape"))}}var ai=y.style;var R=q.style;var l=p.convert(I.height),af=Math.ceil(l);var V=af/l;var P=V*Cufon.CSS.fontStretch(Y.get("fontStretch"));var U=I.minX,T=I.minY;R.height=af;R.top=Math.round(p.convert(T-ac.ascent));R.left=Math.round(p.convert(U));ai.height=p.convert(ac.height)+"px";var F=Y.get("color");var ag=Cufon.CSS.textTransform(G,Y).split("");var L=ac.spacing(ag,f(ad,Y,p,"letterSpacing"),f(ad,Y,p,"wordSpacing"));if(!L.length){return null}var k=L.total;var x=-U+k+(I.width-L[L.length-1]);var ah=p.convert(x*P),X=Math.round(ah);var O=x+","+I.height,m;var J="r"+O+"ns";var u=C.textGradient&&d(C.textGradient);var o=ac.glyphs,S=0;var H=C.textShadow;var ab=-1,aa=0,w;while(w=ag[++ab]){var D=o[ag[ab]]||ac.missingGlyph,v;if(!D){continue}if(n){v=q.childNodes[aa];while(v.firstChild){v.removeChild(v.firstChild)}}else{v=document.createElement("cvml:shape");q.appendChild(v)}v.stroked="f";v.coordsize=O;v.coordorigin=m=(U-S)+","+T;v.path=(D.d?"m"+D.d+"xe":"")+"m"+m+J;v.fillcolor=F;if(u){v.appendChild(u.cloneNode(false))}var ae=v.style;ae.width=X;ae.height=af;if(H){var s=H[0],r=H[1];var B=Cufon.CSS.color(s.color),z;var N=document.createElement("cvml:shadow");N.on="t";N.color=B.color;N.offset=s.offX+","+s.offY;if(r){z=Cufon.CSS.color(r.color);N.type="double";N.color2=z.color;N.offset2=r.offX+","+r.offY}N.opacity=B.opacity||(z&&z.opacity)||1;v.appendChild(N)}S+=L[aa++]}var M=v.nextSibling,t,A;if(C.forceHitArea){if(!M){M=document.createElement("cvml:rect");M.stroked="f";M.className="cufon-vml-cover";t=document.createElement("cvml:fill");t.opacity=0;M.appendChild(t);q.appendChild(M)}A=M.style;A.width=X;A.height=af}else{if(M){q.removeChild(M)}}ai.width=Math.max(Math.ceil(p.convert(k*P)),0);if(h){var Q=Y.computedYAdjust;if(Q===undefined){var E=Y.get("lineHeight");if(E=="normal"){E="1em"}else{if(!isNaN(E)){E+="em"}}Y.computedYAdjust=Q=0.5*(a(ad,E)-parseFloat(ai.height))}if(Q){ai.marginTop=Math.ceil(Q)+"px";ai.marginBottom=Q+"px"}}return y}})());Cufon.registerEngine("canvas",(function(){var b=document.createElement("canvas");if(!b||!b.getContext||!b.getContext.apply){return}b=null;var a=Cufon.CSS.supports("display","inline-block");var e=!a&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var f=document.createElement("style");f.type="text/css";f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(e?"":"font-size:1px;line-height:1px;")+"}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}"+(a?"cufon canvas{position:relative;}":"cufon canvas{position:absolute;}")+"}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(f);function d(p,h){var n=0,m=0;var g=[],o=/([mrvxe])([^a-z]*)/g,k;generate:for(var j=0;k=o.exec(p);++j){var l=k[2].split(",");switch(k[1]){case"v":g[j]={m:"bezierCurveTo",a:[n+~~l[0],m+~~l[1],n+~~l[2],m+~~l[3],n+=~~l[4],m+=~~l[5]]};break;case"r":g[j]={m:"lineTo",a:[n+=~~l[0],m+=~~l[1]]};break;case"m":g[j]={m:"moveTo",a:[n=~~l[0],m=~~l[1]]};break;case"x":g[j]={m:"closePath"};break;case"e":break generate}h[g[j].m].apply(h,g[j].a)}return g}function c(m,k){for(var j=0,h=m.length;j<h;++j){var g=m[j];k[g.m].apply(k,g.a)}}return function(V,w,P,t,C,W){var k=(w===null);if(k){w=C.getAttribute("alt")}var A=V.viewBox;var m=P.getSize("fontSize",V.baseSize);var B=0,O=0,N=0,u=0;var z=t.textShadow,L=[];if(z){for(var U=z.length;U--;){var F=z[U];var K=m.convertFrom(parseFloat(F.offX));var I=m.convertFrom(parseFloat(F.offY));L[U]=[K,I];if(I<B){B=I}if(K>O){O=K}if(I>N){N=I}if(K<u){u=K}}}var Z=Cufon.CSS.textTransform(w,P).split("");var E=V.spacing(Z,~~m.convertFrom(parseFloat(P.get("letterSpacing"))||0),~~m.convertFrom(parseFloat(P.get("wordSpacing"))||0));if(!E.length){return null}var h=E.total;O+=A.width-E[E.length-1];u+=A.minX;var s,n;if(k){s=C;n=C.firstChild}else{s=document.createElement("cufon");s.className="cufon cufon-canvas";s.setAttribute("alt",w);n=document.createElement("canvas");s.appendChild(n);if(t.printable){var S=document.createElement("cufontext");S.appendChild(document.createTextNode(w));s.appendChild(S)}}var aa=s.style;var H=n.style;var j=m.convert(A.height);var Y=Math.ceil(j);var M=Y/j;var G=M*Cufon.CSS.fontStretch(P.get("fontStretch"));var J=h*G;var Q=Math.ceil(m.convert(J+O-u));var o=Math.ceil(m.convert(A.height-B+N));n.width=Q;n.height=o;H.width=Q+"px";H.height=o+"px";B+=A.minY;H.top=Math.round(m.convert(B-V.ascent))+"px";H.left=Math.round(m.convert(u))+"px";var r=Math.max(Math.ceil(m.convert(J)),0)+"px";if(a){aa.width=r;aa.height=m.convert(V.height)+"px"}else{aa.paddingLeft=r;aa.paddingBottom=(m.convert(V.height)-1)+"px"}var X=n.getContext("2d"),D=j/A.height;X.scale(D,D*M);X.translate(-u,-B);X.save();function T(){var x=V.glyphs,ab,l=-1,g=-1,y;X.scale(G,1);while(y=Z[++l]){var ab=x[Z[l]]||V.missingGlyph;if(!ab){continue}if(ab.d){X.beginPath();if(ab.code){c(ab.code,X)}else{ab.code=d("m"+ab.d,X)}X.fill()}X.translate(E[++g],0)}X.restore()}if(z){for(var U=z.length;U--;){var F=z[U];X.save();X.fillStyle=F.color;X.translate.apply(X,L[U]);T()}}var q=t.textGradient;if(q){var v=q.stops,p=X.createLinearGradient(0,A.minY,0,A.maxY);for(var U=0,R=v.length;U<R;++U){p.addColorStop.apply(p,v[U])}X.fillStyle=p}else{X.fillStyle=P.get("color")}T();return s}})());(function($){
	$.smartia = $.extend($.smartia, {
		urls: {
			/**
			 * Obter uma URL cadastrada, substituindo parametros {} se for necessário.
			 * 
			 * (comando)	smartia.urls.get("dummy")
			 * (resultado)	dummy/a/{a}/b/{b}/c/{c}/dummy
	
			 * (comando)	smartia.urls.get("dummy", {a:1, b:2});
			 * (resultado)	dummy/a/1/b/2/c/{c}/dummy
			 */
			get: function(key, params, config) {
				if (key == null) {
					throw new Error("A chave da url deve ser informada");
				}
				config = $.extend({open: "{", close:"}", baseURL: window.baseURL}, config);
				var url = $.smartia.urls.table[key];
				if (url == null) {
					throw new Error("A url '" + key + "' não está cadastrada");
				}
				if (params == null) {
					return config.baseURL + url;
				}
				$.each(params, function(key, value) {
					url = url.replace(config.open + key + config.close, value);				
				});
				$.log("Valor url", key, " -> é '", url, "'");
				return config.baseURL + url;
			}
			/**
			 * Registro de urls do sistema
			 */
			,table: {
				"dummy" : "dummy/a/{a}/b/{b}/c/{c}/dummy"
				,"contato" : "seguro-auto/enviar-contato-fale-conosco"
				,"listarModeloVeiculo": "seguro-auto/simulacao-preco/listarModeloVeiculo"
				,"listarCombustivel": "seguro-auto/simulacao-preco/listar-veiculo-padrao-combustivel"
				,"buscarCep": "seguro-auto/simulacao-preco/buscarEndereco"
				,"consultarSituacaoPedido": "seguro-auto/simulacao-preco/consultar-situacao-pedido"
				,"recalcularSeguradora": "seguro-auto/simulacao-preco/recalcular-seguradora"
				,"obterHtmlFormEspecificoSeguradora": "seguro-auto/simulacao-preco/form-{seguradora}"
				,"obterDadosFormEspecificoSeguradora": "seguro-auto/simulacao-preco/recuperaValoresFormEspecifico"
				,"lead": "seguro-auto/simulacao-preco/seguradora/{seguradora}/corretor/{corretor}/solicitar-contato"
				,"novaLead": "seguro-auto/simulacao-preco/cotacao/solicitar-proposta"
				,"listarProfissoes": "seguro-auto/profissoes/{seguradora}/listar"
			}
		}
	});
})(jQuery);(function ($) {
	/**
	 *  Inicialização da página 
	 **/
	function applicationInitialize() {
		if ($.fn.crossForm) {
			$("select").crossForm();
		}
		
		$(".marcadagua_text").marcadagua();
	
		
		installTooltip();
		window.installTooltip = installTooltip;
		
		$(document.body).maxLengthForTextarea();
		
		installHotkeys();
		
		// Anular right-click nos links dos modais
		$('.disable_context_menu').find('*').andSelf().bind('contextmenu', function() {
			return false;
		});
		
		compileAllTemplates();
	}

	/**
	 *  Inicialização dos tooltips 
	 **/
	function installTooltip() {
		// Habilitar o tooltip de todas as páginas
		$(".ico_tooltip").each(function() {
			var me = $(this);
			if (me.data('tooltip')) {
				//$.log("Tooltip já instalado para o elemento", me);
				return;
			}
			//$.log("Iniciando instalacao do tooltip para o elemento", me);
			me.removeAttr('href');
			var title = me.attr('title');
			if (!title || title == '') {
				//$.log("Criando atributo title para tooltip com html dinamico");
				title = 'custom_html';
				me.attr('title', title);
			}
								
			me.bind('tipCreated', function(e, tooltip, tip) {
				var customTitle = tooltip.getTrigger().parent().next('.tooltip_title:first');
				if (customTitle.length == 0) {
					customTitle = tooltip.getTrigger().next('.tooltip_title:first');
				}
				if (customTitle.length == 0) {
					customTitle = tooltip.getTrigger().parent().find('.tooltip_title:first');
				}
				var tip = tooltip.getTip();
				if (customTitle.length == 1) {
					tip.addClass(customTitle.attr('class'));
					tip.css('cssText', customTitle.css('cssText'));
					tip.html(customTitle.html());
				}
			});
			
			var defaultEvents = 'mouseenter click, blur mouseleave';
			var defaultDelay = 150;
			if (me.hasClass("porque")) {
				defaultEvents = "click, mouseleave";
				defaultDelay = 500;
			}
			me.tooltip({
				// use div.tooltip as our tooltip
				//tip: '.tooltip',
				events: {
					def: defaultEvents,
					tooltip: 'mouseenter, mouseleave'
				},
				// use the fade effect instead of the default
				effect: navigator.userAgent.match(/msie/i) ? 'toggle' : 'fade', // IE Hack: ClearType with DXTransforms in IE7 ( http://blogs.msdn.com/b/ie/archive/2006/08/31/730887.aspx )
				// how long the tooltip remains visible after the mouse leaves the trigger.
				delay: defaultDelay,
				// make fadeOutSpeed similar to the browser's default
				fadeOutSpeed: 300,
				// the time before the tooltip is shown
				predelay: 200,
				position: "top center"
				,onBeforeShow: function() {
					$("object,embed").css('visibility', 'hidden');
				}
				,onShow: function() {
					if (navigator.userAgent.match(/msie/i)) {
						// IE Hack: ClearType with DXTransforms in IE7 ( http://blogs.msdn.com/b/ie/archive/2006/08/31/730887.aspx )
						// Quando o atributo filter é utilizado no IE, e o windows estiver com o ClearType habilitado,
						// para este elemento o IE vai desabilitar o ClearType, causando uma impressão estranha se comparar
						// com o resto do site. Por esse motivo, removemos o filter ao final do 'fade'.
						this.getTip().get(0).style.removeAttribute('filter');
					}
				}
				,onHide: function() {
					$("object,embed").css('visibility', 'visible');
				}
			}).dynamic({ bottom: { direction: 'down'} });
		});
		
	}
	
	/**
	 *  Configurações de teclas de atalho 
	 **/
	function installHotkeys() {
		
		// Exibir ou esconder botao de sugestões
		$(document).bind('keyup', 'alt+del', function() {
			$(".revision_number, .build-number").toggle();
		});
		
		// Abrir o console customizado para IE
		$(window).bind('keyup', 'alt+pageup', function() {
			$.log("Toggle Console!");
			$.toggleConsole();
		});
		
		// Habilitar o estado de depuração dos campos de recálculo
		$(window).bind('keyup', 'alt+pagedown', function() {
			$.log("Debug is >", $(document.body).toggleClass('stateDebugCampos'), this);
		});
	}
	
	function compileAllTemplates() {
		$('.jsTemplate').compileTemplate();
	}
		
	function irParaPaginaAtualizeSeuNavegador() {
		if (window.top.location.href.indexOf('atualize-seu-navegador') == -1) {
			window.top.location = '/atualize-seu-navegador';
		}
	}
	
	function ehUmNavegadorAntigo() {
		return (($.browser.msie || $.browser.mozilla) && ($.browser.version < 8));
	}
	
	window.internetExplorerAntigo = function() {
		return ($.browser.msie && $.browser.version == "8.0") || ($.browser.msie && $.browser.version == "7.0");
	};
	
	if (ehUmNavegadorAntigo()) {
		irParaPaginaAtualizeSeuNavegador();
	} else {
		$(document).ready(applicationInitialize);
	}

	document.domain = document.domain.replace(/^www\.|^staging\./, '');
})(jQuery);
(function ($) {

	/**
	 *  Configurações do chat 
	 **/
	
	function installChat() {
		// Inicializa o botão de chat
		verifyChatStatus();
		// Associa todos os botoes de abrir o chat
		$("body").delegate('.jsChatLink', 'click', openChat);
	}
	
	function openChat() {
		try {
			if (SnapABug.getAgentStatusAsync) {
				SnapABug.getAgentStatusAsync(function(online) {
				    if (online) {
				    	SnapABug.startLink();
				    } else {
				    	var faleConoscoURL = window.base + '/fale-conosco?chat=offline';
				    	window.location.href = faleConoscoURL;
				    }
				});
			} else {
				SnapABug.startLink();
			}
		} catch (e) {} 
		return false;
	}
		
	function verifyChatStatus() {
		if (typeof(snapEngageId) === 'undefined') {
			return;
		}
		$(new Image()).bind('load', function(event) {
			if (event.currentTarget.width > 100) { // chat online
				$('body').addClass('stateChatOnline');
			} else {
				$('body').removeClass('stateChatOnline');
			}
		}).attr('src', 'https://snapabug.appspot.com/statusImage?w=' + snapEngageId + '&bogus=' + Math.random());		
	}
	
	
	$(document).ready(function() {
		installChat();
		
		// Abrir o chat
		//$(window).bind('keyup', 'alt+shift+del', openChat);
	});
})(jQuery);
Cufon.registerFont({"w":195,"face":{"font-family":"DIN Alternate","font-weight":700,"font-stretch":"normal","units-per-em":"360","panose-1":"2 2 5 0 0 0 0 0 0 0","ascent":"288","descent":"-72","x-height":"2","bbox":"-16 -365 348 74","underline-thickness":"15.293","underline-position":"-16.1719","unicode-range":"U+0020-U+2122"},"glyphs":{" ":{"w":83},"\u00d0":{"d":"131,-256v71,1,101,53,93,139v13,114,-75,123,-186,117r0,-111r-25,0r0,-38r25,0r0,-107r93,0xm88,-44v66,4,95,-9,86,-83v7,-73,-19,-90,-86,-85r0,63r42,0r0,38r-42,0r0,67","w":245},"\u00f0":{"d":"20,-91v0,-59,20,-92,80,-91r-12,-23r-41,0r0,-33r25,0r-12,-21r51,0r11,21r33,0r0,33r-17,0v18,36,37,62,37,114v0,59,-26,93,-77,93v-52,0,-78,-35,-78,-93xm98,-40v25,0,30,-22,30,-51v0,-29,-3,-52,-30,-52v-26,0,-31,23,-31,52v0,29,6,51,31,51"},"\u0160":{"d":"172,-342r-48,61r-37,0r-47,-61r36,0r30,32r30,-32r36,0xm157,-197v-20,-25,-96,-28,-92,15v4,46,91,21,111,52v13,12,19,30,19,54v0,91,-142,97,-188,44r32,-32v20,25,108,36,108,-10v0,-51,-88,-25,-112,-56v-40,-53,-3,-128,71,-128v39,0,62,10,83,29","w":212},"\u0161":{"d":"156,-278r-47,61r-38,0r-47,-61r36,0r30,32r30,-32r36,0xm133,-139v-11,-12,-70,-23,-70,6v0,29,60,10,79,28v16,8,25,24,25,46v0,73,-121,76,-159,34r30,-30v12,12,29,17,51,17v15,-1,34,-5,33,-19v-3,-33,-76,-10,-90,-36v-36,-38,3,-97,58,-97v32,0,56,7,72,22","w":180},"\u00dd":{"d":"205,-256r-77,151r0,105r-50,0r0,-105r-77,-151r54,0r48,103r47,-103r55,0xm156,-343r-41,62r-32,0r23,-62r50,0","w":205},"\u00fd":{"d":"176,-188r-80,218v-10,31,-32,41,-73,39r0,-42v33,5,36,-18,43,-40r-65,-175r50,0r39,116r37,-116r49,0xm141,-279r-41,62r-32,0r23,-62r50,0","w":205},"\u00de":{"d":"80,-209v76,-6,134,10,134,79v0,69,-58,86,-134,80r0,50r-50,0r0,-256r50,0r0,47xm80,-94v40,1,85,4,84,-36v0,-39,-44,-36,-84,-35r0,71","w":227},"\u00fe":{"d":"118,-190v52,3,65,37,65,96v0,58,-11,95,-65,96v-23,0,-34,-6,-45,-19r0,86r-47,0r0,-325r47,0r0,85v11,-12,26,-19,45,-19xm105,-40v29,0,31,-22,31,-54v0,-32,-2,-54,-31,-54v-29,0,-32,23,-32,54v0,31,3,54,32,54","w":202},"\u00bd":{"d":"246,-155v47,-3,60,51,30,83r-38,41r57,0r0,31r-98,0r0,-31r62,-69v5,-12,-1,-25,-13,-25v-10,0,-15,5,-15,16r-34,0v0,-29,21,-44,49,-46xm223,-256r-121,256r-36,0r121,-256r36,0xm80,-103r-34,0r0,-115r-32,28r0,-38r32,-28r34,0r0,153","w":310},"\u00bc":{"d":"287,-21r-12,0r0,21r-33,0r0,-21r-63,0r0,-32r51,-101r38,0r-52,101r26,0r0,-22r33,0r0,22r12,0r0,32xm225,-256r-121,256r-37,0r121,-256r37,0xm80,-103r-34,0r0,-115r-32,28r0,-38r32,-28r34,0r0,153","w":300},"\u00b9":{"d":"80,-103r-34,0r0,-115r-32,28r0,-38r32,-28r34,0r0,153","w":105},"\u00be":{"d":"297,-21r-12,0r0,21r-32,0r0,-21r-64,0r0,-32r52,-101r37,0r-52,101r27,0r0,-22r32,0r0,22r12,0r0,32xm237,-256r-122,256r-37,0r122,-256r37,0xm66,-258v42,-3,67,53,33,76v37,23,12,85,-33,81v-28,-2,-52,-17,-51,-48r34,0v0,10,7,18,17,18v10,0,18,-6,17,-18v-1,-12,-8,-20,-22,-18r0,-29v12,2,20,-5,20,-15v0,-10,-5,-16,-15,-16v-9,0,-15,5,-15,15r-34,0v0,-28,22,-44,49,-46","w":311},"\u00b3":{"d":"66,-258v42,-3,67,53,33,76v37,23,12,85,-33,81v-28,-2,-52,-17,-51,-48r34,0v0,10,7,18,17,18v10,0,18,-6,17,-18v-1,-12,-8,-20,-22,-18r0,-29v12,2,20,-5,20,-15v0,-10,-5,-16,-15,-16v-9,0,-15,5,-15,15r-34,0v0,-28,22,-44,49,-46","w":132},"\u00b2":{"d":"65,-258v45,-2,60,52,30,84r-38,41r56,0r0,30r-98,0r0,-30v21,-27,51,-46,65,-79v0,-9,-6,-15,-15,-15v-10,0,-16,5,-16,16r-34,0v0,-30,22,-46,50,-47","w":128},"\u00a6":{"d":"86,-157r-46,0r0,-126r46,0r0,126xm86,27r-46,0r0,-126r46,0r0,126","w":127},"\u00ad":{"d":"178,-81r-160,0r0,-44r160,0r0,44"},"\u00d7":{"d":"178,-52r-30,29r-50,-50r-51,50r-29,-29r50,-51r-50,-51r29,-29r51,50r50,-50r30,29r-51,51"},"!":{"d":"98,-256r-12,176r-34,0r-12,-176r58,0xm69,-55v17,0,28,12,29,28v1,16,-14,28,-29,28v-15,1,-28,-13,-28,-28v0,-15,12,-29,28,-28","w":124},"\"":{"d":"142,-180r-43,0r0,-76r43,0r0,76xm68,-180r-44,0r0,-76r44,0r0,76","w":166},"#":{"d":"232,-151r-32,0r-6,39r24,0r0,44r-31,0r-11,68r-50,0r11,-68r-41,0r-11,68r-49,0r10,-68r-24,0r0,-44r32,0r5,-39r-25,0r0,-44r32,0r10,-63r50,0r-11,63r42,0r10,-63r49,0r-9,63r25,0r0,44xm150,-151r-41,0r-6,39r41,0","w":248},"$":{"d":"35,-131v-41,-46,-6,-128,57,-127r0,-32r36,0r0,32v32,1,54,12,71,29r-32,32v-10,-10,-25,-16,-44,-18r0,63v50,6,82,22,82,76v0,48,-35,71,-77,77r0,40r-36,0r0,-39v-39,0,-66,-14,-85,-34r32,-32v14,14,33,20,58,21r0,-65v-27,-1,-49,-10,-62,-23xm97,-214v-26,0,-43,32,-24,50v5,5,14,8,24,10r0,-60xm123,-43v35,2,47,-48,16,-59v-4,-1,-9,-2,-16,-3r0,62","w":222},"%":{"d":"234,-132v44,0,56,35,53,85v-2,30,-23,49,-53,49v-44,1,-52,-36,-52,-85v0,-29,23,-50,52,-49xm232,-256r-121,256r-37,0r121,-256r37,0xm71,-258v44,0,52,35,52,85v0,30,-23,49,-52,49v-44,1,-52,-36,-52,-85v0,-29,23,-49,52,-49xm234,-28v25,2,18,-30,19,-53v0,-13,-6,-21,-19,-21v-24,0,-17,31,-18,53v0,14,6,21,18,21xm71,-155v24,0,17,-30,18,-53v0,-14,-5,-19,-18,-20v-24,-2,-17,31,-18,53v0,13,5,20,18,20","w":305},"&":{"d":"232,-134v-3,35,-9,61,-28,80r46,54r-59,0r-19,-22v-43,43,-158,28,-150,-54v3,-35,22,-52,46,-68v-13,-14,-26,-29,-26,-55v1,-37,29,-59,69,-59v40,0,64,23,65,60v2,25,-25,46,-45,58r44,51v8,-11,12,-26,13,-45r44,0xm106,-169v11,-5,26,-18,26,-29v0,-12,-9,-21,-21,-20v-31,1,-24,34,-5,49xm93,-115v-37,13,-33,78,13,75v17,-1,27,-6,38,-15","w":259},"'":{"d":"69,-180r-45,0r0,-76r45,0r0,76","w":93},"(":{"d":"101,-259v-47,34,-18,135,-25,207v-3,31,11,40,25,54r-31,32v-21,-21,-44,-41,-41,-84v5,-80,-21,-188,30,-229r11,-11","w":120},")":{"d":"20,2v46,-32,19,-135,25,-206v3,-31,-10,-40,-25,-54r31,-32v20,22,41,37,41,83r-2,183v-5,28,-22,40,-39,58","w":120},"*":{"d":"158,-166r-16,29r-38,-24r1,45r-33,0r2,-45r-38,24r-16,-29r39,-21r-39,-20r16,-29r38,24r-2,-45r33,0r-1,45r38,-24r16,29r-40,20","w":177},"+":{"d":"178,-78r-58,0r0,58r-44,0r0,-58r-58,0r0,-44r58,0r0,-57r44,0r0,57r58,0r0,44"},",":{"d":"76,20r-52,39r0,-110r52,0r0,71","w":100},"-":{"d":"132,-81r-111,0r0,-44r111,0r0,44","w":153},".":{"d":"22,-30v0,-31,43,-42,58,-16v12,21,-3,47,-27,47v-16,0,-31,-15,-31,-31","w":106},"\/":{"d":"147,-283r-103,310r-44,0r103,-310r44,0","w":145},"0":{"d":"98,-217v47,0,78,28,78,76r0,67v-1,48,-31,76,-78,76v-47,0,-78,-28,-78,-76r0,-67v1,-48,31,-76,78,-76xm98,-40v43,0,29,-59,31,-100v1,-21,-11,-35,-31,-35v-42,0,-29,58,-31,100v-1,21,12,35,31,35"},"1":{"d":"118,0r-46,0r0,-165r-53,46r0,-51r53,-45r46,0r0,215","w":157},"2":{"d":"94,-224v67,-4,101,73,56,117v-21,21,-47,44,-70,65r96,0r0,42r-161,0r0,-42r84,-72v30,-14,38,-68,-5,-68v-19,0,-31,11,-31,32r-47,0v0,-47,32,-71,78,-74","w":197},"3":{"d":"142,-91v19,10,33,29,33,58v0,86,-127,102,-156,35v-4,-10,-7,-21,-7,-34r47,0v-1,21,15,34,35,34v21,0,35,-14,34,-36v0,-25,-16,-37,-43,-35r0,-41v26,2,39,-10,40,-32v1,-19,-14,-33,-32,-33v-18,0,-31,12,-31,31r-47,0v1,-47,31,-69,78,-73v71,-6,107,93,49,126","w":192},"4":{"d":"198,-11r-29,0r0,55r-44,0r0,-55r-111,0r0,-44r88,-176r50,0r-87,176r60,0r0,-53r44,0r0,53r29,0r0,44","w":212},"5":{"d":"70,-118v49,-34,120,6,110,73v16,94,-122,120,-152,44v-3,-9,-5,-18,-6,-29r47,0v3,21,13,31,31,31v26,-1,33,-16,33,-46v10,-48,-49,-61,-63,-25r-42,0r0,-145r146,0r0,42r-104,0r0,55","w":198},"6":{"d":"84,-155v53,-19,101,18,99,74v-2,52,-33,81,-84,83v-89,4,-95,-98,-59,-164r55,-100r50,0xm99,-38v23,0,38,-18,37,-42v-1,-24,-13,-41,-37,-42v-23,-1,-37,18,-37,42v0,24,14,42,37,42","w":197},"7":{"d":"187,-173r-95,216r-51,0r95,-216r-75,0r0,40r-45,0r0,-82r171,0r0,42","w":199},"8":{"d":"101,-258v74,-10,103,95,49,126v63,37,28,141,-49,134v-76,8,-113,-95,-50,-134v-53,-33,-25,-136,50,-126xm101,-152v18,0,32,-15,32,-32v1,-18,-14,-32,-32,-32v-18,0,-32,14,-32,32v0,18,14,33,32,32xm101,-40v19,0,36,-16,35,-35v-1,-21,-15,-35,-35,-36v-19,-1,-35,17,-35,36v0,19,16,35,35,35","w":201},"9":{"d":"99,-217v89,-5,94,100,59,164r-55,100r-51,0r61,-107v-51,20,-100,-18,-98,-74v2,-52,33,-80,84,-83xm99,-92v23,0,38,-19,37,-43v-1,-24,-13,-42,-37,-42v-24,0,-37,16,-37,42v0,23,14,44,37,43","w":197},":":{"d":"62,-157v19,0,30,13,31,31v0,19,-13,32,-31,32v-16,0,-32,-15,-31,-32v1,-18,12,-31,31,-31xm62,-62v17,0,31,13,31,32v0,16,-14,31,-31,31v-16,0,-31,-15,-31,-31v0,-17,15,-32,31,-32","w":114},";":{"d":"62,-157v19,0,30,13,31,31v0,19,-13,32,-31,32v-16,0,-32,-15,-31,-32v1,-18,12,-31,31,-31xm88,20r-52,39r0,-110r52,0r0,71","w":111},"<":{"d":"323,-75r-138,139r-139,-139r0,-59r117,118r0,-254r44,0r0,254r116,-118r0,59","w":369},"=":{"d":"178,-120r-160,0r0,-44r160,0r0,44xm178,-42r-160,0r0,-44r160,0r0,44"},">":{"d":"324,-72r-117,-118r0,254r-44,0r0,-254r-117,118r0,-59r139,-139r139,139r0,59","w":369},"?":{"d":"99,-258v64,-4,96,67,59,116v-14,18,-34,31,-33,62r-47,0v-5,-55,44,-64,50,-107v2,-17,-11,-29,-29,-29v-18,0,-29,12,-29,29r-46,0v1,-45,30,-68,75,-71xm101,-55v17,0,28,12,29,28v1,16,-14,28,-29,28v-16,1,-28,-13,-28,-28v0,-15,12,-29,28,-28","w":188},"@":{"d":"111,-258v84,0,141,8,141,90r0,169r-44,-1r0,-17v-10,13,-22,19,-43,19v-46,-2,-65,-31,-62,-85v-15,-72,62,-109,104,-67v3,-41,-10,-66,-48,-66v-50,0,-98,-2,-93,49v4,47,-14,116,15,140r-32,32v-43,-28,-26,-108,-28,-173v-2,-60,28,-90,90,-90xm178,-37v24,0,30,-19,29,-46v-1,-27,-3,-46,-29,-46v-26,0,-30,20,-30,46v0,26,4,46,30,46","w":272},"A":{"d":"228,0r-52,0r-16,-45r-91,0r-15,45r-52,0r93,-256r39,0xm147,-88r-31,-93r-33,93r64,0","w":229},"B":{"d":"180,-131v20,9,36,27,36,57v-2,48,-30,73,-79,74r-107,0r0,-256v83,1,186,-16,182,72v-1,26,-14,44,-32,53xm80,-153v36,-1,82,8,82,-29v0,-38,-46,-29,-82,-30r0,59xm80,-45v38,0,86,7,86,-31v0,-39,-47,-32,-86,-32r0,63","w":236},"C":{"d":"115,-43v20,0,29,-7,39,-17r33,33v-19,18,-37,29,-72,29v-66,0,-102,-49,-94,-130v-22,-114,94,-166,166,-101r-33,33v-11,-11,-20,-18,-39,-18v-42,1,-44,40,-44,86v0,48,3,83,44,85","w":202},"D":{"d":"122,-256v80,0,94,58,94,146v0,71,-27,110,-94,110r-92,0r0,-256r92,0xm80,-45v51,4,85,-4,85,-56v0,-51,6,-115,-47,-111r-38,0r0,167","w":237},"E":{"d":"199,0r-169,0r0,-256r169,0r0,44r-119,0r0,60r101,0r0,45r-101,0r0,62r119,0r0,45","w":217},"F":{"d":"199,-212r-119,0r0,63r101,0r0,45r-101,0r0,104r-50,0r0,-256r169,0r0,44","w":212},"G":{"d":"115,-43v31,0,49,-22,46,-58r-46,0r0,-42r96,0v7,88,-17,145,-96,145v-66,0,-102,-49,-94,-130v-23,-118,101,-167,173,-98r-34,34v-14,-14,-21,-22,-45,-22v-41,0,-44,38,-44,86v0,48,2,84,44,85","w":229},"H":{"d":"217,0r-50,0r0,-107r-87,0r0,107r-50,0r0,-256r50,0r0,104r87,0r0,-104r50,0r0,256","w":246},"I":{"d":"80,0r-50,0r0,-256r50,0r0,256","w":109},"J":{"d":"34,-57v22,26,73,15,73,-29r0,-170r50,0r0,172v7,82,-106,111,-156,60","w":184},"K":{"d":"237,0r-58,0r-66,-117r-33,40r0,77r-50,0r0,-256r50,0r0,111r90,-111r61,0r-85,101","w":239},"L":{"d":"196,0r-166,0r0,-256r50,0r0,211r116,0r0,45","w":207},"M":{"d":"262,0r-50,0r0,-149r-49,97r-34,0r-49,-97r0,149r-50,0r0,-256r49,0r67,138r67,-138r49,0r0,256","w":291},"N":{"d":"226,0r-45,0r-101,-157r0,157r-50,0r0,-256r45,0r101,157r0,-157r50,0r0,256","w":255},"O":{"d":"116,-258v79,-3,94,72,94,163v0,59,-41,97,-94,97v-71,0,-95,-48,-95,-130v0,-83,24,-128,95,-130xm116,-43v42,0,44,-37,44,-85v0,-49,-1,-86,-44,-86v-42,0,-45,37,-45,86v0,48,2,85,45,85","w":231},"P":{"d":"129,-256v52,1,85,30,85,80v0,68,-58,85,-134,79r0,97r-50,0r0,-256r99,0xm80,-142v39,0,84,5,84,-34v0,-40,-43,-37,-84,-36r0,70","w":226},"Q":{"d":"211,-128v-2,41,-1,67,-16,91r22,22r-27,26r-22,-23v-81,40,-164,-13,-147,-116v-5,-82,23,-130,95,-130v66,0,99,51,95,130xm71,-128v0,55,13,98,62,81r-23,-22r27,-26r19,19v5,-43,19,-143,-40,-138v-42,4,-45,37,-45,86","w":231},"R":{"d":"130,-256v88,-11,111,124,37,145r57,111r-58,0r-50,-102r-36,0r0,102r-50,0r0,-256r100,0xm80,-144v39,1,83,5,83,-34v0,-39,-44,-34,-83,-34r0,68","w":235},"S":{"d":"157,-197v-20,-25,-96,-28,-92,15v4,46,91,21,111,52v13,12,19,30,19,54v0,91,-142,97,-188,44r32,-32v20,25,108,36,108,-10v0,-51,-88,-25,-112,-56v-40,-53,-3,-128,71,-128v39,0,62,10,83,29","w":212},"T":{"d":"195,-212r-67,0r0,212r-50,0r0,-212r-67,0r0,-44r184,0r0,44","w":205},"U":{"d":"120,-43v29,0,45,-18,45,-47r0,-166r50,0r0,168v-2,55,-38,90,-95,90v-56,0,-94,-34,-94,-90r0,-168r50,0r0,166v0,29,16,47,44,47","w":240},"V":{"d":"208,-256r-85,256r-37,0r-85,-256r52,0r51,167r52,-167r52,0","w":209},"W":{"d":"317,-256r-69,256r-41,0r-48,-156r-47,156r-42,0r-68,-256r52,0r40,161r47,-161r37,0r47,161r40,-161r52,0","w":319},"X":{"d":"215,0r-57,0r-50,-89r-49,89r-57,0r79,-131r-74,-125r57,0r44,83r45,-83r57,0r-75,125","w":217},"Y":{"d":"205,-256r-77,151r0,105r-50,0r0,-105r-77,-151r54,0r48,103r47,-103r55,0","w":205},"Z":{"d":"183,0r-169,0r0,-40r110,-172r-105,0r0,-44r164,0r0,39r-110,172r110,0r0,45","w":197},"[":{"d":"121,27r-92,0r0,-310r92,0r0,42r-45,0r0,226r45,0r0,42","w":136},"\\":{"d":"145,27r-44,0r-101,-305r44,0","w":145},"]":{"d":"108,27r-93,0r0,-42r46,0r0,-226r-46,0r0,-42r93,0r0,310","w":136},"^":{"d":"194,-140r-49,0r-37,-68r-36,68r-49,0r64,-119r43,0","w":216},"_":{"d":"217,64r-217,0r0,-31r217,0r0,31","w":216},"`":{"d":"110,-217r-32,0r-41,-62r50,0","w":180},"a":{"d":"121,-111v11,-46,-54,-49,-71,-24r-29,-29v35,-44,147,-35,147,41r0,123r-46,0r0,-16v-31,36,-113,17,-109,-41v4,-51,52,-58,108,-54xm85,-36v28,1,38,-12,36,-43v-27,1,-64,-7,-63,21v0,15,11,22,27,22","w":192},"b":{"d":"118,-190v52,3,65,37,65,96v0,58,-11,95,-65,96v-23,0,-35,-7,-46,-20r0,18r-46,0r0,-256r47,0r0,85v11,-12,26,-19,45,-19xm105,-40v29,0,31,-22,31,-54v0,-32,-2,-54,-31,-54v-29,0,-32,23,-32,54v0,31,3,54,32,54","w":201},"c":{"d":"64,-94v-8,49,43,70,67,39r32,32v-17,17,-37,25,-62,25v-57,-1,-84,-36,-84,-96v0,-88,91,-124,146,-71r-32,32v-25,-30,-75,-10,-67,39","w":172},"d":{"d":"83,-190v22,0,34,7,46,19r0,-85r47,0r0,256r-46,0r0,-18v-12,13,-23,20,-47,20v-53,-1,-65,-39,-65,-96v0,-57,13,-96,65,-96xm97,-40v28,0,32,-23,32,-54v0,-32,-4,-54,-32,-54v-29,0,-32,23,-32,54v0,31,4,54,32,54","w":201},"e":{"d":"99,-190v59,0,86,45,81,111r-117,0v-4,46,63,54,84,24r28,28v-19,18,-36,29,-71,29v-56,-1,-88,-32,-87,-96v1,-57,28,-96,82,-96xm134,-111v5,-41,-52,-53,-67,-20v-3,6,-4,13,-4,20r71,0","w":197},"f":{"d":"32,-182v-6,-57,20,-84,81,-77r0,39v-18,-1,-34,-2,-34,17r0,21r34,0r0,35r-34,0r0,147r-47,0r0,-147r-19,0r0,-35r19,0","w":123},"g":{"d":"82,-190v22,1,34,7,46,20r0,-18r45,0r0,181v8,78,-104,100,-150,53r29,-29v21,25,81,16,75,-25r0,-19v-34,40,-117,14,-108,-49v-5,-62,4,-113,63,-114xm96,-50v28,0,31,-21,31,-49v0,-28,-3,-49,-31,-49v-27,0,-31,21,-31,49v0,28,4,48,31,49","w":199},"h":{"d":"73,-170v35,-39,108,-16,108,49r0,121r-47,0r0,-114v1,-21,-12,-34,-31,-34v-53,0,-23,97,-30,148r-47,0r0,-256r47,0r0,86","w":204},"i":{"d":"50,-270v16,2,29,11,29,30v0,15,-14,29,-29,29v-15,0,-30,-14,-30,-29v-1,-15,15,-31,30,-30xm73,0r-47,0r0,-188r47,0r0,188","w":98},"j":{"d":"50,-270v16,2,29,11,29,30v0,15,-14,29,-29,29v-15,0,-30,-14,-30,-29v-1,-15,15,-31,30,-30xm73,17v0,42,-32,58,-81,53r0,-39v18,1,34,2,34,-17r0,-202r47,0r0,205","w":98},"k":{"d":"197,0r-58,0r-46,-78r-20,22r0,56r-47,0r0,-256r47,0r0,145r62,-77r57,0r-67,76","w":201},"l":{"d":"71,-57v-2,19,17,17,35,17r0,40v-48,5,-82,-12,-82,-54r0,-202r47,0r0,199","w":117},"m":{"d":"168,-166v36,-44,123,-23,123,46r0,120r-46,0v-7,-53,22,-143,-32,-148v-52,6,-24,96,-31,148r-47,0r0,-113v0,-21,-12,-35,-31,-35v-53,0,-24,96,-31,148r-47,0r0,-188r46,0r0,18v21,-25,79,-28,96,4","w":315},"n":{"d":"72,-170v35,-40,110,-16,110,50r0,120r-47,0r0,-113v0,-21,-12,-35,-31,-35v-53,0,-24,96,-31,148r-47,0r0,-188r46,0r0,18","w":206},"o":{"d":"98,-190v52,0,79,34,79,96v0,60,-26,96,-79,96v-53,0,-80,-37,-80,-96v0,-59,27,-96,80,-96xm98,-40v28,0,32,-23,32,-54v0,-31,-5,-54,-32,-54v-27,0,-33,23,-33,54v0,31,5,54,33,54"},"p":{"d":"118,-190v52,0,65,37,65,96v0,58,-11,95,-65,96v-23,0,-34,-6,-45,-19r0,86r-47,0r0,-257r46,0r0,18v12,-13,24,-20,46,-20xm105,-40v29,0,31,-22,31,-54v0,-32,-2,-54,-31,-54v-29,0,-32,23,-32,54v0,31,3,54,32,54","w":201},"q":{"d":"83,-190v23,0,35,7,47,20r0,-18r46,0r0,257r-47,0r0,-86v-11,13,-23,19,-46,19v-53,0,-65,-40,-65,-96v0,-57,13,-96,65,-96xm97,-40v28,0,32,-23,32,-54v0,-32,-4,-54,-32,-54v-29,0,-32,23,-32,54v0,31,4,54,32,54","w":201},"r":{"d":"72,-170v17,-23,73,-29,91,-2r-35,36v-16,-23,-55,-10,-55,23r0,113r-47,0r0,-188r46,0r0,18","w":163},"s":{"d":"133,-139v-11,-12,-70,-23,-70,6v0,29,60,10,79,28v16,8,25,24,25,46v0,73,-121,76,-159,34r30,-30v12,12,29,17,51,17v15,-1,34,-5,33,-19v-3,-33,-76,-10,-90,-36v-36,-38,3,-97,58,-97v32,0,56,7,72,22","w":180},"t":{"d":"111,0v-47,4,-81,-10,-80,-54r0,-93r-20,0r0,-35r20,0r0,-56r46,0r0,56r34,0r0,35r-34,0r0,90v-1,18,16,18,34,17r0,40","w":126},"u":{"d":"102,-40v19,0,32,-12,31,-34r0,-114r47,0r0,188r-46,0r0,-17v-38,40,-110,14,-110,-51r0,-120r47,0r0,114v-1,22,11,34,31,34","w":206},"v":{"d":"176,-188r-69,188r-37,0r-69,-188r50,0r38,116r38,-116r49,0","w":177},"w":{"d":"272,-188r-57,188r-39,0r-39,-118r-39,118r-39,0r-58,-188r50,0r30,116r39,-116r34,0r38,116r31,-116r49,0","w":273},"x":{"d":"185,0r-56,0r-34,-56r-35,56r-56,0r65,-96r-62,-92r56,0r32,54r32,-54r56,0r-62,92","w":189},"y":{"d":"176,-188r-80,218v-10,31,-32,41,-73,39r0,-42v33,5,36,-18,43,-40r-65,-175r50,0r39,116r37,-116r49,0","w":177},"z":{"d":"156,0r-143,0r0,-36r84,-109r-79,0r0,-43r138,0r0,36r-84,110r84,0r0,42","w":172},"{":{"d":"79,-128v60,13,-19,130,70,113r0,42v-52,4,-92,-6,-92,-54v0,-39,13,-92,-42,-80r0,-42v26,2,44,-2,42,-29v-3,-56,-2,-108,55,-105r37,0r0,42v-27,-1,-46,-2,-45,28v2,37,5,79,-25,85","w":164},"|":{"d":"86,27r-46,0r0,-310r46,0r0,310","w":126},"}":{"d":"108,-230v0,39,-13,92,41,81r0,42v-25,-1,-42,2,-41,28v3,57,0,108,-56,106r-37,0r0,-42v28,1,46,1,46,-29v0,-37,-6,-79,25,-84v-31,-6,-25,-48,-25,-85v0,-30,-18,-29,-46,-28r0,-42v52,-4,93,5,93,53","w":164},"~":{"d":"72,-136v39,-1,74,42,103,5r30,30v-19,18,-30,31,-60,31v-37,0,-74,-41,-102,-6r-30,-29v17,-17,29,-30,59,-31","w":218},"\u00c4":{"d":"228,0r-52,0r-16,-45r-91,0r-15,45r-52,0r93,-256r39,0xm147,-88r-31,-93r-33,93r64,0xm155,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm73,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":229},"\u00c5":{"d":"114,-365v26,0,47,22,47,47v0,25,-22,47,-47,47v-25,0,-47,-22,-47,-47v0,-25,21,-47,47,-47xm114,-297v12,0,21,-9,21,-21v0,-12,-9,-21,-21,-21v-12,0,-21,9,-21,21v0,12,9,21,21,21xm228,0r-52,0r-16,-45r-91,0r-15,45r-52,0r93,-256r39,0xm147,-88r-31,-93r-33,93r64,0","w":229},"\u00c7":{"d":"115,-43v20,0,29,-7,39,-17r33,33v-19,18,-37,29,-72,29v-66,0,-102,-49,-94,-130v-22,-114,94,-166,166,-101r-33,33v-11,-11,-20,-18,-39,-18v-42,1,-44,40,-44,86v0,48,3,83,44,85xm137,22r-16,52r-43,0r24,-52r35,0","w":207},"\u00c9":{"d":"199,0r-169,0r0,-256r169,0r0,44r-119,0r0,60r101,0r0,45r-101,0r0,62r119,0r0,45xm164,-343r-41,62r-32,0r23,-62r50,0","w":217},"\u00d1":{"d":"103,-331v26,-1,50,30,69,4r21,21v-14,13,-21,21,-41,21v-25,0,-51,-29,-69,-4r-20,-21v14,-13,21,-20,40,-21xm226,0r-45,0r-101,-157r0,157r-50,0r0,-256r45,0r101,157r0,-157r50,0r0,256","w":256},"\u00d6":{"d":"116,-258v79,-3,94,72,94,163v0,59,-41,97,-94,97v-71,0,-95,-48,-95,-130v0,-83,24,-128,95,-130xm116,-43v42,0,44,-37,44,-85v0,-49,-1,-86,-44,-86v-42,0,-45,37,-45,86v0,48,2,85,45,85xm157,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm75,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":231},"\u00dc":{"d":"120,-43v29,0,45,-18,45,-47r0,-166r50,0r0,168v-2,55,-38,90,-95,90v-56,0,-94,-34,-94,-90r0,-168r50,0r0,166v0,29,16,47,44,47xm161,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm79,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":240},"\u00e1":{"d":"121,-111v11,-46,-54,-49,-71,-24r-29,-29v35,-44,147,-35,147,41r0,123r-46,0r0,-16v-31,36,-113,17,-109,-41v4,-51,52,-58,108,-54xm85,-36v28,1,38,-12,36,-43v-27,1,-64,-7,-63,21v0,15,11,22,27,22xm147,-279r-41,62r-32,0r23,-62r50,0","w":192},"\u00e0":{"d":"121,-111v11,-46,-54,-49,-71,-24r-29,-29v35,-44,147,-35,147,41r0,123r-46,0r0,-16v-31,36,-113,17,-109,-41v4,-51,52,-58,108,-54xm85,-36v28,1,38,-12,36,-43v-27,1,-64,-7,-63,21v0,15,11,22,27,22xm114,-217r-32,0r-41,-62r50,0","w":192},"\u00e2":{"d":"160,-217r-36,0r-30,-33r-30,33r-36,0r47,-61r38,0xm121,-111v11,-46,-54,-49,-71,-24r-29,-29v35,-44,147,-35,147,41r0,123r-46,0r0,-16v-31,36,-113,17,-109,-41v4,-51,52,-58,108,-54xm85,-36v28,1,38,-12,36,-43v-27,1,-64,-7,-63,21v0,15,11,22,27,22","w":192},"\u00e4":{"d":"121,-111v11,-46,-54,-49,-71,-24r-29,-29v35,-44,147,-35,147,41r0,123r-46,0r0,-16v-31,36,-113,17,-109,-41v4,-51,52,-58,108,-54xm85,-36v28,1,38,-12,36,-43v-27,1,-64,-7,-63,21v0,15,11,22,27,22xm135,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm53,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":192},"\u00e3":{"d":"69,-268v26,0,49,29,69,5r21,20v-14,13,-21,22,-41,22v-24,0,-50,-29,-69,-5r-20,-20v13,-13,20,-22,40,-22xm121,-111v11,-46,-54,-49,-71,-24r-29,-29v35,-44,147,-35,147,41r0,123r-46,0r0,-16v-31,36,-113,17,-109,-41v4,-51,52,-58,108,-54xm85,-36v28,1,38,-12,36,-43v-27,1,-64,-7,-63,21v0,15,11,22,27,22","w":192},"\u00e5":{"d":"94,-305v26,0,47,22,47,48v0,25,-22,47,-47,47v-25,0,-47,-22,-47,-47v0,-26,21,-48,47,-48xm94,-236v12,0,21,-9,21,-21v0,-12,-9,-21,-21,-21v-12,0,-21,9,-21,21v0,12,9,21,21,21xm121,-111v11,-46,-54,-49,-71,-24r-29,-29v35,-44,147,-35,147,41r0,123r-46,0r0,-16v-31,36,-113,17,-109,-41v4,-51,52,-58,108,-54xm85,-36v28,1,38,-12,36,-43v-27,1,-64,-7,-63,21v0,15,11,22,27,22","w":192},"\u00e7":{"d":"64,-94v-8,49,43,70,67,39r32,32v-17,17,-37,25,-62,25v-57,-1,-84,-36,-84,-96v0,-88,91,-124,146,-71r-32,32v-25,-30,-75,-10,-67,39xm117,22r-16,52r-43,0r24,-52r35,0","w":173},"\u00e9":{"d":"99,-190v59,0,86,45,81,111r-117,0v-4,46,63,54,84,24r28,28v-19,18,-36,29,-71,29v-56,-1,-88,-32,-87,-96v1,-57,28,-96,82,-96xm134,-111v5,-41,-52,-53,-67,-20v-3,6,-4,13,-4,20r71,0xm153,-279r-41,62r-32,0r23,-62r50,0","w":197},"\u00e8":{"d":"99,-190v59,0,86,45,81,111r-117,0v-4,46,63,54,84,24r28,28v-19,18,-36,29,-71,29v-56,-1,-88,-32,-87,-96v1,-57,28,-96,82,-96xm134,-111v5,-41,-52,-53,-67,-20v-3,6,-4,13,-4,20r71,0xm120,-217r-32,0r-41,-62r50,0","w":197},"\u00ea":{"d":"166,-217r-36,0r-30,-33r-30,33r-37,0r48,-61r37,0xm99,-190v59,0,86,45,81,111r-117,0v-4,46,63,54,84,24r28,28v-19,18,-36,29,-71,29v-56,-1,-88,-32,-87,-96v1,-57,28,-96,82,-96xm134,-111v5,-41,-52,-53,-67,-20v-3,6,-4,13,-4,20r71,0","w":197},"\u00eb":{"d":"99,-190v59,0,86,45,81,111r-117,0v-4,46,63,54,84,24r28,28v-19,18,-36,29,-71,29v-56,-1,-88,-32,-87,-96v1,-57,28,-96,82,-96xm134,-111v5,-41,-52,-53,-67,-20v-3,6,-4,13,-4,20r71,0xm141,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm59,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":197},"\u00ed":{"d":"73,0r-47,0r0,-188r47,0r0,188xm94,-279r-41,62r-32,0r23,-62r50,0","w":98},"\u00ec":{"d":"73,0r-47,0r0,-188r47,0r0,188xm79,-217r-32,0r-41,-62r50,0","w":98},"\u00ee":{"d":"73,0r-47,0r0,-188r47,0r0,188xm117,-217r-37,0r-30,-33r-29,33r-37,0r48,-61r37,0","w":98},"\u00ef":{"d":"73,0r-47,0r0,-188r47,0r0,188xm90,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm8,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":98},"\u00f1":{"d":"80,-268v25,0,48,29,68,5r21,20v-14,13,-21,22,-41,22v-24,0,-50,-29,-69,-5r-20,-20v14,-13,21,-22,41,-22xm72,-170v35,-40,110,-16,110,50r0,120r-47,0r0,-113v0,-21,-12,-35,-31,-35v-53,0,-24,96,-31,148r-47,0r0,-188r46,0r0,18","w":206},"\u00f3":{"d":"98,-190v52,0,79,34,79,96v0,60,-26,96,-79,96v-53,0,-80,-37,-80,-96v0,-59,27,-96,80,-96xm98,-40v28,0,32,-23,32,-54v0,-31,-5,-54,-32,-54v-27,0,-33,23,-33,54v0,31,5,54,33,54xm151,-279r-41,62r-32,0r23,-62r50,0"},"\u00f2":{"d":"98,-190v52,0,79,34,79,96v0,60,-26,96,-79,96v-53,0,-80,-37,-80,-96v0,-59,27,-96,80,-96xm98,-40v28,0,32,-23,32,-54v0,-31,-5,-54,-32,-54v-27,0,-33,23,-33,54v0,31,5,54,33,54xm117,-217r-32,0r-41,-62r50,0"},"\u00f4":{"d":"164,-217r-36,0r-30,-33r-30,33r-36,0r47,-61r38,0xm98,-190v52,0,79,34,79,96v0,60,-26,96,-79,96v-53,0,-80,-37,-80,-96v0,-59,27,-96,80,-96xm98,-40v28,0,32,-23,32,-54v0,-31,-5,-54,-32,-54v-27,0,-33,23,-33,54v0,31,5,54,33,54"},"\u00f6":{"d":"98,-190v52,0,79,34,79,96v0,60,-26,96,-79,96v-53,0,-80,-37,-80,-96v0,-59,27,-96,80,-96xm98,-40v28,0,32,-23,32,-54v0,-31,-5,-54,-32,-54v-27,0,-33,23,-33,54v0,31,5,54,33,54xm139,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm57,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24"},"\u00f5":{"d":"73,-268v26,0,49,29,69,5r21,20v-14,13,-21,22,-41,22v-25,0,-50,-29,-69,-5r-20,-20v13,-13,20,-22,40,-22xm98,-190v52,0,79,34,79,96v0,60,-26,96,-79,96v-53,0,-80,-37,-80,-96v0,-59,27,-96,80,-96xm98,-40v28,0,32,-23,32,-54v0,-31,-5,-54,-32,-54v-27,0,-33,23,-33,54v0,31,5,54,33,54"},"\u00fa":{"d":"102,-40v19,0,32,-12,31,-34r0,-114r47,0r0,188r-46,0r0,-17v-38,40,-110,14,-110,-51r0,-120r47,0r0,114v-1,22,11,34,31,34xm155,-279r-41,62r-32,0r23,-62r50,0","w":206},"\u00f9":{"d":"102,-40v19,0,32,-12,31,-34r0,-114r47,0r0,188r-46,0r0,-17v-38,40,-110,14,-110,-51r0,-120r47,0r0,114v-1,22,11,34,31,34xm122,-217r-32,0r-41,-62r50,0","w":206},"\u00fb":{"d":"168,-217r-36,0r-30,-33r-30,33r-36,0r47,-61r38,0xm102,-40v19,0,32,-12,31,-34r0,-114r47,0r0,188r-46,0r0,-17v-38,40,-110,14,-110,-51r0,-120r47,0r0,114v-1,22,11,34,31,34","w":206},"\u00fc":{"d":"102,-40v19,0,32,-12,31,-34r0,-114r47,0r0,188r-46,0r0,-17v-38,40,-110,14,-110,-51r0,-120r47,0r0,114v-1,22,11,34,31,34xm143,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm61,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":206},"\u00b0":{"d":"86,-262v39,0,66,29,66,67v0,38,-28,66,-66,66v-38,0,-66,-28,-66,-66v0,-38,27,-67,66,-67xm86,-166v16,0,27,-14,28,-29v1,-15,-13,-29,-28,-29v-16,0,-28,14,-28,29v0,15,12,29,28,29","w":172},"\u00a2":{"d":"115,-80v12,-3,15,-7,23,-15r31,30v-14,15,-30,24,-49,27r0,38r-37,0r0,-38v-43,-10,-65,-42,-66,-94v-1,-51,25,-86,66,-94r0,-30r37,0r0,30v19,3,35,12,49,27r-31,31v-8,-8,-15,-13,-23,-15r0,103xm89,-182v-35,7,-34,94,0,101r0,-101","w":179},"\u00a3":{"d":"159,-200v-22,-26,-79,-14,-73,30r0,27r41,0r0,36r-41,0r0,62r106,0r0,45r-156,0r0,-107r-22,0r0,-36r22,0v-19,-101,90,-148,156,-89","w":208},"\u00a7":{"d":"97,-218v-33,-1,-34,37,-2,45v39,9,77,23,75,74v0,26,-15,44,-32,54v55,28,24,121,-42,116v-41,-3,-71,-23,-72,-64r45,0v0,14,13,22,27,23v33,-1,34,-41,1,-50v-39,-11,-75,-24,-75,-75v0,-24,18,-47,33,-54v-51,-25,-25,-115,42,-109v42,4,67,21,69,61r-44,0v-2,-14,-9,-21,-25,-21xm96,-65v18,0,29,-14,29,-32v0,-18,-11,-32,-29,-32v-19,1,-29,13,-29,32v0,18,10,32,29,32","w":191},"\u00b6":{"d":"13,-183v-1,-47,35,-74,83,-73r115,0r0,325r-47,0r0,-281r-36,0r0,281r-47,0r0,-180v-40,-2,-67,-31,-68,-72","w":240},"\u00df":{"d":"163,-155v30,10,22,57,23,97v1,46,-30,61,-79,58r0,-40v43,8,31,-39,32,-74v0,-17,-13,-24,-32,-22r0,-36v19,2,32,-6,32,-22v0,-17,-13,-24,-32,-24v-24,0,-33,12,-34,34r0,184r-47,0r0,-188v-1,-48,33,-70,81,-70v67,0,105,67,56,103","w":206},"\u00ae":{"d":"152,-258v77,0,130,53,130,130v0,77,-53,130,-130,130v-77,0,-130,-53,-130,-130v0,-77,53,-130,130,-130xm152,-27v59,0,99,-41,99,-101v0,-60,-40,-101,-99,-101v-59,0,-99,41,-99,101v0,59,40,101,99,101xm161,-198v48,-5,61,69,20,81r30,58r-36,0r-25,-54r-15,0r0,54r-31,0r0,-139r57,0xm135,-136v21,1,41,1,41,-18v0,-20,-21,-19,-41,-18r0,36","w":303},"\u00a9":{"d":"152,-258v77,0,130,53,130,130v0,77,-53,130,-130,130v-77,0,-130,-53,-130,-130v0,-77,53,-130,130,-130xm152,-27v59,0,99,-41,99,-101v0,-60,-40,-101,-99,-101v-59,0,-99,41,-99,101v0,59,40,101,99,101xm121,-128v-6,39,38,55,61,31r20,21v-38,37,-120,13,-112,-52v-5,-64,69,-93,112,-52r-20,20v-22,-23,-68,-8,-61,32","w":303},"\u2122":{"d":"310,-103r-35,0r0,-90r-28,56r-31,0r-28,-56r0,90r-35,0r0,-153r35,0r44,82r43,-82r35,0r0,153xm130,-226r-40,0r0,123r-34,0r0,-123r-40,0r0,-30r114,0r0,30","w":332},"\u00b4":{"d":"143,-279r-41,62r-32,0r23,-62r50,0","w":180},"\u00a8":{"d":"131,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm49,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":180},"\u00c6":{"d":"333,0r-168,0r0,-56r-81,0r-29,56r-54,0r134,-256r198,0r0,44r-118,0r0,61r101,0r0,44r-101,0r0,62r118,0r0,45xm165,-98r0,-114r-60,114r60,0","w":352},"\u00d8":{"d":"183,-232v30,25,27,82,27,137v0,74,-68,115,-135,89r-10,22r-36,0r19,-40v-24,-24,-27,-54,-27,-104v0,-98,51,-149,136,-122r10,-22r35,0xm139,-208v-69,-31,-79,63,-64,134xm93,-49v49,22,67,-20,67,-79v0,-26,-1,-44,-3,-54","w":234},"\u00b1":{"d":"178,-123r-58,0r0,58r-44,0r0,-58r-58,0r0,-43r58,0r0,-58r44,0r0,58r58,0r0,43xm178,0r-160,0r0,-44r160,0r0,44"},"\u00a5":{"d":"204,-256r-48,97r26,0r0,36r-45,0v-5,10,-11,19,-9,36r54,0r0,36r-54,0r0,51r-50,0r0,-51r-55,0r0,-36r55,0v2,-17,-4,-26,-9,-36r-46,0r0,-36r27,0r-49,-97r54,0r48,103r47,-103r54,0","w":205},"\u00b5":{"d":"103,-40v19,0,32,-12,31,-34r0,-114r47,0r0,188r-46,0r0,-17v-14,16,-42,25,-63,14r0,72r-47,0r0,-257r47,0r0,114v-1,22,11,34,31,34","w":207},"\u00aa":{"d":"23,-237v27,-36,118,-29,118,32r0,98r-37,0r0,-13v-24,30,-87,13,-87,-32v0,-41,41,-46,86,-43v9,-37,-42,-38,-56,-19xm75,-136v21,0,31,-9,28,-34v-21,0,-49,-5,-49,17v0,11,7,17,21,17","w":163},"\u00ba":{"d":"83,-258v43,0,64,29,64,77v0,48,-22,76,-64,76v-42,0,-63,-29,-63,-76v0,-48,20,-77,63,-77xm83,-139v22,0,26,-18,26,-42v0,-24,-3,-43,-26,-43v-22,0,-25,18,-25,43v0,25,3,41,25,42","w":166},"\u00e6":{"d":"121,-111v11,-46,-54,-49,-71,-24r-29,-29v22,-34,103,-34,129,-5v13,-14,31,-21,53,-21v60,2,86,46,82,111r-118,0v-4,46,62,53,84,24r28,28v-26,36,-108,40,-137,3v-29,41,-133,36,-129,-33v3,-52,52,-58,108,-54xm239,-111v3,-39,-52,-54,-67,-20v-3,6,-5,13,-5,20r72,0xm85,-36v28,1,38,-12,36,-43v-27,1,-64,-7,-63,21v0,15,11,22,27,22","w":301},"\u00f8":{"d":"155,-167v24,11,19,38,22,73v5,75,-53,113,-117,88r-13,22r-28,0r21,-37v-17,-18,-19,-38,-22,-73v-5,-73,54,-114,117,-88r13,-21r29,0xm115,-143v-43,-23,-60,35,-47,80xm80,-45v44,24,59,-34,47,-80"},"\u00bf":{"d":"95,-189v16,0,28,14,28,29v0,15,-13,28,-28,28v-14,0,-29,-14,-29,-28v0,-15,14,-29,29,-29xm96,29v17,0,30,-12,29,-30r47,0v1,43,-34,72,-76,72v-62,0,-96,-66,-58,-117v13,-18,34,-31,33,-61r47,0v5,54,-42,64,-51,106v0,17,11,30,29,30","w":188},"\u00a1":{"d":"66,-189v15,1,28,13,28,29v0,15,-14,28,-28,28v-14,0,-28,-13,-28,-28v0,-15,14,-29,28,-29xm95,69r-58,0r12,-176r34,0","w":124},"\u00ac":{"d":"179,-34r-44,0r0,-52r-118,0r0,-44r162,0r0,96"},"\u0192":{"d":"143,-220v0,0,-40,-3,-44,17r-11,60r35,0r0,36r-41,0r-31,176r-47,0r31,-176r-24,0r0,-36r30,0v10,-61,16,-130,102,-116r0,39","w":153},"\u00ab":{"d":"202,-10r-90,-89r90,-89r0,55r-34,34r34,33r0,56xm102,-10r-90,-89r90,-89r0,55r-34,34r34,33r0,56","w":226},"\u00bb":{"d":"214,-99r-90,89r0,-56r34,-33r-34,-34r0,-55xm114,-99r-90,89r0,-56r34,-33r-34,-34r0,-55","w":226},"\u2026":{"d":"252,-62v17,2,31,13,31,32v0,16,-14,31,-31,31v-17,0,-32,-15,-32,-31v0,-19,14,-30,32,-32xm152,-62v18,0,32,14,32,32v0,16,-15,31,-32,31v-16,0,-31,-15,-31,-31v0,-17,15,-32,31,-32xm22,-30v0,-31,43,-42,58,-16v12,21,-3,47,-27,47v-16,0,-31,-15,-31,-31","w":304},"\u00a0":{"w":83},"\u00c0":{"d":"228,0r-52,0r-16,-45r-91,0r-15,45r-52,0r93,-256r39,0xm147,-88r-31,-93r-33,93r64,0xm134,-281r-32,0r-41,-62r50,0","w":229},"\u00c3":{"d":"89,-331v26,-1,50,30,69,4r21,21v-14,13,-21,21,-41,21v-25,0,-51,-29,-69,-4r-20,-21v14,-13,21,-20,40,-21xm228,0r-52,0r-16,-45r-91,0r-15,45r-52,0r93,-256r39,0xm147,-88r-31,-93r-33,93r64,0","w":229},"\u00d5":{"d":"91,-331v26,-1,50,30,69,4r21,21v-14,13,-21,21,-41,21v-25,0,-51,-29,-69,-4r-20,-21v13,-13,20,-20,40,-21xm116,-258v79,-3,94,72,94,163v0,59,-41,97,-94,97v-71,0,-95,-48,-95,-130v0,-83,24,-128,95,-130xm116,-43v42,0,44,-37,44,-85v0,-49,-1,-86,-44,-86v-42,0,-45,37,-45,86v0,48,2,85,45,85","w":231},"\u0152":{"d":"22,-163v0,-77,84,-121,138,-77r0,-16r168,0r0,44r-118,0r1,61r100,0r0,44r-100,0r-1,63r118,0r0,44r-168,0r0,-16v-10,11,-26,18,-46,18v-85,1,-92,-75,-92,-165xm116,-43v42,0,44,-37,44,-85v0,-49,-1,-86,-44,-86v-42,0,-45,37,-45,86v0,48,2,85,45,85","w":347},"\u0153":{"d":"212,-190v60,2,86,46,82,111r-118,0v-4,46,62,53,84,24r28,28v-25,34,-105,40,-133,5v-11,14,-32,24,-57,24v-53,-1,-83,-37,-80,-96v-14,-87,90,-124,138,-71v12,-14,30,-25,56,-25xm247,-111v4,-41,-52,-54,-67,-20v-2,6,-4,12,-4,20r71,0xm98,-40v28,0,32,-23,32,-54v0,-31,-5,-54,-32,-54v-27,0,-33,23,-33,54v0,31,5,54,33,54","w":310},"\u2013":{"d":"178,-81r-160,0r0,-44r160,0r0,44"},"\u2014":{"d":"348,-81r-327,0r0,-45r327,0r0,45","w":369},"\u201c":{"d":"149,-212r-49,0r0,-44r49,-38r0,82xm73,-212r-49,0r0,-44r49,-38r0,82","w":173},"\u201d":{"d":"149,-212r-49,37r0,-81r49,0r0,44xm73,-212r-49,37r0,-81r49,0r0,44","w":173},"\u2018":{"d":"73,-212r-49,0r0,-44r49,-38r0,82","w":98},"\u2019":{"d":"73,-212r-49,37r0,-81r49,0r0,44","w":98},"\u00f7":{"d":"98,-209v19,0,30,14,31,32v0,19,-13,30,-31,31v-19,0,-32,-13,-32,-31v0,-18,13,-32,32,-32xm179,-81r-162,0r0,-44r162,0r0,44xm98,-60v18,1,31,13,31,32v0,18,-13,30,-31,31v-19,0,-30,-14,-32,-31v2,-18,13,-32,32,-32"},"\u00ff":{"d":"176,-188r-80,218v-10,31,-32,41,-73,39r0,-42v33,5,36,-18,43,-40r-65,-175r50,0r39,116r37,-116r49,0xm129,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm47,-264v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":177},"\u0178":{"d":"205,-256r-77,151r0,105r-50,0r0,-105r-77,-151r54,0r48,103r47,-103r55,0xm144,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm62,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":205},"\u00a4":{"d":"78,-176v24,-17,61,-14,84,0r27,-26r31,31r-27,26v16,25,16,59,0,84r27,26r-31,31r-27,-26v-25,16,-59,16,-84,0r-26,26r-31,-31r26,-26v-15,-25,-15,-59,0,-84r-26,-26r31,-31xm120,-61v24,0,43,-19,43,-42v0,-23,-19,-42,-43,-42v-23,-1,-43,19,-42,42v0,22,20,42,42,42","w":240},"\u00c2":{"d":"180,-281r-36,0r-30,-33r-30,33r-36,0r47,-61r38,0xm228,0r-52,0r-16,-45r-91,0r-15,45r-52,0r93,-256r39,0xm147,-88r-31,-93r-33,93r64,0","w":229},"\u00ca":{"d":"178,-281r-36,0r-30,-33r-30,33r-37,0r48,-61r37,0xm199,0r-169,0r0,-256r169,0r0,44r-119,0r0,60r101,0r0,45r-101,0r0,62r119,0r0,45","w":217},"\u00c1":{"d":"228,0r-52,0r-16,-45r-91,0r-15,45r-52,0r93,-256r39,0xm147,-88r-31,-93r-33,93r64,0xm167,-343r-41,62r-32,0r23,-62r50,0","w":229},"\u00cb":{"d":"199,0r-169,0r0,-256r169,0r0,44r-119,0r0,60r101,0r0,45r-101,0r0,62r119,0r0,45xm153,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm71,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":217},"\u00c8":{"d":"199,0r-169,0r0,-256r169,0r0,44r-119,0r0,60r101,0r0,45r-101,0r0,62r119,0r0,45xm132,-281r-32,0r-41,-62r50,0","w":217},"\u00cd":{"d":"80,0r-50,0r0,-256r50,0r0,256xm99,-343r-41,62r-32,0r23,-62r50,0","w":109},"\u00ce":{"d":"121,-281r-37,0r-30,-33r-30,33r-36,0r48,-61r37,0xm80,0r-50,0r0,-256r50,0r0,256","w":109},"\u00cf":{"d":"80,0r-50,0r0,-256r50,0r0,256xm96,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-12,-24,-24v0,-12,11,-24,24,-24xm14,-328v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24","w":109},"\u00cc":{"d":"80,0r-50,0r0,-256r50,0r0,256xm85,-281r-32,0r-41,-62r50,0","w":109},"\u00d3":{"d":"116,-258v79,-3,94,72,94,163v0,59,-41,97,-94,97v-71,0,-95,-48,-95,-130v0,-83,24,-128,95,-130xm116,-43v42,0,44,-37,44,-85v0,-49,-1,-86,-44,-86v-42,0,-45,37,-45,86v0,48,2,85,45,85xm169,-343r-41,62r-32,0r23,-62r50,0","w":231},"\u00d4":{"d":"182,-281r-36,0r-30,-33r-30,33r-36,0r47,-61r37,0xm116,-258v79,-3,94,72,94,163v0,59,-41,97,-94,97v-71,0,-95,-48,-95,-130v0,-83,24,-128,95,-130xm116,-43v42,0,44,-37,44,-85v0,-49,-1,-86,-44,-86v-42,0,-45,37,-45,86v0,48,2,85,45,85","w":231},"\u00d2":{"d":"116,-258v79,-3,94,72,94,163v0,59,-41,97,-94,97v-71,0,-95,-48,-95,-130v0,-83,24,-128,95,-130xm116,-43v42,0,44,-37,44,-85v0,-49,-1,-86,-44,-86v-42,0,-45,37,-45,86v0,48,2,85,45,85xm136,-281r-32,0r-41,-62r50,0","w":231},"\u00da":{"d":"120,-43v29,0,45,-18,45,-47r0,-166r50,0r0,168v-2,55,-38,90,-95,90v-56,0,-94,-34,-94,-90r0,-168r50,0r0,166v0,29,16,47,44,47xm173,-343r-41,62r-32,0r23,-62r50,0","w":240},"\u00db":{"d":"187,-281r-37,0r-30,-33r-30,33r-36,0r48,-61r37,0xm120,-43v29,0,45,-18,45,-47r0,-166r50,0r0,168v-2,55,-38,90,-95,90v-56,0,-94,-34,-94,-90r0,-168r50,0r0,166v0,29,16,47,44,47","w":240},"\u00d9":{"d":"120,-43v29,0,45,-18,45,-47r0,-166r50,0r0,168v-2,55,-38,90,-95,90v-56,0,-94,-34,-94,-90r0,-168r50,0r0,166v0,29,16,47,44,47xm140,-281r-32,0r-41,-62r50,0","w":240},"\u00af":{"d":"147,-227r-114,0r0,-31r114,0r0,31","w":180},"\u00b8":{"d":"117,22r-16,52r-43,0r24,-52r35,0","w":180}}});

(function($){$.toJSON=function(o)
{if(typeof(JSON)=='object'&&JSON.stringify)
return JSON.stringify(o);var type=typeof(o);if(o===null)
return"null";if(type=="undefined")
return undefined;if(type=="number"||type=="boolean")
return o+"";if(type=="string")
return $.quoteString(o);if(type=='object')
{if(typeof o.toJSON=="function")
return $.toJSON(o.toJSON());if(o.constructor===Date)
{var month=o.getUTCMonth()+1;if(month<10)month='0'+month;var day=o.getUTCDate();if(day<10)day='0'+day;var year=o.getUTCFullYear();var hours=o.getUTCHours();if(hours<10)hours='0'+hours;var minutes=o.getUTCMinutes();if(minutes<10)minutes='0'+minutes;var seconds=o.getUTCSeconds();if(seconds<10)seconds='0'+seconds;var milli=o.getUTCMilliseconds();if(milli<100)milli='0'+milli;if(milli<10)milli='0'+milli;return'"'+year+'-'+month+'-'+day+'T'+
hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
if(o.constructor===Array)
{var ret=[];for(var i=0;i<o.length;i++)
ret.push($.toJSON(o[i])||"null");return"["+ret.join(",")+"]";}
var pairs=[];for(var k in o){var name;var type=typeof k;if(type=="number")
name='"'+k+'"';else if(type=="string")
name=$.quoteString(k);else
continue;if(typeof o[k]=="function")
continue;var val=$.toJSON(o[k]);pairs.push(name+":"+val);}
return"{"+pairs.join(", ")+"}";}};$.evalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);return eval("("+src+")");};$.secureEvalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))
return eval("("+src+")");else
throw new SyntaxError("Error parsing JSON, source is not valid.");};$.quoteString=function(string)
{if(string.match(_escapeable))
{return'"'+string.replace(_escapeable,function(a)
{var c=_meta[a];if(typeof c==='string')return c;c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var _meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};})(jQuery);(function($){

	$.jsonPOST = function(userOptions) {
		var options = $.extend(true, 
			{
				type: 'POST',
				contentType: 'application/json',
				beforeSend: function (xmlHttp) {
					xmlHttp.setRequestHeader("Accept", "application/json, text/javascript, */*");
				}
			}, userOptions);

		options.data =  $.toJSON(options.data);
		$.ajax(options);
	};

    $.fn.findNextNode = function (selector) {
    	return this.parents().find(selector).first();
    };

    $.normalizeObject = function (obj, opts) {
    	if (obj == null)
    		return null;
    	var options = $.extend({blankAsNull: true, nullText: null}, opts || {});
    	var newObj = {};
    	if ($.type(obj) === 'array') {
    		newObj = [];
    	}
    	$.each(obj, function(name, value) {
    		if (typeof(value) == 'object') {
    			newObj[name] = $.normalizeObject(value, opts);
    			return;
    		}
    		if (value == undefined) {
    			newObj[name] = null;
    			return;
    		}
    		if (options.blankAsNull) {
	    		if (typeof(value) == 'string' && $.trim(value) == "") {
	    			newObj[name] = null;
	    			return;
	    		}
    		}
    		if (options.nullText) {
	    		if (typeof(value) == 'string' && $.trim(options.nullText) == "") {
	    			newObj[name] = null;
	    			return;
	    		}
    		}
    		newObj[name] = value;
    	});
    	return newObj;
    };

	$.fn.serializeAsObject = function (options) {
		var defaultOptions = {blankAsNull: true};
		options = $.extend(defaultOptions, options || {});
		var formArray = this.serializeArray();
		var rootObject = {};
		var createObject = function(obj, name, value) {
			var index = 0;
			var parentObj = obj;
			while (true) {
				var next = name.indexOf('.', index) + 1;
				var node = "";
				if (next > 0) {
					node = name.substring(index, next - 1);
				} else {
					node = name.substring(index);
				}

				var childObj = parentObj[node];
				if (next > 0) {
					if (childObj == null || typeof(childObj) == 'undefined') {
						childObj = {};
						parentObj[node] = childObj;
					}
				} else {
					if (parentObj[node] !== null && typeof(parentObj[node]) !== 'undefined' && !$.isArray(parentObj[node])) {
						parentObj[node] = [parentObj[node]];
					}
					if ($.isArray(parentObj[node])) {
						parentObj[node].push(value);
					} else {
						parentObj[node] = value;
					}
				}
				parentObj = childObj;
				index = next;
				if (next == 0) {
					break;
				}
			}
		};
		$(formArray).each(function(index, nameValuePair) {
			createObject(rootObject, nameValuePair.name, nameValuePair.value);
		});

		if (options.blankAsNull) {
			rootObject = $.normalizeObject(rootObject);
		}

		return rootObject;
	};

	$.consoleHistory = [];
	
	$.readConsoleLog = function() {
		if ($.toggleConsole.consoleList) {
			if ($.consoleHistory.length > 0) {
				var history = $.consoleHistory.join("</li><li>");
				$.consoleHistory.length = 0;
				var items = "<li>" + history + "</li>";
				$.toggleConsole.consoleList.append(items);
			}
		}
	};
	
	$.applyConsole = function() {
		if (window.console && typeof console.log === "function") {
			$.console_log = function () { console.log.apply(console, arguments); };
		} else {
			$.console_log = function(){ try { $.consoleHistory.push(/*$.toJSON*/($.merge([new Date().getTime()], arguments))); } catch (e) {$.consoleHistory.push(($.merge([new Date()], arguments))); } $.readConsoleLog(); };
			window.console = {log: $.log};
		}
	};
		
	$.toggleConsole = function() {
		if (!$.toggleConsole.console) {
			$("body").append($("<div class='console_logger' style='display: none'><ul></ul></div>"));
			$.toggleConsole.console = $("body > .console_logger");
			$.toggleConsole.consoleList = $.toggleConsole.console.find("ul");
		}
		$.readConsoleLog();
		$.toggleConsole.console.toggle();
	};

	$.log = function() {
		if (!$.console_log) {
			$.applyConsole();
		}
		try {
			$.console_log.apply(this, arguments);
		} catch (e) {
			$.console_log(arguments);
		}
	};

	$.fn.log = function (msg) {
		try {
		  $.log("%s: %o", msg, this);
		  return this;
		} catch (e) {
			// faça nada...
		}
	};

	$.fn.disable = function() {
		return this.each(function() {
			$(this).attr("disabled", true);
		});
	};

	$.fn.enable = function() {
		return this.each(function() {
			$(this).attr("disabled", false);
		});
	};

	$.fn.maskDate = function() {
		return this.each(function() {
			var el = $(this);
			el.bind('keydown', function(e) {
				var removerBarra = el.data('removerBarra');
				if (removerBarra && (e.which == 191 || e.which == 193 || e.which == 111)) {
					e.stopPropagation();
					return false;
				} else {
					el.data('removerBarra', false);
				}

			});
			el.bind('keyup', function(e) {
				var dataString = $.trim(el.val());
				var RE = new RegExp("^(\\d*)/?(\\d*)/?(\\d*)$");
				var ISDIGIT = new RegExp("\\d");
				var data = RE.exec(dataString);
				var removerBarra = el.data('removerBarra');
				if (!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105))) {
					return;
				}
				if (data == null) {
					return;
				}
				if (parseInt(data[1], 10) > 3 && data[2] == "" || !isNaN(data[1]) && data[1].length == 2) {
					if (dataString.length == 1 || dataString.length == 2) {
						if (ISDIGIT.test(dataString.substring(dataString.length - 1))) {
							el.val(el.val() + "/");
							el.data('removerBarra', true);
							e.stopPropagation();
							return false;
						}
					}
				}
				if (parseInt(data[2], 10) > 1 && data[3] == "" || !isNaN(data[2]) && data[2].length == 2) {
					if (dataString.length == 3 || dataString.length == 4 || dataString.length == 5) {
						if (ISDIGIT.test(dataString.substring(dataString.length - 1))) {
							el.val(el.val() + "/" );
							el.data('removerBarra', true);
							e.stopPropagation();
							return false;
						}
					}
				}
			});
		});
	};


	$.fn.maskPlaca = function() {
		return this.each(function() {
			var el = $(this);
			el.bind('keydown', function(e) {
				var removerTraco = el.data('removerTraco');
				if (removerTraco && (e.which == 191 || e.which == 193 || e.which == 111)) {
					e.stopPropagation();
					return false;
				} else {
					el.data('removerTraco', false);
				}

			});
			el.bind('keyup', function(e) {
				var dataString = $.trim(el.val());
				var RE = new RegExp("^(\\d*)-?(\\d*)/?(\\d*)$");
				var ISDIGIT = new RegExp("\\d");
				var data = RE.exec(dataString);
				var removerTraco = el.data('removerTraco');
				if (!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105))) {
					return;
				}
				if (data == null) {
					return;
				}
				if (parseInt(data[1], 10) > 3 && data[2] == "" || !isNaN(data[1]) && data[1].length == 2) {
					if (dataString.length == 1 || dataString.length == 2) {
						if (ISDIGIT.test(dataString.substring(dataString.length - 1))) {
							el.val(el.val() + "-");
							el.data('removerTraco', true);
							e.stopPropagation();
							return false;
						}
					}
				}
				if (parseInt(data[2], 10) > 1 && data[3] == "" || !isNaN(data[2]) && data[2].length == 2) {
					if (dataString.length == 3 || dataString.length == 4 || dataString.length == 5) {
						if (ISDIGIT.test(dataString.substring(dataString.length - 1))) {
							el.val(el.val() + "-" );
							el.data('removerTraco', true);
							e.stopPropagation();
							return false;
						}
					}
				}
			});
		});
	};



	$.spriteId = 0;
	$.spriteFunctionId = 0;
	$.fn.createSprite = function (opts) {
		return this.each(function() {
			var el = $(this);
			var options = $.extend({
				spriteSpacing: null,
				spriteSpacingStyleProperty: 'line-height',
				verticalOrientation: false,
				negative: true,
				totalSprites: -1,
				duration: -1,
				checkElement: function() {return true;},
				completed: function() {},
				timeout: function() {},
				status: function(seg, o) {$.log("Aguarde " + seg, o);},
				startOffsetSeconds: 0,
				step: 500,
				data: {}
			}, opts || {});
			options.checkElement(el);
			options.multiplier = options.negative ? -1 : 1;
			var lastOptions = $.spriteOptions(el, undefined, true);
			if (lastOptions) {
				el.clearQueue(lastOptions.data["sprite-queue-name"]);
			}
			var queueName = "sprite-queue" + $.spriteId++;
			$.spriteOptions(el, options);
			el.clearQueue(queueName);
			options.data["sprite-queue-name"] = queueName;
			options.data["elapsed-time-millis"] = options.startOffsetSeconds * 1000;
			var id = $.spriteId++;
			if (options.duration != -1) {
				var duration = options.duration;
				if (typeof(duration) == 'function' ) {
					options.duration = options.duration.call(el);
				}
				for (var sec = 0; sec <= options.duration - options.startOffsetSeconds; sec = sec + (options.step / 1000)) {
					function runNextSprite() {
						var functionId = $.spriteFunctionId++;
						return function(next) {
							try {
								options.data["elapsed-time-millis"] = options.data["elapsed-time-millis"] + options.step;
								el.sprite({elapsed: options.data["elapsed-time-millis"]});
							} catch (e) {
							}
							next();
						};
					}
					el.queue(queueName, runNextSprite());
					el.delay(options.step, queueName);
				}
				el.dequeue(queueName);
			}
		});
	};

	// Save or read sprite options ...
	$.spriteOptions = function(el, options, isCreateSprite) {
		if (options) {
			el.data("smartia-sprite", options);
		} else {
			options = el.data("smartia-sprite");
			if (!options) {
				if (!isCreateSprite) {
					el.createSprite({});
				}
				options = el.data("smartia-sprite");
			}
		}
		return options;
	};

	$.fn.hasSprite = function (callback) {
		return this.each(function() {
			var el = $(this);
			var spriteOptions = el.data("smartia-sprite");
			callback(spriteOptions != null);
		});
	};

	$.fn.sprite = function (opts) {
		return this.each(function() {
			var el = $(this);
			var options = $.spriteOptions(el);
			var spriteNumber = 0;
			if (typeof(opts) == 'object') {
				if (opts.completed) {
					var currentSpriteNumber = options.data["sprite-number"] || 0;
					var currentSpritePercent = Math.round(100*currentSpriteNumber/options.totalSprites);
					var queueName = options.data["sprite-queue-name"];
					var loops = (options.totalSprites - spriteNumber);
					var percentStep = (100 - currentSpritePercent) / loops;
					options.data["sprite-queue-percent-step"] = percentStep;
					options.data["sprite-queue-current-percent"] = currentSpritePercent;
					el.clearQueue(queueName);
					for (var i = 0; i < loops; i++) {
						el.queue(queueName, function(next) {
							var per =   options.data["sprite-queue-current-percent"];
							per = per + options.data["sprite-queue-percent-step"];
							options.data["sprite-queue-current-percent"] = per;
							el.sprite({percent: per, forceCompleted: true});
							if (options.data["sprite-number"] == options.totalSprites) {
								if (opts.continueProcess) {
									opts.continueProcess.call(el);
								}
							}
							next();
						});
						el.delay(40, queueName);
					}
					el.dequeue(queueName);
					return;
				}
				if (opts.elapsed) {
					opts.percent = (100 * opts.elapsed) / (options.duration * 1000);
				}
				if (opts.percent) {
					if (options.totalSprites == -1) {
						throw Error("Para alterar o percentual de sprites, é necessario definir a propriedade totalSprites. Exemplo: $('my_class').setSprite({totalSprites: 12});");
					}
					spriteNumber = opts.percent * options.totalSprites / 100;
				}
			} else {
				spriteNumber = opts;
			}
			opts.completed = opts.completed || opts.forceCompleted;
			var spriteSpacing = options.spriteSpacing;
			if (spriteSpacing == null) {
				var spriteSpacingStyle = el.css(options.spriteSpacingStyleProperty);
				spriteSpacing = parseFloat(spriteSpacingStyle.replace(/[^\d]*/g, ""));
				spriteSpacingUnit = spriteSpacingStyle.replace(/[\d]*/g, "");
			}
			if (spriteNumber > 0.0 && spriteNumber < 1) {
				spriteNumber = 1;
			}
			spriteNumber = Math.round(spriteNumber);
			options.data["sprite-number"] = spriteNumber;
			var width = el.width();
			var height = el.height();
			if (options.verticalOrientation) {
				height = (el.height() + spriteSpacing) * spriteNumber * options.multiplier;
				width = 0;
			} else {
				height = 0;
				width = (el.width() + spriteSpacing) * spriteNumber  * options.multiplier;
			}
			var backgroundPosition = width + spriteSpacingUnit + " " + height + spriteSpacingUnit;
			if (options.totalSprites != -1 && spriteNumber == options.totalSprites) {
				el.clearQueue(options.data["sprite-queue-name"]);
			}
			el.css("background-position", backgroundPosition);
			if (opts.elapsed) {
				options.status(options.duration - (opts.elapsed / 1000),  opts);
			}
			if (options.totalSprites != -1 && spriteNumber >= options.totalSprites) {
				if (opts.completed) {
					options.completed.call(el);
				} else {
					options.timeout.call(el);
				}
			}
		});
	};

	// Esta criação é necessária para que os grupos de radios que não possuam nenhuma radio marcada
	// cheguem ao servidor, pelo POST, com algum valor (no caso, blank). Assim, o Spring pode zerar o
	// bean correspondente.
	$.fn.createBlankValuesForUncheckedRadioGroups = function() {
		return this.each(function() {
			var form$ = $(this);
			var checkedRadioNames = {};
			var blankInputHiddenNames = {};

			// obtem todos os radios marcados
			$("input[type=radio]:checked", form$).each(function() {
				var radioName = $(this).attr('name');
				checkedRadioNames[radioName] = radioName;
			});
			// guarda os nomes únicos dos radios que não estejam na lista de marcados
			$("input[type=radio]", form$).each(function() {
				var radioName = $(this).attr('name');
				if (checkedRadioNames[radioName] == null)
					blankInputHiddenNames[radioName] = radioName;
			});
			// para cada nome de radio (radio group) que não possua radios marcados, cria um input hidden com valor blank
			$.each(blankInputHiddenNames, function(radioName) {
				form$.append('<input type="hidden" value="" name="' + radioName + '"/>');
			});
		});
	};
	
	$.expr[':'].blocked = function (el) {
		var el$ = $(el);
		return el$.data('blocked') || false;
	};
	
	$.doBlock = function (el$, options) {
		el$.data('blocked', true);
		// Backup das configurações de bloqueio
		el$.data('_blocked_options', options);
		// Backup dos atributos relevantes
		el$.data('_blocked_attrs', {
			title: el$.attr('title')
		});
		// Backup de todos os evento atuais
		el$.data('_blocked_events', $.extend(true, {}, el$.data('events'), el$.data('__events__'), $._data && $._data(el$[0], "events")));
		console.log(el$.data('_blocked_events'));
		// Remover todos os eventos que devem ser bloqueados
		el$.unbind(options.blockEvents.join(', '));
		// Função que não faz nada...
		el$.bind('click', $.doNothing);
		// Adicionar classe que faz o bloqueio...
		el$.addClass(options.blockClass);
		// Adicionar mensagem de bloqueio caso exista...
		if (options.blockMessage) {
			el$.attr('title', options.blockMessage);
		}
	};
	
	$.doUnblock = function (el$) {
		// Restore das configurações de bloqueio
		var options = el$.data('_blocked_options');
		var events = el$.data('_blocked_events');
		var attrs = el$.data('_blocked_attrs');
		console.log(events, attrs);
		// Remover as configurações
		el$.removeData('blocked');
		el$.removeData('_blocked_options');
		el$.removeData('_blocked_attrs');
		el$.removeData('_blocked_events');
		
		// Reatribuir os atributos originais
		$.each(attrs, function (name, value) {
			if ($.type(value) == 'undefined') 
				el$.removeAttr(name);
			else 
				el$.attr(name, value);
		});

		// Remover a função que não faz nada
		el$.unbind('click', $.doNothing);
		
		// Rebind dos eventos originais
		$.each(options.blockEvents, function(i, eventName) {
			$.each(events[eventName] || [], function(i, event) {
				el$.bind(eventName, event.handler || event);
			});
		});
		
		// Adicionar classe que faz o bloqueio...
		el$.removeClass(options.blockClass);
		
	};
	
	$.doNothing = function(e) {
		if (e.stopImmediatePropagation)
			e.stopImmediatePropagation();
		$.log("Do nothing!");
		return false;
	};
	
	$.doForParent = function(el$, callback) {
		var options = el$.data('_blocked_options');
		if (options.findParent) {
			var parent$ = options.findParent(el$);
			if (parent$) {
				parent$.each(function() {
					var p$ = $(this);
					if (!p$.is(':blocked')) {
						callback(p$, options);							
					}
				});
			}
		}
	};
	
	$.fn.block = function(opts) {
		var options = $.extend(true, {
			blockClass: 'app-event-block'
			, blockEvents: ['click']
			, blockMessage: "Aguarde..." 
			, findParent: null
			}, opts);
		return this.filter(':not(:blocked)').each(function() {
			var el$ = $(this);
			$.doBlock(el$, options);
			$.doForParent(el$, function(p$, options) {
				$.doBlock(p$, options);
			});
		});
	};
	
	$.fn.unblock = function(opts) {
		return this.filter(':blocked').each(function() {
			var el$ = $(this);
			$.doForParent(el$, function(p$) {
				$.doUnblock(p$);	
			});
			$.doUnblock(el$);
		});
	};
	
	$.fn.toggleImmediate = function(show) {
		return this.each(function() {
			if (show) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	};

	// Substitui, na 'formatString' informada, os placeholders '{n}' pelos valores passados em 'argsArray'. Exemplo:
	// $.stringFormat('Teenage {0} Ninja {1}s... Heroes in a half shell, {1} Power!', ['Mutant', 'Turtle']);
	// resulta em:    'Teenage Mutant Ninja Turtles... Heroes in a half shell, Turtle Power!'
	$.stringFormat = function(formatString, argsArray) {
		$(argsArray).each(function(index, arrayItem) {
			formatString = formatString.replace(new RegExp("\\{" + index + "\\}", "g"), arrayItem);
		});
		return formatString;
	};

	$.getWindowSize = function() {
		if (typeof window.innerWidth  == 'number') {
			width = window.innerWidth;
			height = window.innerHeight;
		} else if(document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
		} else {
			width = document.body.clientWidth;
			height = document.body.clientHeight;
		}
		return {"width": parseInt(width, 10), "height": parseInt(height, 10)};
	};

	$.resizeWindow = function(targetWidth, targetHeight) {
		window.resizeTo(targetWidth, targetHeight);
		currentSize = $.getWindowSize();
		var deltaWidth = targetWidth - currentSize.width;
		var deltaHeight = targetHeight - currentSize.height;
		window.resizeTo(targetWidth + deltaWidth, targetHeight + deltaHeight);
	};

	$.ensureMinWindowSize = function(minWidth, minHeight) {
		$(window).unbind('resize.ensureMinWindowsSize').bind('resize.ensureMinWindowsSize', function() {
			var currentSize = $.getWindowSize();
			if (minWidth > currentSize.width || minHeight > currentSize.height) {
				var targetWidth = currentSize.width < minWidth ? minWidth : currentSize.width;
				var targetHeight = currentSize.height < minHeight ? minHeight : currentSize.height;
				$.resizeWindow(targetWidth, targetHeight);
			}
		});
	};

	$.aspect = function(obj, opts) {
		opts = opts || {};
		var aspect = $.extend({
				before: function(before) {

				}
				,around: function(aop) {
					return aop.proceed();
				}
				,afterReturning: function(afterReturning) {

				}
				,afterThrowing: function(afterThrowing) {

				}
				,after: function(after) {

				}
			}, opts.aspect || {});
		var options = $.extend({
			defaultExcludeObjects: [$]
			,defaultExcludeObjectTest: function(object) {
				return false;
			}
			,excludedProperties: ["_prototype"]
			,excludePropertyTest: function(name, value) {
				return false;
			}
		}, opts);
		options.aspect = aspect;
		var testExcludeObject = function(obj) {
			if ($.inArray(obj, options.defaultExcludeObjects) > -1) {
				return true;
			}
			options.defaultExcludeObjectTest(obj);
			return false;
		};
		var testExcludeProperty = function(name, targetFunction) {
			if ($.inArray(name, options.excludedProperties) > -1) {
				return true;
			}
			options.excludePropertyTest(name, targetFunction);
			return false;
		};
		var AopProxyFunction = function(obj, name, targetFunction, aspect) {
			this.IS_AOP_FUNCTION = true;
			return function() {
				var scope = this;
				var aop = {name: name, args: arguments, scope: scope, me: obj, "proceed": function() {
					return targetFunction.apply(aop.scope, aop.args);
				}};
				var value;
				var error;
				aspect.before.call(scope, {name: name, args: arguments, scope: scope, me: obj});
				try {
					value = aspect.around(aop);
					aspect.afterReturning.call(scope, {name: name, args: arguments, scope: scope, me: obj, returnValue: value});
				} catch (e) {
					error = e;
					aspect.afterThrowing.call(scope, {name: name, args: arguments, scope: scope, me: obj, error: error});
					throw e;
				} finally {
					aspect.after.call(scope, {name: name, args: arguments, scope: scope, me: obj, error: error, returnValue: value});
				}
				return value;
			};
		};
		var applyAspect = function(obj) {
			if ($.type(obj) == 'object' && !testExcludeObject(obj)) {
				$.each(obj, function(name, targetFunction) {
					if (targetFunction != null && $.type(targetFunction) == "function" && !testExcludeProperty(name, targetFunction) && !targetFunction.IS_AOP_FUNCTION) { // Só																													// functions...
						obj[name] =	new AopProxyFunction(obj, name, targetFunction, options.aspect);
					}
				});
			}
			return obj;
		};
		return applyAspect(obj);

	};

	$.logAspect = function(obj, opts) {
		var clone = function(target) {
			var dest = [];
			for(var v = 0; v < target.length; v++) {
				dest[v] = target[v];
			}
			return dest;
		};
		var repeat = function(num, str) {
		    return new Array(isNaN(num)? 1 : ++num).join(str);
	    };
		var createMessage = function(template, args) {
			var messageTemplate = clone(template);
			$.each(messageTemplate, function(i, message) {
				if ($.type(message) == 'number') {
					messageTemplate[i] = args[messageTemplate[i]];
				}
			});
			return messageTemplate;
		};
		var depth = 0;
		var options = $.extend({
			messagesTemplates: {
				"before": [0, 4, "inicio >>", 1,"(", 2, ")"]
				,"afterThrowing": [0, 5, "fim    <<", 1, "(", 2, ") Erro: ", 3]
				,"afterReturning": [0, 5, "fim    <<", 1, "(", 2, ") Retornando: ", 3]
				,"afterReturning_sem_retorno": [0, 5, "fim    <<", 1, "(", 2, ")"]
			}
			,enableDepth: true
			,messagePrefix: "\tjsAOP "
			,depthChar: "  "
			,ownerToString: function(obj) {
				return obj;
			}
			,aspectConfig: {
				aspect:{
					before: function(aop) {
						var args = ["", aop.name, aop.args, aop.scope, options.ownerToString(aop.me)];
						if (options.enableDepth) {
							args[0] = repeat(depth, options.depthChar);
							depth++;
						}
						args[0] = options.messagePrefix + args[0];
						if (aop.args.length == 0)
							args[2] = "";
						var logMessage = createMessage(options.messagesTemplates.before, args);
						$.log.apply(this, logMessage);
					}
					,afterThrowing: function(aop) {
						var args = ["", aop.name, aop.args, aop.error, aop.scope, options.ownerToString(aop.me)];
						if (options.enableDepth) {
							depth--;
							args[0] = repeat(depth, options.depthChar);
						}
						args[0] = options.messagePrefix + args[0];
						if (aop.args.length == 0)
							args[2] = "";
						var logMessage = createMessage(options.messagesTemplates.afterThrowing, args);
						$.log.apply(this, logMessage);
					}
					,afterReturning: function(aop) {
						var args = ["", aop.name, aop.args, aop.returnValue, aop.scope, options.ownerToString(aop.me)];
						if (options.enableDepth) {
							depth--;
							args[0] = repeat(depth, options.depthChar);
						}
						args[0] = options.messagePrefix + args[0];
						if (aop.args.length == 0)
							args[2] = "";
						var template = aop.returnValue ? options.messagesTemplates.afterReturning : options.messagesTemplates.afterReturning_sem_retorno;
						var logMessage = createMessage(template, args);
						$.log.apply(this, logMessage);
					}
				}
			}
		}, opts);
		return $.aspect(obj, options.aspectConfig);
	};

	$.getWindowSize = function() {
		if (typeof window.innerWidth  == 'number') {
			width = window.innerWidth;
			height = window.innerHeight;
		} else if(document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
		} else {
			width = document.body.clientWidth;
			height = document.body.clientHeight;
		}
		return {"width": parseInt(width, 10), "height": parseInt(height, 10)};
	};

	$.resizeWindow = function(targetWidth, targetHeight) {
		window.resizeTo(targetWidth, targetHeight);
		// devido a bordas, toolbars etc, o tamanho efetivo fica incorreto - calcula a diferença e redimensiona para compensar
		currentSize = $.getWindowSize();
		var deltaWidth = targetWidth - currentSize.width;
		var deltaHeight = targetHeight - currentSize.height;
		window.resizeTo(targetWidth + deltaWidth, targetHeight + deltaHeight);
	};

	$.ensureMinWindowSize = function(minWidth, minHeight) {
		var func = function() {
			var currentSize = $.getWindowSize();
			if (minWidth > currentSize.width || minHeight > currentSize.height) {
				var targetWidth = currentSize.width < minWidth ? minWidth : currentSize.width;
				var targetHeight = currentSize.height < minHeight ? minHeight : currentSize.height;
				$.resizeWindow(targetWidth, targetHeight);
			}
		};
		$(window).unbind('resize.ensureMinWindowsSize').bind('resize.ensureMinWindowsSize', func);
		func();
	};

	String.prototype.padLeft = function(n, pad)
	{
		t = '';
		if(n>this.length){
			for(i=0;i < n-this.length;i++){
				t+=pad;
			}
		}
		return t+this;
	};

	String.prototype.padRight = function(n, pad)
	{
		t = this;
		if(n>this.length){
			for(i=0;i < n-this.length;i++){
				t+=pad;
			}
		}
		return t;
	};


	$.ajaxSetup({
		type: "POST"
		,cache: false
	});
	
	$.__ajax = $.ajax;
	
	$.ajax = function(opts) {
		if ($.type(opts) == 'object') {
			opts.cache = false;
			if (opts.url) {
				var dynamic = new Date().getTime();
				if (opts.url.indexOf('?') > -1) {
					opts.url = opts.url + "&t=" + dynamic;
				} else {
					opts.url = opts.url + "?t=" + dynamic;
				}
			}
		}
		$.__ajax.call(this, opts);
		return $.__ajax;
	};
	
	$.getJSON = function( url, data, callback ) {
		return $.post(url, data, callback, "json");
	};
	
	
	
	$.fn.marcadaguaUpdate = function () {
		return this.each(function () {
			var el = $(this);
			var showOrHideMarcaDagua = el.data('marcadagua-options').showOrHideMarcaDagua;
			if (showOrHideMarcaDagua) {
				showOrHideMarcaDagua();
			}
		});
	};
	
	$.marcadaguaFields = [];
	$.marcadaguaCheckDirty = function() {
		for(var i = 0; i < $.marcadaguaFields.length; i++) {
			var field = $.marcadaguaFields[i];
			if (field.val() != '') {
				if (field.data('isMarcadaguaShowing')) {
					field.marcadaguaUpdate();
				}
			};
		}
		if ($.marcadaguaFields.length != 0) {
			window.setTimeout($.marcadaguaCheckDirty, 200);
		}
	};
	
	$.fn.forceUpperCase = function() {
		return this.bind('blur', function() {
			var val = this.value || "";
			val = val.toUpperCase();
			if (val != this.value) {
				this.value = val;
			}
		});
	};
	
	// Customizado de http://that-matt.com/2010/04/updated-textarea-maxlength-with-jquery-plugin/
	$.fn.maxLengthForTextarea = function(options) {
		 var settings = $.extend({
	          attribute: "data-maxlength"
	         , onLimitEvent: 'limit'
	         , onEditEvent: 'typing'
        	 , truncate: false
	         , findCounter: function(event, maxlength, remaining) {
	        	 var idTextarea = $(this).attr('id');
	        	 if ($.type(idTextarea) == 'string') {	 
	        		 $(".contador_" + idTextarea).text(remaining).toggleClass('negativo', remaining < 0);
	        	 }
	         }
	     }, options);
	    // Event handler to limit the textarea
		 var onEdit = function() {
	        var textarea = $(this);
	        var maxlength = parseInt(textarea.attr(settings.attribute));
	        var used = textarea.val().length;
	        if (settings.truncate && used > maxlength) {
	            textarea.val(textarea.val().substr(0, maxlength));
	            // Call the onlimit handler within the scope of the textarea
	            textarea.trigger(settings.onLimitEvent, [maxlength]);
	        }
	        // Call the onEdit handler within the scope of the textarea
	        textarea.trigger(settings.onEditEvent, [maxlength, maxlength - used]);
	    };
	    return this.find("textarea[data-maxlength]").live('keyup keydown focus', onEdit).live('input paste', onEdit).live('typing', settings.findCounter || function() {}).each(onEdit);	    
	};
	
	/*$.fn.limitarCaracteres = function(options) {		
		var defaults = {  
			maxCarateresMensagem: 1000,  
			seletorContador: '#max_mensagem',
			corFonteContador: '#bbb', 
			resetarContador: false
		};  		
		var options = $.extend(defaults, options);
		var contador = $(options.seletorContador);
		contador.html(options.maxCarateresMensagem);
		if (options.resetarContador) return;
		return this.each(function() {
			$(this).bind('keyup keydown', function() {
				var totalCaracteres = $(this).val().length;
				var caracteresFaltando = parseInt(options.maxCarateresMensagem - totalCaracteres);
				if (caracteresFaltando < 0) contador.css('color', 'red');				
				else contador.css('color', options.corFonteContador);
				contador.html(caracteresFaltando);
			});
		});		
	};*/

	$.fn.tornaTextoExpansivel = function(opts) {
		var options = $.extend({tamanhoResumo: 200, textoLink: 'ver texto completo'}, opts);
		return this.each(function() {
			//debugger;
			var me$ = $(this);
			if (me$.children().length > 0) {
				$.log("O plugin tornaTextoExpansivel só deve ser aplicado em elementos que contenham apenas texto. Pulando este elemento...", me$);
				return;
			}
			var textoOriginal = me$.text();
			if (textoOriginal && textoOriginal.length > options.tamanhoResumo) {
				var dataKey = 'textoOriginal';
				me$.data(dataKey, textoOriginal);
				var tagName = this.nodeName.toLowerCase();
				var textoResumido = textoOriginal.substr(0, options.tamanhoResumo);
				var htmlResumo = textoResumido + "... <a>" + options.textoLink + "</a></" + tagName + ">";
				me$.html(htmlResumo).find('a').one('click', function() {
					var texto$ = $(this).parent();
					texto$.text(texto$.data(dataKey)).removeData(dataKey);
				});
			}
		});
	};
	
	$.fn.autoTabNumerico = function() {
		return this.autotab_magic().autotab_filter('numeric');
	};
	
	$.fn.marcadagua = function (opts) {
		var options = $.extend({targetSelector: '.marcadagua_target', 
		onresize: function(marcadaguaEl, inputEl, marcadaguaParent) {
			var pos = marcadaguaParent.position();
			//marcadaguaEl.css('left', pos.left + "px");
			//marcadaguaEl.css('top', pos.top + "px");
		},
		onshow: function(marcadaguaEl, inputEl, marcadaguaParent) {
			
		}, 
		onhide: function(marcadaguaEl, inputEl, marcadaguaParent){
			
		}}, opts);
		return this.each(function() {
			var el = $(this);
			var myoptions = $.extend({
				
			}, options);
			var target = el.prev(options.targetSelector);
			var field = target.find('input,textarea').first();
			if (field != null) {
				if (field.length == 1) {
					var isAutocompleteDisabled = "off" == field.attr('autocomplete');
					field.data('isMarcadaguaShowing', false);
					var showOrHideMarcaDagua = function(type) {
						options.onresize(el, field, target);
						if (field.val() != '') {
							el.hide();
							field.data('isMarcadaguaShowing', false);
							options.onhide(el, field, target);
						} else {
							if (type == 'forceshow') {
								el.show();
							} else {
								el.fadeIn();
							}
							field.data('isMarcadaguaShowing', true);
							options.onshow(el, field, target);
						}
						options.onresize(el, field, target);
					};
					myoptions.showOrHideMarcaDagua = showOrHideMarcaDagua;
					el.data('marcadagua-options', myoptions);
					field.data('marcadagua-options', myoptions);
					field.bind('blur keyup focus', showOrHideMarcaDagua);
					showOrHideMarcaDagua('forceshow');
					el.click(function() {
						field.click();
						setTimeout(function() { 
							field.focus();
						}, 50);
					});
					el.dblclick(function() {
						field.dblclick();
						setTimeout(function() { 
							field.focus();
						}, 50);
					});
					el.mousedown(function() {
						field.mousedown();
						setTimeout(function() { 
							field.focus();
						}, 50);
					});
					field.bind('validationerror', function(context) {
						/*var me = $(this);
						el.hide();
						function upMe() {
							me.marcadaguaUpdate();
						}
						me.delay(100).queue(upMe).delay(100).queue(upMe).delay(200).queue(upMe).delay(1000).queue(upMe);
						*/
					});
					if (!isAutocompleteDisabled) {
						$.marcadaguaFields.push(field);
						if ($.marcadaguaFields.length == 1) {
							$.marcadaguaCheckDirty();
						}
					}
				} 
			}
		});
	};
	
	$.re = {
		email : new RegExp("^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$")
	};
	
	$.fn.center = function () {
        return this.each(function() { 
        	var w = $(window);
        	var me = $(this);
        	var top = Math.max((w.height() - me.outerHeight({margin:true})) / 2, 0) + w.scrollTop();
            var left = Math.max((w.width() - me.outerWidth({margin:true})) / 2, 0) + w.scrollLeft();
            $.log(me, top, left, w);
            me.css({position:'absolute', margin:0, top: top, left: left});
        });
    };
	
	$.fatalDiv = null;
	$.fatalErrorDisable = false;
	$.disableFatalError = function() {
		$.fatalErrorDisable = true;
	};
	
	$(window).bind('unload', $.disableFatalError);
	$(window).bind('beforeunload', $.disableFatalError);
	$(document).bind('unload', $.disableFatalError);
	$(document.body).bind('unload', $.disableFatalError);
	$(document.body).bind('unload', $.disableFatalError);
	
	if ("onpagehide" in window) {
		window.addEventListener("pagehide", $.disableFatalError, false);
	}
	 
	$.fatalError = function(opts, opts2) {
		if ($.fatalErrorDisable) {
			return;
		} 
		var options = {title: "Ocorreu um erro", message: "Por favor aguarde um momento e tente novamente."};
		if (opts && $.type(opts) == 'string') {
			options.message = opts;
			if (opts2 && $.type(opts2) == 'string') {
				options.title = opts2;
			}
		} else {
			options = $.extend(options, opts || {});
		}
		if ($.fatalDiv == null) {
			$.fatalDiv = $(document.body).append("<div class='fatalerror' style='display: none'><a title='Fechar Janela' class='ico_fechar' href='#'><span>Fechar Janela</span></a><h2 class='fatalerror-title'></h2><p class='fatalerror-text'></p></div>").find('.fatalerror');
		}
		$.fatalDiv.find('.fatalerror-title').html(options.title);
		$.fatalDiv.find('.fatalerror-text').html(options.message);
		$.fatalDiv.find('.ico_fechar').click(function() {
			$.mask.close();
			return false;
		});
		if ($.mask && $.mask.getExposed()) {
			$.mask.getExposed().clearQueue();
		}
		$.fatalDiv.expose({onLoad: function() {
			var me = this;
			$.fatalDiv.center().show().center();
		},onClose: function() {
			$.fatalDiv.hide();
		}});
	};

	window.j$cache = {};
	window.j$stats = {totalHits: 0, totalMiss: 0, savedTime: 0, usedTime: 0, hits: {}, miss:{}, times: {},
		addHit: function(key) {window.j$stats.hits[key]++; window.j$stats.savedTime = window.j$stats.savedTime + window.j$stats.times[key];}
		,addMiss: function(key) {window.j$stats.miss[key] = (window.j$stats.miss[key] || 0) + 1;}
	};
	window.j$disable = false;
	window.j$ = function() {
		if (window.j$disable) {
			if (arguments.length == 1 && typeof(arguments[0]) == 'string' && (arguments[0].indexOf(':') == -1 || arguments[0].indexOf('=') == -1)) {
				var s = new Date().getTime();
				var val = $.apply(this, arguments);
				var t = new Date().getTime() - s;
				window.j$stats.usedTime = window.j$stats.usedTime + t;
				return val;
			} else {
				return $.apply(this, arguments);
			}
		}
		if (arguments.length == 1 && typeof(arguments[0]) == 'string' && (arguments[0].indexOf(':') == -1 || arguments[0].indexOf('=') == -1)) {
			var key = arguments[0];
			var val = window.j$cache[key];
			if (!val) {
				var s = new Date().getTime();
				val = $(key);
				var t = new Date().getTime() - s;
				window.j$cache[key] = val;
				window.j$stats.times[key] = t;
				window.j$stats.hits[key] = 0;
				//$.log("Created cache for", key, {el: val}, "in", t, "ms");
			} else {
				//$.log("Has cache for", key, val);
				window.j$stats.addHit(key);
			}
			return val;
		} else {
			//$.log("Cant cache multiple arguments for", key, arguments);
			window.j$stats.addMiss(key);
			return $.apply(this, arguments);
		}
	};
	
	
	$.hideSWF = function() {
		$("object,embed").css('visibility', 'hidden');
	};
	
	$.smartiaTooltipDefaults = {
			// use div.tooltip as our tooltip
			//tip: '.tooltip',
			events: {
				def: 'click, close',
				tooltip: 'click, close'
			},
			// use the fade effect instead of the default
			effect: jQuery.browser && jQuery.browser.msie ? 'toggle' : 'fade', // IE Hack: ClearType with DXTransforms in IE7 ( http://blogs.msdn.com/b/ie/archive/2006/08/31/730887.aspx )
			// how long the tooltip remains visible after the mouse leaves the trigger.
			delay: 150,
			// make fadeOutSpeed similar to the browser's default
			fadeOutSpeed: 300,
			// the time before the tooltip is shown
			predelay: 200,
			relative: true,
			position: "center right"
			,onBeforeShow: function() {
				$.hideSWF();
			}
			,onShow: function() {
				if(jQuery.browser.msie) {
					// IE Hack: ClearType with DXTransforms in IE7 ( http://blogs.msdn.com/b/ie/archive/2006/08/31/730887.aspx )
					// Quando o atributo filter é utilizado no IE, e o windows estiver com o ClearType habilitado,
					// para este elemento o IE vai desabilitar o ClearType, causando uma impressão estranha se comparar
					// com o resto do site. Por esse motivo, removemos o filter ao final do 'fade'.
					this.getTip().get(0).style.removeAttribute('filter');
				}
				
			}
			,onHide: function() {
				$.hideSWF();
				
			}
		};
})(jQuery);


/**
  Plugin FixedHeader para fixar o header de uma tabela quando o usuário fizer scroll da página
**/
(function($) {

	var window$ = $(window);
	
	// Declaração como objeto apenas para evitar warnings no código
	var Plugin = {};
	
	// Plugin Constructor 
	Plugin = function FixedHeaderPlugin(el, data) {
		// Copia todas as opções como atributos da instância desse plugin
		this.data = data;
		
		// Possibilitar que através de configuração faça override dos métodos públicos do plugin
		$.extend(this, this.data.override);
		
		// Criar o elemento clone
		this.data.fixedElement = this.createFixedElement(el, this.data);
		
		el.trigger('fixed-header-created');
		
		// Static call - Salvar essa instância de plugin dentro do próprio elemento
		Plugin.save(el, this);
		
		// Observar essa instância de plugin
		Plugin.observe(el);
	};
	
	// Public members
	$.extend(Plugin.prototype, {
		// Função default para criação do elemento clone que vai ficar fixo na tela
		createFixedElement: function (el, data) {
			var cloned = el.clone().wrap('<div class=\'' + data.css + '\'></div>').parent().insertBefore(el);
			var height = data.height = el.find(data.headingSelector).outerHeight();
			cloned.height(height).width(el.outerWidth());
			return cloned;
		}
	});
	
	// Static members
	$.extend(Plugin, {
		// Registro de elementos cadastrados para monitoramento
		elements: []
	
		// Armazena ou obtém os dados do plugin dentro do próprio elemento
		, getOrSet: function (el, data) {
			var key = 'fixed-header-plugin';
			if (typeof data == 'undefined') {
				return el.data(key);					
			} else {
				el.data(key, data);
				return data;
			};
		}
		// Atalhos 
		, save: function(el, data) { return Plugin.getOrSet(el, data); }
		, load: function(el) { return Plugin.getOrSet(el); }
	
		//  Monitora o scroll da janela do navegador, e verifica quais os fixedheaders devem ser exibidos nesse momento.
		, onScroll: function() {
			var wtop = window$.scrollTop();
			$.each(Plugin.elements, function(i, el) {
				if (el.is(':visible')) {
					var data = Plugin.load(el).data;
					var elTop = el.offset().top;
					var elBottom = elTop + el.height() - data.height;
					var exibir = wtop - elTop >= 0 && wtop < elBottom;
					data.fixedElement.toggle(exibir);
					if (exibir) {
						el.trigger('fixed-header-scroll');
					}
				}
			});
		}
	
		// Adiciona um elemento para ser monitorado 
		, observe: function(el) {
			Plugin.elements.push(el);
			Plugin.monitor();
		}
		
		// Inicializa ou para o monitor de acordo se houver elemento 
		, monitor: function() {
			if (Plugin.elements.length > 0) {
				window$.bind('scroll', Plugin.onScroll);
			} else {
				window$.unbind('scroll', Plugin.onScroll);
			}
		}
	
	});
	
	$.fn.fixedHeader = function(options) {
		var global = $.extend({
			cssClass: ''
			, fixedHeaderCssClass: 'jsCssFixedHeaderPlugin'
			, headingSelector: 'thead'
		}, options);
		global.css = (global.cssClass || '') + ' ' + (global.fixedHeaderCssClass || '');
		
		return this.each(function() {
			new Plugin($(this), $.extend({}, global));
		});
	};
	
	
})(jQuery);
(function($) {
	$.fn.toggleState = function(enabledState, states) {
	    this.removeClass($(states).not([enabledState]).toArray().join(' '));
	    this.toggleClass(enabledState, true);
	    return this;
	};
	
	$.proxyAll = function(object, scope) {
	    scope = scope || object;
	    $.each(object, function(key, value) {
	        if ($.type(value) === 'function') {
	            object[key] = $.proxy(value, scope);
	        }
	    });
	};
})(jQuery);
(function($) {
	$.fn.openModal = function(options) {
		var me$ = this;
		var opt = $.extend(true, {
			loadSpeed : 'fast',
			closeOnClick : false,
			onBeforeLoad : function() {
				me$.center().show().center();
			},
			onShow : function() {
				me$.center();
			},
			onClose : function() {
				me$.hide(0, function() {
					me$.delay(200).queue(function() {
						me$.trigger('closed-modal');
					});
				});
			}
		}, options);
	    return this.expose(opt);
	};
	
	$.fn.closeModal = function() {
		$.mask.close();
	};
})(jQuery);
(function($) {
	$.fn.compileTemplate = function() {
		return this.each(function() {
			var el$ = $(this);
			
			// Obter os dados do template por val(), mas caso venha branco ou nulo, tente obter por text() para elementos TEXTAREA, ou por html() para qualquer outro elemento  
			var templateValue = el$.val();
			if (!templateValue || "" === $.trim(templateValue)) {
				if (el$.is("textarea")) {
					templateValue = el$.text();
				} else {
					templateValue = el$.html();
				}
			}
			
			// Obter o id do template para usar como nome do template...
			var id = el$.attr('id');
			if (!id || "" === $.trim(id)) {
				id = el$.attr('name');
			}
			
			// Compilar o template
			$.log("Compilando o template", id);
			try {
				$.template(id, templateValue);
			} catch(e) {}
		});
	};
})(jQuery);/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){

	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},

		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}

		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");

		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				 event.target.type === "text") ) {
				return;
			}

			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}

			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );/*

jQuery Tools 1.2.5 / Expose - Dim the lights

NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.

http://flowplayer.org/tools/toolbox/expose.html

Since: Mar 2010
Date:    Wed Sep 22 06:02:10 2010 +0000 
*/
(function(b){function k(){if(b.browser.msie){var a=b(document).height(),d=b(window).height();return[window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,a-d<20?d:a]}return[b(document).width(),b(document).height()]}function h(a){if(a)return a.call(b.mask)}b.tools=b.tools||{version:"1.2.5"};var l;l=b.tools.expose={conf:{maskId:"exposeMask",loadSpeed:"slow",closeSpeed:"fast",closeOnClick:true,closeOnEsc:true,zIndex:9998,opacity:0.8,startOpacity:0,color:"#fff",onLoad:null,
onClose:null}};var c,i,e,g,j;b.mask={load:function(a,d){if(e)return this;if(typeof a=="string")a={color:a};a=a||g;g=a=b.extend(b.extend({},l.conf),a);c=b("#"+a.maskId);if(!c.length){c=b("<div/>").attr("id",a.maskId);b("body").append(c)}var m=k();c.css({position:"absolute",top:0,left:0,width:m[0],height:m[1],display:"none",opacity:a.startOpacity,zIndex:a.zIndex});a.color&&c.css("backgroundColor",a.color);if(h(a.onBeforeLoad)===false)return this;a.closeOnEsc&&b(document).bind("keydown.mask",function(f){f.keyCode==
27&&b.mask.close(f)});a.closeOnClick&&c.bind("click.mask",function(f){b.mask.close(f)});b(window).bind("resize.mask",function(){b.mask.fit()});if(d&&d.length){j=d.eq(0).css("zIndex");b.each(d,function(){var f=b(this);/relative|absolute|fixed/i.test(f.css("position"))||f.css("position","relative")});i=d.css({zIndex:Math.max(a.zIndex+1,j=="auto"?0:j)})}c.css({display:"block"}).fadeTo(a.loadSpeed,a.opacity,function(){b.mask.fit();h(a.onLoad);e="full"});e=true;return this},close:function(){if(e){if(h(g.onBeforeClose)===
false)return this;c.fadeOut(g.closeSpeed,function(){h(g.onClose);i&&i.css({zIndex:j});e=false});b(document).unbind("keydown.mask");c.unbind("click.mask");b(window).unbind("resize.mask")}return this},fit:function(){if(e){var a=k();c.css({width:a[0],height:a[1]})}},getMask:function(){return c},isLoaded:function(a){return a?e=="full":e},getConf:function(){return g},getExposed:function(){return i}};b.fn.mask=function(a){b.mask.load(a);return this};b.fn.expose=function(a){b.mask.load(a,this);return this}})(jQuery);
/*
 
 jQuery Tools 1.2.5 Tooltip - UI essentials

 NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.

 http://flowplayer.org/tools/tooltip/

 Alterado por 'Gabriel Moreira'
 
					// autogenerated tooltip
					} else if (title) { 
						tip = $(conf.layout).addClass(conf.tipClass).appendTo(document.body)
							.hide().append(title);
							
(ADICIONADO ESSA LINHA) fire.trigger('tipCreated', [self, tip]);

						...
*/
(function($){$.tools=$.tools||{version:'1.2.5'};$.tools.tooltip={conf:{effect:'toggle',fadeOutSpeed:"fast",predelay:0,delay:30,opacity:1,tip:0,position:['top','center'],offset:[0,0],relative:false,cancelDefault:true,events:{def:"mouseenter,mouseleave",input:"focus,blur",widget:"focus mouseenter,blur mouseleave",tooltip:"mouseenter,mouseleave"},layout:'<div/>',tipClass:'tooltip'},addEffect:function(a,b,c){g[a]=[b,c]}};var g={toggle:[function(a){var b=this.getConf(),tip=this.getTip(),o=b.opacity;if(o<1){tip.css({opacity:o})}tip.show();a.call()},function(a){this.getTip().hide();a.call()}],fade:[function(a){var b=this.getConf();this.getTip().fadeTo(b.fadeInSpeed,b.opacity,a)},function(a){this.getTip().fadeOut(this.getConf().fadeOutSpeed,a)}]};function getPosition(a,b,c){var d=c.relative?a.position().top:a.offset().top,left=c.relative?a.position().left:a.offset().left,pos=c.position[0];d-=b.outerHeight()-c.offset[0];left+=a.outerWidth()+c.offset[1];if(/iPad/i.test(navigator.userAgent)){d-=$(window).scrollTop()}var e=b.outerHeight()+a.outerHeight();if(pos=='center'){d+=e/2}if(pos=='bottom'){d+=e}pos=c.position[1];var f=b.outerWidth()+a.outerWidth();if(pos=='center'){left-=f/2}if(pos=='left'){left-=f}return{top:d,left:left}}function Tooltip(c,d){var f=this,fire=c.add(f),tip,timer=0,pretimer=0,title=c.attr("title"),tipAttr=c.attr("data-tooltip"),effect=g[d.effect],shown,isInput=c.is(":input"),isWidget=isInput&&c.is(":checkbox, :radio, select, :button, :submit"),type=c.attr("type"),evt=d.events[type]||d.events[isInput?(isWidget?'widget':'input'):'def'];if(!effect){throw"Nonexistent effect \""+d.effect+"\"";}evt=evt.split(/,\s*/);if(evt.length!=2){throw"Tooltip: bad events configuration for "+type;}c.bind(evt[0],function(e){clearTimeout(timer);if(d.predelay){pretimer=setTimeout(function(){f.show(e)},d.predelay)}else{f.show(e)}}).bind(evt[1],function(e){clearTimeout(pretimer);if(d.delay){timer=setTimeout(function(){f.hide(e)},d.delay)}else{f.hide(e)}});if(title&&d.cancelDefault){c.removeAttr("title");c.data("title",title)}$.extend(f,{show:function(e){if(!tip){if(tipAttr){tip=$(tipAttr)}else if(d.tip){tip=$(d.tip).eq(0)}else if(title){tip=$(d.layout).addClass(d.tipClass).appendTo(document.body).hide().append(title);fire.trigger('tipCreated',[f,tip])}else{tip=c.next();if(!tip.length){tip=c.parent().next()}}if(!tip.length){throw"Cannot find tooltip for "+c;}}if(f.isShown()){return f}tip.stop(true,true);var a=getPosition(c,tip,d);if(d.tip){tip.html(c.data("title"))}e=e||$.Event();e.type="onBeforeShow";fire.trigger(e,[a]);if(e.isDefaultPrevented()){return f}a=getPosition(c,tip,d);tip.css({position:'absolute',top:a.top,left:a.left});shown=true;effect[0].call(f,function(){e.type="onShow";shown='full';fire.trigger(e)});var b=d.events.tooltip.split(/,\s*/);if(!tip.data("__set")){tip.bind(b[0],function(){clearTimeout(timer);clearTimeout(pretimer)});if(b[1]&&!c.is("input:not(:checkbox, :radio), textarea")){tip.bind(b[1],function(e){if(e.relatedTarget!=c[0]){c.trigger(evt[1].split(" ")[0])}})}tip.data("__set",true)}return f},hide:function(e){if(!tip||!f.isShown()){return f}e=e||$.Event();e.type="onBeforeHide";fire.trigger(e);if(e.isDefaultPrevented()){return}shown=false;g[d.effect][1].call(f,function(){e.type="onHide";fire.trigger(e)});return f},isShown:function(a){return a?shown=='full':shown},getConf:function(){return d},getTip:function(){return tip},getTrigger:function(){return c}});$.each("onHide,onBeforeShow,onShow,onBeforeHide".split(","),function(i,b){if($.isFunction(d[b])){$(f).bind(b,d[b])}f[b]=function(a){if(a){$(f).bind(b,a)}return f}})}$.fn.tooltip=function(a){var b=this.data("tooltip");if(b){return b}a=$.extend(true,{},$.tools.tooltip.conf,a);if(typeof a.position=='string'){a.position=a.position.split(/,?\s/)}this.each(function(){b=new Tooltip($(this),a);$(this).data("tooltip",b)});return a.api?b:this}})(jQuery);/*
 
 jQuery Tools 1.2.5 / Tooltip Dynamic Positioning

 NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.

 http://flowplayer.org/tools/tooltip/dynamic.html

 Since: July 2009
 Date:    Wed Sep 22 06:02:10 2010 +0000 
*/
(function(g){function j(a){var c=g(window),d=c.width()+c.scrollLeft(),h=c.height()+c.scrollTop();return[a.offset().top<=c.scrollTop(),d<=a.offset().left+a.width(),h<=a.offset().top+a.height(),c.scrollLeft()>=a.offset().left]}function k(a){for(var c=a.length;c--;)if(a[c])return false;return true}var i=g.tools.tooltip;i.dynamic={conf:{classNames:"top right bottom left"}};g.fn.dynamic=function(a){if(typeof a=="number")a={speed:a};a=g.extend({},i.dynamic.conf,a);var c=a.classNames.split(/\s/),d;this.each(function(){var h=
g(this).tooltip().onBeforeShow(function(e,f){e=this.getTip();var b=this.getConf();d||(d=[b.position[0],b.position[1],b.offset[0],b.offset[1],g.extend({},b)]);g.extend(b,d[4]);b.position=[d[0],d[1]];b.offset=[d[2],d[3]];e.css({visibility:"hidden",position:"absolute",top:f.top,left:f.left}).show();f=j(e);if(!k(f)){if(f[2]){g.extend(b,a.top);b.position[0]="top";e.addClass(c[0])}if(f[3]){g.extend(b,a.right);b.position[1]="right";e.addClass(c[1])}if(f[0]){g.extend(b,a.bottom);b.position[0]="bottom";e.addClass(c[2])}if(f[1]){g.extend(b,
a.left);b.position[1]="left";e.addClass(c[3])}if(f[0]||f[2])b.offset[0]*=-1;if(f[1]||f[3])b.offset[1]*=-1}e.css({visibility:"visible"}).hide()});h.onBeforeShow(function(){var e=this.getConf();this.getTip();setTimeout(function(){e.position=[d[0],d[1]];e.offset=[d[2],d[3]]},0)});h.onHide(function(){var e=this.getTip();e.removeClass(a.classNames)});ret=h});return a.api?ret:this}})(jQuery);
$(document).ready(function(){
		
	
	
	// Link Atendimento
	$('a.jsMsgCliente').click(function(){
		$('body').scrollTop(0);
		mostrarModal('#msgCliente');
	});	
	
	$('a.jsMsgClienteFechar').click(function(){
		fecharModal();
	});
		
	// Link Atendimento
	$('a.jsAtendimento').click(function(){
		mostrarModal('#atendimento');
	});	
	$('a.jsAtendimentoFechar').click(function(){
		fecharModal();
	});
	
	// Link Compre pelo telefone
	$('a.jsComprePeloTelefone').click(function(){
		mostrarModal('#comprePeloTelefone');
	});	
	$('a.jsComprePeloTelefoneFechar').click(function(){
		fecharModal();
	});
	
	// Link login/cadastro
	$('a.jsLoginCadastro').click(function(){
		mostrarModal('#loginCadastro');
	});	
	$('a.jsLoginCadastroFechar').click(function(){
		fecharModal();
	});
	
	$('#bg_Modal').click(function(){
		fecharModal();
	});
	$(document).bind('keyup', 'esc', function(){
		fecharModal();
	});
	
	var mostrarModal = function(idModal) {
		$('body').addClass('stateBgModal');
		$(idModal).center().show();		
	};
	
	var fecharModal = function() {
		$('body').removeClass('stateBgModal');
		$('#atendimento').hide();
		$('#comprePeloTelefone').hide();		
		$('#loginCadastro').hide();
		$('#msgCliente').hide();
	};
});	
/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
		} catch(e) {
			return;
		}

		try {
			// If we can't parse the cookie, ignore it, it's unusable.
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));
