import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

const { PRODUCTION } = process.env

export default {
    input: 'build/index.js',
    output: {
        dir: 'build/bundle/',
        format: 'es'
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
        commonjs()]
};