// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    heal,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 920
/** 
Recovers all allies by 20% of my MAX HP and increases the Attack Power for 2 turns.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("atk", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 25,
        },
    }
    return new GenericSkill(920, spec.meta, multistep(spec.action))
}
