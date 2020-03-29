// @flow
import type { Ability } from "../index"
import { step, targetAlly, buff, multistep, GenericSkill } from "../skill"

// skill id: 1217
/** 
Reflects 30% of damage back to the enemy whenever you're attacked. Inflicts additional damage that's proportionate to the damage that another ally received from the enemy when you attack during your turn. The amount of additional damage you inflicted will reset after the attack. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: FIXME: Passive DMG reflect
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("reflectDmg", 2)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1217, spec.meta, multistep(spec.action))
}
