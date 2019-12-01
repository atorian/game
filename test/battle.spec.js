import { Battle } from "../src/battle";

const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const { assert } = chai;
import { WATER, WIND } from "../src";

describe('Battle', () => {
    it("starts", () => {
        let battle = new Battle("battle-id");

        const slowUnit = {
            id: 'slow-unit-id',
            element: WATER,
            player: 'player-id',
            hp: 1000,
            atk: 100,
            def: 100,
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
            player: 'player-id',
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

        assert.include(battle.units['slow-unit-id'], {
            id: 'slow-unit-id',
            player: 'player-id',
            element: WATER,
            atb: 0,
            currentHP: 1400,
            hp: 1400,
            atk: 160,
            def: 140,
            spd: 115,
            cr: 15,
            cd: 100,
            res: 15,
            acc: 0,
        });

        assert.include(battle.units['fast-unit-id'], {
            id: 'fast-unit-id',
            player: 'player-id',
            element: WIND,
            atb: 0,
            currentHP: 1400,
            hp: 1400,
            atk: 160,
            def: 140,
            spd: 133.4,
            cr: 15,
            cd: 100,
            res: 15,
            acc: 0,
        });

        const nextUnit = battle.next();

        assert.deepEqual(nextUnit, { id: 'fast-unit-id', skills: { 0: 0 } }, 'fastest unit should get a turn');

        battle.cast(0, 'slow-unit-id');

        assert.equal(battle.units['slow-unit-id'].currentHP, 835);
    });
});
