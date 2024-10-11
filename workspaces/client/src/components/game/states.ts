import { atom } from 'recoil';
import { ServerPayloads } from '@memory-cards/shared/server/ServerPayloads';
import { ServerEvents } from '@memory-cards/shared/server/ServerEvents';

export const CurrentLobbyState = atom<ServerPayloads[ServerEvents.LobbyState] | null>({
  key: 'CurrentLobbyState',
  default: null,
});

export const CurrentChatMessages = atom<ServerPayloads[ServerEvents.ChatHistory] | null>({
  key: 'CurrentChatMessages',
  default: null,
});

