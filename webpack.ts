import * as path from 'path';
import { lib as sls } from 'serverless-webpack';
import * as nodeExternals from 'webpack-node-externals';

const entry = sls.entries;
let mode = 'production';
const optimization = { minimize: true };

if (sls.webpack.isLocal) {
	mode = 'development';
}

const config = {
	target: 'node',
	entry,
	mode,
	watch: true,
	optimization,
	stats: { all: false, colors: true, entrypoints: true, assets: true },
	module: {
		rules: [
			{ test: /.ts?$/, exclude: /node_modules/, loader: 'ts-loader', options: { transpileOnly: true } },
			{ test: /\.(graphql|gql)$/i, loader: 'raw-loader' },
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.ts'],
	},
	output: {
		libraryTarget: 'commonjs2',
		path: path.join(__dirname, '.webpack'),
		filename: '[name].js',
	},
	externals: [
		nodeExternals({
			modulesDirs: [
				'node_modules',
				'services/service1/node_modules',
				'services/service2/node_modules'
			]
		}),
	],
};

module.exports = config;
