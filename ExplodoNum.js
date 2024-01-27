//maybe this should've been a fork but still

;(function(globalScope){
  // Editable defaults //
  var ExplodoNum = {
    maxOps: 1000, // Maximum number of operations. When it is exceeded, the lowest priority operations are removed. Prevents long loops from eating memory and time.
    serializeMode: "auto" // Mode to use when converting from a JSON.
  //debug: 0
  },
    external = true,
    explodoNumError = "[ExplodoNumError]",
    invalidArgument = `${explodoNumError} Invalid argument:`,
    isExplodoNum = /^[-\+]*(Infinity|NaN|(M+|M\^\d+)?(J(\^+|\{[1-9]\d*\})|\(J(\^+|\{[1-9]\d*\})\)\^[1-9]\d*)*(10(\^+|\{[1-9]\d*\})|\(10(\^+|\{[1-9]\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_E = Math.log10(MAX_SAFE_INTEGER),
    P = {},
    Q = {},
    R = {};

  Q.fromNumber = function(number){
    if(typeof number!="number") throw Error(`${invalidArgument} Expected a number but instead got ${number}`);
    let x = new ExplodoNum();
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

  Q.fromBigInt = function(bigint){
    if(typeof bigint!="bigint") throw Error(`${invalidArgument} Expected a bigint but instead got ${bigint}`);
    let x = new ExplodoNum();
    let abs = bigint<BigInt(0)?-bigint:bigint;
    x.sign = bigint<BigInt(0)?-1:1;
    if (abs<BigInt(MAX_SAFE_INTEGER)) x.array = [[0,Number(abs)]];
    else x.array = [[0,BigIntLog10(abs)],[1,1]];
    x.normalize();
    return x;
  }

  function getHyperE(hyperE){
    if(typeof hyperE!="string") throw Error(`${invalidArgument} Expected a string but instead got ${hyperE}`);
    if(!/^[-\+]*(0|[1-9]\d*(\.\d*)?|Infinity|NaN|E[1-9]\d*(\.\d*)?(#[1-9]\d*)*)$/.test(hyperE)) throw Error(`${invalidArgument} Expected a Hyper-E notation number but instead got ${hyperE}`);
    let sign = hyperE.substring(0,hyperE.search(/[^-\+]/)).match(/-/g);
    if(Array.isArray(sign)) sign = sign.length%2*2-1;
    else sign = -1;
    sign = -sign;
    hyperE = hyperE.substring(hyperE.search(/[^-\+]/));
    if(hyperE=="Infinity"){
      return {
        sign: sign,
        argv: Infinity
      }
    }
    if(hyperE=="NaN"){
      return {
        sign: sign,
        argv: NaN
      }
    }
    if(!hyperE.includes("E")){
      return {
        sign: sign,
        argv: +hyperE
      }
    }
    return {
      sign: sign,
      argv: hyperE.match(/[1-9]\d*(\.\d*)?/g).map((e)=>+e)
    }
  }

  Q.fromHyperE = function(hyperE){
    let packet = getHyperE(hyperE);
    if(!Array.isArray(packet.argv)) return ExplodoNum.fromNumber(packet.sign*packet.argv);
    let x = new ExplodoNum();
    for(let i = 0;i<packet.argv.length;i++){
      let arg = packet.argv[i];
      if(i>=2) arg--;
      x.array[i] = [i,arg];
    }
    x.normalize();
    return x;
  }

  Q.fromObject = function(object){
    if(typeof object!="object") throw Error(`${invalidArgument} Expected an object but instead got ${object}`);
    let x = new ExplodoNum();
    x.layer = Array.from(object.layer);
    x.sign = object.sign;
    x.array = Array.from(object.array);
    x.normalize();
    return x;
  }

  Q.fromString() = function(string){
    if(typeof string!="string") throw Error(`${invalidArgument} Expected a string but instead got ${string}`);
    try {
      return ExplodoNum.fromJSON(JSON.parse(string));
    } catch {
      //Do nothing
    }
    
  }

  //Begin ON/EN.js excerpt
  function clone(obj) {
    var i, p, ps;
    function ExplodoNum(input,input2) {
      var x=this;
      if (!(x instanceof ExplodoNum)) return new ExplodoNum(input,input2);
      x.constructor=ExplodoNum;
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
        temp=ExplodoNum.fromNumber(input);
      }else if (typeof input=="bigint"){
        temp=ExplodoNum.fromBigInt(input);
      }else if (parsedObject){
        temp=ExplodoNum.fromObject(parsedObject);
      }else if (typeof input=="string"&&input[0]=="E"){
        temp=ExplodoNum.fromHyperE(input);
      }else if (typeof input=="string"){
        temp=ExplodoNum.fromString(input);
      }else if (input instanceof Array||input2 instanceof Array){
        temp=ExplodoNum.fromArray(input,input2);
      }else if (input instanceof ExplodoNum){
        temp = Array.from(input.array);
        temp2 = input.sign;
        temp3 = Array.from(input.layer)
      }else if (typeof input=="object"){
        temp=ExplodoNum.fromObject(input);
      }else{
        temp=[[0,NaN]];
        temp2=1;
        temp3=[0];
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
    ExplodoNum.prototype = P;

    ExplodoNum.clone=clone;
    ExplodoNum.config=ExplodoNum.set=config;
    
    Object.assign(ExplodoNum,Q);
  //for (var prop in Q){
  //  if (Q.hasOwnProperty(prop)){
  //    ExplodoNum[prop]=Q[prop];
  //  }
  //}
    
    if (obj === void 0) obj = {};
    if (obj) {
      ps = ['maxOps', 'serializeMode'];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }

    ExplodoNum.config(obj);
    
    return ExplodoNum;
  }

  function defineConstants(obj){
    for (var prop in R){
      if (R.hasOwnProperty(prop)){
        if (Object.defineProperty){
          Object.defineProperty(obj,prop,{
            configurable: false,
            enumerable: true,
            writable: false,
            value: new ExplodoNum(R[prop])
          });
        }else{
          obj[prop]=new ExplodoNum(R[prop]);
        }
      }
    }
    return obj;
  }

  /*
   * Configure global settings for a ExplodoNum constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   maxOps        {number}
   *   serializeMode {string}
   *
   * E.g. ExplodoNum.config({ maxOps: 900, serializeMode: "string" })
   *
   */
  function config(obj){
    if (!obj||typeof obj!=='object') {
      throw Error(explodoNumError+'Object expected');
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

  // Create and configure initial ExplodoNum constructor.
  ExplodoNum=clone(ExplodoNum);

  ExplodoNum=defineConstants(ExplodoNum);

  ExplodoNum['default']=ExplodoNum.ExplodoNum=ExplodoNum;

  // Export.

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return ExplodoNum;
    });
  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = ExplodoNum;
    // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self
        ? self : Function('return this')();
    }
    globalScope.ExplodoNum = globalScope.EXN = ExplodoNum;
  }
})(this)
