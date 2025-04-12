import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import StatusBar from "../components/StatusBar";

interface BingoLayoutProps {
    children: React.ReactNode;
    socket: Socket | null;
}

function BingoLayout({ children, socket }: BingoLayoutProps) {
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
      useEffect(() => {
        if (!socket) return;
    
        const onConnect = () => {
          setConnectionStatus('connected');
        };
    
        const onDisconnect = () => {
          setConnectionStatus('disconnected');
        };
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
    
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
        };
      }, [socket]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-6">
            <StatusBar connectionStatus={connectionStatus}/>
            <section className="max-w-7xl mx-auto">
                {children}
            </section>       
        </main>
    );
}

export default BingoLayout;