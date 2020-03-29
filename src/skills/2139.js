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

// skill id: 2139
/** 
Attacks the enemy 3 times with a whirling storm of water. Freezes the enemy for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "freeze", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "freeze", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "freeze", 1, 100),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2139, spec.meta, multistep(spec.action))
}
