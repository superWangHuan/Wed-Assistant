var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // Z_URL:'http://beta.api2.wed114.net/',
  Z_URL:'https://api2.wed114.net/',
  // DC_URL:'ttp://tool.wed114.com/',
  DC_URL:'https://tool.wed114.net/',
})
