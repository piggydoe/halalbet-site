// webpack.config.js

module.exports = {
    // other configurations...
    module: {
      rules: [
        {
          test: /\.(wav|mp3)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
  };
  