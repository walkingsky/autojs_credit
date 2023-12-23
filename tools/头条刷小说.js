auto();



var _common_Fuction = require('common.js');
var stop_view = false;


function view() {
    while (1 == 1) {
        swipe(device.width * 0.8, device.height * 0.8, device.width * 0.2, device.height * 0.9, 400);
        let s = 0;
        s = _common_Fuction.randomNum(2, 4);
        sleep(s * 1000);
        if (text('任务已完成').indexInParent(2).exists() || stop_view)
            break;
        toast(s + ':左划屏幕');
    }
}

toast('音量上开始刷视频，音量下退出');
//启用按键监听
events.observeKey()
//监听音量上键按下
events.onKeyDown("volume_up", function (event) {
    console.log("音量上键被按下了")
    view();
    //guangGao();
})

events.onKeyDown("volume_down", function (event) {
    console.log("音量下键被按下了")
    stop_view = true;
    exit();
})