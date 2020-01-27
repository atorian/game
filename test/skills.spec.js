// @flow
import { assert } from 'chai';
import { before } from 'mocha'
import { DARK, FIRE, LIGHT, WATER, WIND } from '../src';
import { Elements, GenericSkill, simpleAtkDmg, step, targetEnemy, debuf } from '../src/skills';
import Contestant from '../src/contestant';
import Battle from '../src/battle';

describe('Element Advantage', () => {
    it('fire has advantage over wind', () => {
        assert.isTrue(Elements.hasAdvantage({ element: FIRE }, { element: WIND }))
    });
    it('water has advantage over fire', () => {
        assert.isTrue(Elements.hasAdvantage({ element: WATER }, { element: FIRE }))
    });
    it('wind has advantage over water', () => {
        assert.isTrue(Elements.hasAdvantage({ element: WIND }, { element: WATER }))
    });
    it('light has advantage over dark', () => {
        assert.isTrue(Elements.hasAdvantage({ element: LIGHT }, { element: DARK }))
    });
    it('dark has advantage over light', () => {
        assert.isTrue(Elements.hasAdvantage({ element: DARK }, { element: LIGHT }))
    });
    it('fire has disadvantage over water', () => {
        assert.isTrue(Elements.hasDisadvantage({ element: FIRE }, { element: WATER }))
    });
    it('wind has disadvantage over fire', () => {
        assert.isTrue(Elements.hasDisadvantage({ element: WIND }, { element: FIRE }))
    });
    it('water has disadvantage over wind', () => {
        assert.isTrue(Elements.hasDisadvantage({ element: WATER }, { element: WIND }))
    });
    it('water is neutral to water, light and dark', () => {
        [WATER, LIGHT, DARK].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: WATER }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: WATER }, { element }));
        });
    });
    it('fire is neutral to fire, light and dark', () => {
        [FIRE, LIGHT, DARK].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: FIRE }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: FIRE }, { element }));
        });
    });
    it('wind is neutral to wind, light and dark', () => {
        [WIND, LIGHT, DARK].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: WIND }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: WIND }, { element }));
        });
    });
    it('light is neutral to wind, fire and water', () => {
        [WIND, FIRE, WATER].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: LIGHT }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: LIGHT }, { element }));
        });
    });
    it('dark is neutral to wind, fire and water', () => {
        [WIND, FIRE, WATER].forEach(element => {
            assert.isFalse(Elements.hasAdvantage({ element: DARK }, { element }));
            assert.isFalse(Elements.hasDisadvantage({ element: DARK }, { element }));
        });
    });
});

describe('Generic Skill', () => {

    let battle: Battle;

    before(() => {
        battle = new Battle('test');
    });

    it('casts dmg to target', () => {
        const skill = new GenericSkill(
            0,
            {
                dmg: 0.3,
                effect: 0.35,
                cooldown: 0,
            },
            step(
                targetEnemy,
                simpleAtkDmg(() => 1),
                debuf(()=>100,'stun', 2),
            ),
        );

        const target = new Contestant(battle, {
            id: 'target-id',
            player: 'player-1',
            element: 'wind',
            hp: 1000,
            atk: 100,
            def: 100,
            spd: 100,
            cr: 15,
            cd: 75,
            res: 15,
            acc: 0,
            skills: [1],
        }, [skill]);
        const caster = new Contestant(battle, {
            id: 'caster-id',
            player: 'player-2',
            element: 'wind',
            hp: 1000,
            atk: 100,
            def: 100,
            spd: 100,
            cr: 15,
            cd: 75,
            res: 15,
            acc: 0,
            skills: [1],
        }, [skill]);

        battle.units = {
            [caster.id]: caster,
            [target.id]: target,
        };

        skill.cast(caster, 'target-id', [caster, target]);

        assert.deepEqual(battle.units['target-id'].currentHP, 579);
        assert.deepEqual(battle.units['target-id'].effects.elements, [{name: 'stun', duration: 2}]);
    });
});

describe('debuf', () => {
    const battle = null;
    const target = new Contestant(battle, {
        id: 'target-id',
        player: 'player-1',
        element: 'wind',
        hp: 1000,
        atk: 100,
        def: 100,
        spd: 100,
        cr: 15,
        cd: 75,
        res: 0,
        acc: 0,
        skills: [1],
    }, []);
    const caster = new Contestant(battle, {
        id: 'caster-id',
        player: 'player-2',
        element: 'wind',
        hp: 1000,
        atk: 100,
        def: 100,
        spd: 100,
        cr: 15,
        cd: 75,
        res: 15,
        acc: 100,
        skills: [1],
    }, []);

    it('adds effect', () => {
        const mechanic = debuf(() => 100, 'any-effect', 2);
        let ctx = { effectsAdded:[] };

        assert.deepEqual(mechanic(caster, target, { effect: 0, dmg: 0 }, ctx), {
            effectsAdded:[{name:'any-effect', duration:2}],
        });
    });
});
