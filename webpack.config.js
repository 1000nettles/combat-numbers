const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  name: 'combat-numbers',
  mode: 'development',
  devtool: 'source-map',
  entry: './src/combat-numbers.js',
  output: {
    filename: 'combat-numbers.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './module.json', to: './' },
        { from: './lang/*', to: './' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
};
