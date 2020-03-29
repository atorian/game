// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmgWithoutDmgReduction,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1536
/** 
Attacks all enemies with a secret skill that deals substantial damage that ignores all beneficial effects that reduces the inflicted damage. Generates a shield which is proportionate to your level and lasts for 1 turn if Sword of the Supreme Sky Wolf is activated. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Shield scales with ATK or Damage for skill: 1536
        action: [
            step(
                targetEnemies,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker => attacker.atk * 5.8,
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1536, spec.meta, multistep(spec.action))
}
