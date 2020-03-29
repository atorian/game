// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    heal,
    targetSelf,
    buff,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 678
/** 
Enrages and attacks an enemy target. You instantly recover a turn and prevent this attack from going on cool down with a 40% chance. When this attack is on cool down, your Attack Speed increases and you recover 10% HP every turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: While skill on cooldown
        // fixme: While skill on cooldown
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.atk * 7.6),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", null)),
                additionalTurn(roll, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(678, spec.meta, multistep(spec.action))
}
