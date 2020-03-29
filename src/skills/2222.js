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

// skill id: 2222
/** 
Attacks on the enemy's wounds to leave a Branding Effect for 2 turns. The damage increases by 50% for each harmful effect on the enemy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 7.2 + attacker.debuff * 0.5,
                ),
                debuff(roll, "brand", 2, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            debuffDuration: 1,
        },
    }
    return new GenericSkill(2222, spec.meta, multistep(spec.action))
}
