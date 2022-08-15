"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameTwoModule = void 0;
const common_1 = require("@nestjs/common");
const game_two_service_1 = require("./game-two.service");
const game_two_gateway_1 = require("./game-two.gateway");
const game_1 = require("./game");
let GameTwoModule = class GameTwoModule {
};
GameTwoModule = __decorate([
    (0, common_1.Module)({
        providers: [game_two_gateway_1.GameTwoGateway, game_two_service_1.GameTwoService, game_1.Game],
    })
], GameTwoModule);
exports.GameTwoModule = GameTwoModule;
//# sourceMappingURL=game-two.module.js.map