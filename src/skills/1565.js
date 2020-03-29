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

// skill id: 1565
/** 
Orders the ship to fire a bombardment of 3 rounds to attack random targets. Each hit has a 75% chance of stunning the enemy for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "stun", 1, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "stun", 1, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "stun", 1, 75),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1565, spec.meta, multistep(spec.action))
}
