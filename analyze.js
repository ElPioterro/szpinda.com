process.env.NODE_ENV = "production";

const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const config = require("react-scripts/config/webpack.config")("production");

config.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: "static", // Generates a static HTML file
    reportFilename: "report.html", // Name of the report file
    openAnalyzer: true, // Automatically opens the report in the browser
  })
);

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err || stats.toJson().errors);
  }
});
