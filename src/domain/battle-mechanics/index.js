import {Battle} from "../battle";
import Nemesis from "./nemesis";
import AutoAction from "./auto-action";
import Guard from "./guard";
import Violent from "./violent";


export interface BattleMechanics {
    subscribe(battle: Battle): void;
}

export default class BattleMechanicsAggregate {
    mechanics: BattleMechanics[];

    constructor() {
        this.mechanics = [
            new Nemesis(),
            new AutoAction(/*policy*/),
            new Guard(/*policy*/),
            Violent,
        ];
    }

    subscribe(battle) {
        this.mechanics.map(
            m => m.subscribe(battle)
        );
    }
}
