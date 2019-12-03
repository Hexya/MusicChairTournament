const webpack = require('webpack');
const path = require('path');

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const DashboardPlugin = require('webpack-dashboard/plugin');

// Global variables
const APP_TITLE = 'My new App';
const entry = './src/application.js';

module.exports = {
	entry: entry,
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},

	devServer: {
		compress: true,
		contentBase: path.join(__dirname, 'dist'),
		host: 'localhost',
		inline: true,
		port: 8080,
		stats: {
			chunks: false,
			colors: true,
			modules: false,
			reasons: true,
		},
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: { minimize: true },
					},
				],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg|otf|ttf)$/i,
				use: {
					loader: 'file-loader',
				},
			},
			{
				test: /\.(mp3)$/i,
				use: {
					loader: 'file-loader',
				},
			},
			{
				test: /\.(ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, // Font file
				use: {
					loader: 'file-loader',
				},
			},
			{
				test: /\.glsl$/,
				loader: 'webpack-glsl-loader',
			},
			{
				test: /\.(gltf|glb)$/,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: APP_TITLE,
			template: './src/index.html',
			filename: './index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true,
			},
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new DashboardPlugin(),
	],

	optimization: {},

	resolve: {
		alias: {
			three: path.resolve(__dirname, 'node_modules/three'),
		},
	},

	target: 'web',
};
