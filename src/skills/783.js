// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 783
/** 
Attacks a target with a massive magic bullet, dealing damage according to the target's MAX HP. This attack also heals all allies for 30% of the damage dealt. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(783, spec.meta, multistep(spec.action))
}
