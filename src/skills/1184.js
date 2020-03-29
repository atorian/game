// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1184
/** 
Explodes compressed energy of darkness to inflict damage to an enemy. The more HP the targeted enemy currently has, the larger the damage becomes. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 1 * ((target.hp / target.maxHp) * 4 + 5),
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1184, spec.meta, multistep(spec.action))
}
