const numberOfMarios = 10;
const mutationRate = 0.3;

var i;
var elJugador = [];

function isEverybodyDead(aKarts) {
    for(var i=1; i<aKarts.length; i++) {
        if(!aKarts[i].isFreezed) {
            return false;
        }
    }
    return true;
}

function normalizeFitness(aKarts) {
    //Fazer os pontos serem exponencialmente melhores elevando ao quadrado
    for(let i=1; i<aKarts.length; i++){
        aKarts[i].fitness = Math.pow(aKarts[i].fitness, 2);
    }

    //Achando o soma total
    var sum = 0;
    for (let i=1; i<aKarts.length; i++){
        sum += aKarts[i].fitness;
    }

    //Dividir todo mundo pela soma total
    for (let i=1; i<aKarts.length; i++){
        aKarts[i].fitness = ((aKarts[i].fitness)*1.0)/sum;
    }
    return aKarts;
}

function newGeneration(aKarts, oMap) {
    console.log('Gerando nova populacao');
    var Best = bestFitness(aKarts);
    var newPopulation = [];
    //Normalizando o fitness 
    aKarts = normalizeFitness(aKarts);
    
    // aKarts[2].brain.weights_ih.print();

    for(var i=1; i<aKarts.length; i++){
        var newMario = crossOver(Best, aKarts[i]);    
        // var newMario = acceptReject(aKarts);    
        newMario.brain.mutate(mutationRate);

        // Resetar as informações (Novo construtor do objeto)
        console.log('nuevo i: ', i);
        newMario.speed = 0;
        newMario.speedinc = 0;
        newMario.rotincdir = 0;
        newMario.rotinc = 0;
        newMario.fitness = 0;
        newMario.x = 167;
        newMario.y = 198;
        newMario.rotation = oMap.startrotation;
        newMario.isFreezed = 0; //The new Mario is not freezed anymore
        
        //Adicionar o novo mario no vetor da nova população
        newPopulation[i] = newMario;
    }
    // console.log(newMario);
    // console.log(aKarts[2]);
    //O kart que eu controlo fica em 0, basta passar essa posicao para o novo vetor
    newPopulation[0] = aKarts[0];
    
    return newPopulation;
}

function maxFitness(aKarts) {
    var maxFit = -1;
    for (var i=1; i<aKarts.length; i++){
        if(aKarts[i].fitness > maxFit){
            maxFit = aKarts[i].fitness;
        }
    }
    return maxFit;
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

//Based on fitness, we'll choose a mario to survive
function acceptReject(aKarts) {
    var sayNoToInfinityLoop = 0;
    while(true && sayNoToInfinityLoop < 10000){    
        sayNoToInfinityLoop++;
        //Pick a random mario from the array
        var index = Math.floor(randomBetween(0, aKarts.length));
        var partner = aKarts[index];

        //Pick a random number between 0 and the maximum fitness
        //The probability to pick this number is the same that the probability to pick
        //a number less than the fitness of this mario
        var r = Math.floor(randomBetween(0, maxFitness(aKarts)));
        if(r < partner.fitness) {
            return partner;
        }
    }
    return null;
}

//If is partnerA, cut from the first column till the cut point, if is not partner A, begin cutting in column cutPoint+1 till "in the end it doesn't even matter. I tried so hard....."
function identityMatrix(isParterA, cutPoint, numCols) {
    var identityMatrix = new Matrix(numCols, numCols);
    //Put 0 in every position
    identityMatrix.data = Array(identityMatrix.rows).fill().map(() => Array(identityMatrix.cols).fill(0));
    if(isParterA){
        for(let i=0; i<=cutPoint; i++){
            //Put 1 in the diagonal until the cutPoint
            identityMatrix.data[i][i] = 1;
        }
    } else {
        for (let i=cutPoint+1; i<numCols; i++){
            //Put 1 in the diagonal until from cutPoint until the end
            identityMatrix.data[i][i] = 1;
        }
    }
    // identityMatrix.print();
    return identityMatrix;
}

function crossOver(partnerA, partnerB) {
    var copyPartnerA = partnerA;
    var copyPartnerB = partnerB;
    var child = partnerA;

    //Chose a point to make crossover
    var cutPoint = Math.floor(randomBetween(1, partnerA.brain.weights_ih.cols-1));

    for (var i=cutPoint+1; i<partnerB.brain.weights_ih.cols; i++){
        for (var j=0; j<partnerB.brain.weights_ih.rows; j++){
            child.brain.weights_ih.data[j][i] = partnerB.brain.weights_ih.data[j][i];
        }
    }    



    // partnerA.brain.weights_ih.print();
    // partnerB.brain.weights_ih.print();

    // var identityForA = identityMatrix(true, cutPoint, copyPartnerA.brain.weights_ih.cols);
    // var identityForB = identityMatrix(false, cutPoint, copyPartnerB.brain.weights_ih.cols);
    
    // //Cuts the matrix
    // copyPartnerA.brain.weights_ih = Matrix.multiply(copyPartnerA.brain.weights_ih, identityForA);
    // copyPartnerB.brain.weights_ih.print();
    // copyPartnerB.brain.weights_ih = Matrix.multiply(copyPartnerB.brain.weights_ih, identityForB);

    // //Now we have half matrix, we just need to add them
    // copyPartnerA.brain.weights_ih = Matrix.addMatrix(copyPartnerA.brain.weights_ih, copyPartnerB.brain.weights_ih);

    // //Return the child
    // console.log('partnerA');
    // // partnerA.brain.weights_ih.print();
    // // console.log('partnerB');
    // // partnerB.brain.weights_ih.print();
    // console.log('child');
    // // copyPartnerA.brain.weights_ih.print();
    return child;
}

function bestFitness(aKarts) {
    var bestKart = aKarts[4];
    // for (let i=1; i<aKarts.length; i++) {
    //     if(aKarts[i].fitness > bestKart.fitness) {
    //         bestKart = aKarts[i];
    //     }
    // }
    // console.log('todos os fitness');
    // for(let i=1; i<aKarts.length; i++) {
    //     // console.log(aKarts[i].fitness);
    // }
    // console.log('melhor');
    // console.log(bestKart);
    return bestKart;
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