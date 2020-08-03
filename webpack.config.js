const path = require('path');

const {NODE_ENV} = process.env;

module.exports = (env, argv) => ({
  mode: NODE_ENV,
  entry: path.resolve(__dirname, 'src/app.js'),
  output: {
    publicPath: '/assets/',
    path: path.resolve(__dirname, 'public/assets/js'),
    filename: `app.min.js`
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias:
      NODE_ENV === 'development'
        ? {}
        : {
            react: 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat'
          }
  }
});
