# ExplodoNum.js
A JavaScript library for handling numbers up to {10,9e15,1,3} in [BEAF](https://googology.fandom.com/wiki/BEAF).

This reaches up to f<sub>ω2+1</sub> in the FGH, which is also where [explosion](https://googology.fandom.com/wiki/Explosion) lies, hence the name.
A lot of the code here is from or derived from [ExpantaNum.js](https://github.com/Naruyoko/ExpantaNum.js/) by [Naruyoko](https://github.com/Naruyoko/). Now you may be asking yourself "Why didn't you just fork it?". I (30IG) have no answer to that.

Internally, it is represented as a sign and two arrays, one simply called array and the other layer. Sign is either 1 or -1 as the sign of the number, array is of the form \[\[a<sub>0</sub>,b<sub>0</sub>\],\[a<sub>1</sub>,b<sub>1</sub>\],\[a<sub>2</sub>,b<sub>2</sub>\],\[a<sub>3</sub>,b<sub>3</sub>\]...\], and layer is \[m,\[j<sub>0</sub>,k<sub>0</sub>,l<sub>0</sub>\],\[j<sub>1</sub>,k<sub>1</sub>,l<sub>1</sub>\],\[j<sub>2</sub>,k<sub>2</sub>,l<sub>2</sub>\],\[j<sub>3</sub>,k<sub>3</sub>,l<sub>3</sub>\]...\]. Together they make up sign*(M<sup>m</sup> omegaLayer topLayer), with Mx = {10,10,x,2}, omegaLayer is the operator ...(J{j<sub>3</sub>}k<sub>3</sub>)<sup>l<sub>3</sub></sup>(J{j<sub>2</sub>}k<sub>2</sub>)<sup>l<sub>2</sub></sup>(J{j<sub>1</sub>}k<sub>1</sub>)<sup>l<sub>1</sub></sup>(J{j<sub>0</sub>}k<sub>0</sub>)<sup>l<sub>0</sub></sup>, with Jx = 10{x}10, and topLayer is:
- ...(10{a<sub>3</sub>})<sup>b<sub>3</sub></sup>(10{a<sub>2</sub>})<sup>b<sub>2</sub></sup>(10{a<sub>1</sub>})<sup>b<sub>1</sub></sup>b<sub>0</sub> if a<sub>0</sub> = 0
- ...(10{a<sub>3</sub>})<sup>b<sub>3</sub></sup>(10{a<sub>2</sub>})<sup>b<sub>2</sub></sup>(10{a<sub>1</sub>})<sup>b<sub>1</sub></sup>(10{a<sub>0</sub>})<sup>b<sub>0</sub></sup>10 otherwise
