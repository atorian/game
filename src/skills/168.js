// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 168
/** 
Inflicts great damage by blowing up the Continuous Damage effects on the enemy. The inflicted damage increases by 50% for each effect. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 5.8 + attacker.debuff * 0.5,
                ),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(168, spec.meta, multistep(spec.action))
}
