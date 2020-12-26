import { inject } from "vue";
import { Connection } from "../../store/connectionHandler";

export function ensureConnection(): Connection {
    const connection : Connection | undefined = inject('connection');
    if(connection){
        return connection;
    }else{
        throw new Error('Connection not available in ui.');
    }
}