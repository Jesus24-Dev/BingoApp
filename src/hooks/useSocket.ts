import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>('')
  const [logged, setIsLogged] = useState<boolean>(false)

  useEffect(() => {

    if(!logged) return;
    
      setToken(localStorage.getItem('token'))

      const socketIo = io(url, {
        auth: {
          token: token
        }
      });

    setSocket(socketIo);
    
    
    return () => {
      socketIo.disconnect();
    };

  }, [url, token, logged]);

  return {socket, token, logged, setIsLogged};
};