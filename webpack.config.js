const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        battle: './webui/battle.js',
        teams: './webui/teams.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.ts$/, use: 'ts-loader' },
            { test: /\.m?js$/, use: 'babel-loader', exclude: /(node_modules|bower_components)/, }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: './webui/*.html', to: '.', flatten: true },
            { from: './webui/assets', to: './assets', flatten: true },
        ]),
    ],
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
};
