const path = require('path');

const commonConfig = {
    mode: "development",
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: [/node_modules/]
            },
            {
                test: /\.s?css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName:'[local]'
                        }
                    }
                }, 'sass-loader'],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx' ],
        fallback: {
            fs: false,
            buffer: require.resolve('buffer'),
            crypto: require.resolve('crypto-browserify'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify')
        }
    },
    externals: {
        "react": "commonjs react",
        "react-dom": "commonjs react-dom"
    }
};

const webChart = {
    ...commonConfig,
    entry: {
        'charts':'./build/src/charts.js'
    },
    output: {
        filename: '[name].js',
        library: {
            type:'commonjs'
        },
        umdNamedDefine: true,
        path: path.resolve(__dirname, 'build/dist')
    }
};

module.exports =[webChart];

