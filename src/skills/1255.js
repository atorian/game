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

// skill id: 1255
/** 
Attacks the enemy 2 times. Each attack has a 75% chance to leave a Brand and Silence the target for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "brand", 2, 75),
                debuff(roll, "silence", 2, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "brand", 2, 75),
                debuff(roll, "silence", 2, 75),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1255, spec.meta, multistep(spec.action))
}
