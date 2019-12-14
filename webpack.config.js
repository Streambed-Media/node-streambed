const path = require('path')
const env = process.env

const isProduction = env === 'production';
module.exports = {
    entry: './src/App.js',
    mode: 'development',
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node-modules/
        }]
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
    output: {
        path: path.join( __dirname, 'public'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join( __dirname, 'public')
    }
}