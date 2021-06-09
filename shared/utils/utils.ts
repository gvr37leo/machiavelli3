import {Vector} from '../vector/vector.js'

let TAU = Math.PI * 2
export {TAU}

export function map(val:number,from1:number,from2:number,to1:number,to2:number):number{
    return lerp(to1,to2,inverseLerp(val,from1,from2))
}

export function inverseLerp(val:number,a:number,b:number):number{
    return to(a,val) / to(a,b)
}

export function inRange(min: number, max: number, value: number):boolean{
    if(min > max){
        let temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}

export function min(a: number, b: number): number{
    if(a < b)return a;
    return b;
}

export function max(a: number, b: number): number{
    if(a > b)return a;
    return b;
}

export function clamp(val: number, min: number, max: number): number{
    return this.max(this.min(val, max), min)
}

export function rangeContain(a1: number, a2: number, b1: number, b2: number):boolean{//as in does a enclose b----- so returns true if b is smaller in all ways
    return max(a1, a2) >= max(b1, b2) && min(a1,a2) <= max(b1,b2);
}

export function startMouseListen(localcanvas:HTMLCanvasElement){
    let mousepos = new Vector(0,0)
    document.addEventListener('mousemove',(e) => {
        mousepos.overwrite(getMousePos(localcanvas,e))
    })
    return mousepos
}

export function getMousePos(canvas:HTMLCanvasElement, evt:MouseEvent) {
    let rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top)
}

export function createCanvas(x: number, y: number){
    let canvas = document.createElement('canvas')
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas)
    let ctxt = canvas.getContext('2d')
    return {ctxt:ctxt,canvas:canvas};
}

export function random(min: number, max: number){
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

export function mod(number: number, modulus: number){
    return ((number%modulus)+modulus)%modulus;
}


export function loadTextFiles(strings:string[]){
    let promises = []
    for(let string of strings){
        let promise = fetch(string)
        .then(resp => resp.text())
        .then(text => text)
        promises.push(promise)
    }
    return Promise.all(promises)
}

export function loadImages(urls:string[]):Promise<HTMLImageElement[]>{
    let promises:Promise<HTMLImageElement>[] = []

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

export function findbestIndex<T>(list:T[], evaluator:(v:T) => number):number {
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

export function string2html(string): HTMLElement {
    let div = document.createElement('div')
    div.innerHTML = string;
    return div.children[0] as HTMLElement;
}


export function lerp(a:number,b:number,r:number):number{
    return a + to(a,b) * r
}

export function to(a:number,b:number):number{
    return b - a;
}

export function swap<T>(arr:T[],a:number = 0,b:number = 1){
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

export function first<T>(arr:T[]):T{
    return arr[0]
}

export function last<T>(arr:T[]):T{
    return arr[arr.length - 1]
}

export function create2DArray<T>(size:Vector,filler:(pos:Vector) => T){
    let result = new Array(size.y)
    for(let i = 0; i < size.y;i++){
        result[i] = new Array(size.x)
    }
    size.loop2d(v => {
        result[v.y][v.x] = filler(v)
    })
    return result
}

export function get2DArraySize(arr:any[][]){
    return new Vector(arr[0].length,arr.length)
}

export function index2D<T>(arr:T[][],i:Vector){
    return arr[i.x][i.y]
}

export function copy2dArray<T>(arr:T[][]){
    return create2DArray(get2DArraySize(arr),pos => index2D(arr,pos))
}

export function round(number,decimals){
    let mul = 10 ** decimals
    return Math.round(number *  mul) / mul
}

export class RNG{
    public mod:number = 4294967296
    public multiplier:number = 1664525
    public increment:number = 1013904223

    constructor(public seed:number){

    }

    next(){
        this.seed = (this.multiplier * this.seed + this.increment) % this.mod
        return this.seed
    }

    norm(){
        return this.next() / this.mod
    }
    
    
    range(min:number,max:number){
        return this.norm() * to(min,max) + min
    }
}


export function shuffle<T>(array:T[],rng:RNG){
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

declare global {
    interface Array<T> {
        remove(index: number):T
        first():T
        last():T
    }
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

