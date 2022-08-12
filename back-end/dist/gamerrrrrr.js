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
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const auth_dto_1 = require("./dto/auth.dto");
let gameGateway = class gameGateway {
    constructor() {
        this.player = new auth_dto_1.player;
        this.player2 = new auth_dto_1.player;
        this.ball = new auth_dto_1.ball;
        this.canvWidth = 600;
        this.canvheight = 400;
    }
    initPlayer() {
        this.player.x = 0;
        this.player.y = (this.canvheight - 100) / 2;
        this.player.width = 10;
        this.player.height = 100;
        this.player.color = "white";
        this.player.score = 10;
    }
    initPlayer2() {
        this.player.x = this.canvWidth - 10;
        this.player.y = (this.canvheight - 100) / 2;
        this.player.width = 10;
        this.player.height = 100;
        this.player.color = "blue";
        this.player.score = 220;
    }
    initBall() {
        this.ball.x = this.canvWidth / 2;
        this.ball.y = this.canvheight / 2;
        this.ball.radius = 10;
        this.ball.speed = 7;
        this.ball.velocityX = 5;
        this.ball.velocityY = 5;
        this.ball.color = "white";
    }
    async handleConnection(socket) {
        console.log("clientId connected:", socket.id);
        this.initPlayer();
        this.initPlayer2();
        this.initBall();
        this.server.emit('setInitPlayer', this.player);
        this.server.emit('setInitPlayer2', this.player2);
        this.server.emit('setInitBall', this.ball);
    }
    async handleDisconnect(socket) {
        console.log("clientId disconencted:", socket.id);
    }
    async afterInit(socket) {
        console.log("init ", socket.id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], gameGateway.prototype, "server", void 0);
gameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], gameGateway);
exports.gameGateway = gameGateway;
//# sourceMappingURL=gamerrrrrr.js.map