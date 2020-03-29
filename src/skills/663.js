// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 663
/** 
Inflicts 12% of my MAX HP as damage when you're attacked with a critical hit and weakens the Defense for 1 turn with every attack. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: FIXME: Passive DMG reflect
        action: [step(targetEnemy, debuff(roll, "def_break", 1, 100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(663, spec.meta, multistep(spec.action))
}
