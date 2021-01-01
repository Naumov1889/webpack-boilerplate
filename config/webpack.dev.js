// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('webpack-merge');
const paths = require('./paths');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  /**
     * Mode
     *
     * Set the mode to development or production.
     */
  mode: 'development',
  target: process.env.NODE_ENV === 'development' ? 'web' : 'browserslist',

  /**
     * Devtool
     *
     * Control how source maps are generated.
     */
  devtool: 'inline-source-map',

  /**
     * DevServer
     *
     * Spin up a server for quick development.
     */
  devServer: {
    historyApiFallback: true,
    contentBase: paths.build,

    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },

  module: {
    rules: [
      /**
             * Styles
             *
             * Inject CSS into the head with source maps.
             */
      {
        test: /\.(pcss|css)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                from: `${paths.src}/` + 'styles', // necessary for postcss-import
                plugins: [
                  // eslint-disable-next-line import/no-extraneous-dependencies
                  require('postcss-import'),
                  // eslint-disable-next-line import/no-extraneous-dependencies
                  require('precss'),
                  // eslint-disable-next-line import/no-extraneous-dependencies
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

  plugins: [
    /**
         * HotModuleReplacementPlugin
         *
         * Only update what has changed.
         */
    new webpack.HotModuleReplacementPlugin(),
  ],
});
