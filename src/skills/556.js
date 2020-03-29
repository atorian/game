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

// skill id: 556
/** 
Attacks with 3 water arrows, each having a 15% chance to stun the enemy. The damage increases according to Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2 + attacker.def * 2,
                ),
                debuff(roll, "stun", 1, 15),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2 + attacker.def * 2,
                ),
                debuff(roll, "stun", 1, 15),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2 + attacker.def * 2,
                ),
                debuff(roll, "stun", 1, 15),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(556, spec.meta, multistep(spec.action))
}
