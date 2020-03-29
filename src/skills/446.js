// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 446
/** 
Hurls razor-sharp feathers to attack multiple enemies at once. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.6),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.6),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.6),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.6),
            ),
        ],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(446, spec.meta, multistep(spec.action))
}
