// @flow
export default function(battles:LocalStorageBattles) {
    return (id:string) => {



        return battles.find(id);
    }
};
