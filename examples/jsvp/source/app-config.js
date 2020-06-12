App.init({
    name: 'AppDemo',
    version: '1.0'
});
App.onEvent('404', (e, errorMsg) => {
    App.logger().info(`Page<${Page.current().className}> received AppEvent<404>:${errorMsg}!`, `This Event from: ${e.url}`);
});
