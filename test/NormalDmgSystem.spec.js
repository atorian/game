import {assert} from 'chai';
import type {Contestant, ActionContext} from "../src/battle";
import {EnemyDmgSystem, Multiplier} from "../src/mechanics/enemy-damage";

describe('SingleTargetDmgSystem', () => {

    const hitStrategyFactory = {
        create() {
            // test strategy
            return {
                name: 'test',
                apply() {
                    return 100;
                }
            }
        }
    };

    const system = new EnemyDmgSystem(
        hitStrategyFactory,
        new Multiplier(),
    );

    it('should apply dmg reduced by target def', () => {
        const unit: Contestant = {
            atk: 100
        };

        const context: ActionContext = {
            caster: unit,
            units: [],
            target: {
                id: 'target_id',
                name: 'target_name',
                hp: 100,
                def: 100,
            }
        };

        const step = {
            enemy_dmg: 'self.atk * 2',
        };

        const events = system.apply(context, step);

        assert.deepInclude(events, {
            name: 'hit',
            payload: {
                target: 'target_id',
                type: 'test',
                damage: 99
            }
        });
    });
    it('ignore def dmg should not be affected by def', () => {
        const unit: Contestant = {
            atk: 100
        };

        const context: ActionContext = {
            caster: unit,
            units: [],
            target: {
                id: 'target_id',
                name: 'target_name',
                hp: 100,
                def: 100,
            }
        };

        const step = {
            enemy_dmg: {
                multiplier: 'self.atk * 1',
                ignore_def: true,
            },
        };

        const events = system.apply(context, step);

        assert.deepInclude(events, {
            name: 'hit',
            payload: {
                target: 'target_id',
                type: 'test',
                damage: 100
            }
        });
    });
    it('aoe attack should affect all enemies', () => {
        const unit: Contestant = {
            atk: 100,
            player: 1
        };

        const target = {
            id: 'target_id',
            name: 'target_name',
            hp: 100,
            def: 100,
            player: 2
        };

        const context: ActionContext = {
            caster: unit,
            units: [
                unit,
                {
                    ...unit,
                    id: 'other_ally'
                },
                target,
                {
                    id: 'other_enemy',
                    name: 'target_name',
                    hp: 100,
                    def: 100,
                    player: 2,
                }
            ],
            target: {
                id: 'target_id',
                name: 'target_name',
                hp: 100,
                def: 100,
            }
        };

        const step = {
            enemy_dmg: {
                multiplier: 'self.atk * 1',
                aoe: true
            },
        };

        const events = system.apply(context, step);

        assert.lengthOf(events, 2);
        assert.deepInclude(events, {
            name: 'hit',
            payload: {
                target: 'target_id',
                type: 'test',
                damage: 100
            }
        });
        assert.deepInclude(events, {
            name: 'hit',
            payload: {
                target: 'other_target',
                type: 'test',
                damage: 100
            }
        });
    });
});
