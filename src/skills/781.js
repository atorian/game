// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 781
/** 
Attacks the enemy target 2 times and attacks all enemies on the 3rd attack to inflict damage that's proportionate to the enemy's MAX HP. Decreases the Attack Bar by 30% each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 1 + target.maxHp * 0.06,
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(781, spec.meta, multistep(spec.action))
}
