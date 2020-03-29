// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 511
/** 
Deals damage proportionate to your Defense to the enemy target. If the target dies, you instantly gain another turn. The damage also increases as the enemy's HP status decreases. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: DEF,Target Current HP %
        action: [step(targetEnemy)],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(511, spec.meta, multistep(spec.action))
}
