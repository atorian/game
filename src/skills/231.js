// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 231
/** 
Revives all fallen allies with little HP and increases all allies' Attack Speed for 2 turns. Increases the allies' Attack Bar by 30% each according to the no. of revived allies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 7,
        },
    }
    return new GenericSkill(231, spec.meta, multistep(spec.action))
}
