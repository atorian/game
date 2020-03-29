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

// skill id: 558
/** 
Attacks the enemy with powerful magic arrows to stun and decrease the target's Defense for 2 turns with a 60% chance each.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.5),
                debuff(roll, "stun", 1, 60),
                debuff(roll, "def_break", 2, 60),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 40,
            cooldown: 4,
        },
    }
    return new GenericSkill(558, spec.meta, multistep(spec.action))
}
