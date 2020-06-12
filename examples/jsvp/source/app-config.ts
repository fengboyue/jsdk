/// <reference path="../../../dist/jsdk.d.ts" /> 
type AppEvents = '404';
App.init({
    name: 'AppDemo',
    version: '1.0'
})
App.onEvent<AppEvents>('404', (e: AppEvent, errorMsg: string) => {
    App.logger().info(`Page<${Page.current().className}> received AppEvent<404>:${errorMsg}!`, 
    `This Event from: ${e.url}`);
})

