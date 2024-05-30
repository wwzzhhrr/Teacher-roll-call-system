const path = require('path');
const SemiWebpackPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },

    plugins: [
      new SemiWebpackPlugin({
        theme: '@semi-bot/semi-theme-callroll',
        include: '~@semi-bot/semi-theme-callroll/scss/local.scss',
      }),
    ],
  },
};
