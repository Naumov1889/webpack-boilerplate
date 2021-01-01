const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const paths = require('./paths');

// dynamically add all pug files to the config
const templates = [];
const files = fs.readdirSync(paths.src);
files.forEach((file) => {
  if (file.match(/\.pug$/)) {
    const filename = file.substring(0, file.length - 4);
    templates.push(
      new HtmlWebpackPlugin({
        template: `${paths.src}/${filename}.pug`,
        filename: `${filename}.html`,
      }),
    );
  }
});

module.exports = {
  mode: 'development',
  devtool: false,
  /**
     * Entry
     *
     * The first place Webpack looks to start building the bundle.
     */
  entry: [`${paths.src}/index.js`],

  /**
     * Output
     *
     * Where Webpack outputs the assets and bundles.
     */
  output: {
    path: paths.django,
    filename: '[name].bundle.js',
    publicPath: './',
  },

  /**
     * Plugins
     *
     * Customize the Webpack build process.
     */
  plugins: [
    /**
         * CleanWebpackPlugin
         *
         * Removes/cleans build folders and unused assets when rebuilding.
         */
    new CleanWebpackPlugin(),

    /**
         * CopyWebpackPlugin
         *
         * Copies files from target to destination folder.
         */
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.static,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
        },
      ],
    }),

    new ESLintPlugin(),

    /**
         * HtmlWebpackPlugin
         *
         * Generates an HTML file from a template.
         */
    // ...templates,
    // new HtmlWebpackPugPlugin(),

    /**
       * MiniCssExtractPlugin
       *
       * Extracts CSS into separate files.
       *
       * Note: style-loader is for development, MiniCssExtractPlugin is for production.
       * They cannot be used together in the same config.
       */
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      // chunkFilename: '[id].css',
      chunkFilename: 'style.css',
      // publicPath: '../src',
    }),
  ],

  /**
     * Module
     *
     * Determine how modules within the project are treated.
     */
  module: {
    rules: [
      /**
             * JavaScript
             *
             * Use Babel to transpile JavaScript files.
             */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },

      /**
             * Images
             *
             * Copy image files to build folder.
             */
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          context: 'src', // prevent display of src/ in filename
        },
      },

      /**
             * Fonts
             *
             * Inline font files.
             */
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[path][name].[ext]',
          context: 'src', // prevent display of src/ in filename
        },
      },
      {
        test: /\.pug/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
            options: {
              // other options https://pugjs.org/api/reference.html
              pretty: true, // to not minify
            },
          },
        ],
      },
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
    minimize: true,
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
};
