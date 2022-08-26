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
exports.GameTwoGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const game_two_service_1 = require("./game-two.service");
const socket_io_1 = require("socket.io");
let GameTwoGateway = class GameTwoGateway {
    constructor(gameTwoService) {
        this.gameTwoService = gameTwoService;
    }
    afterInit() {
        console.log('Websocket Server Started,Listening on Port:3000');
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`, "    length: ", this.server.engine.clientsCount, "  server:   ", Object.keys(this.server.sockets).length);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.gameTwoService.gameActive = false;
        const roomName = this.gameTwoService.clientRooms[client.id];
        if (roomName)
            if (client.id === this.gameTwoService.state[roomName].playerOne.id)
                this.gameTwoService.playerDisconnected = 1;
            else if (client.id === this.gameTwoService.state[roomName].playerTwo.id)
                this.gameTwoService.playerDisconnected = 2;
    }
    handleKeyDown(keyCode, client) {
        const ret = this.gameTwoService.handleKeyDown(keyCode);
        this.gameTwoService.updatePlayer(client, this.gameTwoService.state, ret);
    }
    handleNewGame(client, name) {
        this.gameTwoService.handleNewGame(client, name);
    }
    handleJoinGame(data, client) {
        this.gameTwoService.handleJoinGame(this.server, client, data.gameCode, data.name);
    }
    handleCanvaSize(data) {
        this.gameTwoService.handleCanvaSize(data.width, data.height);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameTwoGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('keyDown'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameTwoGateway.prototype, "handleKeyDown", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newGame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameTwoGateway.prototype, "handleNewGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameTwoGateway.prototype, "handleJoinGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('canvaSize'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameTwoGateway.prototype, "handleCanvaSize", null);
GameTwoGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [game_two_service_1.GameTwoService])
], GameTwoGateway);
exports.GameTwoGateway = GameTwoGateway;
//# sourceMappingURL=game-two.gateway.js.map