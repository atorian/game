import { Battle } from "../src/battle";

const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const { assert } = chai;
import { WATER, WIND } from "../src";
import Contestant from "../src/contestant";

describe('Battle', () => {
    it("starts", () => {
        let battle = new Battle("battle-id");

        const slowUnit = {
            id: 'slow-unit-id',
            element: WATER,
            player: 'looser',
            hp: 1,
            atk: 100,
            def: 1,
            spd: 100,
            cr: 15,
            cd: 50,
            res: 15,
            acc: 0,
            skills: [1]
        };
        const fastUnit = {
            id: 'fast-unit-id',
            element: WIND,
            player: 'winner',
            hp: 1000,
            atk: 100,
            def: 100,
            spd: 116,
            cr: 15,
            cd: 50,
            res: 15,
            acc: 0,
            skills: [1]
        };

        battle.start([slowUnit], [fastUnit], Battle.GUILD_BATTLE);

        assert.deepEqual(battle.type, Battle.GUILD_BATTLE);

        assert.instanceOf(battle.units['fast-unit-id'], Contestant);
        assert.instanceOf(battle.units['slow-unit-id'], Contestant);

        const nextUnit = battle.next();

        assert.deepEqual(nextUnit, { id: 'fast-unit-id', skills: { 0: 0 } }, 'fastest unit should get a turn');

        battle.cast(nextUnit.skills[0], 'slow-unit-id');

        assert.equal(battle.units['slow-unit-id'].currentHP, 0);
        assert.equal(battle.ended, true);
        assert.equal(battle.winner, 'winner');
    });
});
