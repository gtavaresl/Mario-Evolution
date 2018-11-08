const numberOfMarios = 5;
const mutationRate = 0.1;

var i;
var elJugador = [];

function isEverybodyDead(aKarts) {
    for(var i=0; i<aKarts.length-1; i++) {
        if(!aKarts[i].isFreezed) {
            return false;
        }
    }
    return true;
}

function newGeneration(aKarts) {
    console.log('Generating new population');
    var newPopulation = [];

    for(var i=0; i<aKarts.length; i++){
        var newMario = acceptReject(aKarts);
        
        //Remember me
        console.log('bora mutar');
        newMario.brain.mutate(mutationRate);
        console.log('mutou');

        newPopulation[i] = newMario;
    }

    return newGeneration;
}

function maxFitness(aKarts) {
    var maxFit = -1;
    for (var i=0; i<aKarts.length; i++){
        if(aKarts[i].fitness > maxFit){
            maxFit = aKarts[i].fitness;
        }
    }
    return maxFit;
}

function acceptReject(aKarts) {
    var sayNoToInfinityLoop = 0;
    while(true && sayNoToInfinityLoop < 10000){    
        sayNoToInfinityLoop++;
        //Pick a random mario from the array
        var index = Math.floor(Math.random(0, aKarts.length));
        var partner = aKarts[index];

        //Pick a random number between 0 and the maximum fitness
        //The probability to pick this nummber is the same that the probability to pick
        //a number less than the fitness of this mario
        var r = Math.floor(Math.random(maxFitness(aKarts)));
        if(r < partner.fitness) {
            console.log('eu fui aceito!!');
            return partner;
        }
        console.log('vai de novo');
    }
    console.log('passou de 10000 e sai do loop');
    return null;
}

//Construtor
//Cria os vários objetos declarando os métodos
//As instâncias serão setadas no outro arquivo a partir da linha 176
for(i=0; i<numberOfMarios; i++) {
    elJugador[i] = {
        //Métodos do objeto
        think: function(oMap) {
            let inputs = [];
            inputs[0] = this.distanceUp(oMap);
            inputs[1] = this.distanceBottom(oMap);
            inputs[2] = this.distanceRight(oMap);
            inputs[3] = this.distanceLeft(oMap);
            inputs[4] = this.rotation/360;
            let output = this.brain.predict(inputs);
            if (output[0] > 0.5) {
                this.buttonRight();
            }
            if (output[0] < 0.5) {
                this.buttonLeft();
            }
        }, 

        distanceUp: function(oMap) {
            let x = this.x;
            let y = this.y;
            let minDistance = y;
            //Passa por todas as caixas contidas no vetor collision
            for (var i = 0; i < oMap.collision.length; i++) {
                var oBox = oMap.collision[i];
                //O jogador precisa estar abaixo ou acima da caixa para detectar as linha, isso evita detecções erradas
                if (x > oBox[0] && x < oBox[0] + oBox[2]){
                    //As coordenadas y precisam ser menores que a atual do jogador, pois isso fara com que a linha esteja acima dele olhando no png do mapa
                    if (oBox[1] < y) {
                        minDistance = y - oBox[1];
                    }
                    //A outra linha da caixa
                    if (oBox[1] + oBox[3] < y) {
                        let distance = y - oBox[1] - oBox[3]; 
                        if (distance < minDistance) {
                            minDistance = distance;
                        }
                    }
                }
                return minDistance;
            }
        },

        distanceBottom: function(oMap) {
            //365 é o tamanho na vertical
            let minDistance = 365 - this.y;
            let x = this.x;
            let y = this.y;
            for (var i = 0; i < oMap.collision.length; i++) {
                var oBox = oMap.collision[i];
                //O jogador precisa estar abaixo ou acima da caixa para detectar as linha, isso evita detecções erradas
                if (x > oBox[0] && x < oBox[0] + oBox[2]){
                    //As coordenadas y da caixa precisam ser maiores que a atual do jogador, pois isso fara com que a linha esteja abaixo dele, olhando no png do mapa
                    if (oBox[1] > y) {
                        minDistance = oBox[1] - y;
                    }
                    //A outra linha da caixa
                    if (oBox[1] + oBox[3] > y) {
                        let distance = oBox[1] + oBox[3] - y;
                        if (distance < minDistance) {
                            minDistance = distance; 
                        }
                    }
                }
            }
            return minDistance;
        },

        distanceLeft: function(oMap) {
            let x = this.x;
            let y = this.y;
            let minDistance = x;
            for (var i = 0; i < oMap.collision.length; i++) {
                var oBox = oMap.collision[i];
                //O jogador precisa estar à direita ou à esquerda da caixa para detectar as linhas, isso evita detecções erradas
                if (y > oBox[1] && y < oBox[1] + oBox[3]){
                    //As coordenadas y da caixa precisam ser maiores que a atual do jogador, pois isso fara com que a linha esteja abaixo dele, olhando no png do mapa
                    if (x > oBox[0] + oBox[2]) {
                        minDistance = x - oBox[0] - oBox[2];
                    }
                    //A outra linha da caixa sempre estará mais longe, pois como nao ha coordenadas negativas o oBox[0]+oBox[2] sempre ira minimizar o minDistance
                    //Entoncess não precisamos conferir
                }
            }
            return minDistance;
        },

        distanceRight: function(oMap) {
            let x = this.x;
            let y = this.y;
            let minDistance = 188 - x;
            for (var i = 0; i < oMap.collision.length; i++) {
                var oBox = oMap.collision[i];
                //O jogador precisa estar à direita ou à esquerda da caixa para detectar as linhas, isso evita detecções erradas
                if (y > oBox[1] && y < oBox[1] + oBox[3]){
                    //As coordenadas y da caixa precisam ser maiores que a atual do jogador, pois isso fara com que a linha esteja abaixo dele, olhando no png do mapa
                    if (x < oBox[0]) {
                        minDistance = oBox[0] - x;
                    }
                    //A outra linha da caixa sempre estará mais longe, pois como nao ha coordenadas negativas o oBox[0]+oBox[2] sempre ira minimizar o minDistance
                    //Entoncess não precisamos conferir
                }
            }
            return minDistance;
        },

        hit: function(oMap) {
            let distance = 3;
            if (this.distanceUp(oMap) < distance || this.distanceBottom(oMap) < distance || 
                this.distanceLeft(oMap) < distance || this.distanceRight(oMap) < distance ||
                this.x < 9 || this.x > imgWidth-distance || 
                this.y < 9 || this.y > imgHeight-distance) { 
                return true;
            } else {
                return false;
            }
        },

        // Acceleration function
        buttonUp: function() {
            this.speedinc = 1;
        },

        //Deceleration function
        buttonDown :function() {
            this.speedinc -= 0.2;
        },

        //Turn right
        buttonRight :function() {
            this.rotincdir = -1;
        },

        //Turn left
        buttonLeft :function() {
            this.rotincdir = 1;
        },

        freeze: function() {
            this.speed = 0;
        }

    };
}