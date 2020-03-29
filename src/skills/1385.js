// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1385
/** 
Attacks the enemy 4 times and deals damage proportionate to your Defense. 2 additional attacks are added if the enemy's MAX HP is lower than yours and if the target is suffering a harmful effect. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.6),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.6),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.6),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.6),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1385, spec.meta, multistep(spec.action))
}
