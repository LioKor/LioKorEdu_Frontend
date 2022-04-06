const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            BUILD_TIMESTAMP: Date.now(),
            VERSION: JSON.stringify(require('./package.json').version)
        }),
    ],
    devServer: {
        port: 9000,
        historyApiFallback: {
            rewrites: [
                {
                    from: /.(js|png)$/,
                    to: (context) => {
                        const path = context.parsedUrl.pathname.split('/')
                        return `/${path[path.length - 1]}`
                    }
                },
                { from: /^\/#/, to: '/index.html' },
            ]
        },
        proxy: {
            '/api': {
                target: 'https://code.liokor.com',
                secure: false,
                changeOrigin: true
            }
        }
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
              test: /\.vue$/,
              use: [
                  'vue-loader',
              ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.png$/,
                loader: 'file-loader'
            },
            {
                test: /\.worker.js$/,
                use: { loader: 'worker-loader' }
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            // FIXME: Оно не работаеть! Потому я дописал
            //  этот модуль через import в "LiveEditor.js"
            // {
            //     test: /\.js$/,
            //     include: path.resolve(__dirname, 'src', 'vendor'),
            //     use: [
            //       'script-loader'
            //     ]
            // }
        ],
    }
};
