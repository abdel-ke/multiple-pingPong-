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
let GameTwoService = class GameTwoService {
    constructor() {
        this.state = {};
        this.clientRooms = {};
        this.clientSpectating = {};
        this.gameActive = false;
        this.canvasWidth = 600;
        this.canvasHeight = this.canvasWidth / 2;
        this.playerDisconnected = 0;
    }
    createGameState() {
        return {
            playerOne: {
                id: 'playerOne',
                name: '',
                x: 0,
                y: (this.canvasHeight - 100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            playerTwo: {
                id: 'playerTwo',
                name: '',
                x: this.canvasWidth - 10,
                y: (this.canvasHeight - 100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            ball: {
                x: this.canvasWidth / 2,
                y: this.canvasHeight / 2,
                radius: this.canvasHeight * 0.02,
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
        state.ball.x = this.canvasWidth / 2;
        state.ball.y = this.canvasHeight / 2;
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
        else if (ball.x + ball.radius > this.canvasWidth) {
            playerOne.score++;
            this.resetBall(state);
        }
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > this.canvasHeight)
            ball.velocityY = -ball.velocityY;
        let player = (ball.x + ball.radius < this.canvasWidth / 2) ? playerOne : playerTwo;
        if (this.collision(ball, player)) {
            let collidPoint = ball.y - (player.y + player.height / 2);
            collidPoint /= player.height / 2;
            let angleRad = collidPoint * (Math.PI / 4);
            let direction = (ball.x + ball.radius < this.canvasWidth / 2) ? 1 : -1;
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);
            ball.speed += 0.1;
        }
        if (playerOne.score == 10) {
            playerOne.score = 0;
            playerTwo.score = 0;
            ball.x = this.canvasWidth / 2;
            ball.y = this.canvasHeight / 2;
            ball.velocityX = 7;
            ball.velocityY = 7;
            return 1;
        }
        if (playerTwo.score == 10) {
            playerOne.score = 0;
            playerTwo.score = 0;
            ball.x = this.canvasWidth / 2;
            ball.y = this.canvasHeight / 2;
            ball.velocityX = -7;
            ball.velocityY = 7;
            return 2;
        }
        return false;
    }
    handleKeyDown(keyCode) {
        try {
            const key = parseInt(keyCode);
            switch (key) {
                case 87:
                    return -1;
                case 83:
                    return 1;
                default:
                    return 0;
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    updatePlayer(client, state, ret) {
        const roomName = this.clientRooms[client.id];
        if (!roomName || !this.gameActive)
            return;
        if (this.state[roomName].playerOne.id === client.id)
            this.updatePlayerOne(state[roomName], ret);
        else
            this.updatePlayerTwo(state[roomName], ret);
    }
    updatePlayerOne(state, ret) {
        if (ret == 1) {
            if (state.playerOne.y + 115 > this.canvasHeight)
                state.playerOne.y = this.canvasHeight - 100;
            else
                state.playerOne.y += 15;
        }
        else if (ret == -1) {
            if (state.playerOne.y < 15)
                state.playerOne.y = 0;
            else
                state.playerOne.y -= 15;
        }
    }
    updatePlayerTwo(state, ret) {
        if (ret == 1) {
            if (state.playerTwo.y + 115 > this.canvasHeight)
                state.playerTwo.y = this.canvasHeight - 100;
            else
                state.playerTwo.y += 15;
        }
        else if (ret == -1) {
            if (state.playerTwo.y < 15)
                state.playerTwo.y = 0;
            else
                state.playerTwo.y -= 15;
        }
    }
    startGameInterval(server, state, roomName) {
        const interval = setInterval(() => {
            const winner = this.gameloop(state[roomName]);
            if (this.gameActive) {
                if (!winner) {
                    this.emitGameState(server, state[roomName], roomName);
                }
                else {
                    this.emitGameOver(server, roomName, winner);
                    this.state[roomName] = null;
                    clearInterval(interval);
                    this.gameActive = false;
                }
            }
            else {
                console.log(`player ${this.playerDisconnected} was disconnected`);
                this.emitPlayerDesconnected(server, roomName, this.playerDisconnected);
                clearInterval(interval);
            }
        }, 1000 / constants_1.FRAMERATE);
    }
    handleNewGame(client, name) {
        let roomName = Math.floor(Math.random() * 1000000);
        this.clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);
        this.state[roomName] = this.createGameState();
        this.state[roomName].playerOne.id = client.id;
        this.state[roomName].playerOne.name = name;
        client.join(roomName.toString());
        client.emit('init', 1);
    }
    handleJoinGame(server, client, gameCode, name) {
        let room;
        if (!gameCode)
            return;
        this.gameActive = true;
        server.sockets.adapter.rooms.get(gameCode).forEach((value) => room = value);
        let allUsers;
        if (room) {
            allUsers = server.sockets;
        }
        let numClients = 0;
        if (allUsers) {
            numClients = server.engine.clientsCount;
            console.log("length: ", numClients);
        }
        if (numClients === 0) {
            client.emit('unknownGame');
            return;
        }
        this.clientRooms[client.id] = gameCode;
        client.join(gameCode);
        this.state[gameCode].playerTwo.id = client.id;
        this.state[gameCode].playerTwo.name = name;
        client.emit('init', 2);
        this.startGameInterval(server, this.state, gameCode);
    }
    handleSpectateGame(server, client, gameCode) {
        let room;
        if (!gameCode)
            return;
        server.sockets.adapter.rooms.get(gameCode).forEach((value) => room = value);
        this.clientSpectating[client.id] = gameCode;
        setInterval(() => {
            const state = this.state[gameCode];
            server.emit("spectateState", JSON.stringify(state));
        }, 1000 / constants_1.FRAMERATE);
    }
    emitGameState(server, gameState, roomName) {
        server.sockets.in(roomName).emit("gameState", JSON.stringify(gameState));
    }
    emitGameOver(server, roomName, winner) {
        server.in(roomName).emit('gameOver', JSON.stringify(winner));
    }
    emitPlayerDesconnected(server, roomName, winner) {
        server.in(roomName).emit('playerDisconnected', JSON.stringify(winner));
    }
};
GameTwoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GameTwoService);
exports.GameTwoService = GameTwoService;
//# sourceMappingURL=game-two.service.js.map