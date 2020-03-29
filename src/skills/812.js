// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 812
/** 
Throws soul beads at the enemy to deal damage, and recovers the same amount of the inflicted damage as HP. Additionally, all excessive HP recovery from this skill will be converted into a shield that lasts for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Shield scales with ATK or Damage for skill: 812
        // fixme: On overheal
        action: [step(targetEnemy)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(812, spec.meta, multistep(spec.action))
}
