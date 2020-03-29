// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 1369
/** 
Increases the Attack Bar of all allies by 25% each. This skill will also create a shield that absorbs damage and increases your Attack Power for 3 turns. The Shield amount is proportionate to your level. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("atk", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            shield: 0.2,
        },
    }
    return new GenericSkill(1369, spec.meta, multistep(spec.action))
}
