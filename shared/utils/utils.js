
let TAU = Math.PI * 2
export {TAU}

export function map(val,from1,from2,to1,to2){
    return lerp(to1,to2,inverseLerp(val,from1,from2))
}

export function inverseLerp(val,a,b){
    return to(a,val) / to(a,b)
}

export function inRange(min, max, value){
    if(min > max){
        let temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}

export function min(a, b){
    if(a < b)return a;
    return b;
}

export function max(a, b){
    if(a > b)return a;
    return b;
}

export function clamp(val, min, max){
    return this.max(this.min(val, max), min)
}

export function rangeContain(a1, a2, b1, b2){//as in does a enclose b----- so returns true if b is smaller in all ways
    return max(a1, a2) >= max(b1, b2) && min(a1,a2) <= max(b1,b2);
}

export function createCanvas(x, y){
    let canvas = document.createElement('canvas')
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas)
    let ctxt = canvas.getContext('2d')
    return {ctxt:ctxt,canvas:canvas};
}

export function random(min, max){
    return Math.random() * (max - min) + min
}


let lastUpdate = Date.now();
export function loop(callback){
    let now = Date.now()
    callback((now - lastUpdate) / 1000)
    lastUpdate = now
    requestAnimationFrame(() => {
        loop(callback)
    })
}

export function mod(number, modulus){
    return ((number%modulus)+modulus)%modulus;
}


export function loadTextFiles(strings){
    let promises = []
    for(let string of strings){
        let promise = fetch(string)
        .then(resp => resp.text())
        .then(text => text)
        promises.push(promise)
    }
    return Promise.all(promises)
}

export function loadImages(urls){
    let promises = []

    for(let url of urls){
        promises.push(new Promise((res,rej) => {
            let image = new Image()
            image.onload = e => {
                res(image)     
            }
            image.src = url
        }))
    }

    return Promise.all(promises)
}

export function findbestIndex(list, evaluator) {
    if (list.length < 1) {
        return -1;
    }
    let bestIndex = 0;
    let bestscore = evaluator(list[0])
    for (let i = 1; i < list.length; i++) {
        let score = evaluator(list[i])
        if (score > bestscore) {
            bestscore = score
            bestIndex = i
        }
    }
    return bestIndex
}

export function string2html(string) {
    let div = document.createElement('div')
    div.innerHTML = string;
    return div.children[0];
}


export function lerp(a,b,r){
    return a + to(a,b) * r
}

export function to(a,b){
    return b - a;
}

export function swap(arr,a = 0,b = 1){
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

export function first(arr){
    return arr[0]
}

export function last(arr){
    return arr[arr.length - 1]
}

export function create2DArray(size,filler){
    let result = new Array(size.y)
    for(let i = 0; i < size.y;i++){
        result[i] = new Array(size.x)
    }
    size.loop2d(v => {
        result[v.y][v.x] = filler(v)
    })
    return result
}

export function index2D(arr,i){
    return arr[i.x][i.y]
}

export function copy2dArray(arr){
    return create2DArray(get2DArraySize(arr),pos => index2D(arr,pos))
}

export function round(number,decimals){
    let mul = 10 ** decimals
    return Math.round(number *  mul) / mul
}

export class RNG{
    mod = 4294967296
    multiplier = 1664525
    increment = 1013904223

    constructor(seed){
        this.seed = seed
    }

    next(){
        this.seed = (this.multiplier * this.seed + this.increment) % this.mod
        return this.seed
    }

    norm(){
        return this.next() / this.mod
    }
    
    
    range(min,max){
        return this.norm() * to(min,max) + min
    }
}


export function shuffle(array,rng){
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(rng.norm() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export function remove(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

Array.prototype.remove = function (index) {
    return this.splice(index,1)
}

Array.prototype.first = function () {
    return this[0]
}

Array.prototype.last = function () {
    return this[this.length - 1]
}

