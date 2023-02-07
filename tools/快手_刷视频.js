auto();

var _common_Fuction = require('common.js');

toast('音量上开始刷视频，音量下退出');
function view() {
    while (1 == 1) {

        swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
        let s = 0;
        if (textContains('逛逛街 多赚钱').exists())
            s = _common_Fuction.randomNum(3, 6);
        else
            s = _common_Fuction.randomNum(10, 35);
        sleep(s * 1000);
        toast(s + ':秒刷新视频');
    }
}

//启用按键监听
events.observeKey()
//监听音量上键按下
events.onKeyDown("volume_up", function (event) {
    console.log("音量上键被按下了")
    view();
})

events.onKeyDown("volume_down", function (event) {
    console.log("音量下键被按下了")
    exit();
})