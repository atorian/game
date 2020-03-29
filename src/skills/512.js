// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 512
/** 
Fill the Attack Bar of all allies by 30% and recovers their HP by 30%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 20,
        },
    }
    return new GenericSkill(512, spec.meta, multistep(spec.action))
}
