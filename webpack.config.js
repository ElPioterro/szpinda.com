const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  entry: "./src/index.js", // Entry point of your app
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output file name
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Process .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/, // Process CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Process image files
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Use your HTML template
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // Generates a static HTML file
      openAnalyzer: true, // Automatically opens the report in your browser
    }),
  ],
  devServer: {
    static: "./dist", // Serve files from the dist directory
    port: 3000, // Development server port
    open: true, // Automatically open the browser
  },
  mode: "development", // Set mode to development
};
