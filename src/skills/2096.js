// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 2096
/** 
Absorbs 25% (10% instead if it's a Boss) of your Attack Power and Defense per Knowledge from the enemy target's Attack Power and Defense. In addition, if you have 5 Knowledge, steals all beneficial effects granted on the enemy and instantly gains another turn. This skill can be used when you have at least 1 Knowledge, and all Knowledge will be consumed once you use the skill. (Accumulates up to 10 times) 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 72
        // fixme: If used at 5 Knowledge
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2096, spec.meta, multistep(spec.action))
}
