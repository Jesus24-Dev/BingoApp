import { StatusBarProps } from "../types/bingo";

const StatusBar = ({connectionStatus}: StatusBarProps) => {
    return (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-full text-sm font-medium shadow-md ${
            connectionStatus === 'connected' ? 'bg-green-500 text-white' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500 text-white' : 
            'bg-red-500 text-white'
          }`}>
            {connectionStatus === 'connected' ? 'Conectado' : 
             connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
          </div>
    );
};

export default StatusBar;