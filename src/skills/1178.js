// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1178
/** 
Attacks with an extreme chill to inflict damage that's proportionate to the enemy's MAX HP and freezes the enemy for 1 turn if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 4.5 + target.maxHp * 0.08,
                ),
                debuff(roll, "freeze", null, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1178, spec.meta, multistep(spec.action))
}
