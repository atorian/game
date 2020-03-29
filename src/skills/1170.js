// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1170
/** 
Attacks all enemies, removing all beneficial effects and stunning the enemies whose beneficial effect has been removed for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If buff was removed
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                debuff(roll, "stun", null, 100),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1170, spec.meta, multistep(spec.action))
}
