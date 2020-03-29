// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 1340
/** 
Removes all harmful effects on all allies and recovers their HP by 30% of your MAX HP. Revives all dead allies with 30% HP if there's any defeated ally but the skill cooldown will be increased by 2 turns for each revived ally.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 20,
        },
    }
    return new GenericSkill(1340, spec.meta, multistep(spec.action))
}
