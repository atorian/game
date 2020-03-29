// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 2010
/** 
Attacks an enemy to inflict damage that increases according to your MAX HP and recovers 30% of the inflicted damage as HP. In addition, when used in Beast Form, the damage you inflict will be increased by 20% and then transforms into Druid Form. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(2010, spec.meta, multistep(spec.action))
}
