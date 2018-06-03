import {assert} from 'chai';
import {HitStrategyFactory} from "../src/mechanics/enemy-damage";
import bernard from '../src/units/bernard';

describe('HitStrategyFactory', () => {

    const strategyFactory = new HitStrategyFactory(
        () => 30,
    );

    it('glancing damage reduced by 30%', () => {
        const caster = {
            ...bernard,
            glancing_mod: 100,
        };
        const target = {
            element: 'wind',
        };

        const strategy = strategyFactory.create({
            caster,
            battlefield: [caster, target],
            target,
            skill: caster.skills[0], // todo: add skill here
        });

        assert.equal(strategy.name, 'glancing');
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

        const strategy = strategyFactory.create({
            caster,
            battlefield: [caster, target],
            target,
            // skill: Skill, // todo: add skill here
            additional_dmg: 0,
            additional_chance: 0
        });

        assert.equal(strategy.name, 'glancing');
        assert.equal(strategy.apply(100), 54);
    });
});
