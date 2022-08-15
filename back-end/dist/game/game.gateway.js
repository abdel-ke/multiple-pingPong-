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
const SetPlayer_dto_1 = require("./dto/SetPlayer.dto");
const game_entity_1 = require("./entities/game.entity");
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
    }
    setInitPlayer(setPlayerDto, client) {
        const resp = this.gameService.setPlayer(setPlayerDto, client.id);
        client.join(setPlayerDto.matchId.toString());
        if (resp.status === 'first player') {
            return 'first player';
        }
        else {
            this.server.to(resp.match.id.toString()).emit('JoinMatch', resp.match);
            return resp.match;
        }
    }
    updateGame(id) {
        return this.gameService.update(id);
    }
    updateplayers(match) {
        this.gameService.updateMovement(match);
    }
    keydown(data) {
        this.gameService.keydown(data);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetPlayer_dto_1.SetPlayerDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "setInitPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "updateGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateplayers'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [game_entity_1.Match]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "updateplayers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('keydown'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "keydown", null);
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