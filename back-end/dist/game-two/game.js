"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
let Game = class Game {
    createGameState() {
        return {
            playerOne: {
                x: 0,
                y: (-100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            playerTwo: {
                x: constants_1.canvasWidth - 10,
                y: (constants_1.canvasHeight - 100) / 2,
                width: 10,
                height: 100,
                color: 'white',
                score: 0,
            },
            ball: {
                x: constants_1.canvasWidth / 2,
                y: constants_1.canvasHeight / 2,
                radius: 10,
                speed: 7,
                velocityX: 7,
                velocityY: 7,
                color: "white"
            }
        };
    }
};
Game = __decorate([
    (0, common_1.Injectable)()
], Game);
exports.Game = Game;
//# sourceMappingURL=game.js.map