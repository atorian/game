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

// skill id: 1557
/** 
Attacks the enemy with an explosive bullet and stuns the target with a 50% chance. Afterwards, attacks all enemies and stuns them with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Duplicate debuffs
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.9),
                debuff(roll, "stun", 1, 50),
                debuff(roll, "stun", 1, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(1557, spec.meta, multistep(spec.action))
}
