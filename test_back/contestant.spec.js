import BattleState, {Bernard, Contestant, DefBreak, DefBuf, IgnoreDefDmg} from '../scatch/BattleState';
import {assert} from 'chai';

// todo: implement Skill class
// todo: violent procs
// todo: def break
// todo: slow, attack buf, speed buf, etc
describe('Contestant', () => {
    it('inits with current unit stats and empty ATB', () => {
        const base = new Bernard();

        // new pvp battle
        const bernard = new Contestant(base);

        assert.equal(bernard.hp, base.hp);
        assert.equal(bernard.atb, 0);
    });

    it('applies dmg', () => {
        const base = new Bernard();

        // new pvp battle
        const bernard = new Contestant(base);

        const nextBernard = bernard.apply([new IgnoreDefDmg(100)]);

        assert.equal(nextBernard.hp, 0);
    });

    it('counterattacks', () => {
        const bernard = new Contestant(new Bernard(), {
            effects:['counterattack']
        });

        const nextBernard = bernard.apply([new IgnoreDefDmg(1)]);

        console.log(nextBernard);
        assert.equal(nextBernard.action, 'counterattack');
    });

    it('DEF break', () => {
        const bernard = new Contestant(new Bernard());

        const nextBernard = bernard.apply([new DefBreak(2)]);

        console.log(nextBernard);
        assert.equal(nextBernard.def, 30);
    });

    it('DEF buf', () => {
        const bernard = new Contestant(new Bernard());

        const nextBernard = bernard.apply([new DefBuf(2)]);

        assert.equal(nextBernard.def, 170);
    });

    it('DEF buf and break together', () => {
        const bernard = new Contestant(new Bernard());

        const nextBernard = bernard.apply([
            new DefBuf(2),
            new DefBreak(2),
        ]);

        assert.equal(nextBernard.def, 100);
    });

});
