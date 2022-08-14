"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
let GameService = class GameService {
    constructor() {
        this.matches = [];
        this.canvWidth = 600;
        this.canvheight = 400;
    }
    setPlayer(setPlayerDto, clientId) {
        const { matchId, name } = setPlayerDto;
        const match = this.matches.find(m => m.id === matchId);
        if (!match) {
            const newMatch = {
                id: matchId,
                playerOne: {
                    socketId: clientId,
                    name,
                    x: 0,
                    y: (this.canvheight - 100) / 2,
                    width: 10,
                    height: 100,
                    color: 'white',
                    score: 1337,
                },
                playerTwo: {
                    socketId: null,
                    name: null,
                    x: this.canvWidth - 10,
                    y: (this.canvheight - 100) / 2,
                    width: 10,
                    height: 100,
                    color: 'white',
                    score: 220,
                },
                ball: {
                    x: this.canvWidth / 2,
                    y: this.canvheight / 2,
                    radius: 10,
                    speed: 7,
                    velocityX: 7,
                    velocityY: 7,
                    color: 'white',
                },
            };
            this.matches.push(newMatch);
            return {
                status: 'first player',
            };
        }
        else {
            match.playerTwo.socketId = clientId;
            match.playerTwo.name = name;
            return {
                status: 'second player',
                match,
            };
        }
    }
    collision(b, p) {
        p.top = p.y;
        p.bottom = p.y + p.height;
        p.left = p.x;
        p.right = p.x + p.width;
        b.top = b.y - b.radius;
        b.bottom = b.y + b.radius;
        b.left = b.x - b.radius;
        b.right = b.x + b.radius;
        return (b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom);
    }
    resetBall(id) {
        const match = this.matches.find(m => m.id === id);
        if (match.id === id) {
            match.ball.x = this.canvWidth / 2;
            match.ball.y = this.canvheight / 2;
            match.ball.speed = 7;
            match.ball.velocityX = -match.ball.velocityX;
        }
    }
    update(id) {
        const match = this.matches.find(m => m.id === id);
        if (match === null || match === void 0 ? void 0 : match.id)
            if (match.id === id) {
                if (match.ball.x - match.ball.radius < 0) {
                    match.playerTwo.score++;
                    this.resetBall(id);
                }
                else if (match.ball.x + match.ball.radius > this.canvWidth) {
                    match.playerOne.score++;
                    this.resetBall(id);
                }
                match.playerTwo.y += (match.ball.y - (match.playerTwo.y + match.playerTwo.height / 2)) * 1;
                if (match.ball.y - match.ball.radius < 0 || match.ball.y + match.ball.radius > this.canvheight) {
                    match.ball.velocityY = -match.ball.velocityY;
                }
                let player = (match.ball.x + match.ball.radius < this.canvWidth / 2) ? match.playerOne : match.playerTwo;
                if (this.collision(match.ball, player)) {
                    let collidPoint = match.ball.y - (player.y + player.height / 2);
                    collidPoint /= player.height / 2;
                    let angleRad = collidPoint * (Math.PI / 4);
                    let direction = (match.ball.x + match.ball.radius < this.canvWidth / 2) ? 1 : -1;
                    match.ball.velocityX = direction * match.ball.speed * Math.cos(angleRad);
                    match.ball.velocityY = match.ball.speed * Math.sin(angleRad);
                    match.ball.speed += 0.1;
                }
                return match;
            }
    }
    updateMovement(movement) {
        const match = this.matches.find(m => m.id === movement.id);
        if (match.id === movement.id) {
            match.playerOne.y += movement.y;
            if (match.playerOne.y < 0) {
                match.playerOne.y = 0;
            }
            else if (match.playerOne.y + match.playerOne.height > this.canvheight) {
                match.playerOne.y = this.canvheight - match.playerOne.height;
            }
        }
        return match;
    }
    keydown(data) {
        const match = this.matches.find(m => m.id === data.id);
        if (match.id === data.id) {
            match.playerOne.y += data.y;
            if (match.playerOne.y < 0) {
                match.playerOne.y = 0;
            }
            else if (match.playerOne.y + match.playerOne.height > this.canvheight) {
                match.playerOne.y = this.canvheight - match.playerOne.height;
            }
        }
        return match;
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map