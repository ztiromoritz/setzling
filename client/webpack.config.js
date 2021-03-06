const webpack = require('webpack');
const path = require('path');

module.exports = {
    watchOptions: { aggregateTimeout: 300, poll: 1000, ignored: 'node_modules/**' },
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'ts-loader',
                    options: {
                        //transpileOnly: true
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.html$/i,
                use: [
                    {
                        loader: 'raw-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            }
        ],
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm-bundler.js',
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: path.join(__dirname, 'build', 'vendor-manifest.json')
        })
    ],

    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build', 'bundle'),
    },
};