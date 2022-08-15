import { Socket } from 'socket.io';
export declare class GameTwoService {
    constructor();
    createGameState(): {
        playerOne: {
            x: number;
            y: number;
            width: number;
            height: number;
            color: string;
            score: number;
        };
        playerTwo: {
            x: number;
            y: number;
            width: number;
            height: number;
            color: string;
            score: number;
        };
        ball: {
            x: number;
            y: number;
            radius: number;
            speed: number;
            velocityX: number;
            velocityY: number;
            color: string;
        };
    };
    hasCollision(ball: any, player: any): boolean;
    collision(b: any, p: any): boolean;
    resetBall(state: any): void;
    gameloop(state: any): false | 2 | 1;
    startGameInterval(clinet: Socket, state: any): void;
}
