// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 376
/** 
Attacks the enemy 3 times to grant Continuous Damage for 1 turn with each attack and increases the Critical Rate of all allies for 2 turns. Gets drunk and attacks a random enemy with [Rolling Punch] with a 50% chance afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
            ),
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
            ),
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
            ),
        ],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(376, spec.meta, multistep(spec.action))
}
