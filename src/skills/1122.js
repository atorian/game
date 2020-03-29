// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1122
/** 
Increases the damage inflicted on enemies with harmful effects by 30% and makes an enemy (Boss monsters excluded) oblivious for 2 turns with each attack. Passive skills aren't activated in oblivion state. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy, debuff(roll, "oblivious", 2, 100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1122, spec.meta, multistep(spec.action))
}
