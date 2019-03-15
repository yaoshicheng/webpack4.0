module.exports = {
  parser: 'postcss-strip-inline-comments',
  plugins: [
    require('autoprefixer')({}),
    // require('cssnano')()  //压缩css
  ],
};
