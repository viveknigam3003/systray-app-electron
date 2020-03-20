function doNotify() {
    Notification.requestPermission().then(function (result){
        
        var myNotification = new Notification('Hello World App', {
            'body': 'Notifications Working!',
            'icon': 'electorn-logo=2.png'
        });
    });
}