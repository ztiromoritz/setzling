const webpack = require('webpack');
const path = require('path');
module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        // Not in vendor bundle
        // "setzling-common": "file:../common/",
        vendor: ['immer', 'lindenmayer', 'perlin.js', 'phaser', 'tone', 'lib-jitsi-meet', 'vue/dist/vue.esm-bundler.js']
    },
    output: {
        filename: 'vendor.bundle.js',
        path: path.join(__dirname, 'build','bundle'),
        library: 'vendor_lib'
    },
    plugins: [
        new webpack.DllPlugin({
            name: 'vendor_lib',
            path: path.join(__dirname, 'build', 'vendor-manifest.json')
        }),
        new webpack.DefinePlugin({
            __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
            __VUE_OPTIONS_API__: JSON.stringify(true)
        })
    ]
}