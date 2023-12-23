auto();
var _common_Fuction = require('common.js');
var stopFlag = false;
var xiaoShuoTask = false;

//请求截图
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}

function jingXi() {
    if (className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('恭喜获得惊喜奖励').depth(10).clickable(false).exists()) {
        let b = className('com.lynx.tasm.behavior.ui.view.UIView').textMatches(/看视频再领\d+金币/).depth(10).clickable().findOne();
        //console.log(b);
        if (b) {
            _common_Fuction.toast_console('获得惊喜');
            click(b.bounds().centerX(), b.bounds().centerY());
            //sleep(2000);
            guangGao();
        }
    }
}
function clickButtonK3() {
    _common_Fuction.toast_console('k3');
    //没办法了，直接点击坐标点
    click(540, 2082);
}

function kanXiaoShuo() {
    _common_Fuction.toast_console('进入看小说');
    sleep(2000);
    jingXi();
    sleep(1000);
    if (className('android.view.View').text('任务完成').depth(24).exists()) {
        _common_Fuction.toast_console('发现任务已完成');
        xiaoShuoTask = true;
        clickButtonK3();
        return;
    }
    if (id('novel_sdk_ug_btn_confirm').exists())
        _common_Fuction.click_by_id('novel_sdk_ug_btn_confirm');
    sleep(1000)
    if (id('novel_sdk_ug_btn_confirm').exists())
        _common_Fuction.click_by_id('novel_sdk_ug_btn_confirm');
    sleep(1000)
    if (id('tv_read_button').exists())
        _common_Fuction.click_by_id('tv_read_button');

    className('android.view.View').depth(21).indexInParent(0).clickable().click();
    sleep(2000);
    while (true) {
        swipe(device.width * 0.8, device.height * 0.8, device.width * 0.2, device.height * 0.9, 400);
        let s = 0;
        s = _common_Fuction.randomNum(2, 4);
        sleep(s * 1000);
        if (text('任务已完成').indexInParent(2).exists() || stopFlag) {
            _common_Fuction.toast_console('任务已完成');
            break;
        }
        _common_Fuction.toast_console(s + ':左划屏幕');
    }
    //id('novel_reader_back').depth(6).click();
    _common_Fuction.click_by_id('novel_reader_back');
    sleep(600);
    _common_Fuction.click_by_id('lw');
    sleep(1000);
    clickButtonK3();
    _common_Fuction.toast_console('离开看小说');
}

function start() {
    while (stopFlag == false) {

        // 点开开宝箱
        if (className('com.lynx.tasm.behavior.ui.text.UIText').text('开宝箱得金币').exists()) {
            let b = className('com.lynx.tasm.behavior.ui.text.UIText').text('开宝箱得金币').clickable(false).findOne();
            //console.log(b);
            if (b) {
                _common_Fuction.toast_console('点击右下角开宝箱');
                click(b.bounds().centerX(), b.bounds().centerY());
                sleep(600);
            }
        }
        //匹配颜色值
        let img = captureScreen();
        //获取在点(100, 100)的颜色值
        let point = findColor(img, "#FFED46", {
            region: [290, 1410, 10, 10],
            threshold: 4
        });
        if (point) {
            click(point.x, point.y);
            _common_Fuction.toast_console('开宝箱');
            guangGao();
        } else {
            /* //经常获取不到组件
            if (className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('看视频领金币').depth(15).clickable().exists()) {
                let b = className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('看视频领金币').depth(15).clickable().findOne();
                //console.log(b);
                if (b) {
                    _common_Fuction.toast_console('开宝箱');
                    click(b.bounds().centerX(), b.bounds().centerY());
                    //sleep(3000);
                    guangGao();
                }
            } else {
            */
            if (xiaoShuoTask == false) {
                jingXi();
                if (className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('看小说').depth(15).clickable().exists()) {
                    let b = className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('看小说').depth(15).clickable().findOne();
                    //console.log(b);
                    if (b) {
                        _common_Fuction.toast_console('看小说');
                        click(b.bounds().centerX(), b.bounds().centerY());
                        sleep(2000);
                        kanXiaoShuo();
                    }
                }
            }

            jingXi();
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
        }
        if (stopFlag == true)
            break;
        else
            sleep(1000);
    }
}

function guangGao() {
    _common_Fuction.toast_console('进入广告函数');
    while (true) {
        sleep(3000);
        //打开快应用弹窗提示
        if (id('hj').indexInParent(0).exists()) {
            _common_Fuction.click_by_id('bzr');
            sleep(1000);
        }
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
            else if (className('com.lynx.tasm.behavior.ui.view.UIView').textStartsWith('看视频至多').depth(8).clickable().exists()) {
                let a = className('com.lynx.tasm.behavior.ui.view.UIView').textStartsWith('看视频至多').depth(8).clickable().findOne();
                if (click(a.bounds().centerX(), a.bounds().centerY()))
                    _common_Fuction.toast_console('看视频至多 按钮点击成功');
                else
                    _common_Fuction.toast_console('看视频至多 按钮点击失败');
            }
            else {
                //匹配颜色值
                let img = captureScreen();
                //获取在点(100, 100)的颜色值
                let point = findColor(img, "#FF3545", {
                    region: [645, 1185, 10, 10],
                    threshold: 4
                });
                if (point) {
                    click(point.x, point.y);
                    _common_Fuction.toast_console('开心收下');
                }
                /*  按空间操作总是有问题，识别不到
                let cnt = 0;
                while (cnt < 5) {
                    if (className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('开心收下').clickable().exists()) {
                        let a = className('com.lynx.tasm.behavior.ui.LynxFlattenUI').text('开心收下').clickable().findOne();
                        if (click(a.bounds().centerX(), a.bounds().centerY()))
                            _common_Fuction.toast_console('开心收下 按钮点击成功');
                        else
                            _common_Fuction.toast_console('开心收下 按钮点击失败');
                        _common_Fuction.toast_console('开心收下');
                    } else {
                        //click(device.width * 0.9, device.height * 0.9);
                        //_common_Fuction.toast_console('强制点击开心收下');
                    }
                    sleep(1000);
                    cnt++;
                }
                */
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