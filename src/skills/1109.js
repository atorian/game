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

// skill id: 1109
/** 
Attacks all enemies 2 times to decrease the Defense and disturbs the HP recovery for 2 turns with each attack. Additionally, destroys the enemy's MAX HP by the amount of damage inflicted by the second attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.6),
                debuff(roll, "def_break", 2, 100),
                debuff(roll, "heal_block", 2, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.6),
                debuff(roll, "def_break", 2, 100),
                debuff(roll, "heal_block", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1109, spec.meta, multistep(spec.action))
}
