/*
 * Jiashuai
 * 2015/01/05
 */

/*将URL中的查询字符串转为参数对象*/
function getQueryStringArgs(searchStr){
	searchStr = searchStr || location.search;
	var qs = (searchStr.length > 0 ? searchStr.substring(1) : ""),
		args = {},
		items = qs.length ? qs.split("&") : [],
		item = null,
		name = null,
		value = null,
		i = 0,
		len = items.length;
	for (i=0; i < len; i++){
		item = items[i].split("=");
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);
		if (name.length) {
			args[name] = value;
		}
	}
	return args;
};

/*URL操作方法-获取单个参数*/
function getParam(name, url) {
    if(typeof name !== 'string') return false;
    if (!url) url = window.location.href;
    // 当遇到name[xx]时，对方括号做一下转义为 name\[xxx\]，因为下面还需要使用name做正则
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/*URL操作方法-设置单个参数*/
function setParam(name, val, url) {
    if(typeof name !== 'string') return false;
    if (!url) url = window.location.href;
    var _name = name.replace(/[\[\]]/g, '\\$&');
    var value = name + '=' + encodeURIComponent(val);
    var regex = new RegExp(_name + '=[^&]*');
    var urlArr = url.split('#');
    var result = '';

    if(regex.exec(url)){
        result =  url.replace(regex, value);
    }else{
        result = urlArr[0]+'&'+value+ (urlArr[1] || '');
    }

    return result
};

/*URL操作方法-移除单个参数*/
function removeParam(name, url) {
    if(typeof name !== 'string') return false;
    if (!url) url = window.location.href;
    var urlparts = url.split('?');
    var prefix = encodeURIComponent(name + '=');
    var pars = urlparts[1].split(/[&;]/g);
    var i = 0, len = pars.length;

    for (; i < len; i++) {
        if (encodeURIComponent(pars[i]).lastIndexOf(prefix, 0) !== -1) {
            pars.splice(i, 1);
        }
    }

    url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');

    return url;
}

/**
 * URL操作方法-获取多个参数
 * @param  {String} names [多个用空格分割]
 * @param  {String} url   [default:location.href] 
 * @return {[String|Boolean]}       
 */
function getParams(names, url) {
    if(typeof name !== 'string') return false;
    var names = names.split(' ');
    var result = {};
    var i = 0,
        len = names.length;
    if (names.length === 0) return false;
    for (; i < len; i++) {
        result[names[i]] = getParam(names[i], url);
    }
    return result;
}

/**
 * URL操作方法-设置多个参数
 * @param {Object} obj 
 * @param  {String} url   [default:location.href] 
 * @return {[String|Boolean]}       
 */
function setParams(obj, url) {
    var result = url || '';
    if (Object.prototype.toString.call(obj) !== '[object Object]') return false;
    for (var name in obj) {
        result = setParam(name, obj[name], result);
    }
    return result;
}

/**
 * [removeParams 移除多个参数]
 * @param  {String} names [多个用空格分割]
 * @param  {String} url   [default:location.href] 
 * @return {[String|Boolean]}       
 */
function removeParams(names, url) {
    var result = url || '';
    var names = names.split(' ');
    var i = 0,
        len = names.length;
    if (names.length === 0) return false;

    for (; i < len; i++) {
        result = removeParam(names[i], result);
    }
    return result;
}

/*根据ID查找页面元素*/
function getElement(id){
	if (document.getElementById){
		return document.getElementById(id);
	} else if (document.all){
		return document.all[id];
	} else {
		throw new Error("No way to retrieve element!");
	}
};

/*在浏览器环境下测试任何对象的某个特性是否存在*/
function isHostMethod(object, property) {
	var t = typeof object[property];
	return t=='function' || 
		(!!(t=='object' && object[property])) ||
		t=='unknown';
};

/*用户代理字符串检测脚本,包括检测呈现引擎、平台、Windows操作系统、移动设备和游戏系统*/
function getUserAgentChk(){
	//呈现引擎
	var engine = {
		ie: 0,
		gecko: 0,
		webkit: 0,
		khtml: 0,
		opera: 0,
		//完整的版本号
		ver: null
	};
	//浏览器
	var browser = {
		//主要浏览器
		ie: 0,
		firefox: 0,
		safari: 0,
		konq: 0,
		opera: 0,
		chrome: 0,
		//具体的版本号
		ver: null
	};
	//平台、设备和操作系统
	var system = {
		win: false,
		mac: false,
		x11: false,
		//移动设备
		iphone: false,
		ipod: false,
		ipad: false,
		ios: false,
		android: false,
		nokiaN: false,
		winMobile: false,
		//游戏系统
		wii: false,
		ps: false
	};
	//检测呈现引擎和浏览器
	var ua = navigator.userAgent;
	if (window.opera){
		engine.ver = browser.ver = window.opera.version();
		engine.opera = browser.opera = parseFloat(engine.ver);
	} else if (/AppleWebKit\/(\S+)/.test(ua)){
		engine.ver = RegExp["$1"];
		engine.webkit = parseFloat(engine.ver);
		//确定是 Chrome 还是 Safari
		if (/Chrome\/(\S+)/.test(ua)){
			browser.ver = RegExp["$1"];
			browser.chrome = parseFloat(browser.ver);
		} else if (/Version\/(\S+)/.test(ua)){
			browser.ver = RegExp["$1"];
			browser.safari = parseFloat(browser.ver);
		} else {
			//近似地确定版本号
			var safariVersion = 1;
			if (engine.webkit < 100){
				safariVersion = 1;
			} else if (engine.webkit < 312){
				safariVersion = 1.2;
			} else if (engine.webkit < 412){
				safariVersion = 1.3;
			} else {
				safariVersion = 2;
			}
			browser.safari = browser.ver = safariVersion;
		}
	} else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
		engine.ver = browser.ver = RegExp["$1"];
		engine.khtml = browser.konq = parseFloat(engine.ver);
	} else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
		engine.ver = RegExp["$1"];
		engine.gecko = parseFloat(engine.ver);
		//确定是不是 Firefox
		if (/Firefox\/(\S+)/.test(ua)){
			browser.ver = RegExp["$1"];
			browser.firefox = parseFloat(browser.ver);
		}
	} else if (/MSIE ([^;]+)/.test(ua)){
		engine.ver = browser.ver = RegExp["$1"];
		engine.ie = browser.ie = parseFloat(engine.ver);
	}
	//检测浏览器
	browser.ie = engine.ie;
	browser.opera = engine.opera;
	//检测平台
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	//检测 Windows 操作系统
	if (system.win){
		if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
			if (RegExp["$1"] == "NT"){
				switch(RegExp["$2"]){
					case "5.0":
						system.win = "2000";
						break;
					case "5.1":
						system.win = "XP";
						break;
					case "6.0":
						system.win = "Vista";
						break;
					case "6.1":
						system.win = "7";
						break;
					default:
						system.win = "NT";
						break;
				}
			} else if (RegExp["$1"] == "9x"){
				system.win = "ME";
			} else {
				system.win = RegExp["$1"];
			}
		}
	}
	//移动设备
	system.iphone = ua.indexOf("iPhone") > -1;
	system.ipod = ua.indexOf("iPod") > -1;
	system.ipad = ua.indexOf("iPad") > -1;
	system.nokiaN = ua.indexOf("NokiaN") > -1;
	//windows mobile
	if (system.win == "CE"){
		system.winMobile = system.win;
	} else if (system.win == "Ph"){
		if(/Windows Phone OS (\d+.\d+)/.test(ua)){
			system.win = "Phone";
			system.winMobile = parseFloat(RegExp["$1"]);
		}
	}
	//检测 iOS 版本
	if (system.mac && ua.indexOf("Mobile") > -1){
		if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
			system.ios = parseFloat(RegExp.$1.replace("_", "."));
		} else {
			system.ios = 2; //不能真正检测出来，所以只能猜测
		}
	}
	//检测 Android 版本
	if (/Android (\d+\.\d+)/.test(ua)){
		system.android = parseFloat(RegExp.$1);
	}
	//游戏系统
	system.wii = ua.indexOf("Wii") > -1;
	system.ps = /playstation/i.test(ua);
	//返回这些对象
	return {
		engine: engine,
		browser: browser,
		system: system
	};
};

/*迭代元素的每一个特性*/
function outputAttributes(element){
	var pairs = new Array(),
		attrName,
		attrValue,
		i,
		len;
	for (i=0, len=element.attributes.length; i < len; i++){
		attrName = element.attributes[i].nodeName;// nodeName可以替换为name
		attrValue = element.attributes[i].nodeValue;// nodeValue可以替换为value
		if (element.attributes[i].specified) {// 返回指定的特性
			pairs.push(attrName + "=\"" + attrValue + "\"");
		}
	}
	return pairs.join(" ");
};

/*判断元素与选择符是否匹配(兼容浏览器)*/
function matchesSelector(element, selector){
	if (element.matchesSelector){
		return element.matchesSelector(selector);
	} else if (element.msMatchesSelector){
		return element.msMatchesSelector(selector);
	} else if (element.mozMatchesSelector){
		return element.mozMatchesSelector(selector);
	} else if (element.webkitMatchesSelector){
		return element.webkitMatchesSelector(selector);
	} else {
		throw new Error("Not supported.");
	}
}

/*判断某节点是不是另一个节点的后代,是否是包含关系*/
function contains(refNode, otherNode){
	if (typeof refNode.contains == "function" && (!client.engine.webkit || client.engine.webkit >= 522)){
		return refNode.contains(otherNode);
	} else if (typeof refNode.compareDocumentPosition == "function"){
		return !!(refNode.compareDocumentPosition(otherNode) & 16);
	} else {
		var node = otherNode.parentNode;
		do {
			if (node === refNode){
				return true;
			} else {
				node = node.parentNode;
			}
		} while (node !== null);
		return false;
	}
}

/*取得元素的左偏移量*/
function getElementLeft(element){
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while (current !== null){
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}

/*取得元素的上偏移量*/
function getElementTop(element){
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while (current !== null){
		actualTop += current. offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}

/*元素在页面中相对于视口的位置*/
function getBoundingClientRect(element){
	var scrollTop = document.documentElement.scrollTop;
	var scrollLeft = document.documentElement.scrollLeft;
	if (element.getBoundingClientRect){
		if (typeof arguments.callee.offset != "number"){
			var temp = document.createElement("div");
			temp.style.cssText = "position:absolute;left:0;top:0;";
			document.body.appendChild(temp);
			arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
			document.body.removeChild(temp);
			temp = null;
		}
		var rect = element.getBoundingClientRect();
		var offset = arguments.callee.offset;
		return {
			left: rect.left + offset,
			right: rect.right + offset,
			top: rect.top + offset,
			bottom: rect.bottom + offset
		};
	} else {
		var actualLeft = getElementLeft(element);
		var actualTop = getElementTop(element);
		return {
			left: actualLeft - scrollLeft,
			right: actualLeft + element.offsetWidth - scrollLeft,
			top: actualTop - scrollTop,
			bottom: actualTop + element.offsetHeight - scrollTop
		}
	}
}

/*页面元素迭代遍历-NodeIterator方法*/
function nodeIterator(element){
	// 此遍历的是元素节点,若要遍历所有节点第二个参数指定NodeFilter.SHOW_ALL
	// 第三个参数是过滤器,可以筛选和屏蔽节点
	var iterator = document.createNodeIterator(element, NodeFilter.SHOW_ELEMENT, null, false);
	var node = iterator.nextNode();
	while (node !== null) {
		alert(node.tagName); //输出标签名
		node = iterator.nextNode();
	}
}

/*跨浏览器添加元素事件*/
function addHandler(element, type, handler){
	if (element.addEventListener){ // DOM2级方法
		element.addEventListener(type, handler, false);
	} else if (element.attachEvent){ // IE
		element.attachEvent("on" + type, handler);
	} else { // DOM0级方法
		element["on" + type] = handler;
	}
}

/*跨浏览器删除元素事件*/
function removeHandler(element, type, handler){
	if (element.removeEventListener){ // DOM2级方法
		element.removeEventListener(type, handler, false);
	} else if (element.detachEvent){ // IE
		element.detachEvent("on" + type, handler);
	} else { // DOM0级方法
		element["on" + type] = null;
	}
}

/*跨浏览器获取事件对象*/
function getEvent(event){
	return event ? event : window.event;
}

/*跨浏览器获取事件目标*/
function getTarget(event){
	return event.target || event.srcElement;
}

/*跨浏览器取消事件的默认行为*/
function preventDefault(event){
	if (event.preventDefault){
		event.preventDefault();
	} else {
		event.returnValue = false;
	}
}

/*跨浏览器停止冒泡事件,阻止事件流*/
stopPropagation: function(event){
	if (event.stopPropagation){
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}
}

/*跨浏览器取得相关元素*/
function getRelatedTarget(event){
	if (event.relatedTarget){
		return event.relatedTarget;
	} else if (event.toElement){
		return event.toElement;
	} else if (event.fromElement){
		return event.fromElement;
	} else {
		return null;
	}
}

/*判断质数(负数、0、1都不是质数)*/
function isPrime(number) {
	// isTnteger()用来判断参数是不是整数
	if (typeof number !== 'number' || !Number.isInteger(number) || number < 2) {
		return false;
	}
	if (number === 2) {
		return true;
	} else if (number % 2 === 0) {
		return false;
	}
	// Math.sqrt()返回数字的平方根
	var squareRoot = Math.sqrt(number);
	for(var i = 3; i <= squareRoot; i += 2) {
		if (number % i === 0) {
			return false;
		}
	}
	return true;
}

/*判断是否来自微信浏览器*/
function isFromWeiXin() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	}
	return false;
}

/*判断手机类型*/
function phoneType() {
	var ua = navigator.userAgent;
	if (/android/i.test(ua)){
		return "android";
	}
	if (/ipad|iphone|mac/i.test(ua)){
		return "ios";
	}
}

/*获取鼠标在文档中的位置(包含滚动条)*/
function getMousePosition(ev){
	var oEvent = ev || window.event;
	var x = oEvent.pageX || oEvent.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y = oEvent.pageY || oEvent.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
	return {'x':x, 'y':y};
}

/*生成随机的字母数字字符串*/
function getRandomAlphaNum(len) {
    var rdmString = "";
    for( ; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
    return  rdmString.substr(0, len);
}

/*动态加载js文件*/
function loadJS(path){
	if(!path || path.length === 0){
		throw new Error('argument "path" is required !');
	}
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = path;
	script.type = 'text/javascript';
	head.appendChild(script);
}

/*动态加载js、css文件*/
function loadCSS(path){
	if(!path || path.length === 0){
		throw new Error('argument "path" is required !');
	}
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.href = path;
	link.rel = 'stylesheet';
	link.type = 'text/css';
	head.appendChild(link);
}

/*解析URL字符串*/
function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function() {
      var ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s;
      for(; i < len; i++) {
        if(!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
}

/*根据身份证号获得出生日期*/
function getBirthday(psidno){
    var birthdayno,birthdaytemp
    if(psidno.length==18){
        birthdayno=psidno.substring(6,14)
    }else if(psidno.length==15){
        birthdaytemp=psidno.substring(6,12)
        birthdayno="19"+birthdaytemp
    }else{
        alert("错误的身份证号码，请核对！")
        return false
    }
    var birthday=birthdayno.substring(0,4)+"-"+birthdayno.substring(4,6)+"-"+birthdayno.substring(6,8)
    return birthday    
}

/*根据身份证号获得性别*/
function getSex(psidno){
    var sexno,sex
    if(psidno.length==18){
        sexno=psidno.substring(16,17)
    }else if(psidno.length==15){
        sexno=psidno.substring(14,15)
    }else{
        alert("错误的身份证号码，请核对！")
        return false
    }
    var tempid=sexno%2;
    if(tempid==0){
        sex='F'
    }else{
        sex='M'
    }
    return sex
}

/*打乱数组的顺序*/
function arrayRandom(array) {
	return array && array.sort(function(){ return Math.random() - 0.5});
}

/*字符串去首尾空格*/
String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, "");};

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例：(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * 例：(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function(fmt) {
	var o = {                                                              
	  "M+" : this.getMonth()+1,                 //月份                                                             
	  "d+" : this.getDate(),                    //日                                                              
	  "h+" : this.getHours(),                   //小时                                                             
	  "m+" : this.getMinutes(),                 //分                                                              
	  "s+" : this.getSeconds(),                 //秒                                                              
	  "q+" : Math.floor((this.getMonth()+3)/3), //季度                                                             
	  "S"  : this.getMilliseconds()             //毫秒                                                             
	};                                                             
	if(/(y+)/.test(fmt))                                                             
	  fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));                                                              
	for(var k in o)                                                              
	  if(new RegExp("("+ k +")").test(fmt))                                                              
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));                                                             
	return fmt;                                                              
}

/*秒转换成时分秒*/
function formatDuring(mss) {
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (mss % (1000 * 60)) / 1000;
    return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
}

/*金钱格式化*/
function formatCash(cash) {
	return cash && cash.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/*数组去重复*/
function trimRepeat(ary) {
	// return [...new Set([1, "1", 2, 1, 1, 3])]; // [1, "1", 2, 3]
	return [...new Set(ary)];
}

/*过滤emoji表情*/
function formatEmoji(str) {
	const emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/ig;
    return str.replace(emojiRegex, '');
}

/*过滤html元素*/
function formatDom(str) {
	return str.replace(/<[^>]+>/g, '');
}

/**
 * 处理过长的字符串，截取并添加省略号 
 * 注：半角长度为1，全角长度为2 
 * pStr:字符串
 * pLen:截取字节长度 
 * return: 截取后的字符串
 */  
function autoAddEllipsis(pStr, pLen) {  
    var _ret = cutString(pStr, pLen);
    var _cutFlag = _ret.cutflag;  
    var _cutStringn = _ret.cutstring;  
  
    if ('1' == _cutFlag) {  
        return _cutStringn + '...';  
    } else {  
        return _cutStringn;  
    }  
}  
  
/**
 * 取得指定长度的字符串 
 * 注：半角长度为1，全角长度为2 
 * pStr:字符串
 * pLen:截取长度 
 * return: 截取后的字符串
 */  
function cutString(pStr, pLen) {  
  
    // 原字符串长度  
    var _strLen = pStr.length;  
  
    var _tmpCode;  
  
    var _cutString;  
  
    // 默认情况下，返回的字符串是原字符串的一部分  
    var _cutFlag = '1';  
  
    var _lenCount = 0;  
  
    var _ret = false;  
  
    if (_strLen <= pLen/2) {  
        _cutString = pStr;  
        _ret = true;  
    }  
  
    if (!_ret) {  
        for (var i = 0; i < _strLen ; i++ ) {  
            if (isFull(pStr.charAt(i))) {  
                _lenCount += 2;  
            } else {  
                _lenCount += 1;  
            }  
  
            if (_lenCount > pLen) {  
                _cutString = pStr.substring(0, i);  
                _ret = true;  
                break;  
            } else if (_lenCount == pLen) {  
                _cutString = pStr.substring(0, i + 1);  
                _ret = true;  
                break;  
            }  
        }  
    }  
      
    if (!_ret) {  
        _cutString = pStr;  
        _ret = true;  
    }  
  
    if (_cutString.length == _strLen) {  
        _cutFlag = '0';  
    }  
  
    return {'cutstring':_cutString, 'cutflag':_cutFlag};  
}  
  
/**
 * 判断是否为全角 
 * pChar:长度为1的字符串
 * return: true:全角 
 *          false:半角 
 */  
function isFull (pChar) {
	return pChar.charCodeAt(0) > 128;
}

/*获取选中的文本*/
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

/**
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
function DateAdd(interval, number, date) {
	switch (interval) {
    case "y ": {
			date.setFullYear(date.getFullYear() + number);
			return date;
			break;
    }
    case "q ": {
			date.setMonth(date.getMonth() + number * 3);
			return date;
			break;
    }
    case "m ": {
			date.setMonth(date.getMonth() + number);
			return date;
			break;
    }
    case "w ": {
			date.setDate(date.getDate() + number * 7);
			return date;
			break;
    }
    case "d ": {
			date.setDate(date.getDate() + number);
			return date;
			break;
    }
    case "h ": {
			date.setHours(date.getHours() + number);
			return date;
			break;
    }
    case "m ": {
			date.setMinutes(date.getMinutes() + number);
			return date;
			break;
    }
    case "s ": {
			date.setSeconds(date.getSeconds() + number);
			return date;
			break;
    }
    default: {
			date.setDate(d.getDate() + number);
			return date;
			break;
    }
	}
}