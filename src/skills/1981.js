// @flow
import type { Ability } from "../index"
import { step, targetEnemy, heal, multistep, GenericSkill } from "../skill"

// skill id: 1981
/** 
Honey bees will transfer all harmful effects granted on the allies to the target enemy. If the allies don't have any harmful effects, all allies will recover their HP by 20%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If ally does not have harmful effects
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 25,
        },
    }
    return new GenericSkill(1981, spec.meta, multistep(spec.action))
}
