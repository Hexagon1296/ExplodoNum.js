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
    isExplodoNum = /^[-\+]*(Infinity|NaN|(M+|M\^\d+ )?(J+|(J+|J(\^+|\{[1-9]\d*\})[1-9]\d* |\(J(\^+|\{[1-9]\d*\})[1-9]\d*\)\^[1-9]\d* )*)?(10(\^+|\{[1-9]\d*\})|\(10(\^+|\{[1-9]\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_E = Math.log10(MAX_SAFE_INTEGER),
    P = {},
    Q = {},
    R = {};

  function deepCopy(array){
    return Array.from(array, (e) => Array.isArray(e)?deepCopy(e):e);
  }

  P.getOperatorIndex(isLayer,operator){
    let index;
    let list = isLayer?this.layer.slice(1).map((e)=>e[0]):this.array.map((e)=>e[0]);
    index = list.indexOf(operator)+parseInt(isLayer);
    if(index>=0) return index;
    else return list.filter((e)=>e<operator).length-0.5+parseInt(isLayer);
  }
  
  P.getOperator(get,operator){
    let index = this.getOperatorIndex(get!==0,operator);
    if(Number.isInteger(index)){
      if(get===0) return this.array[index][1];
      else return this.layer[index][get];
    }
    return get===0?(operator===0?10:0):0;
  }

  P.setOperator(set,operator,value){
    let index = this.getOperatorIndex(set!==0,operator);
    if(Number.isInteger(index)){
      if(set===0) this.array[index][1] = value;
      else this.layer[index][set] = value;
    } else {
      index = Math.ceil(index);
      if(set===0) this.array.splice(index,0,[operator,value);
      else if(set===1) this.layer.splice(index,0,[operator,value,1]);
      else this.layer.splice(index,0,[operator,2,value]);
    }
    //this.normalize();
  }

  Q.fromNumber = function(number){
    if(typeof number!="number") throw Error(`${invalidArgument} Expected a number but instead got ${number}`);
    let x = new ExplodoNum();
    x.array[0][1] = number;
    x.sign = number<0?-1:1;
    //x.normalize();
    return x;
  }

  P.toNumber = function(){
    if (this.array.length>=2&&(this.array[1][0]>=2||this.array[1][1]>=2||this.array[1][1]==1&&this.array[0][1]>Math.log10(Number.MAX_VALUE)||this.array[1][1]==3&&this.array[0][1]>Math.log10(Math.log10(Number.MAX_VALUE)))) return this.sign*Infinity;
    if (this.array.length>=2&&this.array[1][1]==1) return this.sign*10**this.array[0][1];
    return this.sign*this.array[0][1];
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
    //x.normalize();
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
    //x.normalize();
    return x;
  }

  Q.fromObject = function(object){
    if(typeof object!="object") throw Error(`${invalidArgument} Expected an object but instead got ${object}`);
    let x = new ExplodoNum();
    x.layer = deepCopy(object.layer);
    x.sign = object.sign;
    x.array = deepCopy(object.array);
    //x.normalize();
    return x;
  }

  Q.fromString = function(string){
    if(typeof string!="string") throw Error(`${invalidArgument} Expected a string but instead got ${string}`);
    let isJSON = false;
    try {
      return JSON.parse(string);
    } finally {
      isJSON = true;
    }
    if(isJSON){
      return ExplodoNum.fromJSON(string);
    }
    let x = new ExplodoNum();
  }

  P.toString = function(){
    let string = this.sign<0?"-":"";
    if(this.isInfinite()) return string+"Infinity";
    else if(this.isNaN()) return string+"NaN";
    let m = this.layer[0];
    if(m>0){
      if(m>3) string+="M^"+String(m)+" ";
      else string+="M".repeat(m);
    }
    let layer = Array.from(this.layer).slice(1,-1).toReversed();
    for(let j of layer){
      let omegaArrow = "J";
      if(j[0]==1) omegaArrow = "J";
      else if(j[0]<4) omegaArrow += "^".repeat(j[0]);
      else omegaArrow += "{"+String(j[0])+"}";
      if(j[0]==1){
        let total = j[1]*(j[2]>0?j[2]:1);
        if(total<4) omegaArrow = omegaArrow.repeat(total);
        else omegaArrow += "^"+String(total)+" ";
      } else omegaArrow += "^"+String(j[1]);
      if(j[0]==1) string += omegaArrow;
      else if(j[2]<4) string += (omegaArrow+" ").repeat(j[2]);
      else string += "("+omegaArrow+")^"+String(j[2])+" ";
    }
    if(this.array.length>=3||this.array.length==2&&this.array[1][0]>=2){
      let array = Array.from(this.layer).slice(0,-1).toReversed();
      for(let arrow of array){
        let natArrow = "10";
        if(arrow[0]<4) natArrow += "^".repeat(arrow[0]);
        else natArrow += "{"+String(arrow[0])"}";
        if(arrow[1]>=4) string += "("+natArrow+")^"+String(arrow[1])+" ";
        else if(arrow[1]>0) string += natArrow.repeat(arrow[1]);
      }
    }
    let operator0 = this.getOperator(0,0);
    let operator1 = this.getOperator(0,1);
    if(operator1<=0) string += String(operator0);
    else if(operator1==1) string += String(10**(operator%1))+"e"+String(operator0);
    else if(operator1==2) string += String(10**((10**(operator%1))%1))+"e"+String(10**(operator%1))+"e"+String(operator0);
    else if(operator1==3) string += "e"+String(10**((10**(operator%1))%1))+"e"+String(10**(operator%1))+"e"+String(operator0);
    else if(operator1<5) string += "e".repeat(operator1-1)+String(10**(operator%1))+"e"+String(operator0);
    else if(operator1<10) string += "e".repeat(operator1)+String(operator0);
    else string += "(10^)^"+String(operator1)+" "+String(operator0);
    return string;
  }

  //Begin OmegaNum.js/ExpantaNum.js excerpt
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
        temp = deepCopy(input.array);
        temp2 = input.sign;
        temp3 = deepCopy(input.layer)
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
      throw Error(explodoNumError+' Object expected');
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