// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    heal,
    targetSelf,
    onKill,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 983
/** 
Steals life from the enemy. The amount stolen is equivalent to 50% of your MAX HP. You gain another turn if the enemy dies.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.maxHp * undefined),
            ),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.3),
                onKill(additionalTurn(roll, 100)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(983, spec.meta, multistep(spec.action))
}
