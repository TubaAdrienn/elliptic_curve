import {Point, add, multiply} from './point' 
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
        this.pk = multiply(G, this.sk, this.curve.p, this.curve.a);
    }

    sign(k:any, msg: any){
        let q = this.curve.q;

        if(!k){
            do {
                k = new BN(crypto.randomBytes(3));
            } while (k.gte(q))
        }

        const R = multiply(this.curve.G, k,this.curve.p, this.curve.a)
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
        const uG = multiply(this.curve.G, u1,this.curve.p, this.curve.a);
        const uB = multiply(this.pk, u2,this.curve.p, this.curve.a);
        const P = add(uG, uB, this.curve.p, this.curve.a);

        const Pxmod = P.x.mod(p).toString('hex');
        const rmod = sign.x.mod(p).toString('hex');
        const valid = Pxmod === rmod;
        console.log("P_x mod: "+Pxmod + "\tr mod: "+rmod);
        return valid;
    }
}
