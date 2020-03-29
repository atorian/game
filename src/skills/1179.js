// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1179
/** 
Attacks all enemies with an exploding ice volcano, inflicting damage based on their MAX HP and decreasing their Attack Power for 2 turns. Freezes them for 1 turn if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 3 + target.maxHp * 0.12,
                ),
                debuff(roll, "atk_break", 2, 100),
                debuff(roll, "freeze", null, null),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1179, spec.meta, multistep(spec.action))
}
