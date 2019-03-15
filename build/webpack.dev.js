const webpack = require('webpack')
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {theme} = require('../package.json');
const env = process.argv.slice(-1)[0];

module.exports = {
  entry: {
    app: ['babel-polyfill',path.resolve(__dirname, '../src/index.js')],
    // app: path.resolve(__dirname, '../src/index.js'),
  },
  output: {
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [{
          loader: 'babel-loader',
          query: {
            "plugins": [
              "dynamic-import-webpack",
            ],
            presets: ['@babel/react', '@babel/preset-env'],
          },
        }],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
          },
        ],
        include: [path.join(__dirname, "../src")]
      },
      {
        test: /\.json$/i,
        type: 'javascript/auto',
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          // MiniCssExtractPlugin.loader,
          // 'style-loader',
          // "css-loader?modules&localIdentName=[local]-[contenthash:base64:8]",
          // "css-loader?modules",
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          // "postcss-loader",
          {loader: 'less-loader', options: {modifyVars: theme}},
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: "file-loader",
          },
          {
            loader: 'css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:8]!!',
          },
          // {
          //   loader: 'postcss-loader',
          //   options:{
          //     ident: 'postcss',
          //     sourceMap: true,
          //     config: {
          //       path: path.resolve(__dirname, './postcss.config.js'),
          //     },
          //   },
          // },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: "file-loader",
          },
          // {
          //   loader: 'postcss-loader',
          //   options:{
          //     ident: 'postcss',
          //     sourceMap: true,
          //     config: {
          //       path: path.resolve(__dirname, './postcss.config.js'),
          //     },
          //   },
          // },
          // "css-loader",
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.sass$/,
        use: ['style-loader', 'css-loader', 'sass-loader?outputStyle=expanded&indentedSyntax'],
      }, {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader?outputStyle=expanded'],
      },
      {
        test: /\.(png|jpe?g|gif|woff|woff2|ttf|eot|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/octet-stream"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: "file-loader",
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   'antd':'antd',
    // }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./manifest.json'),
    // }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      // favicon: path.resolve(__dirname, '../favicon.ico'),
      filename: "index.html",
      template: path.resolve(__dirname, "../src/index.ejs"),
      inject: true,
      hash: true,
      chunksSortMode: 'none',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: [".mjs",".js", ".json", ".jsx", ".ts", ".tsx"],
    alias: {
      '@': path.resolve(__dirname, "../src/"),
      'components': path.join(__dirname, '../src/components'),
    },
    modules: ['node_modules'],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'bizcharts':"BizCharts",
    // 'antd':'antd',
    // moment:"moment",
  },
};
