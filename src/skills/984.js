// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 984
/** 
Attacks all enemies with a fiery tornado to inflict damage that's proportionate to your MAX HP and increases the Attack Bar of all allies by 25%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.6 + attacker.maxHp * 0.1,
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(984, spec.meta, multistep(spec.action))
}
