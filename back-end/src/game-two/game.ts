import { Injectable } from '@nestjs/common';
import { canvasHeight, canvasWidth } from './constants';

@Injectable()
export class Game {
    createGameState() {
        return {
            playerOne: {
                x: 0,
                y: (- 100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            playerTwo: {
                x: canvasWidth - 10,
                y: (canvasHeight - 100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            ball: {
                x: canvasWidth / 2,
                y: canvasHeight / 2,
                radius: 10,
                speed: 7,
                velocityX: 7,
                velocityY: 7,
                color: "white"
            }
        }
    }    
}
