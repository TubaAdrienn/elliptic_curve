import { Point } from "./e_curve";

const BN = require('bn.js');

export class curve
{
    public a = 0;
    public b = 7;
    public G = new Point(new BN('79BE667E F9DCBBAC 55A06295 CE870B07 029BFCDB 2DCE28D9 59F2815B 16F81798'.toLowerCase().replace(/\s/g, ''), 'hex'), 
                    new BN('483ADA77 26A3C465 5DA4FBFC 0E1108A8 FD17B448 A6855419 9C47D08F FB10D4B8'.toLowerCase().replace(/\s/g, ''), 'hex'));
    public p = new BN('FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE FFFFFC2F'.toLowerCase().replace(/\s/g, ''), 'hex');
    public q = new BN('FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE BAAEDCE6 AF48A03B BFD25E8C D0364141'.toLowerCase().replace(/\s/g, ''), 'hex');
};


export class test_curve
{
    public a = 2;
    public b = 2;
    public p = new BN(17);
    public G = new Point(new BN(5),new BN(1));
};