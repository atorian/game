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

// skill id: 1212
/** 
Attacks the enemy with an attack where the inflicted damage is increased by 30% for each harmful effect or beneficial effect of the enemy. Puts the enemy to sleep for 2 turns after the attack. Targets that have immunity against sleep will be inflicted with 50% more damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 8.4 + attacker.debuff * 0.3,
                ),
                debuff(roll, "sleep", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1212, spec.meta, multistep(spec.action))
}
