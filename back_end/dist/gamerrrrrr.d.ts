import { NestGateway } from "@nestjs/websockets/interfaces/nest-gateway.interface";
import { Server, Socket } from "socket.io";
export declare class gameGateway implements NestGateway {
    server: Server;
    player: any;
    player2: any;
    ball: any;
    canvWidth: number;
    canvheight: number;
    initPlayer(): void;
    initPlayer2(): void;
    initBall(): void;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    afterInit(socket: Socket): Promise<void>;
}
