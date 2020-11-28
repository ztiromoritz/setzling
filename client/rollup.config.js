import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

const {PRODUCTION} = process.env

export default {
    input: 'src/index.ts',
    output: {
        dir: 'build/bundle/',
        format: 'es',
        sourcemap: 'inline'
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify(
                PRODUCTION ? 'production' : 'development'
            )
        }),
        resolve({
            preferBuiltins: false
        }),
        typescript({
            sourceMap: false,
            tsconfig: './tsconfig.json',
        }),
        commonjs()
    ]
};