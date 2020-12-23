const path = require('path');

module.exports = {
    watchOptions: { aggregateTimeout: 300, poll: 1000, ignored: 'node_modules/**'},
    entry: path.resolve(__dirname, 'src' , 'index.ts'),
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build', 'bundle'),
    },
};