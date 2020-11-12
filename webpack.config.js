const path = require('path');

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
    minimize: true,
  },
  watch: true
};