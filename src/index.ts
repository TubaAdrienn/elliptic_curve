import {ECurve, Point} from './e_curve'
import { curve,test_curve } from './curve';
const BN = require('bn.js');
const crypto = require('crypto');
const ECTest = require('elliptic').ec;

function hash (obj:any) {
    return new BN(crypto.createHash('sha256').update(JSON.stringify(obj)).digest());
}

//Test Run 
console.log('-------------------------------------Test For Utilities-------------------------------------');
const sk_test = new BN(1);
const cryp_test = new ECurve(new test_curve(), sk_test);

const point1 = new Point(new BN(5),new BN(1))
const point2 = new Point(new BN(6),new BN(3))

const add = cryp_test.add(point1,point2);

console.log("Addition test (value should be (10,6)):")
console.log("( "+add.x.toNumber() + " , "+add.y.toNumber()+" )");

const double = cryp_test.double(point1);

console.log("Doubling test (value should be (6,3)):")
console.log("( "+double.x.toNumber() + " , "+double.y.toNumber()+" )");

let mult = cryp_test.multiply(point1, new BN(1))
console.log("Multiplying test (value should be (5,1)):")
console.log("( "+mult.x.toNumber() + " , "+mult.y.toNumber()+" )");

mult = cryp_test.multiply(point1, new BN(2))
console.log("Multiplying test (value should be (6,3)):")
console.log("( "+mult.x.toNumber() + " , "+mult.y.toNumber()+" )");

mult = cryp_test.multiply(point1, new BN(18))
console.log("Multiplying test (value should be (5,16)):")
console.log("( "+mult.x.toNumber() + " , "+mult.y.toNumber()+" )");

const sk = new BN(crypto.randomBytes(32));
const msg = hash({ secret: 'xxx' });
const k = new BN(1234567890);

//Normal Run
console.log('-------------------------------------Test for Normal Run-------------------------------------');
const cryp = new ECurve(new curve(), sk);
const pk = cryp.getPk();
const sign = cryp.sign(k, msg);
const verify = cryp.verify(sign,msg);

const ec2 = new ECTest('secp256k1');
const keyPair = ec2.keyFromPrivate(sk.toBuffer());
const signature2 = keyPair.sign(msg, { k: () => k });
const verify2 = keyPair.verify(msg, signature2);

console.log('-------------------------------------Private Key-------------------------------------');
console.log('Private Key is : '+ sk.toString('hex'));
console.log('-------------------------------------Public Key-------------------------------------');
console.log('#1: x:', pk.x, '\ty:', pk.y);
console.log('#2: x:', keyPair.getPublic().getX().toString('hex'), '\ty:', keyPair.getPublic().getY().toString('hex'));
console.log('-------------------------------------Signature-------------------------------------');
console.log('#1: r:', sign.x, '\ts:', sign.y);
console.log('#2: r:', signature2.r.toString('hex'), '\ts:', signature2.s.toString('hex'))
console.log('-------------------------------------Verification-------------------------------------');
console.log('#1: s:', verify);
console.log('#2: s:', verify2);
