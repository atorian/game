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

// skill id: 1175
/** 
Attacks the enemy with a mysterious energy and stuns them for 1 turn with an 18% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
                debuff(roll, "stun", 1, 18),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(1175, spec.meta, multistep(spec.action))
}
