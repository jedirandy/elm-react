const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const args = require('yargs').argv;

const port = args.port || 8080;

config.entry.app.unshift(
    `webpack-dev-server/client?http://localhost:${port}`,
    'webpack/hot/dev-server'
);

config.plugins.push(
    new Webpack.HotModuleReplacementPlugin()
);

const compiler = Webpack(config);
const server = new WebpackDevServer(compiler, {
    stats: {
        colors: true
    },
    contentBase: './dist',
    hot: true
});

server.listen(port, () => {
    console.log(`listening to ${port}`);
});
