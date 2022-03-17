const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');

module.exports={
    entry: ['babel-polyfill','./src/js/index.js'],
    output: {
        path: path.resolve(__dirname,'./dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
//        port:8080,
//        publicPath: '/js/',//wds in memory bundle file serve from this location , by default it is / , it's name will same as filename of output object ,to get in memory bundle file you to define src="http://localhost:port/publicpath/filename" in script tag of html
        contentBase: './dist',//index.html is server from here.
//        watchContentBase: true
//        open: true,
//        hot: true,
//        inline: true,
//        hotOnly: true
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
            
        ]
    }
    
}