auto();

var _common_Fuction = require('common.js');

toast('音量上开始刷视频，音量下退出');

function guangGao() {
    _common_Fuction.toast_console('进入广告');
    sleep(2000);
    while (true) {
        if (textContains('s后可领取奖励').exists()) {
            sleep(1000);
        } else {
            sleep(1000);
            let a = idContains('end_icon').findOne();
            if (a) {
                if (click(a.bounds().centerX(), a.bounds().centerY())) {
                    //console.log('2');
                }
            } else
                _common_Fuction.toast_console('没找到广告关闭按钮');
            break;
        }
    }
    _common_Fuction.toast_console('退出广告');
    sleep(1000);
}

function view() {
    while (1 == 1) {
        if (text('立即解锁章节').className('android.widget.Button').exists()) {
            text('立即解锁章节').className('android.widget.Button').findOne().click();
            _common_Fuction.toast_console('立即解锁章节');
            sleep(1000);
            guangGao();
        }
        if (textContains('看完视频再领').exists()) {
            textContains('看完视频再领').className('android.view.View').findOne().click();
            _common_Fuction.toast_console('看完视频再领');
            sleep(1000);
            guangGao();
        }
        if (textContains('看广告免').className('android.view.View').clickable().exists()) {
            textContains('看广告免').className('android.view.View').clickable().findOne().click();
            _common_Fuction.toast_console('看广告免广告');
            sleep(1000);
            guangGao();
        }
        if (text('限时福利').className('android.widget.TextView').depth(14).exists()) {
            let a = className('android.view.View').clickable(false).depth(15).indexInParent(1).findOne();
            if (a) {
                click(a.bounds().centerX(), a.bounds().centerY())
                _common_Fuction.toast_console('限时福利');
                sleep(1000);
                guangGao();
            }
        }
        //swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
        let s = 0;
        if (textContains('逛逛街 多赚钱').exists()) {
            _common_Fuction.toast_console('逛逛街');
            swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
            s = _common_Fuction.randomNum(3, 6);
        } else if (idContains('follow_avatar').exists()) {
            _common_Fuction.toast_console('视频播放');
            swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
            s = _common_Fuction.randomNum(10, 35);
        } else if (textContains('金币').className('android.view.View').depth(16).exists()) {
            _common_Fuction.toast_console('看小说');
            swipe(device.width * 0.9, device.height * 0.7, device.width * 0.2, device.height * 0.6, 400);
            s = _common_Fuction.randomNum(9, 12);
        }
        if (s != 0) {
            sleep(s * 1000);
            toast(s + ':秒刷新');
        } else {
            sleep(1000);
        }

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