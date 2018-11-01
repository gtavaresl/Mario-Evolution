function canMoveTo(iX, iY) {
        if (iX > iMapWidth - 5 || iY > iMapHeight - 5) return false;
        if (iX < 4 || iY < 4) return false;
        for (var i = 0; i < oMap.collision.length; i++) {
            var oBox = oMap.collision[i];
                 //se x está para dentro da caixa (x maior que a linha da esquerda e x menor que a linha da direita)
            if (iX > oBox[0] && iX < oBox[0] + oBox[2]) {
                //se y esta dentro da caixa, mesma logica de cima
                if (iY > oBox[1] && iY < oBox[1] + oBox[3]) {
                    return false;
                }
            }
        }
        return true;
    }