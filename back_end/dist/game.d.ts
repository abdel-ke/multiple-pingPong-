import { NestGateway } from "@nestjs/websockets/interfaces/nest-gateway.interface";
import { Server, Socket } from "socket.io";
import { ball, player } from "./dto/auth.dto";
export declare class gameGateway implements NestGateway {
    server: Server;
    player: player;
    player2: player;
    ball: ball;
    canvWidth: number;
    canvheight: number;
    initPlayer(): void;
    initPlayer2(): void;
    initBall(): void;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    afterInit(socket: Socket): Promise<void>;
}
