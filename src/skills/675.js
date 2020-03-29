// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    heal,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 675
/** 
Attacks the enemy 2 times, with each strike having a 75% chance to steal 1 beneficial effect from the enemy. Absorbs the Attack Bar by 50% each if you attack the enemy with no beneficial effects. When this attack is on cool down, your Attack Speed increases and you recover 10% HP every turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If skill on cooldown
        // fixme: If target has no beneficial effects
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.atk * 4),
            ),
            step(
                targetEnemy,
                heal((self, target) => self.atk * 4),
            ),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.1),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(675, spec.meta, multistep(spec.action))
}
