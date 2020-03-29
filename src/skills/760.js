// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    heal,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 760
/** 
Inflicts damage to all enemies with a hole that consumes souls and recovers by 50% of the inflicted damage. Absorbs the enemy's Attack Bar by 15% with a 25% chance for each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemy),
            step(targetEnemy),
            step(targetEnemy),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.5),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(760, spec.meta, multistep(spec.action))
}
