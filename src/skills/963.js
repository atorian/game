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

// skill id: 963
/** 
Attacks all enemies with a cyclone 4 times. Each attack has a 20% chance to stun the enemy and absorbs the Attack Bar by 20%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.1),
                debuff(roll, "stun", 1, 20),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.1),
                debuff(roll, "stun", 1, 20),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.1),
                debuff(roll, "stun", 1, 20),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.1),
                debuff(roll, "stun", 1, 20),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(963, spec.meta, multistep(spec.action))
}
