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

// skill id: 943
/** 
Attacks without waking up the enemy that's under Sleep. Attacks random targets 5 times. Puts the enemy who's not under Sleep to Sleep for 1 turn, and deals 50% more damage to the target that's under Sleep. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.07),
                debuff(roll, "sleep", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.07),
                debuff(roll, "sleep", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.07),
                debuff(roll, "sleep", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.07),
                debuff(roll, "sleep", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.07),
                debuff(roll, "sleep", 1, 100),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(943, spec.meta, multistep(spec.action))
}
