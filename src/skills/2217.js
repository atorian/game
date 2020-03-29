// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    simpleDmg,
    groupAttack,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2217
/** 
Teams up with another ally to attack an enemy. The damage increases by 20% for each harmful effect on the enemy, and this effect also applies to the ally who attacks together.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 4.5 + attacker.debuff * 0.2,
                ),
                groupAttack(self => 2), // fixme: might scale of something
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2217, spec.meta, multistep(spec.action))
}
