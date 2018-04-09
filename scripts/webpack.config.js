const path = require('path');
const webpack = require('webpack');

const config = module.exports = {
    plugins: []
};

// Set context to root of project
config.context = path.resolve(__dirname, '..');

// Client entry
config.entry = {
    Vs: path.resolve(__dirname, '../src/main')
};

// Basic output config
config.output = {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: "Vs",
    libraryTarget: "umd",
};

config.externals = ['buefy', 'vuex', 'vue'];
// Resolver config
config.resolve = {
    extensions: ['.js', '.vue'],
    enforceExtension: false
};

config.resolveLoader = {
    modules: config.resolve.modules
};

config.module = {
    rules: [
        {
            test: /\.vue$/,
            use: 'vue-loader'
        },
        {
            test: /\.js$/,
            use: 'babel-loader',
            // important: exclude files in node_modules, otherwise it's going to be really slow!
            exclude: /node_modules|vendor/
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            exclude: /node_modules|vendor/,
            use: {
                loader: 'url-loader',
                options: {
                    name: 'images/[name].[ext]',
                }
            },
        },
        {
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    plugins: (loader) => [
                        require('postcss-import')({root: loader.resourcePath}),
                        require('autoprefixer')(), // browser compatibility
                        require('cssnano')()  // compress css
                    ]
                }
            }]
        },
        {
            test: /\.scss$/,
            use: [{
                loader: "style-loader",
                options: {
                    singleton: true,
                }
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }
    ]
};
process.traceDeprecation = true;
if (process.env.NODE_ENV === 'production') {
    config.output.filename = "Vs.min.js"
    config.devtool = '#source-map';

    // Pass build environment inside bundle
    // This will strip comments in Vue code & hort-circuits all Vue.js warning code
    config.plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }));

    // The UglifyJsPlugin will no longer put loaders into minimize mode, and the debug option has been deprecated.
    config.plugins.push(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }));

    // Minify with dead-code elimination
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false},
        sourceMap: true
    }));
} else {
    config.devtool = '#eval-source-map';
}
