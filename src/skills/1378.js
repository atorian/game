// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1378
/** 
Crushes all enemies and decreases the Attack Bar of each enemy by 30%. The damage of this attack is proportionate to your MAX HP and Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: DEF,MAX HP
        action: [step(targetEnemy, atbDecrease(roll, undefined))],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1378, spec.meta, multistep(spec.action))
}
