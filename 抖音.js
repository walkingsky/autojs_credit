/**
 * 点淘刷元宝autojs脚本
 * author: walkingsky
 * url:https://github.com/walkingsky/autojs_credit
 */

var _common_Fuction = require('common.js');


/**
 * 应用
 */
var app_aweme = {};

/**
 * 限时任务赚金币
 */
app_aweme.task = function () {
    id('i4g').indexInParent(0).depth(18).findOne().click();
    sleep(3000);
    title = text('赚钱任务').depth(18).findOne();
    console.log(title);
    try {
        if (title) {
            getButton = textContains('限时任务赚金币20000').depth(18).findOne();
            console.log(getButton);
            if (getButton) {
                getButton.click();
                sleep(3000);
                console.log(textContains('广告').depth(8).findOne());
                if (textContains('广告').depth(8).exists()) {
                    while (true) {
                        lingQuChengGong = text('领取成功').depth(8).indexInParent(21).findOne();
                        guanBiButton = text('关闭 按钮').depth(8).findOne();
                        console.log(lingQuChengGong);
                        console.log(guanBiButton);
                        if (lingQuChengGong || guanBiButton) {
                            if (lingQuChengGong)
                                lingQuChengGong.click();
                            else
                                guanBiButton.click();
                            sleep(1000);
                            lingJiang = text('领取奖励').depth(8).indexInParent(47).findOne();
                            if (lingJiang)
                                lingJiang.click();
                            kaiXinShouXia = text('开心收下').depth(8).indexInParent(47).findOne();
                            if (kaiXinShouXia) {
                                kaiXinShouXia.click();
                                className('com.lynx.tasm.behavior.ui.view.UIView').depth(18).findOne().click();
                                break;
                            }
                        } else {
                            sleep(1000);
                        }
                    }
                } else {
                    //未到任务执行时间
                    _common_Fuction.toast_console('未到任务执行时间，返回首页');
                    className('com.lynx.tasm.behavior.ui.view.UIView').indexInParent(17).findOne().click();
                }
            }
        } else {
            //没找到就返回首页
            className('com.lynx.tasm.behavior.ui.view.UIView').indexInParent(17).findOne().click();
            _common_Fuction.toast_console('没有进入到限时任务赚金币，返回首页');
        }
    } catch (error) {
        _common_Fuction.toast_console('限时任务赚金币' + error);
    }
    _common_Fuction.toast_console('完成一次限时任务赚金币，返回首页');
    className('com.lynx.tasm.behavior.ui.view.UIView').indexInParent(17).findOne().click();
}

/**
 * 打开应用，
 */
function start() {
    //let result = shell('am start com.taobao.live/com.taobao.live.home.activity.TaoLiveHomeActivity');
    app.launch('com.ss.android.ugc.aweme.lite');
    //阻断式等待
    id('i4g').indexInParent(0).waitFor();
    sleep(1500);
    //每天第一次进入app ，有个青少年模式提示，点击任意地方会关闭这个弹层提示
    if (textContains('青少年模式').exists())
        _common_Fuction.click_by_text('我知道了');

    _common_Fuction.toast_console('成功启动app,并且找到了赚钱按钮');
}

/** 
 * 结束应用
*/
function stop() {
    _common_Fuction.toast_console('关闭应用');
    app.openAppSetting('com.ss.android.ugc.aweme.lite');
    sleep(500);
    textContains('强行停止').waitFor();
    textContains('强行停止').click();
    sleep(500);
    textContains('确定').waitFor();
    textContains('确定').click();
    sleep(1000);
    back();
    _common_Fuction.toast_console('成功关闭应用');
}

/** 
 * 重启应用 
*/
function restart() {
    stop();
    start();
}


/**
 * 转换时间字符串到秒钟
 * @param {string} str 要转换的字符串
 * @returns  int 数字秒数
 */
function str_to_seconds(str) {
    let arr = str.split(':');
    if (arr.length == 3)
        return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
    else
        return false;
}

/**
 * 设置调试模式
 * @param {bool} debug 
 */
function deubg(debug) {
    _common_Fuction.debug = debug;
}


auto.waitFor()

//设置起始步骤
let start_step = 1;
//sleep(5000);

if (start_step <= 1)
    start();

//sleep(5000);
//stop();

if (start_step <= 2) {

    app_aweme.task();

}

if (start_step <= 3) {

}

if (start_step <= 4) {

}

if (start_step <= 5) {

}

if (start_step <= 6) {

}
