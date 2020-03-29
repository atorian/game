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

// skill id: 995
/** 
Attacks all enemies with a fire pillar and disturbs their HP recovery for 2 turns with a 50% chance. Additionally, this attack will heal an ally with the lowest HP by 25%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Party member with lowest HP
        action: [
            step(
                targetAlly,
                heal((self, target) => self.atk * 2.8),
                debuff(roll, "heal_block", 2, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(995, spec.meta, multistep(spec.action))
}
