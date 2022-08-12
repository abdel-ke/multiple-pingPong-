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
    }
    setPlayer(setPlayerDto, clientId) {
        const { matchId, name } = setPlayerDto;
        const match = this.matches.find(m => m.id === matchId);
        const canvWidth = 600;
        const canvheight = 400;
        if (!match) {
            const newMatch = {
                id: matchId,
                playerOne: {
                    socketId: clientId,
                    name,
                    x: 0,
                    y: (canvheight - 100) / 2,
                    width: 10,
                    height: 100,
                    color: 'white',
                    score: 1337,
                },
                playerTwo: {
                    socketId: null,
                    name: null,
                    x: canvWidth - 10,
                    y: (canvheight - 100) / 2,
                    width: 10,
                    height: 100,
                    color: 'white',
                    score: 220,
                },
                ball: {
                    x: canvWidth / 2,
                    y: canvheight / 2,
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
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map