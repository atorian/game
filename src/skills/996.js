// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    heal,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 996
/** 
Attacks all enemies with a burst of water pillar and increases their chance of Glancing Hits for 2 turns with a 50% chance. Additionally, this attack will heal an ally with the lowest HP by 25%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Party member with lowest HP
        action: [
            step(
                targetAlly,
                heal((self, target) => self.atk * 2.8),
                debuff(roll, "glancing", 2, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(996, spec.meta, multistep(spec.action))
}
