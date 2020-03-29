// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    debuff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1164
/** 
Inflicts Continuous Damage for 2 turns to the target enemy and sets up a bomb to blow up after 2 turns. Instantly gains another turn after using this skill. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                debuff(roll, "dot", 2, 100),
                debuff(roll, "bomb", 2, 100),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1164, spec.meta, multistep(spec.action))
}
