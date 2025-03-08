$dataInteractions = [null,
    {   "id":1, "name":"Se Presenter", "description":"Se presenter à un inconnu",
        "type":"amicale",
        "conditions":(subject, target)=>{
            let relation    = subject._relations.relation(target._actorId);
            let status      = relation.status.key();
            let alreadyMet  = relation.status.alreadyMet();
            return (status == 'neutral'
                || status == 'ami'
                || status == 'vassal'
                || status == 'suzerain'
                || status == 'antipathique'
            ) && !alreadyMet;
        },
        "successCondition":(subject, target)=>{
            // retourne  -1:echec critique,0:echec,1:succes,2:soumission(succes par la force)
            let relation = subject._relations.relation(target._actorId);
            if(relation.e >= 0) return 1;
            if(relation.s > (relation.e *-1)) return 2;
            if(relation.e < -20 && Math.randomInt(0, -100) < relation.e) return -1;
            return 0;
        },
        "effect":(subject, target, result)=>{

            
        }


    }

];

// Classe Interaction
class Game_Interaction {
    constructor(data) {
        this._name                  = data.name;
        this._description           = data.description;
        this._type                  = data.type;                // amicale, agressive, commerciale, diplomatique, sentimentale
        this._conditions            = data.conditions;          // fonction retournant true/false
        this._successConditions     = data.successConditions;   // fonction retournant tun int de la valeur -1:echec critique,0:echec,1:succes,2:soumission(succes par la force)
        this._effect                = data.effect;              // fonction appliquant les effets
        this._active                = data.activeInit || false;
    }

    isAvailable(subject, target) {
        return this._conditions(subject, target) && this._active;
    }

    execute(subject, target) {
        if (this.isAvailable(subject, target)) {
            let result = this._successConditions(subject, target);
            console.log(`Interaction "${this._name}" effectué. => ${result?'Succès':'Echec'}`);
            this._effect(subject, target, result); 
        } else {
            console.log(`Interaction "${this._name}" indisponible.`);
        }
    }
}
class Game_Interactions{
    constructor(){
        this._data = [];
    }
    interaction(interactionId){
        if(!this._data[interactionId]){
            if($dataInteractions[interactionId]){
                this._data[interactionId] = new Game_Interaction($dataInteractions[interactionId])
            }else{
                alert(`error Game interaction - $dataInteractions[${interactionId}] not exist`);
            }
        }
        return this._data[interactionId];
    }
}