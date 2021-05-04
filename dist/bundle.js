(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    class Vector {
        constructor(...vals) {
            this.vals = vals;
        }
        map(callback) {
            for (var i = 0; i < this.vals.length; i++) {
                callback(this.vals, i);
            }
            return this;
        }
        mul(v) {
            return this.map((arr, i) => arr[i] *= v.vals[i]);
        }
        div(v) {
            return this.map((arr, i) => arr[i] /= v.vals[i]);
        }
        floor() {
            return this.map((arr, i) => arr[i] = Math.floor(arr[i]));
        }
        ceil() {
            return this.map((arr, i) => arr[i] = Math.ceil(arr[i]));
        }
        round() {
            return this.map((arr, i) => arr[i] = Math.round(arr[i]));
        }
        add(v) {
            return this.map((arr, i) => arr[i] += v.vals[i]);
        }
        sub(v) {
            return this.map((arr, i) => arr[i] -= v.vals[i]);
        }
        scale(s) {
            return this.map((arr, i) => arr[i] *= s);
        }
        length() {
            var sum = 0;
            this.map((arr, i) => sum += arr[i] * arr[i]);
            return Math.pow(sum, 0.5);
        }
        normalize() {
            return this.scale(1 / this.length());
        }
        to(v) {
            return v.c().sub(this);
        }
        lerp(v, weight) {
            return this.c().add(this.to(v).scale(weight));
        }
        c() {
            return Vector.fromArray(this.vals.slice());
        }
        overwrite(v) {
            return this.map((arr, i) => arr[i] = v.vals[i]);
        }
        dot(v) {
            var sum = 0;
            this.map((arr, i) => sum += arr[i] * v.vals[i]);
            return sum;
        }
        loop(callback) {
            var counter = this.c();
            counter.vals.fill(0);
            while (counter.compare(this) == -1) {
                callback(counter);
                if (counter.incr(this)) {
                    break;
                }
            }
        }
        compare(v) {
            for (var i = this.vals.length - 1; i >= 0; i--) {
                if (this.vals[i] < v.vals[i]) {
                    continue;
                }
                else if (this.vals[i] == v.vals[i]) {
                    return 0;
                }
                else {
                    return 1;
                }
            }
            return -1;
        }
        incr(comparedTo) {
            for (var i = 0; i < this.vals.length; i++) {
                if ((this.vals[i] + 1) < comparedTo.vals[i]) {
                    this.vals[i]++;
                    return false;
                }
                else {
                    this.vals[i] = 0;
                }
            }
            return true;
        }
        project(v) {
            return v.c().scale(this.dot(v) / v.dot(v));
        }
        get(i) {
            return this.vals[i];
        }
        set(i, val) {
            this.vals[i] = val;
        }
        get x() {
            return this.vals[0];
        }
        get y() {
            return this.vals[1];
        }
        get z() {
            return this.vals[2];
        }
        set x(val) {
            this.vals[0] = val;
        }
        set y(val) {
            this.vals[1] = val;
        }
        set z(val) {
            this.vals[2] = val;
        }
        draw(ctxt) {
            var width = 10;
            var halfwidth = width / 2;
            ctxt.fillRect(this.x - halfwidth, this.y - halfwidth, width, width);
        }
        cross(v) {
            var x = this.y * v.z - this.z * v.y;
            var y = this.z * v.x - this.x * v.z;
            var z = this.x * v.y - this.y * v.x;
            return new Vector(x, y, z);
        }
        static fromArray(vals) {
            var x = new Vector();
            x.vals = vals;
            return x;
        }
        loop2d(callback) {
            var counter = new Vector(0, 0);
            for (counter.x = 0; counter.x < this.x; counter.x++) {
                for (counter.y = 0; counter.y < this.y; counter.y++) {
                    callback(counter);
                }
            }
        }
        loop3d(callback) {
            var counter = new Vector(0, 0, 0);
            for (counter.x = 0; counter.x < this.x; counter.x++) {
                for (counter.y = 0; counter.y < this.y; counter.y++) {
                    for (counter.z = 0; counter.z < this.z; counter.z++) {
                        callback(counter);
                    }
                }
            }
        }
    }
    // (window as any).devtoolsFormatters = [
    //     {
    //         header: function(obj, config){
    //             if(!(obj instanceof Vector)){
    //                 return null
    //             }
    //             if((obj.vals.length == 2)){
    //                 return ["div",{style:""}, `x:${obj.x} y:${obj.y}`]
    //             }
    //             if((obj.vals.length == 3)){
    //                 return ["div",{style:""}, `x:${obj.x} y:${obj.y} z:${obj.z}`]
    //             }
    //         },
    //         hasBody: function(obj){
    //             return false
    //         },
    //     }
    // ]

    function createCanvas(x, y) {
        var canvas = document.createElement('canvas');
        canvas.width = x;
        canvas.height = y;
        document.body.appendChild(canvas);
        var ctxt = canvas.getContext('2d');
        return { ctxt: ctxt, canvas: canvas };
    }
    var lastUpdate = Date.now();
    function loop(callback) {
        var now = Date.now();
        callback((now - lastUpdate) / 1000);
        lastUpdate = now;
        requestAnimationFrame(() => {
            loop(callback);
        });
    }
    var keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    var screensize = new Vector(document.documentElement.clientWidth, document.documentElement.clientHeight);
    var crret = createCanvas(screensize.x, screensize.y);
    var ctxt = crret.ctxt;
    loop((dt) => {
        ctxt.clearRect(0, 0, screensize.x, screensize.y);
        ctxt.fillRect(10, 10, 10, 10);
    });

})));
//# sourceMappingURL=bundle.js.map
