import BattleState, {AttackAndGetATurn, Bernard, Contestant, Frog, SimpleAttack, Unit} from '../scatch/BattleState';
import {assert} from 'chai';

// todo: add player
// todo: violent procs
// todo: def break
// todo: slow, attack buf, speed buf, etc
describe('BattlingState', () => {
    it('Unit ATB increases accordingly to spd', () => {
        const bernard = new Contestant(new Bernard());
        const frog = new Contestant(new Frog());

        const state = new BattleState([bernard, frog]);
        const next = state.next();

        assert.equal(next.currentUnit.atb, 0, 'ATB must be reset when unit gets a turn');
        assert.equal(next.currentUnit.name, 'Bernard');
        assert.equal(next.units[1].atb, 10)
    });

    it('Slow unit accumulates ATB with turns', () => {
        const bernard = new Contestant(new Bernard());
        const frog = new Contestant(new Frog());

        const state = new BattleState([bernard, frog]);
        const firstTurn = state.next();
        const secondTurn = firstTurn.next();
        assert.equal(secondTurn.units[1].atb, 20)
    });

    it('applies skill to a target', () => {
        const bernard = new Contestant(new Bernard());
        const frog = new Contestant(new Frog());

        const state = new BattleState([bernard, frog]);
        const next = state.apply(bernard.skills[0], [frog]);

        assert.equal(next.units[1].hp, 0);
    });

    it('collects unit actions', () => {
        const bernard = new Contestant(new Bernard());
        const frog = new Contestant(new Frog(), {
            hp: 10000,
            effects:['counterattack']
        });

        const state = new BattleState([bernard, frog]);
        const next = state.apply(bernard.skills[0], [frog]);

        // todo: add real action
        assert.include(next.actions, 'counterattack');
    });

    it('grants another turn immediately', () => {
        const base = new Bernard();
        base.skills[1] = {create(unit) {
                return new AttackAndGetATurn(unit)
        }};
        const bernard = new Contestant(base);
        const frog = new Contestant(new Frog());

        const state = new BattleState([bernard, frog]);
        const next = state.apply(bernard.skills[1], [frog]);

        assert.include(next.currentUnit.name, 'Bernard');
    });

});
