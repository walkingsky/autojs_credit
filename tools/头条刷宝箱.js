auto();
var _common_Fuction = require('common.js');
var stopFlag = false;

//关闭1
className('com.lynx.tasm.behavior.ui.view.UIView').depth(8).clickable();
//关闭2 clickable
className('com.lynx.tasm.behavior.ui.view.UIView').text('关闭').depth(8).clickable();
//继续获取金币的按钮 clickable
className('com.lynx.tasm.behavior.ui.view.UIView').textStartsWith('再看一个').depth(8).clickable();

//看视频再领弹窗按钮，clickable,
className('com.lynx.tasm.behavior.ui.view.UIView').textStartsWith('看视频再领').depth(10).clickable();

//看视频领金币 初始入口
className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('看视频领金币').depth(15).clickable();

//倒计时1
className('com.lynx.tasm.behavior.ui.text.UIText').textMatches(/\d+s/).depth(8).exists();
//倒计时2
className('com.lynx.tasm.behavior.ui.text.UIText').textEndsWith('后可领取奖励').depth(8).clickable(false);

//开心收下
className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('开心收下').clickable();

//领福利
className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('领福利').depth(15).clickable();

function start() {
    if (className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('看视频领金币').depth(15).clickable().exists()) {
        let b = className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('看视频领金币').depth(15).clickable().findOne();
        //console.log(b);
        if (b) {
            _common_Fuction.toast_console('开宝箱');
            click(b.bounds().centerX(), b.bounds().centerY());
            //sleep(2000);
            guangGao();
        }
    }
    if (className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('领福利').depth(15).clickable().exists()) {
        let b = className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('领福利').depth(15).clickable().findOne();
        //console.log(b);
        if (b) {
            _common_Fuction.toast_console('看广告');
            click(b.bounds().centerX(), b.bounds().centerY());
            //sleep(2000);
            guangGao();
        }
    }

    if (stopFlag == false) {
        sleep(1000);
        start();
    }
}

function guangGao() {
    _common_Fuction.toast_console('进入广告函数');
    while (true) {
        sleep(2000);
        if (className('com.lynx.tasm.behavior.ui.text.UIText').textMatches(/\d+s/).depth(8).exists() || className('com.lynx.tasm.behavior.ui.text.UIText').textEndsWith('后可领取奖励').depth(8).clickable(false).exists()) {
            sleep(1000);
            continue;
        } else {
            if (className('com.lynx.tasm.behavior.ui.view.UIView').depth(8).clickable().boundsInside(900, 20, 1200, 160).exists()) {
                let a = className('com.lynx.tasm.behavior.ui.view.UIView').depth(8).boundsInside(900, 20, 1200, 160).clickable().findOne();
                if (click(a.bounds().centerX(), a.bounds().centerY()))
                    _common_Fuction.toast_console('关闭1 按钮点击成功');
                else
                    _common_Fuction.toast_console('关闭1 按钮点击失败');
            } else {
                if (className('com.lynx.tasm.behavior.ui.view.UIView').text('关闭').depth(8).clickable().exists()) {
                    let a = className('com.lynx.tasm.behavior.ui.view.UIView').text('关闭').depth(8).clickable().findOne().click();
                    if (a)
                        _common_Fuction.toast_console('关闭2 按钮点击成功');
                    else
                        _common_Fuction.toast_console('关闭2 按钮点击失败');
                }
            }
            sleep(1000);
            if (className('com.lynx.tasm.behavior.ui.view.UIView').textStartsWith('再看一个').depth(8).clickable().exists()) {
                let a = className('com.lynx.tasm.behavior.ui.view.UIView').textStartsWith('再看一个').depth(8).clickable().findOne();
                if (click(a.bounds().centerX(), a.bounds().centerY()))
                    _common_Fuction.toast_console('再看一个 按钮点击成功');
                else
                    _common_Fuction.toast_console('再看一个 按钮点击失败');
            } else if (className('com.lynx.tasm.behavior.ui.view.UIView').textStartsWith('看视频再领').depth(10).clickable().exists()) {
                let a = className('com.lynx.tasm.behavior.ui.view.UIView').textStartsWith('看视频再领').depth(10).clickable().findOne();
                if (click(a.bounds().centerX(), a.bounds().centerY()))
                    _common_Fuction.toast_console('看视频再领 按钮点击成功');
                else
                    _common_Fuction.toast_console('看视频再领 按钮点击失败');
            }
            else {
                if (className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('开心收下').clickable().exists()) {
                    let a = className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('开心收下').clickable().findOne();
                    if (click(a.bounds().centerX(), a.bounds().centerY()))
                        _common_Fuction.toast_console('开心收下 按钮点击成功');
                    else
                        _common_Fuction.toast_console('开心收下 按钮点击失败');
                    _common_Fuction.toast_console('开心收下');
                }
                _common_Fuction.toast_console('退出广告函数');
                return;
            }
        }
    }
}
//guangGao();

toast('音量上开始刷视频，音量下退出');
//启用按键监听
events.observeKey()
//监听音量上键按下
events.onKeyDown("volume_up", function (event) {
    console.log("音量上键被按下了")
    //guangGao();
    start();
})

events.onKeyDown("volume_down", function (event) {
    console.log("音量下键被按下了")
    stopFlag = true;
    exit();
})