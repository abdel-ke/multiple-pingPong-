export declare class Game {
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
}
