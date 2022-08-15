import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { FRAMERATE } from './constants';


@Injectable()
export class GameTwoService {
    constructor() {}
    startGameInterval(clinet:Socket, state: any) {
      const interval = setInterval(() => {
        
      }, 1000 / FRAMERATE);  
    }
}
