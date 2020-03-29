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

// skill id: 71
/** 
Attacks the enemy 3 times with a whirling gust of darkness. Stuns the enemy for 1 turn with a 20% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "stun", null, 20),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "stun", null, 20),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "stun", null, 20),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 40,
            cooldown: 0,
        },
    }
    return new GenericSkill(71, spec.meta, multistep(spec.action))
}
