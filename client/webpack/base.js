import webpack from 'webpack';
import path, { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import { fileURLToPath } from 'url';

// https://stackoverflow.com/a/64383997/4982408
// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);

export default {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'),
    },
    port: 3001,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|mp3|wav|ogg|acc|flac)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(html)$/i,
        use: { loader: 'html-loader', options: { esModule: false } },
      },
      // https://what-problem-does-it-solve.com/webpack/css.html
      // https://github.com/webpack-contrib/style-loader
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new FaviconsWebpackPlugin({
      logo: './src/favicon/bloomby.png',
      mode: 'webapp',
      devMode: 'webapp',
      favicons: {
        appName: 'Witchazzan',
        start_url: '',
      },
    }),
  ],
};
