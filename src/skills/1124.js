// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1124
/** 
Attacks all enemies with powerful magical energy. The damage increases by 30% for each harmful effect on the enemies. The damage increases by 50% if there's only one harmful effect on the enemies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 50% if only one debuff
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.2 + attacker.debuff * 0.3,
                ),
            ),
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.2 + attacker.debuff * 0.3,
                ),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1124, spec.meta, multistep(spec.action))
}
