// @flow
import type { Ability } from "../index"
import { step, targetEnemy, heal, multistep, GenericSkill } from "../skill"

// skill id: 584
/** 
Attacks with an axe and recovers 20% HP. Additionally, if the enemy dies by this attack, your HP is recovered by 25% of the enemy's MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Target MAX HP
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.atk * 6.1),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(584, spec.meta, multistep(spec.action))
}
