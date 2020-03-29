// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    heal,
    cleanse,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1080
/** 
Calls upon the holy power of light, healing all allies by 15% of their HP and also removing 2 harmful effects from each ally. Light attribute allies will receive doubled amount of healing. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
                cleanse(2),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 30,
        },
    }
    return new GenericSkill(1080, spec.meta, multistep(spec.action))
}
