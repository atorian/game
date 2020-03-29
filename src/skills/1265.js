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

// skill id: 1265
/** 
Attacks the enemy 2 times. Each attack has a 25% chance to increase the enemy's chance of dealing a Glancing Hit for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "glancing", 2, 165),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "glancing", 2, 165),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(1265, spec.meta, multistep(spec.action))
}
