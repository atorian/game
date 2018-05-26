import {assert} from 'chai';
import {HitStrategyFactory} from "../src/battle";

describe('HitStrategyFactory', () => {

    const strategyFactory = new HitStrategyFactory({});

    it('glancing damage reduced by 30%', () => {
        const caster = {
            element: 'wind',
            glancing_chance() {
                return 100;
            },
        };
        const target = {
            element: 'wind',
        };

        const strategy = strategyFactory.create({
            caster,
            battlefield: [caster, target],
            target,
            // skill: Skill, // todo: add skill here
            additional_dmg: 0,
            additional_chance: 0
        });

        assert.equal(strategy.name, 'glancing_hit');
        assert.equal(strategy.apply(100), 70);
    });

    it('glancing dmg with attribute disadvantage additionally reduced by 16%', () => {
        const caster = {
            element: 'wind',
            glancing_chance() {
                return 100;
            },
        };
        const target = {
            element: 'fire',
        };

        const [type, strategy] = strategy.create({
            caster,
            battlefield: [caster, target],
            target,
            // skill: Skill, // todo: add skill here
            additional_dmg: 0,
            additional_chance: 0
        });

        assert.equal(type, 'glancing_hit');
        assert.equal(strategy(100), 54);
    });
});
