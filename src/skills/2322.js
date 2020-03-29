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

// skill id: 2322
/** 
Attacks the enemy with claws and disturbs the enemy's HP recovery for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                debuff(roll, "heal_block", 2, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2322, spec.meta, multistep(spec.action))
}
