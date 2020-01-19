const path = require('path');

module.exports = {
    entry: {
        battle: './webui/battle.js',
        teams: './webui/make-teams.js'
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
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
};
