const { compile } = require('nexe')

compile({
  input: './index.js',
  build: true, //required to use patches

  resources: [
    "bible/**/*",
    "public/**/*",
    "views/**/*",
    "lyrics.json"
  ]
}).then(() => {
  console.log('success')
})