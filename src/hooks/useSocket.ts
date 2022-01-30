import {useCallback} from 'react';
import {io, Socket} from 'socket.io-client';
import {getUrl} from '../api';

let socket: Socket | undefined;

const useSocket = (): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  if (!socket) {
    socket = io(`${getUrl()}`, {
      transports: ['websocket'],
    });
  }
  return [socket, disconnect];
};

export default useSocket;
