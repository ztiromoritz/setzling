import { inject } from "vue";
import { Commands } from "../../commands/commands";

export function ensureCommands() {
    const commands: Commands | undefined = inject('commands');
    if(commands){
        return commands;
    }else{
        throw new Error('Commands not available in ui.');
    }
}