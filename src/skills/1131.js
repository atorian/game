// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    heal,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1131
/** 
Attacks and decreases the Defense for 2 turns with a 75% chance and recovers your HP by 15%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.atk * 7.2),
                debuff(roll, "def_break", 2, 75),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1131, spec.meta, multistep(spec.action))
}
