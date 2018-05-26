import {assert} from 'chai';
import type {Contestant, ActionContext} from "../src/battle";
import {SingleTargetDmgSystem, Multiplier} from "../src/battle";

describe('SingleTargetDmgSystem', () => {

    const hitStrategyFactory = {
        create() {
            // test strategy
            return  {
                name: 'test',
                calc() {
                    return 100;
                }
            }
        }
    };

    const system = new SingleTargetDmgSystem(
        hitStrategyFactory,
        new Multiplier(),
    );

    it('should apply dmg reduced by target def', () => {
        const unit: Contestant = {
            atk: 100
        };

        const context: ActionContext = {
            caster: unit,
            units:[],
            target: {
                id: 'target_id',
                name: 'target_name',
                hp: 100,
                def: 100,
            }
        };

        const step = {
            target_dmg: 'self.atk * 2',
        };

        const events = system.apply(context, step);

        assert.deepInclude(events, {
            name: 'test',
            payload: {
                target: 'target_id',
                damage: 99
            }
        });
    })
});
