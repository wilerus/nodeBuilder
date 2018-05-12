const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const jsFileName = 'core.js';
const jsFileNameMin = 'core.min.js';
const cssFileName = 'core.css';
const cssFileNameMin = 'core.min.css';
const FlowWebpackPlugin = require('flow-webpack-plugin');

const pathResolver = {
    client() {
        return path.resolve.apply(path.resolve, [__dirname, 'dist'].concat(Array.from(arguments)));
    },
    source() {
        return path.resolve.apply(path.resolve, [__dirname, 'src'].concat(Array.from(arguments)));
    },
    node_modules() {
        return path.resolve.apply(path.resolve, [__dirname, 'node_modules']);
    },
    tests() {
        return path.resolve.apply(path.resolve, [__dirname, 'tests']);
    }
};

module.exports = options => {
    const PRODUCTION = process.argv.includes('-p');

    const FONT_LIMIT = PRODUCTION ? 10000 : 1000000;
    const GRAPHICS_LIMIT = PRODUCTION ? 10000 : 1000000;
    const webpackConfig = {
        mode: PRODUCTION ? 'production' : 'development',
        devtool: 'source-map',
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'eslint-loader',
                    exclude: [pathResolver.client(), pathResolver.node_modules(), pathResolver.tests()],
                    include: [pathResolver.source()],
                    options: {
                        quiet: true,
                        //fix: true,
                        cache: true
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: [pathResolver.node_modules(), pathResolver.source('external/rangyinputs-jquery-src.js')],
                    options: {
                        presets: [
                            ['flow'],
                            [
                                'env',
                                {
                                    targets: {
                                        browsers: ['ie 11', '> 0.25%', 'not chrome 29']
                                    }
                                }
                            ]
                        ],
                        cacheDirectory: true
                    }
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader'
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true,
                                    plugins: () => {
                                        const plugins = [
                                            autoprefixer({
                                                browsers: ['ie 11', '> 0.25%', 'not chrome 29']
                                            })
                                        ];
                                        if (PRODUCTION) {
                                            plugins.push(
                                                cssnano({
                                                    preset: [
                                                        'default',
                                                        {
                                                            discardComments: {
                                                                removeAll: true
                                                            }
                                                        }
                                                    ]
                                                })
                                            );
                                        }
                                        return plugins;
                                    }
                                }
                            }
                        ]
                    })
                },
                {
                    test: /\.hbs$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.woff(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        prefix: 'fonts/',
                        name: '[path][name].[ext]',
                        limit: FONT_LIMIT,
                        mimetype: 'application/font-woff'
                    }
                },
                {
                    test: /\.eot(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        prefix: 'fonts/',
                        name: '[path][name].[ext]',
                        limit: FONT_LIMIT,
                        mimetype: 'application/font-eot'
                    }
                },
                {
                    test: /\.ttf(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        prefix: 'fonts/',
                        name: '[path][name].[ext]',
                        limit: FONT_LIMIT,
                        mimetype: 'application/font-ttf'
                    }
                },
                {
                    test: /\.woff2(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        prefix: 'fonts/',
                        name: '[path][name].[ext]',
                        limit: FONT_LIMIT,
                        mimetype: 'application/font-woff2'
                    }
                },
                {
                    test: /\.otf(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        prefix: 'fonts/',
                        name: '[path][name].[ext]',
                        limit: FONT_LIMIT,
                        mimetype: 'font/opentype'
                    }
                },
                {
                    test: /\.svg(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        prefix: 'fonts/',
                        name: '[path][name].[ext]',
                        limit: GRAPHICS_LIMIT,
                        mimetype: 'image/svg+xml'
                    }
                },
                {
                    test: /\.(png|jpg)$/,
                    loader: 'url-loader',
                    options: {
                        limit: GRAPHICS_LIMIT
                    }
                },
                {
                    test: /jquery-autosize/,
                    use: [
                        {
                            loader: 'imports-loader',
                            options: 'jquery'
                        }
                    ]
                },
                {
                    test: /rangyinputs/,
                    use: [
                        {
                            loader: 'imports-loader',
                            options: 'jquery'
                        }
                    ]
                },
                {
                    test: /bootstrap-datetime-picker/,
                    use: [
                        {
                            loader: 'imports-loader',
                            options: 'jquery'
                        }
                    ]
                },
                {
                    test: /backbone\.marionette\.js/,
                    use: [
                        {
                            loader: 'expose-loader',
                            options: 'Marionette'
                        }
                    ]
                },
                {
                    test: /backbone\.js/,
                    use: [
                        {
                            loader: 'expose-loader',
                            options: 'Backbone'
                        }
                    ]
                },
                {
                    test: /moment\.js/,
                    use: [
                        {
                            loader: 'expose-loader',
                            options: 'moment'
                        }
                    ]
                },
                {
                    test: /handlebars\.js/,
                    use: [
                        {
                            loader: 'expose-loader',
                            options: 'Handlebars'
                        }
                    ]
                },
                {
                    test: /underscore\.js/,
                    use: [
                        {
                            loader: 'expose-loader',
                            options: '_'
                        }
                    ]
                },
                {
                    test: /jquery\.js/,
                    use: [
                        {
                            loader: 'expose-loader',
                            options: '$'
                        },
                        {
                            loader: 'expose-loader',
                            options: 'jQuery'
                        }
                    ]
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: PRODUCTION ? cssFileNameMin : cssFileName
            }),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|ru|en/),
            new CleanWebpackPlugin([pathResolver.client()], {
                root: pathResolver.source(),
                verbose: false,
                exclude: ['localization']
            })
            //new FlowWebpackPlugin()
        ],
        resolve: {
            modules: [pathResolver.source(), pathResolver.node_modules()],
            alias: {
                rangyinputs: pathResolver.source('external/rangyinputs-jquery-src'),
                'backbone.trackit': pathResolver.source('external/backbone.trackit.js'),
                'jquery-ui': pathResolver.source('external/jquery-ui.js'),
                handlebars: 'handlebars/dist/handlebars',
                localizationMap: pathResolver.client('localization/localization.en.json')
            }
        },
        devServer: {
            noInfo: true,
            stats: 'minimal'
        },
        entry: ['babel-polyfill', pathResolver.source('index.js')],
        output: {
            path: pathResolver.client(),
            filename: jsFileName,
            library: 'core',
            libraryTarget: 'umd'
        }
    };

    return webpackConfig;
};
