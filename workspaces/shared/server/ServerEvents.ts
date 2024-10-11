export enum ServerEvents
{
  // General
  Pong = 'server.pong',

  // Lobby
  LobbyState = 'server.lobby.state',

  // Game
  GameMessage = 'server.game.message',

  // Chat Messages
  SubmittedChatMessage = 'server.message.submitted',
  ChatHistory = 'server.message.history',
}
