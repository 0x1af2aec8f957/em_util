/*!
 * em-util.js v1.0.1
 * 2017 Ed Me(603803799@qq.com)
 * Released under the MIT License.
 */

//import 'babel-polyfill' //使用了ES6语法需要扩展IE的本地对象/内置对象/宿主对象[尽可能减少操作本地对象的原型链]

/* (function (global, factory) {
 typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
 typeof define === 'function' && define.amd ? define(factory) : (global.util = factory());
 })(this, function () { */

const [UA, elFn, strFn, objFn, arrFn, numFn] = [!!window && window.navigator.userAgent.toLowerCase(),
  { // elFn
    escape() { // 需要借助he模块
      return require('he').encode(String(this), {useNamedReferences: false}); // https://mths.be/he v1.1.1
    }
  }, { // strFn
    replaceAll(search, replacement) { // 全局替换
      return this.replace(new RegExp(search, 'g'), replacement);
    },
    toNumber() { // 提取数字(不支持负数)
      return this.replace(/[^0-9]/ig, "") * true
    },
    trimAll() { // 去掉所有空格
      return this.replace(/\s/g, "")
    },
    isNull() { // 是否为空[已经去掉空格后的判断]
      return !this.replace(/\s/g, "").length
    },
    getTime() { // 时间转时间戳[单位:s]
      // this = '2014-04-23 18:55:49:123';
      return Date.parse(new Date(this));
    },
    includes() { // 字符串包含[解决babel未转码成功的BUG]
      return !!~this.indexOf(e)
    },
    toObject() { // 解析JSON字符串
      return JSON.parse(this)
    },
    toArry(separator = "", length) { // 分割成数组
      return this.split(separator, length)
    }
  }, { // objFn
    delete(key) { // 返回被删除的元素，是一个value！
      const data = this[key];
      return delete this[key], data;
    },
    keys() {
      return Object.keys(this)
    },
    values() {
      return Object.values(this)
    },
    entries() {
      return Object.entries(this)
    },
    repeat() { //复制对象
      return {...this, ...this}
    },
    toJSON() { // 转成JSON字符串
      return JSON.stringify(this)
    },
    /*!
     * 对于同一个对象，防止扩展-->密封-->冻结这种操作是不可逆的。一旦该对象被冻结，是无法恢复到防止扩展或密封状态的。一旦该对象被密封，是无法恢复到防止扩展状态的。一旦对象被锁定，它将无法解锁!
     !*/
    isExtensible() { // 检测对象是否可扩展
      return Object.isExtensible(this)
    },
    preventExtensions() { // 防止扩展[禁止为对象添加属性和方法。但已存在的属性和方法可以被修改或删除]
      return Object.preventExtensions(this)
    },
    isSealed() { // 检测对象是否密封
      return Object.isSealed(this)
    },
    seal() { // 密封[禁止为对象删除已存在的属性和方法。被密封的对象也是不可扩展的]
      return Object.seal(this)
    },
    isFrozen() { // 检测对象是否冻结
      return Object.isFrozen(this)
    },
    freeze() { // 冻结[禁止为对象修改已存在的属性和方法。所有字段均只读。被冻结的对象也是不可扩展和密封的]
      return Object.freeze(this)
    }
  }, { // arrFn
    delete(index, number = 1) { // 返回被删除的元素，是一个数组！
      return this.splice(index, number)
    },
    isNull() { // 是否为空
      return !this.length
    },
    clear() { // 清空数组
      return this.length = false
    },
    forEach(fn) {
      for (let [i, x] of this.entries()) fn(x, i, this);
      return null;
    },
    includes() {
      return !!~this.indexOf(e)
    },
    noRepeat() { // 数组去重
      return [...new Set(this)]
    },
    repeat() { //复制数组
      return [...this, ...this]
    },
    map(fn) {
      const result = [];
      for (let [i, x] of this.entries()) result.push(fn.call(x, i, this));
      return result;
    },
    filter(fn) {
      const ret = [];
      for (let [i, x] of this.entries()) fn(x, i, this) && ret.push(x);
      return ret;
    },
    some(fn) {
      for (let x of this) if (fn(x)) return true;
      return false;
    },
    find(fn) { // 查找数组的值，返回查找到的第一个或者false
      for (let x of this) if (fn(x)) return this;
      return false
    },
    toString(join = '') { // 链接成字符串
      return this.join(join)
    }
  }, { // numFn
    isNull() {
      return !this.toString().length
    },
    getTime(type = "：") { // 时间戳转时间[单位:s]
      const date = new Date(this);
      return type ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours() + type + date.getMinutes() + type + date.getSeconds()}` :
        `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    },
    isOdd() { // 是否是奇数
      return !!(this & true)
    },
    toRounding() { // 取整
      return this | false
    },
    toHalf() { // 取半
      return this >> true
    }
  }];

if (this.HTMLElement) for (let [key, value] of Object.entries(elFn)) HTMLElement.prototype[key] || (HTMLElement.prototype[key] = value);
if (this.String) for (let [key, value] of Object.entries(strFn)) String.prototype[key] || (String.prototype[key] = value);
if (this.Object) for (let [key, value] of Object.entries(objFn)) Object.prototype[key] || (Object.prototype[key] = value);
if (this.Array) for (let [key, value] of Object.entries(arrFn)) Array.prototype[key] || (Array.prototype[key] = value);
if (this.Number) for (let [key, value] of Object.entries(numFn)) Number.prototype[key] || (Number.prototype[key] = value);

export default Object.assign({
  _timeStamp() { // 获取当前时间戳【毫秒】
    return (new Date()).valueOf()
  },
  _output(e) { // 输出(线下输出，线上关闭)
    return (!!~location.origin.indexOf('test') ||
      !!~location.origin.indexOf('http://localhost:') ||
      !!~location.origin.indexOf('http://192.168.') ||
      !!~location.origin.indexOf('http://127.0.0.1:')) && console.log(` % ctitle：${e.title}\n%cfrom：${document.title}\n%cdata：%o`, 'color:#cc7832;border-bottom:1px solid #57a3f3', 'color:#6a7c4e;border-bottom:1px solid #f7f7f7', 'color:#d24f4d', e.content)
  },
  _typeOf(obj) { // 精准判断数据类型
    return {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object',
      '[object Document]': 'document',
      '[object HTMLDivElement]': 'div',
      '[object HTMLBodyElement]': 'body',
      '[object HTMLDocument]': 'document',
      '[object HTMLHtmlElement]': 'html'
    }[Object.prototype.toString.call(obj)];
  },
  _encrypt(key, iv, data) { // AES加密（node<==java,c,o-c;iv-向量)
    const cipher = require('crypto').createCipheriv('aes-128-cbc', key, iv);
    let crypted = cipher.update(data, 'utf8', 'binary');
    return crypted += cipher.final('binary'), crypted = new Buffer(crypted, 'binary').toString('base64'), crypted;
  },
  _decrypt(key, iv, crypted) { // AES解密（node<==java,c,o-c;iv-向量)
    crypted = new Buffer(crypted, 'base64').toString('binary');
    const decipher = require('crypto').createDecipheriv('aes-128-cbc', key, iv);
    let decoded = decipher.update(crypted, 'binary', 'utf8');
    return decoded += decipher.final('utf8'), decoded;
  },
  _URLEncode(clearString) { // url编码
    const regex = /(^[a-zA-Z0-9-_.]*)/;
    let output = '', x = 0;
    clearString = clearString.toString();
    while (x < clearString.length) {
      const match = regex.exec(clearString.substr(x));
      if (match !== null && match.length > 1 && !!match[1].length) output += match[1], x += match[1].length;
      else {
        if (!clearString.substr(x, 1).length) output += '+'; // ie不支持把字符串当作数组来访问
        else {
          const charCode = clearString.charCodeAt(x), hexVal = charCode.toString(16);
          output += `%${hexVal.length < 2 ? '0' : ''}${hexVal.toUpperCase()}`;
        }
        x++;
      }
    }
    return output;
  },
  _request(name) { // 获取原始的URL参数
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i'),
      r = window.location.search.substr(1).match(reg);
    return r !== null ? unescape(r[2]) : null;
  },
  _randomString(len = 32) { // 随机字符串32
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
      maxPos = $chars.length;
    /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let pwd = '';
    for (let i = 0; i < len; i++) pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    return pwd;
  },
  _verification(data, reg) { // 验证
    const [r, d] = [new RegExp(reg), data];
    return r.test(d)
  },
  _setCookie(c_name, value, expiredays) { // 设置cookie
    let exdate = new Date();
    return exdate.setDate(exdate.getDate() + expiredays),
      document.cookie = c_name + "=" + escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toGMTString()),
      null;
  },
  _getCookie(c_name) { // 获取cookie
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=");
      if (!!~c_start) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(";", c_start);
        if (!~c_end) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return null
  }
}, UA ? { // 浏览器方法
  _inBrowser() { // 是否是浏览器环境
    return !!window
  },
  _isIE() {
    return UA && /msie|trident/.test(UA)
  },
  _isIE9() {
    return UA && !!~UA.indexOf('msie 9.0')
  },
  _isEdge() {
    return UA && !!~UA.indexOf('edge/')
  },
  _isAndroid() {
    return UA && !!~UA.indexOf('android')
  },
  _isIOS() {
    return UA && /iphone|ipad|ipod|ios/.test(UA)
  },
  _isChrome() {
    return UA && /chrome\/\d+/.test(UA) && !~UA.indexOf('edge/')
  },
  _isPC() { // 判断PC环境
    const userAgentInfo = navigator.userAgent,
      Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    for (let x of Agents) if (!!~userAgentInfo.indexOf(x)) return false;
    return true;
  }
} : null);

/* }); */
//github.com => https://github.com/noteScript/em_util.git
