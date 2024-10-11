import { SocketExceptions } from './SocketExceptions';

export type ServerExceptionResponse = {
  exception: SocketExceptions;
  message?: string | object;
};

export class ChatMessage
{
  message: string;
  username: string;
  timestamp: string;
}

