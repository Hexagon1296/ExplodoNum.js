# ExplodoNum.js
A JavaScript library for handling numbers up to {10,9e15,1,3} in [BEAF](https://googology.fandom.com/wiki/BEAF).

This reaches up to f<sub>ω2+1</sub> in the FGH, which is also where [explosion](https://googology.fandom.com/wiki/Explosion) lies, hence the name.
A lot of the code here is from or derived from [ExpantaNum.js](https://github.com/Naruyoko/ExpantaNum.js/) by [Naruyoko](https://github.com/Naruyoko/). Now you may be asking yourself "Why didn't you just fork it?". I (30IG) have no answer to that.

Internally, it is represented as a sign and two arrays, one simply called array and the other layer. Sign is either 1 or -1 as the sign of the number, array is of the form \[\[a<sub>0</sub>,b<sub>0</sub>\],\[a<sub>1</sub>,b<sub>1</sub>\],\[a<sub>2</sub>,b<sub>2</sub>\],\[a<sub>3</sub>,b<sub>3</sub>\]...\], and layer is \[m,\[j<sub>0</sub>,k<sub>0</sub>,l<sub>0</sub>\],\[j<sub>1</sub>,k<sub>1</sub>,l<sub>1</sub>\],\[j<sub>2</sub>,k<sub>2</sub>,l<sub>2</sub>\],\[j<sub>3</sub>,k<sub>3</sub>,l<sub>3</sub>\]...\]. Together they make up sign*(M<sup>m</sup> omegaLayer topLayer), with Mx = {10,10,x,2}, omegaLayer is the operator ...(J{j<sub>3</sub>}k<sub>3</sub>)<sup>l<sub>3</sub></sup>(J{j<sub>2</sub>}k<sub>2</sub>)<sup>l<sub>2</sub></sup>(J{j<sub>1</sub>}k<sub>1</sub>)<sup>l<sub>1</sub></sup>(J{j<sub>0</sub>}k<sub>0</sub>)<sup>l<sub>0</sub></sup>, with Jx = 10{x}10, and topLayer is:
- ...(10{a<sub>3</sub>})<sup>b<sub>3</sub></sup>(10{a<sub>2</sub>})<sup>b<sub>2</sub></sup>(10{a<sub>1</sub>})<sup>b<sub>1</sub></sup>b<sub>0</sub> if a<sub>0</sub> = 0
- ...(10{a<sub>3</sub>})<sup>b<sub>3</sub></sup>(10{a<sub>2</sub>})<sup>b<sub>2</sub></sup>(10{a<sub>1</sub>})<sup>b<sub>1</sub></sup>(10{a<sub>0</sub>})<sup>b<sub>0</sub></sup>10 otherwise

If you are not planning to make something to the scale of (True Infinity)[https://reinhardt-c.github.io/TrueInfinity], then use other libraries, such as, in ascending order:

- [break_infinity.js](https://github.com/Patashu/break_infinity.js) by Patashu - e9e15
- [decimal.js](https://github.com/MikeMcl/decimal.js) by MikeMcl - e9e15
- [logarithmica_numerus_lite.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/logarithmica_numerus_lite.js) by Aarex Tiaokhiao - e1.8e308
- [confractus_numerus.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/confractus_numerus.js) by Aarex Tiaokhiao - ee9e15
- [magna_numerus.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/magna_numerus.js) by Aarex Tiaokhiao - ?
- [break_eternity.js](https://github.com/Patashu/break_eternity.js) by Patashu - 10^^1.8e308
- [OmegaNum.js](https://github.com/Naruyoko/OmegaNum.js) by Naruyoko - 10{1000}10 (default)
- [ExpantaNum.js](https://github.com/Naruyoko/ExpantaNum.js/)https://github.com/Naruyoko/ExpantaNum.js/ by Naruyoko - {10,9e15,1,2}

Furthur ideas:

- ~~ExpantaNum.js - f<sub>ω+1</sub>, array of value-index pair with separate counter~~
- ~~ExplodoNum.js - f<sub>ω2+1</sub>, layer becomes an array like array already is~~
- MegotaNum.js - f<sub>ω<sup>2</sup></sub>
- PowiainaNum.js - f<sub>ω<sup>3</sup></sub>
- GodgahNum.js - f<sub>ω<sup>ω</sup></sub>
