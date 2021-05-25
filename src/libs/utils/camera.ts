import {Vector} from '../vector/vector'

export class Camera{

    pos:Vector = new Vector(0,0)
    scale:Vector = new Vector(1,1)

    constructor(public ctxt:CanvasRenderingContext2D,public screensize:Vector){
        
    }

    begin(){
        this.ctxt.save()
        let m = this.createMatrixScreen2World().inverse()
        this.ctxt.transform(m.a,m.b,m.c,m.d,m.e,m.f)
    }

    end(){
        this.ctxt.restore()
    }

    createMatrixScreen2World(){
        let a = new DOMMatrix([
            1,0,0,1,-this.screensize.x / 2,-this.screensize.y / 2
        ])
        
        let b = new DOMMatrix([
            this.scale.x,0,0,this.scale.y,this.pos.x,this.pos.y
        ])
        

        return b.multiply(a)
    }

    screen2world(pos:Vector):Vector{
        let dompoint = this.createMatrixScreen2World().transformPoint(new DOMPoint(pos.x,pos.y))
        return new Vector(dompoint.x,dompoint.y)
    }

    world2screen(pos:Vector):Vector{
        let dompoint = this.createMatrixScreen2World().inverse().transformPoint(new DOMPoint(pos.x,pos.y))
        return new Vector(dompoint.x,dompoint.y)
    }

}