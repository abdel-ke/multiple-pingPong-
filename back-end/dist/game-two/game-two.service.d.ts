import { Server, Socket } from 'socket.io';
export declare class GameTwoService {
    constructor();
    state: any;
    clientRooms: any;
    clientSpectating: any;
    gameActive: boolean;
    canvasWidth: number;
    canvasHeight: number;
    playerDisconnected: number;
    handleCanvaSize(width: number, height: number): void;
    createGameState(): {
        playerOne: {
            id: string;
            name: string;
            x: number;
            y: number;
            width: number;
            height: number;
            color: string;
            score: number;
        };
        playerTwo: {
            id: string;
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
    };
    hasCollision(ball: any, player: any): boolean;
    collision(b: any, p: any): boolean;
    resetBall(state: any): void;
    gameloop(state: any): false | 2 | 1;
    handleKeyDown(keyCode: any): 0 | 1 | -1;
    updatePlayer(client: Socket, state: any, ret: number): void;
    updatePlayerOne(state: any, ret: number): void;
    updatePlayerTwo(state: any, ret: number): void;
    startGameInterval(server: Server, state: any, roomName: string): void;
    handleNewGame(client: Socket, name: string): void;
    handleJoinGame(server: Server, client: Socket, gameCode: string, name: string): void;
    handleSpectateGame(server: Server, client: Socket, gameCode: string): void;
    emitGameState(server: Server, gameState: any, roomName: string): void;
    emitGameOver(server: Server, roomName: string, winner: any): void;
    emitPlayerDesconnected(server: Server, roomName: string, winner: number): void;
}
