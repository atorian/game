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

// skill id: 2159
/** 
Attacks the enemy with an Energy ball. The attack has a 75% chance to increase the enemy's chance to land a Glancing Hit for 2 turns and absorbs the Attack Bar by 15%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Duplicate debuffs
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.4),
                debuff(roll, "glancing", 2, 75),
                debuff(roll, "glancing", 2, 75),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 10,
            cooldown: 0,
        },
    }
    return new GenericSkill(2159, spec.meta, multistep(spec.action))
}
