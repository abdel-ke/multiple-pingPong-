export declare class Match {
    id: number;
    playerOne: {
        socketId: string;
        name: string;
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
        score: number;
    };
    playerTwo: {
        socketId: string;
        name: string;
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
}
