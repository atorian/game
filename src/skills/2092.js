// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 2092
/** 
Decreases the current HP of the enemy target (bosses excluded) by 10% for every Knowledge you have. If you have 5 Knowledge, decreases the target's MAX HP by 50% instead. After that, heals all allies by the decreased HP. This skill can be used when you have at least 1 Knowledge, and all Knowledge will be consumed once you use the skill. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 72
        // fixme: If used at 5 Knowledge
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2092, spec.meta, multistep(spec.action))
}
