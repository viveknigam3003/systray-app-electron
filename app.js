function doNotify() {
    Notification.requestPermission().then(function (result){
        
        var myNotification = new Notification('Electron Notification', {
            'body': 'Application Installed'
        });
    });
}