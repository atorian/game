// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    simpleDmg,
    debuff,
    groupAttack,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1961
/** 
Attacks the enemy to decrease the Defense for 1 turn with a 50% chance. Additionally, if there's Chakram Dancer included in the ally team, one of Boomerang Warriors will attack together with Chakram Dancer during Chakram Dancer's turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 1 Chakram Dancer only
        action: [
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 3.4),
                debuff(roll, "def_break", 1, 50),
                groupAttack(self => 1), // fixme: might scale of something
            ),
        ],
        meta: {
            dmg: 35,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(1961, spec.meta, multistep(spec.action))
}
