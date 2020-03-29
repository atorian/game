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

// skill id: 2141
/** 
Attacks the enemy 3 times with a whirling gust of wind. Stuns the enemy for 1 turn with a 60% chance. If the target is immune to stun, reduces the target's Attack Bar to 0 with a 60% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If immune to stun
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "stun", 1, 60),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "stun", 1, 60),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "stun", 1, 60),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 10,
            cooldown: 0,
        },
    }
    return new GenericSkill(2141, spec.meta, multistep(spec.action))
}
