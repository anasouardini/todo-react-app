const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {Hash} = require('react-router-dom');
// const eslintWebpackPlugin = require('eslint-webpack-plugin');

require('dotenv').config();
const MODE = process.env.MODE;
console.log(MODE);

//todo: postcss(autoprefixer), watchers
module.exports = {
    mode: MODE,
    // mode: 'production',
    entry: {
        app: path.resolve(__dirname, 'src/scripts/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        // filename: '[name]_[hash].js',
        filename: '[name].js',
        clean: true,
        assetModuleFilename: 'assets/images/[name]_[hash][ext]',
    },
    // resolve: {
    //     extensions: ['.tsx', '.ts', '.js', '.jsx'],
    // },

    devtool: MODE == 'development' ? 'source-map' : false,
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    //* not installed though. the public path fixes a bug
                    //* {loder:MiniCssExtractPlugin.loader, options:{publicPath:''}},
                    {loader: 'style-loader', options: {}},
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: [{loader: 'style-loader', options: {}}, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(ico|png|jpe?g|gif|svg)$/i,
                type: 'asset', //auto
                //* type : 'asset/inline'//as a base64 encoded data, only good for tiny images/icons
                //* type : 'asset/resource'//as resource file
                //? inlining an SVG is different
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024, //8kb
                    },
                },
            },
            {
                test: /\.(woff2?|eot|[ot]tf)$/i,
                type: 'asset',
            },
            {
                test: /\.(js|ts)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {targets: 'defaults'}],
                            ['@babel/preset-react', {targets: 'defaults'}],
                            // ['@babel/preset-typescript', {targets: 'defaults'}],
                        ],
                    },
                },
            },
        ],
    },
    plugins:
        MODE == 'development'
            ? [
                  new htmlWebpackPlugin({
                      title: 'TODO dev',
                      filename: 'index.html',
                      template: 'src/template.html',
                      inject: false,
                      // hash: true
                  }),
                  // new eslintWebpackPlugin(),
              ]
            : [
                  new htmlWebpackPlugin({
                      title: 'TODO prod',
                      filename: 'index.html',
                      template: 'src/template.html',
                      inject: false,
                      // hash: true
                  }),
              ],

    devServer: {
        // magicHtml: false,
        // historyApiFallback: true,
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 3000,
        hot: true,
        open: false,
        compress: false,
        historyApiFallback: true,
        client: {
            reconnect: false,
            logging: 'error',
            overlay: false,
        },
    },
};
