// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 657
/** 
Dashes towards an enemy, inflicting damage 2 times. Each attack has a 30% chance to stun the target for 1 turn. The damage is proportionate to my MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemy, debuff(roll, "stun", 1, 30)),
            step(targetEnemy, debuff(roll, "stun", 1, 30)),
        ],
        meta: {
            dmg: 25,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(657, spec.meta, multistep(spec.action))
}
