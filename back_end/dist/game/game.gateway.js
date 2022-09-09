"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const game_service_1 = require("./game.service");
const socket_io_1 = require("socket.io");
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
    }
    afterInit() {
        console.log('Websocket Server Started,Listening on Port:8080');
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`, " length: ", this.server.engine.clientsCount);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        const roomName = this.gameService.clientRooms[client.id];
        if (this.gameService.state[roomName]) {
            this.gameService.gameActive = false;
            if (client.id === this.gameService.state[roomName].playerOne.id)
                this.gameService.playerDisconnected = 1;
            else if (client.id === this.gameService.state[roomName].playerTwo.id)
                this.gameService.playerDisconnected = 2;
        }
    }
    handleKeyDown(keyCode, client) {
        const ret = this.gameService.handleKeyDown(keyCode);
        this.gameService.updatePlayer(client, this.gameService.state, ret);
    }
    handleNewGame(client, name) {
        this.gameService.handleNewGame(client, name);
    }
    handleJoinGame(data, client) {
        this.gameService.handleJoinGame(this.server, client, data.gameCode, data.name);
    }
    handleSpectateGame(gameCode, client) {
        this.gameService.handleSpectateGame(this.server, client, gameCode);
    }
    handleTestGame(client) {
        this.gameService.handleTestteGame(this.server, client);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('keyDown'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleKeyDown", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newGame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleNewGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleJoinGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('spectateGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleSpectateGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('testGame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleTestGame", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map