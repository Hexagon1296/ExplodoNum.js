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

  R.ZERO = 0;
  R.ONE = 1;

  function deepCopy(array){
    return Array.from(array, (e) => Array.isArray(e)?deepCopy(e):e);
  }

  P.absoluteValue = P.abs = function(){
    let x = this.clone();
    x.sign = 1;
    return x;
  }

  Q.absoluteValue = Q.abs = function(x){
    return new ExplodoNum(x).abs();
  }

  P.negate = P.neg = function(){
    let x = this.clone();
    x.sign *= -1;
    return x;
  }

  Q.negate = Q.neg = function(x){
    return new ExplodoNum(x).neg();
  }

  P.compareTo = P.cmp = function(other){
    if(!(other instanceof ExplodoNum)) other = new ExplodoNum(other);
    if(this.isNaN()||other.isNaN()) return NaN;
    if(this.isInfinite()&&other.isInfinite()) return NaN;
    if(this.isInfinite()&&other.isFinite()) return this.sign;
    if(this.isFinite()&&other.isInfinite()) return -other.sign;
    if (this.array.length==1&&this.array[0][1]===0&&other.array.length==1&&other.array[0][1]===0) return 0;
    if(this.sign!==other.sign) return this.sign;
    var m=this.sign;
    var r;
    //ExpantaNum.js excerpt
    if (this.layer[0]>other.layer[0]) r=1;
    else if (this.layer[0]<other.layer[0]) r=-1;
    else{
      var e,f;
      for (var i=0,l=Math.min(this.layer.length,other.layer.length);i<l;++i){
        e=this.layer[this.layer.length-1-i];
        f=other.layer[other.layer.length-1-i];
        if (e[0]>f[0]||e[0]==f[0]&&e[1]>f[1]||e[0]==f[0]&&e[1]==f[1]&&e[2]>f[2]){
          r=1;
          break;
        }else if (e[0]<f[0]||e[0]==f[0]&&e[1]<f[1]||e[0]==f[0]&&e[1]==f[1]&&e[2]<f[2]){
          r=-1;
          break;
        }
      }
      if(r!==undefined) return r*m;
      for (var i=0,l=Math.min(this.array.length,other.array.length);i<l;++i){
        e=this.array[this.array.length-1-i];
        f=other.array[other.array.length-1-i];
        if (e[0]>f[0]||e[0]==f[0]&&e[1]>f[1]){
          r=1;
          break;
        }else if (e[0]<f[0]||e[0]==f[0]&&e[1]<f[1]){
          r=-1;
          break;
        }
      }
      if (r===undefined){
        if (this.array.length==other.array.length){
          r=0;
        }else if (this.array.length>other.array.length){
          e=this.array[this.array.length-l];
          if (e[0]>=1||e[1]>10){
            r=1;
          }else{
            r=-1;
          }
        }else{
          e=other.array[other.array.length-l];
          if (e[0]>=1||e[1]>10){
            r=-1;
          }else{
            r=1;
          }
        }
      }
    }
    return r*m;
  }

  Q.compareTo = Q.cmp = function(x,y){
    return new ExplodoNum(x).cmp(y);
  }

  P.lessThan = P.lt = function(other){
    return this.cmp(other)<0
  }

  Q.lessThan = Q.lt = function(x,y){
    return new ExplodoNum(x).lt(y);
  }

  P.lessThanOrEqualTo = P.lte = function(other){
    return this.cmp(other)<=0
  }

  Q.lessThanOrEqualTo = Q.lte = function(x,y){
    return new ExplodoNum(x).lte(y);
  }

  P.greaterThan = P.gt = function(other){
    return this.cmp(other)>0
  }

  Q.greaterThan = Q.gt = function(x,y){
    return new ExplodoNum(x).gt(y);
  }

  P.greaterThanOrEqualTo = P.gte = function(other){
    return this.cmp(other)>=0
  }

  Q.greaterThanOrEqualTo = Q.gte = function(x,y){
    return new ExplodoNum(x).gte(y);
  }

  P.equalTo = P.eq = function(other){
    return this.cmp(other)===0
  }

  Q.equalTo = Q.eq = function(x,y){
    return new ExplodoNum(x).eq(y);
  }

  P.notEqualTo = P.neq = function(other){
    return this.cmp(other)!==0
  }

  Q.notEqualTo = Q.neq = function(x,y){
    return new ExplodoNum(x).neq(y);
  }
  
  P.minimum = P.min = function(...y){
    if(y.length===0) return this.clone();
    else{
      let min = ExplodoNum.min(...y);
      return this.lt(min)?this.clone():min.clone();
    }
  }

  Q.minimum = Q.min = function(x,...y) {
    return new ExpantaNum(x).min(...y);
  }
  
  P.maximum = P.max = function(...y){
    if(y.length===0) return this.clone();
    else{
      let max = ExplodoNum.max(...y);
      return this.gt(min)?this.clone():max.clone();
    }
  }

  Q.maximum = Q.max = function(x,...y) {
    return new ExpantaNum(x).max(...y);
  }

  P.isPositive = P.ispos = function(){
    return this.gt(ExplodoNum.ZERO);
  }

  Q.isPositive = Q.ispos = function(x){
    return new ExplodoNum(x).isPositive();
  }

  P.isNegative = P.isneg = function(){
    return this.lt(ExplodoNum.ZERO);
  }

  Q.isNegative = Q.isneg = function(x){
    return new ExplodoNum(x).isNegative();
  }

  P.isFinite = function(){
    return this.getOperator(0,0)!==Infinity&&!isNaN(this.getOperator(0,0));
  }

  Q.isFinite = function(x){
    return new ExplodoNum(x).isFinite();
  }

  P.isInfinite = function(){
    return this.getOperator(0,0)===Infinity;
  }
  
  Q.isInfinite = function(x){
    return new ExplodoNum(x).isInfinite();
  }

  P.isNaN = function(){
    return isNaN(this.getOperator(0,0))
  }
  
  Q.isNaN = function(x){
    return new ExplodoNum(x).isNaN();
  }

  P.isInteger = P.isint = function(){
    if(this.isInfinite()) return true;
    if(this.isNaN()) return false;
    return Number.isInteger(this.toNumber());
  }
  
  Q.isInteger = Q.isint = function(x){
    return new ExplodoNum(x).isInteger();
  }

  P.getOperatorIndex = function(isLayer,operator){
    let index;
    let list = isLayer?this.layer.slice(1).map((e)=>e[0]):this.array.map((e)=>e[0]);
    index = list.indexOf(operator)+isLayer;
    if(index>=isLayer) return index;
    else return list.filter((e)=>e<operator).length-0.5+isLayer;
  }
  
  P.getOperator = function(get,operator){
    let index = this.getOperatorIndex(get!==0,operator);
    if(Number.isInteger(index)){
      if(get===0) return this.array[index][1];
      else return this.layer[index][get];
    }
    return get===0?(operator===0?10:0):0;
  }

  P.setOperator = function(set,operator,value){
    let index = this.getOperatorIndex(set!==0,operator);
    if(Number.isInteger(index)){
      if(set===0) this.array[index][1] = value;
      else this.layer[index][set] = value;
    } else {
      index = Math.ceil(index);
      if(set===0) this.array.splice(index,0,[operator,value]);
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
  
  var LONG_STRING_MIN_LENGTH=17;
  var log10LongString=function log10LongString(str){
    return Math.log10(Number(str.substring(0,LONG_STRING_MIN_LENGTH)))+(str.length-LONG_STRING_MIN_LENGTH);
  }

  Q.fromString = function(string){
    if(typeof string!="string") throw Error(`${invalidArgument} Expected a string but instead got ${string}`);
    let isJSON = false;
    if (typeof string=="string"&&(string[0]=="["||string[0]=="{")){
      try {
        JSON.parse(string);
      }finally{
        isJSON=true;
      }
    }
    if(isJSON){
      return ExplodoNum.fromJSON(string);
    }
    let x = new ExplodoNum();
    //ExpantaNum.js excerpt
    var negateIt=false;
    if (string[0]=="-"||string[0]=="+"){
      var numSigns=string.search(/[^-\+]/);
      var signs=string.substring(0,numSigns);
      negateIt=signs.match(/-/g).length%2==1;
      string=string.substring(numSigns);
    }
    x.array = [[0,0]];
    x.sign = Number(!negateIt)*2-1
    if (string=="NaN"){
      x.array=[[0,NaN]];
      return x;
    }
    else if (string=="Infinity"){
      x.array=[[0,Infinity]];
      return x;
    }
    else{
      var a,b,c,d,e,i;
      if (string[0]=="M"){
        if (string[1]=="^"){
          a=string.substring(2).search(/[^0-9]/)+2;
          x.layer=Number(string.substring(2,a));
          string=string.substring(a+1);
        }else{
          a=string.search(/[^M]/);
          x.layer[0]=a;
          string=string.substring(a);
        }
      }
      while (string){
        if (string.includes("J")){
          if (string[0]=="("){
            string=string.substring(1);
          }
          let arrows;
          e = 0
          if(/\d/.test(string[1])){
            arrows = 1;
            b = 1;
            e = 1;
          } else if (string[1]=="J"){
            a=string.substring(1).search(/[^J]/);
            e=a+1;
            arrows = 1;
            b=a+1;
          } else if (string[1]=="^"){
            a=string.substring(1).search(/[^\^]/);
            arrows=a;
            b=a+1;
          }else{
            a=string.indexOf("}");
            arrows=Number(string.substring(2,a));
            b=a;
          }
          string=string.substring(b);
          c = string.search(/[\) ]/);
          d = string.substring(0,c)
          if(e===0){
            b = parseInt(d);
            string = string.substring(c)
          } else b = e;
          if (string[0]==")"){
            a=string.indexOf(" ");
            c=Number(string.substring(2,a));
            string=string.substring(a+1);
          }else{
            c=1;
          }
          if (arrows==1){
            if (x.layer.length>=3&&x.layer[1][0]==1){
              x.layer[1][2]+=c;
            }else{
              x.layer.splice(1,0,[1,b,c]);
            }
          }else if (arrows==2){
            if (x.layer.length>=2&&x.layer[1][0]==1) x.layer.splice(1,1);
            d=x.getOperatorIndex(true,2);
            if (Number.isInteger(d)){
              x.layer[d][2]+=c
              if(b>x.layer[d][1]) x.layer[d][1] = b;
            } else x.layer.splice(Math.ceil(d),0,[2,b,c]);
          }else{
            d=x.getOperatorIndex(true,arrows);
            x.layer.splice(1,Math.ceil(d)-1);
            if (Number.isInteger(d)){
              x.layer[1][2]+=c;
              if(b>x.layer[1][1]) x.layer[1][1] = b;
            } else x.layer.splice(1,0,[arrows,b,c]);
          }
        }else{
          break;
        }
      }
      while (string){
        if (/^\(?10[\^\{]/.test(string)){
          if (string[0]=="("){
            string=string.substring(1);
          }
          var arrows;
          if (string[2]=="^"){
            a=string.substring(2).search(/[^\^]/);
            arrows=a;
            b=a+2;
          }else{
            a=string.indexOf("}");
            arrows=Number(string.substring(3,a));
            b=a+1;
          }
          string=string.substring(b);
          if (string[0]==")"){
            a=string.indexOf(" ");
            c=Number(string.substring(2,a));
            string=string.substring(a+1);
          }else{
            c=1;
          }
          if (arrows==1){
            if (x.array.length>=2&&x.array[1][0]==1){
              x.array[1][1]+=c;
            }else{
              x.array.splice(1,0,[1,c]);
            }
          }else if (arrows==2){
            a=x.array.length>=2&&x.array[1][0]==1?x.array[1][1]:0;
            b=x.array[0][1];
            if (b>=1e10) ++a;
            if (b>=10) ++a;
            x.array[0][1]=a;
            if (x.array.length>=2&&x.array[1][0]==1) x.array.splice(1,1);
            d=x.getOperatorIndex(false,2);
            if (Number.isInteger(d)) x.array[d][1]+=c;
            else x.array.splice(Math.ceil(d),0,[2,c]);
          }else{
            a=x.getOperator(0,arrows-1);
            b=x.getOperator(0,arrows-2);
            if (b>=10) ++a;
            d=x.getOperatorIndex(false,arrows);
            x.array.splice(1,Math.ceil(d)-1);
            x.array[0][1]=a;
            if (Number.isInteger(d)) x.array[1][1]+=c;
            else x.array.splice(1,0,[arrows,c]);
          }
        }else{
          break;
        }
      }
      a=string.split(/[Ee]/);
      b=[x.array[0][1],0];
      c=1;
      for (i=a.length-1;i>=0;--i){
        //The things that are already there
        if (b[0]<MAX_E&&b[1]===0){
          b[0]=Math.pow(10,c*b[0]);
        }else if (c==-1){
          if (b[1]===0){
            b[0]=Math.pow(10,c*b[0]);
          }else if (b[1]==1&&b[0]<=Math.log10(Number.MAX_VALUE)){
            b[0]=Math.pow(10,c*Math.pow(10,b[0]));
          }else{
            b[0]=0;
          }
          b[1]=0;
        }else{
          b[1]++;
        }
        //Multiplying coefficient
        var decimalPointPos=a[i].indexOf(".");
        var intPartLen=decimalPointPos==-1?a[i].length:decimalPointPos;
        if (b[1]===0){
          if (intPartLen>=LONG_STRING_MIN_LENGTH) b[0]=Math.log10(b[0])+log10LongString(a[i].substring(0,intPartLen)),b[1]=1;
          else if (a[i]) b[0]*=Number(a[i]);
        }else{
          d=intPartLen>=LONG_STRING_MIN_LENGTH?log10LongString(a[i].substring(0,intPartLen)):a[i]?Math.log10(Number(a[i])):0;
          if (b[1]==1){
            b[0]+=d;
          }else if (b[1]==2&&b[0]<MAX_E+Math.log10(d)){
            b[0]+=Math.log10(1+Math.pow(10,Math.log10(d)-b[0]));
          }
        }
        //Carrying
        if (b[0]<MAX_E&&b[1]){
          b[0]=Math.pow(10,b[0]);
          b[1]--;
        }else if (b[0]>MAX_SAFE_INTEGER){
          b[0]=Math.log10(b[0]);
          b[1]++;
        }
      }
      x.array[0][1]=b[0];
      if (b[1]){
        if (x.array.length>=2&&x.array[1][0]==1) x.array[1][1]+=b[1];
        else x.array.splice(1,0,[1,b[1]]);
      }
    }
    if (negateIt) x.sign*=-1;
    //x.normalize();
    return x;
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
    if(this.layer.length>=2){
      let layer = Array.from(this.layer).slice(1).reverse();
      for(let j of layer){
        let omegaArrow = "J";
        if(j[0]==1) omegaArrow = "J";
        else if(j[0]<4) omegaArrow += "^".repeat(j[0]-1);
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
    }
    if(this.array.length>=3||this.array.length==2&&this.array[1][0]>=2){
      let array = Array.from(this.layer).slice(2-parseInt(this.array.length==2)).reverse();
      for(let arrow of array){
        let natArrow = "10";
        if(arrow[0]<4) natArrow += "^".repeat(arrow[0]);
        else natArrow += "{"+String(arrow[0])+"}";
        if(arrow[1]>=4) string += "("+natArrow+")^"+String(arrow[1])+" ";
        else if(arrow[1]>0) string += natArrow.repeat(arrow[1]);
      }
    }
    let operator0 = this.getOperator(0,0);
    let operator1 = this.getOperator(0,1);
    if(operator1<=0) string += String(operator0);
    else if(operator1==1) string += String(10**(operator0%1))+"e"+String(Math.floor(operator0));
    else if(operator1==2) string += String(10**((10**(operator0%1))%1))+"e"+String(10**(operator0%1))+"e"+String(Math.floor(operator0));
    else if(operator1==3) string += "e"+String(10**((10**(operator0%1))%1))+"e"+String(10**(operator0%1))+"e"+String(Math.floor(operator0));
    else if(operator1<5) string += "e".repeat(operator1-1)+String(10**(operator0%1))+"e"+String(Math.floor(operator0));
    else if(operator1<10) string += "e".repeat(operator1)+String(operator0);
    else string += "(10^)^"+String(operator1)+" "+String(operator0);
    return string;
  }

  P.clone = function(){
    let x = new ExplodoNum();
    x.array = deepCopy(this.array);
    x.sign = this.sign;
    x.layer = deepCopy(this.layer);
    return x;
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
