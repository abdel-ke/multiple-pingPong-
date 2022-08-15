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
exports.GameTwoService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const constants_2 = require("./constants");
let GameTwoService = class GameTwoService {
    constructor() { }
    createGameState() {
        return {
            playerOne: {
                x: 0,
                y: (constants_2.canvasWidth - 100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            playerTwo: {
                x: constants_2.canvasWidth - 10,
                y: (constants_2.canvasHeight - 100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            ball: {
                x: constants_2.canvasWidth / 2,
                y: constants_2.canvasHeight / 2,
                radius: 10,
                speed: 7,
                velocityX: 7,
                velocityY: 7,
                color: "white"
            }
        };
    }
    hasCollision(ball, player) {
        return ball.x + ball.radius > player.x &&
            ball.x - ball.radius < player.x + player.width &&
            ball.y + ball.radius > player.y &&
            ball.y - ball.radius < player.y + player.height;
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
    resetBall(state) {
        state.ball.x = constants_2.canvasWidth / 2;
        state.ball.y = constants_2.canvasHeight / 2;
        state.ball.speed = 7;
        state.ball.velocityX = -state.ball.velocityX;
    }
    gameloop(state) {
        if (!state)
            return;
        const playerOne = state.playerOne;
        const playerTwo = state.playerTwo;
        const ball = state.ball;
        if (ball.x - ball.radius < 0) {
            playerTwo.score++;
            this.resetBall(state);
        }
        else if (ball.x + ball.radius > constants_2.canvasWidth) {
            playerOne.score++;
            this.resetBall(state);
        }
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        playerTwo.y += (ball.y - (playerTwo.y + playerTwo.height / 2)) * 1;
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > constants_2.canvasHeight)
            ball.velocityY = -ball.velocityY;
        let player = (ball.x + ball.radius < constants_2.canvasWidth / 2) ? playerOne : playerTwo;
        if (this.collision(ball, player)) {
            let collidPoint = ball.y - (player.y + player.height / 2);
            collidPoint /= player.height / 2;
            let angleRad = collidPoint * (Math.PI / 4);
            let direction = (ball.x + ball.radius < constants_2.canvasWidth / 2) ? 1 : -1;
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);
            ball.speed += 0.1;
        }
        if (playerOne.score == 10) {
            playerOne.score = 0;
            playerTwo.score = 0;
            ball.x = constants_2.canvasWidth / 2;
            ball.y = constants_2.canvasHeight / 2;
            ball.velocityX = 7;
            ball.velocityY = 7;
            return 1;
        }
        if (playerTwo.score == 10) {
            playerOne.score = 0;
            playerTwo.score = 0;
            ball.x = constants_2.canvasWidth / 2;
            ball.y = constants_2.canvasHeight / 2;
            ball.velocityX = -7;
            ball.velocityY = 7;
            return 2;
        }
        return false;
    }
    startGameInterval(clinet, state) {
        const interval = setInterval(() => {
            const winner = this.gameloop(state);
            if (!winner) {
                clinet.emit('gameState', JSON.stringify(state));
            }
            else {
                clinet.emit('gameOver');
                clearInterval(interval);
            }
        }, 1000 / constants_1.FRAMERATE);
    }
};
GameTwoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GameTwoService);
exports.GameTwoService = GameTwoService;
//# sourceMappingURL=game-two.service.js.map