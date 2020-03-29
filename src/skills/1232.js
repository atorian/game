// @flow
import type { Ability } from "../index"
import { step, targetEnemies, multistep, GenericSkill } from "../skill"

// skill id: 1232
/** 
Attacks deal 50% increased damage on enemies are under harmful effects. Also, attacks will deal 50% increased damage on enemies that do not have any beneficial effects. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Additional 50% if no buffs too
        action: [step(targetEnemies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1232, spec.meta, multistep(spec.action))
}
