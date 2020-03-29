// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1464
/** 
Launches a reckless attack that damages the enemy by 70% of its HP at the cost of receiving the same amount of damage. The damage can't exceed your current HP, and the effect will be reduced to 15% against Boss enemies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: Target MAX HP
        action: [step(targetEnemy), step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1464, spec.meta, multistep(spec.action))
}
