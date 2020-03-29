// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 814
/** 
Attacks the enemy 5 times with a ball of light and recovers your HP by the amount of damage dealt. Each attack has a 50% chance to leave a Branding Effect for 2 turns and the skill will deal 25% increased damage to enemies under Branding Effect. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemy, debuff(roll, "brand", 2, 50)),
            step(targetEnemy, debuff(roll, "brand", 2, 50)),
            step(targetEnemy, debuff(roll, "brand", 2, 50)),
            step(targetEnemy, debuff(roll, "brand", 2, 50)),
            step(targetEnemy, debuff(roll, "brand", 2, 50)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(814, spec.meta, multistep(spec.action))
}
