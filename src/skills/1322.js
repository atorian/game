// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1322
/** 
Slams the body with the enemy at the cost of 10% of your current HP, dealing 20% of your MAX HP to the enemy as damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy), step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1322, spec.meta, multistep(spec.action))
}
