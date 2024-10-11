import { Socket } from 'socket.io';
import { Lobby } from '@app/game/lobby/lobby';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ChatMessage } from '@shared/server/types';


export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
    messages: ChatMessage[];
  };


  emit: <T>(ev: ServerEvents, data: T) => boolean;
};