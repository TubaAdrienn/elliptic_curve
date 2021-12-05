const BN = require('bn.js');

export class Point{
    public x : any;
    public y: any;

    constructor(x:any,y:any) {
        this.x=x;
        this.y=y;
    }

    clone():Point{
        return new Point(new BN(this.x), new BN(this.y));
    }

    equals(P:Point){
        if (P!=null && this.x.toString() === P.x.toString() 
            && this.y.toString() === P.y.toString()) return true;
        return false;
    }
}

//Point operations
export function double(point : Point, a: any, p:any):Point{
    const center = point.x.pow(new BN(2)).muln(3).addn(a).mul(point.y.muln(2).invm(p)).umod(p);;
    const x = center.pow(new BN(2)).sub(point.x.muln(2)).umod(p);
    const y = center.mul(point.x.sub(x)).sub(point.y).umod(p);

    return new Point(x,y);
}


export function add(P: Point, Q: Point, p: any, a:any) : Point{    
    if (!P && !Q) {
        return null;
    } else if (!P && Q) {
        return Q.clone()
    } else if (!Q && P) {
        return P.clone();
    } else if (P.x.eq(Q.x) && P.y.eq(Q.y)) {
        return double(P, a, p);
    }

    const center = Q.y.sub(P.y).mul(Q.x.sub(P.x).invm(p)).umod(p);
    const xr = center.pow(new BN(2)).sub(P.x).sub(Q.x).umod(p);
    const yr = center.mul(P.x.sub(xr)).sub(P.y).umod(p);

    return new Point(xr,yr);
}

export function multiply(P: Point, n:any, p:any, a:any) {     

    if (n.ltn(2)) {
        return  P.clone();
    }

    const n_bit = n.toString(2);
    let N = P.clone();
    let Q = null;
    
    //for (let i =0; n.gtn(i); i++){
    //    if(!N.equals(Q)) {
    //        Q = this.add(Q,N)
    //    }
    //    else Q = this.double(N);
    // }

    //https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication
    for (let i = n_bit.length - 1; i >= 0; i--) {
        if (n_bit[i] === '1') {
            Q = add(Q, N, p, a);
        }
        N = double(N, a, p);
    }
    return new Point(new BN(Q.x), new BN(Q.y));
}

