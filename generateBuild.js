const {compile} = require('nexe')

compile({
    input: 'src/app.js',
    target: 'linux-x64-14.15.3',
    resources:['./public/**/*','./src/**/*','./node_modules/**/*'],
    // target: 'macos-8.4.0',
    output: 'startServer'
}).then(() => {console.log('success')})