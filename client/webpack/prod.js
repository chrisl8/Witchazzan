import { merge } from 'webpack-merge';
import path, { dirname } from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { fileURLToPath } from 'url';
import base from './base.js';

// https://stackoverflow.com/a/64383997/4982408
// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);

export default merge(base, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'bundle.min.js',
    publicPath: '/',
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 9000000,
    maxAssetSize: 9000000,
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, '../'),
    }),
  ],
});
