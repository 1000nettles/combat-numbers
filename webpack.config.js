const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: './src/combat-numbers.js',
  output: {
    filename: 'combat-numbers.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true
};