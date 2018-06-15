import {assert} from 'chai';
import {Battle, contestant} from '../src/domain/battle';
import {slime, bernard} from '../src/units';

describe('Battle', () => {
    it('Unit ATB increases accordingly to spd', () => {
        const battle = new Battle(
            [contestant(slime)],
            [contestant(bernard)]
        );

        battle.next();

        assert.equal(battle.unit.name, 'Bernard');
        assert.equal(battle.unit.atb, 0);
    });
});
