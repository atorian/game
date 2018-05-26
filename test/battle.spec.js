import {assert} from 'chai';
import {GuildWarBattle} from '../src/battle';
import type {Contestant} from "../src/battle";

describe('GuildWarBattle', () => {
    it('Unit ATB increases accordingly to spd', () => {
        const unitA = {
            player: 'player',
            id: 'abc',
            spd: 110,
            name: 'A',
            skills: [{
                dmg: true,
                target(units, target) {

                },
                strategy: 'single_try'
            }]
        };
        const unitB = {id: 'def', spd: 97, name: 'B', player: 'AI'};
        const battle = new GuildWarBattle(
            [unitA],
            [unitB]
        );

        battle.next();

        assert.equal(battle.unit.name, 'A');
        assert.equal(battle.unit.atb, 0);
    });

    it('skills', () => {
        const skill = {
            target(battlefield: Contestant[], target: Contestant) {
                return [target];
            },
            apply(targets) {

            }
        };

        const events = skill.apply(targets);
        assert.deepInclude(events);
    })
});
