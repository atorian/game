// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 2095
/** 
If an ally is attacked by an enemy, uses one of your Knowledge to heal the ally by 35% of the damage received. If you have 5 Knowledge, the ally will be healed by 70% of the damage received. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 72
        // fixme: If 5 knowledge
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
            recovery: 20,
        },
    }
    return new GenericSkill(2095, spec.meta, multistep(spec.action))
}
