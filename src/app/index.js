import LocalStorageBattles from "../storage/battles";
import router from './router';
import getBattleUC from './get-battle';
import startBattleUC from './start-battle';

const battles = new LocalStorageBattles();

export const getBattle = getBattleUC(battles);
export const startBattle = startBattleUC(battles, router);




