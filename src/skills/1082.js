// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1082
/** 
Summons a storm of darkness to attack all enemies 4 times. Each attack has a 15% chance to stun. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.9),
                debuff(roll, "stun", 1, 5),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.9),
                debuff(roll, "stun", 1, 5),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.9),
                debuff(roll, "stun", 1, 5),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 0.9),
                debuff(roll, "stun", 1, 5),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 15,
            cooldown: 3,
        },
    }
    return new GenericSkill(1082, spec.meta, multistep(spec.action))
}
