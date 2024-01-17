//maybe this should've been a fork but still

;(function(globalScobe){
  // Editable defaults //
  var OmegaExpantaNum = {
    maxOps: 1000, // Maximum number of operations. When it is exceeded, the lowest priority operations are removed. Prevents long loops from eating memory and time.
    serializeMode: "auto" // Mode to use when converting from a JSON.
  //debug: 0
  },
    external = true,
    omegaExpantaError = "[OENError]",
    invalidArgument = `${omegaExpantaError} Invalid argument:`,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_E = Math.log10(MAX_SAFE_INTEGER),
    P = {},
    Q = {},
    R = {};

  Q.fromNumber = function(number){
    if(typeof number!="number") throw Error(`${invalidArgument} Expected a number but instead got ${number}`);
    let x = new OmegaExpantaNum();
    x.array[0][1] = number;
    x.sign = number<0?-1:1;
    x.normalize();
    return x;
  }

  function BigIntLog10(bigint){
    let exponent = BigInt(64);
    while(bigint>=BigInt(1)<<exponent) exponent*=BigInt(2);
    let expPart = exponent/BigInt(2)
    while(expHigh>BigInt(0)){
      if(bigint>=BigInt(1)<<exponent) exponent+=expPart;
      else exponent-=expPart;
      expPart/=BigInt(2);
    }
    let cutBits = exponent-BigInt(54);
    let firstBits = bigint>>cutBits;
    return Math.log10(Number(firstBits))+Math.LOG10E/Math.LOG2E*Number(cutBits);
  }

  Q.fromBigInt(bigint){
    if(typeof bigint!="bigint") throw Error(`${invalidArgument} Expected a bigint but instead got ${bigint}`);
    let x = new OmegaExpantaNum();
    let abs = bigint<BigInt(0)?-bigint:bigint;
    x.sign = bigint<BigInt(0)?-1:1;
    if (abs<BigInt(MAX_SAFE_INTEGER) x.array = [[0,Number(abs)]];
    else x.array = [[0,BigIntLog10(abs)],[1,1]];
    x.normalize();
    return x;
  }

  function getHyperE(hyperE){
    if(typeof hyperE!="string") throw Error(`${invalidArgument} Expected a string but instead got ${hyperE}`);
    if(!/^[-\+]*(0|[1-9]\d*(\.\d*)?|Infinity|NaN|E[1-9]\d*(\.\d*)?(#+[1-9]\d*)*)$/.test(hyperE)) throw Error(`${invalidArgument} Expected a Hyper-E notation number but instead got ${hyperE}`);
    let sign = (hyperE.substring(0,hyperE.search(/[^-\+]/)).match(/-/).length%2)*2-1
    hyperE = hyperE.substring(hyperE.search(/[^-\+]/));
    return {
      sign: sign,
      argv: hyperE.match(/[E#][1-9]\d*/).map((e)=>e.substring(1)),
      hyper: hyperE.match(/\d#+/).map((e)=>e.length-1)
    }
  }

  //Begin ON/EN.js excerpt
  function clone(obj) {
    var i, p, ps;
    function OmegaExpantaNum(input,input2) {
      var x=this;
      if (!(x instanceof OmegaExpantaNum)) return new OmegaExpantaNum(input,input2);
      x.constructor=OmegaExpantaNum;
      var parsedObject=null;
      if (typeof input=="string"&&(input[0]=="["||input[0]=="{")){
        try {
          parsedObject=JSON.parse(input);
        }catch{
          //lol just keep going
        }
      }
      var temp,temp2,temp3;
      if (typeof input=="number"&&!(input2 instanceof Array)){
        temp=OmegaExpantaNum.fromNumber(input);
      }else if (typeof input=="bigint"){
        temp=OmegaExpantaNum.fromBigInt(input);
      }else if (parsedObject){
        temp=OmegaExpantaNum.fromObject(parsedObject);
      }else if (typeof input=="string"&&input[0]=="E"){
        temp=OmegaExpantaNum.fromHyperE(input);
      }else if (typeof input=="string"){
        temp=OmegaExpantaNum.fromString(input);
      }else if (input instanceof Array||input2 instanceof Array){
        temp=OmegaExpantaNum.fromArray(input,input2);
      }else if (input instanceof OmegaExpantaNum){
        temp = Array.from(input.array);
        temp2 = input.sign;
        temp3 = Array.from(input.layer)
      }else if (typeof input=="object"){
        temp=OmegaExpantaNum.fromObject(input);
      }else{
        temp=[[0,NaN]];
        temp2=1;
        temp3=0;
      }
      if (typeof temp2=="undefined"){
        x.array=temp.array;
        x.sign=temp.sign;
        x.layer=temp.layer;
      }else{
        x.array=temp;
        x.sign=temp2;
        x.layer=temp3;
      }
      return x;
    }
    OmegaExpantaNum.prototype = P;

    OmegaExpantaNum.clone=clone;
    OmegaExpantaNum.config=OmegaExpantaNum.set=config;
    
    Object.assign(OmegaExpantaNum,Q);
  //for (var prop in Q){
  //  if (Q.hasOwnProperty(prop)){
  //    OmegaExpantaNum[prop]=Q[prop];
  //  }
  //}
    
    if (obj === void 0) obj = {};
    if (obj) {
      ps = ['maxOps', 'serializeMode'];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }

    OmegaExpantaNum.config(obj);
    
    return OmegaExpantaNum;
  }

  function defineConstants(obj){
    for (var prop in R){
      if (R.hasOwnProperty(prop)){
        if (Object.defineProperty){
          Object.defineProperty(obj,prop,{
            configurable: false,
            enumerable: true,
            writable: false,
            value: new OmegaExpantaNum(R[prop])
          });
        }else{
          obj[prop]=new OmegaExpantaNum(R[prop]);
        }
      }
    }
    return obj;
  }

  /*
   * Configure global settings for a OmegaExpantaNum constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   precision  {number}
   *   rounding   {number}
   *   toExpNeg   {number}
   *   toExpPos   {number}
   *
   * E.g. OmegaExpantaNum.config({ precision: 20, rounding: 4 })
   *
   */
  function config(obj){
    if (!obj||typeof obj!=='object') {
      throw Error(omegaExpantaError+'Object expected');
    }
    var i,p,v,
      ps = [
        'maxOps',1,Number.MAX_SAFE_INTEGER,
        'serializeMode',["string", "object", "auto"], "padding"
      ];
    for (i = 0; i < ps.length; i += 3) {
      if ((v = obj[p = ps[i]]) !== void 0) {
        if (Array.isArray(ps[i + 1])&&ps[i + 1].includes(v)) this[p] = v;
        else if (Math.floor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
        else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    return this;
  }

  // Create and configure initial OmegaExpantaNum constructor.
  OmegaExpantaNum=clone(OmegaExpantaNum);

  OmegaExpantaNum=defineConstants(OmegaExpantaNum);

  OmegaExpantaNum['default']=OmegaExpantaNum.OmegaExpantaNum=OmegaExpantaNum;

  // Export.

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return OmegaExpantaNum;
    });
  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = OmegaExpantaNum;
    // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self
        ? self : Function('return this')();
    }
    globalScope.OmegaExpantaNum = globalScope.OEN = OmegaExpantaNum;
  }
})(this)
