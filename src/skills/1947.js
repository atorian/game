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

// skill id: 1947
/** 
Attacks the enemy 2 times to inflict damage that increases as the enemy's HP decreases. Additionally, if there's Boomerang Warrior included in the ally team, one of Chakram Dancers will attack together with Boomerang Warrior during Boomerang Warrior's turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 1 Boomerang Warrior only
        action: [
            step(
                targetAlly,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -1.5 + 3),
                ),
                groupAttack(self => 1), // fixme: might scale of something
            ),
            step(
                targetAlly,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -1.5 + 3),
                ),
                groupAttack(self => 1), // fixme: might scale of something
            ),
        ],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1947, spec.meta, multistep(spec.action))
}
