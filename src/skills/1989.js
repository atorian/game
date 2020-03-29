// @flow
import type { Ability } from "../index"
import { step, targetAllies, heal, multistep, GenericSkill } from "../skill"

// skill id: 1989
/** 
Recovers HP of the allies granted with harmful effects by 15% every turn. Creates a shield that's equivalent to 15% of your HP on the allies with no harmful effects for 2 turns. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Any ally with harmful effect
        // fixme: Any ally without harmful effect
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
            shield: 0.2,
            recovery: 20,
        },
    }
    return new GenericSkill(1989, spec.meta, multistep(spec.action))
}
