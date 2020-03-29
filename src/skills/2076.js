// @flow
import type { Ability } from "../index"
import { step, targetEnemies, multistep, GenericSkill } from "../skill"

// skill id: 2076
/** 
Throws the weapon up in the sky and shares damage with all enemies by the amount of your MAX HP on your next turn. This attack can't be counterattacked. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: Alive Enemies,MAX HP
        action: [step(targetEnemies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2076, spec.meta, multistep(spec.action))
}
