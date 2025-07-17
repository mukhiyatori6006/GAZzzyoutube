// Streeam Me Devloper Bloggers.web.id - Webpack Configuration for Cloudflare Workers

const path = require('path');

module.exports = {
  target: 'webworker',
  mode: 'production',
  entry: './worker.js',
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  externals: {
    // Exclude Node.js built-in modules
    'fs': 'commonjs2 fs',
    'path': 'commonjs2 path',
    'crypto': 'commonjs2 crypto',
    'stream': 'commonjs2 stream',
    'util': 'commonjs2 util',
    'buffer': 'commonjs2 buffer',
    'events': 'commonjs2 events',
  },
  optimization: {
    minimize: true,
  },
};