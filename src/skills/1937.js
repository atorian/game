// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1937
/** 
When the battle begins, balances the Defense and Attack Power so that the stat with the lower value will have the same value as the stat with the higher value. Creates a shield that's equivalent to your Defense for 2 turns when you get attacked, and the damage you inflict on an enemy will be increased by 30% when you have a shield. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1937, spec.meta, multistep(spec.action))
}
