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

// skill id: 986
/** 
Attacks with a small lump of darkness and increases the chances of the enemy to land a Glancing Hit for 2 turns if you get a critical hit.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 4.1 + attacker.atk + -50,
                ),
                debuff(roll, "glancing", 1, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(986, spec.meta, multistep(spec.action))
}
