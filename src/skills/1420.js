// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1420
/** 
Aims at a target to deal substantial damage. If the enemy is frozen, stunned, or asleep, the damage of this attack will be increased by 50%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 7.8 + attacker.debuff * 0.5,
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1420, spec.meta, multistep(spec.action))
}
