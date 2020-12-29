// @ts-ignore
import html from './instrument.html';
import { defineComponent, ref } from "vue";


const ROWS = 12;
const COLS = 64;

const ON = '▣';
const OFF = '□';
function connectToJam() {

    const pattern = Array(ROWS).fill([]).map(() => Array(COLS).fill(OFF));

    const jamState = ref({
        tempo: 120,
        instruments: {
            'clientId': {
                type: 'zither',
                pattern
            }
        }
    });

    return {
        noteEnabledClass(row: number, col: number) {
            return jamState.value.instruments['clientId'].pattern[row][col] === ON;
        },
        removeNote(row: number, col: number) {
            jamState.value.instruments['clientId'].pattern[row][col] = OFF;
        },
        setNote(row: number, col: number) {
            jamState.value.instruments['clientId'].pattern[row][col] = ON;
        },
        toggle(row: number, col: number) {
            console.log("toggle", row, col);
            const current = jamState.value.instruments['clientId'].pattern[row][col];
            console.log("toggle", current);
            jamState.value.instruments['clientId'].pattern[row][col] = (current === OFF) ? ON : OFF;
        },
        increaseTempo() {
            jamState.value.tempo += 1;
        },
        decreaseTempo() {
            jamState.value.tempo -= 1;
        },
        jamState
    }
}

function mod(x: number, N: number) {
    return (x % N + N) % N;
}

function createCursor() {
    const position = ref({
        row: 0, col: 0
    });


    return {
        cursorClass(row: number, col: number) {
            return position.value.row === row && position.value.col === col;
        },
        left() {
            position.value.col = mod(position.value.col - 1, COLS)
        },
        right() {
            position.value.col = mod(position.value.col + 1, COLS)
        },
        up() {
            position.value.row = mod(position.value.row + 1, ROWS)
        },
        down() {
            position.value.row = mod(position.value.row + 1, ROWS)
        },
        position
    }
}

function createSequenzer(){
    const currentColumn = ref(0);

    setInterval(()=>{
        currentColumn.value = mod(currentColumn.value+1, COLS);
    },500);

    return {
        stepPlayingClass(col:number){
            return currentColumn.value === col;
        },
        currentColumn
    }
}



export const SetzlingInstrument = defineComponent({
    template: html,
    setup() {
        const jam = connectToJam();
        const cursor = createCursor();
        const sequenzer = createSequenzer();
        return {
            ...sequenzer,
            ...jam,
            ...cursor
        };
    }
});