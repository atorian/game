// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 860
/** 
Throws numerous cards to attack all enemies. The damage increases by 50% for each beneficial effect on the enemies. Attacks 6 times when this attack is used with full HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 76
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(860, spec.meta, multistep(spec.action))
}
