// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 677
/** 
Attacks an enemy target, depleting its Attack Bar and stunning it for 1 turn. When this attack is on cool down, your Attack Speed increases and you recover 10% HP every turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.4),
                debuff(roll, "stun", 1, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(677, spec.meta, multistep(spec.action))
}
