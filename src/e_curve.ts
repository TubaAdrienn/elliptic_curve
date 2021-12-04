const BN = require('bn.js');
const crypto = require('crypto');

export class ECurve{

    private sk : any;
    public pk: any;

    constructor(private curve: any, sk: any){
        this.sk = sk;
        this.generatePK();
    }

    getPk(){
        return this.pk;
    }

    generatePK(){
        let G = this.curve.G;
        this.pk = this.multiply(G, this.sk);
    }

    sign(k:any, msg: any){
        let q = this.curve.q;

        if(!k){
            do {
                k = new BN(crypto.randomBytes(3));
            } while (k.gte(q))
        }

        const R = this.multiply(this.curve.G, k)
        const s = k.invm(q).mul(msg.add(this.sk.mul(R.x))).mod(q);

        return new Point(R.x, s);
    }

    verify(sign: Point, msg:any){
        //Helpers
        const p = this.curve.p;
        const q = this.curve.q;
        const w = sign.y.invm(q)

        //U1 and U2
        const u1 = w.mul(msg).mod(q);
        const u2 = w.mul(sign.x).mod(q);

        //P computing
        const uG = this.multiply(this.curve.G, u1);
        const uB = this.multiply(this.pk, u2);
        const P = this.add(uG, uB);

        const Pxmod = P.x.mod(p).toString('hex');
        const rmod = sign.x.mod(p).toString('hex');
        const valid = Pxmod === rmod;
        console.log("P_x mod: "+Pxmod + "\tr mod: "+rmod);
        return valid;
    }

    //Curve operations
    double(point : Point):Point{
        let a = this.curve.a;
        let p = this.curve.p;

        const center = point.x.pow(new BN(2)).muln(3).addn(a).mul(point.y.muln(2).invm(p)).umod(p);;
        const x = center.pow(new BN(2)).sub(point.x.muln(2)).umod(p);
        const y = center.mul(point.x.sub(x)).sub(point.y).umod(p);

        return new Point(x,y);
    }

    add(P: Point, Q: Point) : Point{
        const p = this.curve.p;
        
        if (!P && !Q) {
            return null;
        } else if (!P && Q) {
            return Q.clone()
        } else if (!Q && P) {
            return P.clone();
        } else if (P.x.eq(Q.x) && P.y.eq(Q.y)) {
            return this.double(P);
        }

        const center = Q.y.sub(P.y).mul(Q.x.sub(P.x).invm(p)).umod(p);
        const xr = center.pow(new BN(2)).sub(P.x).sub(Q.x).umod(p);
        const yr = center.mul(P.x.sub(xr)).sub(P.y).umod(p);

        return new Point(xr,yr);
    }
    

    
    multiply(P: Point, n:any) {     

        if (n.ltn(2)) {
            return  P.clone();
        }

        const bin = n.toString(2);

        let N = P.clone();
        let Q = null;

        for (let i = bin.length - 1; i >= 0; i--) {
            if (bin[i] === '1') {
                Q = this.add(Q, N);
            }
            N = this.double(N);
        }
        return new Point(new BN(Q.x), new BN(Q.y));

    }
}

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
}