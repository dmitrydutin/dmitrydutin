const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: process.env.ASSET_PATH || '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.s?css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/i,
                type: 'asset/resource',
                use: 'svgo-loader'
            }
        ]
    },
    devtool: isProduction ? false : 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        compress: true,
        port: 9000,
        open: true,
        historyApiFallback: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
            inject: 'head',
            scriptLoading: 'defer',
            publicPath: ''
        }),
        new ESLintPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src', 'config', '_redirects'),
                    to: path.resolve(__dirname, 'build')
                },
                {
                    from: path.resolve(__dirname, 'src', 'assets', 'images', 'categories'),
                    to: path.resolve(__dirname, 'build')
                },
                {
                    from: path.resolve(__dirname, 'src', 'assets', 'images', 'common'),
                    to: path.resolve(__dirname, 'build')
                },
                {
                    from: path.resolve(__dirname, 'src', 'assets', 'sounds'),
                    to: path.resolve(__dirname, 'build')
                }
            ]
        })
    ]
};
