const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.common.js');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'development',
  devtool: false,
  output: {
    path: paths.build,
    publicPath: './',
    filename: '[name].[contenthash].bundle.js',
  },
  plugins: [
    /**
         * MiniCssExtractPlugin
         *
         * Extracts CSS into separate files.
         *
         * Note: style-loader is for development, MiniCssExtractPlugin is for production.
         * They cannot be used together in the same config.
         */
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      // chunkFilename: '[id].css',
      chunkFilename: 'style.css',
      // publicPath: '../src',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(pcss|css)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // publicPath: '../src',
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                from: `${paths.src}/` + 'styles', // necessary for postcss-import
                plugins: [
                  require('postcss-import'),
                  require('precss'),
                  require('postcss-preset-env'),
                  require('postcss-sort-media-queries')({
                    sort: 'desktop-first',
                  }),
                ],
              },
            },
          },
        ],
      },
    ],
  },

  /**
     * Optimization
     *
     * Production minimizing of JavaScript and CSS assets.
     */
  optimization: {
    minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin({})],
    // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
    // instead of having their own. This also helps with long-term caching, since the chunks will only
    // change when actual code changes, not the webpack runtime.
    runtimeChunk: 'single',
    // This breaks apart commonly shared deps (react, semantic ui, etc) into one shared bundle. React, etc
    // won't change as often as the app code, so this chunk can be cached separately from app code.
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|lodash)[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
