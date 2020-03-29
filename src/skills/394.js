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

// skill id: 394
/** 
Unleashes a shock wave that has a 25% chance to stun and a 10% chance to provoke the enemy. This attack will deal more damage according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.8 + attacker.def * 2.5,
                ),
                debuff(roll, "stun", 1, 25),
                debuff(roll, "provoke", 1, 10),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(394, spec.meta, multistep(spec.action))
}
