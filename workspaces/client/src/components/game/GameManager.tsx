import useSocketManager from '@hooks/useSocketManager';
import { useEffect } from 'react';
import { Listener } from '@components/websocket/types';
import { ServerEvents } from '@memory-cards/shared/server/ServerEvents';
import { ServerPayloads } from '@memory-cards/shared/server/ServerPayloads';
import { useRecoilState } from 'recoil';
import { CurrentChatMessages, CurrentLobbyState } from '@components/game/states';
import Introduction from '@components/game/Introduction';
import Game from '@components/game/Game';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';

export default function GameManager() {
  const router = useRouter();
  const {sm} = useSocketManager();
  const [lobbyState, setLobbyState] = useRecoilState(CurrentLobbyState);
  const [chatMessages, setChatMessages] = useRecoilState(CurrentChatMessages);

  useEffect(() => {
    sm.connect();

    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = async (data) => {
      setLobbyState(data);

      router.query.lobby = data.lobbyId;

      await router.push({
        pathname: '/',
        query: {...router.query},
      }, undefined, {});
    };

    const onGameMessage: Listener<ServerPayloads[ServerEvents.GameMessage]> = ({color, message}) => {
      showNotification({
        message: message,
        color: color,
        autoClose: 2000,
      });
    };

    const onNewChatMessage: Listener<ServerPayloads[ServerEvents.SubmittedChatMessage]> = async ( data ) => {
      setChatMessages(data);
    };

    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    sm.registerListener(ServerEvents.GameMessage, onGameMessage);
    sm.registerListener(ServerEvents.SubmittedChatMessage, onNewChatMessage);

    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.GameMessage, onGameMessage);
      sm.removeListener(ServerEvents.SubmittedChatMessage, onNewChatMessage);
    };
  }, []);

  if (lobbyState === null) {
    return <Introduction/>;
  }

  return <Game/>;
}