const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const webpack = require('webpack');

const folder = './client/app';
const bundles = {};

const webpackConfig = require('@ovh-ux/manager-webpack-config');

function foundNodeModulesFolder(checkedDir, cwd = '.') {
  if (fs.existsSync(`${cwd}/node_modules/${checkedDir}`)) {
    return path.relative(process.cwd(), `${cwd}/node_modules/${checkedDir}`);
  }

  if (path.resolve(cwd) !== '/') {
    return foundNodeModulesFolder(checkedDir, `${cwd}/..`);
  }

  return null;
}

fs.readdirSync(folder).forEach((file) => {
  const stats = fs.lstatSync(`${folder}/${file}`);
  if (file === 'components') return;
  if (stats.isDirectory()) {
    const jsFiles = glob.sync(`${folder}/${file}/**/!(*.module).js`);
    if (jsFiles.length > 0) {
      bundles[file] = jsFiles;
    }
  }
});

module.exports = (env = {}) => {
  const { config } = webpackConfig(
    {
      template: './client/app/index.html',
      basePath: './client/app',
      lessPath: ['./node_modules', '../../../node_modules'],
      root: path.resolve(__dirname, './client/app'),
      assets: {
        files: [
          { from: path.resolve(__dirname, './client/assets'), to: 'assets' },
          {
            from: path.resolve(__dirname, './client/**/*.html'),
            context: 'client/app',
          },
          {
            from: foundNodeModulesFolder('angular-i18n'),
            to: 'resources/angular/i18n',
          },
          { from: foundNodeModulesFolder('ckeditor'), to: 'ckeditor' },
        ],
      },
    },
    env,
  );

  config.plugins.push(
    new webpack.DefinePlugin({
      WEBPACK_ENV: {
        region: JSON.stringify(env.region),
        production: JSON.stringify(env.production),
      },
    }),
  );

  // Extra config files
  const extras = glob.sync('./.extras-EU/**/*.js');

  return merge(config, {
    entry: _.assign(
      {
        app: [
          './client/app/index.js',
          './client/app/app.js',
          './client/app/app.routes.js',
          './client/app/app.controller.js',
        ]
          .concat(glob.sync('./client/app/**/*.module.js'))
          .concat(glob.sync('./client/app/components/**/!(*.module).js')),
      },
      bundles,
      extras.length > 0 ? { extras } : {},
    ),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    // resolve: {
    //   alias: {
    //     jquery: path.resolve(__dirname, 'node_modules/jquery'),
    //   },
    // },
    plugins: [
      new webpack.DefinePlugin({
        __WEBPACK_REGION__: `'${env.region.toUpperCase()}'`,
      }),
    ],
  });
};
