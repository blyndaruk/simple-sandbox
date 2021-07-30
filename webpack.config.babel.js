/* TODO:
 1. Remove all comments and garbage imports/code : ****DONE****
 2. Remove all packages don't need any more : ****DONE****
 3. JSON multiple files : ****DONE**** -decision not to use json but raw twig templates with variables
 4. Testing
 5. Test twig functionality
 6. Rename repo without spaces and symbols
 7. Create styles structure
 8. Create twig and data structure : ****DONE****
 9. Add svg-sprite plugin : ****DONE****
 10. Add imagemin plugin : ****DONE****
 11. Auto add entries from folder (fs loop)
 12. Fix package.json file : ****DONE****
 13. Remove all test files : ****DONE****
 14. Write Readme.md
 15. Autoprefixer + check styles bundling for prod : ****DONE****
 16. Scss mixins, helpers and vars
 17. JS Utils
 18. Add script for serve only build
 */

import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlBeautifyPlugin from 'html-beautify-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import SVGSpritemapPlugin from 'svg-spritemap-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';
import eslintformatter from 'eslint-formatter-pretty';

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';
const pagesExtension = isProduction ? 'php' : 'html';

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split(".");
    const [name, extension] = parts;
    return new HtmlWebpackPlugin({
      filename: `${name}.${pagesExtension}`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
      // minify: {
      //   collapseWhitespace: true
      // }
    });
  });
}

const htmlPlugins = generateHtmlPlugins("./src/views");

const config = {
  mode,
  entry:
    {
      polyfilled: ['./src/js/polyfilled.js'],
      app: ['./src/js/app.js'],
      home: ['./src/js/home.js'],
      404: ['./src/js/404.js'],
      audio: ['./src/js/audio.js'],
    },
  output: {
    path: path.join(__dirname, 'build'),
    filename: './js/[name].js',
    publicPath: '',
  },
  devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      })
    ]
  },
  devServer: {
    historyApiFallback: {
      index: '/404.html'
    },
    hot: true,
    inline: true,
    compress: true,
    port: 3000,
    host: 'localhost',
    overlay: {
      warnings: false,
      errors: true
    },
    clientLogLevel: "none",
    before(app, server, compiler) {
      const watchFiles = ['.html', '.twig', '.json'];
      compiler.plugin('done', () => {
        const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);
        const wasChanged = changedFiles.some(filePath => watchFiles.includes(path.parse(filePath).ext));
        if (this.hot && wasChanged) {
          server.sockWrite(server.sockets, 'content-changed');
        }
      });
    }
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        },{
          loader: 'expose-loader',
          options: '$'
        }]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.s([ac])ss$/,
        loader: [
          !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: './postcss.config.js'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../fonts/'
            }
          }
        ]
      },
      {
        test: /\.(svg|jpg|png)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: (url, resourcePath, context) => {
                let relativePath = path.relative(context, resourcePath);
                relativePath = relativePath.replace('src/', '../');
                return relativePath;
              },
            }
          }
        ]
      },
      {
        test: /\.twig$/,
        use: [
          'raw-loader',
          {
            loader: 'twig-html-loader',
            options: {
              namespaces: {
                'templates': path.join(__dirname, './src/templates'),
                'layouts': path.join(__dirname, './src/templates/layouts'),
                'partials': path.join(__dirname, './src/templates/partials'),
                'components': path.join(__dirname, './src/templates/components'),
                'mixins': path.join(__dirname, './src/templates/mixins'),
                'pages': path.join(__dirname, './src/templates/pages'),
              },
              // debug: !isProduction,
              data: (context) => {
                const contextPath = context.resourcePath;
                const name = contextPath.split(path.sep).pop().split('.').shift();
                const data = path.join(__dirname, `src/data/${name}.json`);
                const global = path.join(__dirname, 'src/data/_global.json');

                // Force webpack to watch file
                context.addDependency(data);
                context.addDependency(global);

                const fileData = context.fs.readJsonSync(data, { throws: false }) || {};
                const globalData = context.fs.readJsonSync(global, { throws: false }) || {};

                return ({ ...globalData, ...fileData}) || {};
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.html', '.twig', '.js', '.scss', '.css'],
    modules: ["node_modules"],
  },
  watch: !isProduction,
  watchOptions: {
    aggregateTimeout: 500,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: !isProduction ? '/css/[name].css' : '/css/[name].css',
      chunkFilename: !isProduction ? '/css/[id].css' : '/css/[id].css'
    }),
    new SVGSpritemapPlugin('./src/icons/**/*.svg', {
      output: {
        filename: './img/svg-sprite.svg',
        svgo: true,
      },
      sprite: {
        prefix: 'icon-'
      }
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/img",
        to: "./img"
      },
      {
        from: "./src/video",
        to: "./video"
      },
      {
        from: "./src/fonts",
        to: "./fonts"
      },
      {
        from: "./src/files",
        to: "./files"
      }
    ]),
    new WebpackNotifierPlugin({
        excludeWarnings: true
      }
    ),
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          formatter: eslintformatter
        }
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),

  ].concat(htmlPlugins)
};


module.exports = config;

if (isProduction) {
  module.exports.plugins.push(
    new HtmlBeautifyPlugin({
      config: {
        html: {
          end_with_newline: true,
          indent_size: 2,
          indent_inner_html: true,
          preserve_newlines: true,
          // unformatted: ['p', 'i', 'b', 'span']
        }
      },
      replace: [ ' type="text/javascript"' ]
    }),
    // new ImageminPlugin({
    //   test: ['img/**', 'lazy-placeholders/**'],
    //   cacheFolder: './.cache',
    //   pngquant: {
    //     quality: '70-80',
    //     strip: true,
    //     verbose: true,
    //   },
    //   optipng: {
    //     optimizationLevel: 9
    //   },
    //   minFileSize: 10000, // Only apply this one to files over 10kb
    //   jpegtran: { progressive: true },
    // })
  );
}
