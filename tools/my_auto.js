/**
 * 自动签到工具
 * author: walkingsky
 * url:https://github.com/walkingsky/autojs_credit
 */

var _common_Function = require('./自动脚本/common.js');

auto.waitFor();

function stopApp(className) {
    _common_Function.toast_console('关闭应用');
    app.openAppSetting(className);
    sleep(500);
    textContains('强行停止').waitFor();
    textContains('强行停止').click();
    sleep(500);
    textContains('确定').waitFor();
    textContains('确定').click();
    sleep(1000);
    back();
    _common_Function.toast_console('成功关闭应用:' + className);
}

//快电
_common_Function.toast_console('快电：开始签到');
app.launch('com.czb.charge');
//阻断式等待
id('tv_name').text('我的').waitFor();
sleep(1000);
try {
    id('tv_name').text('我的').findOne(2000).parent().parent().parent().click();
    sleep(1000);
    textContains('签到+2').findOne(2000).parent().click();
    sleep(5000);
    //stopApp(com.czb.charge);

} catch (error) {
    _common_Function.toast_console('快电：签到错误' + error);
}
_common_Function.toast_console('快电：签到完成');


//网上国网
_common_Function.toast_console('网上国网：开始签到');
app.launch('com.sgcc.wsgw.cn');
//阻断式等待
//descContains('网上营业厅').waitFor();
sleep(6000);
if (textContains('今日不再出现').exists()) {
    _common_Function.toast_console('有广告');
    _common_Function.click_bounds(875, 480, 965, 570);
    //className('android.widget.ImageView').depth(10).indexInParent(0).findOne(1000).click();
    sleep(1000);
} else {
    sleep(1000);
}

try {
    //text('我的').depth(20).findOne(2000).click();
    //descContains('点击').indexInParent(3).findOne(2000).click();
    _common_Function.click_by_text('签到');
    sleep(500);
    if (className('android.widget.TextView').depth(14).indexInParent(2).exists()) {
        className('android.widget.TextView').depth(14).indexInParent(2).findOne().click();
    }
    sleep(5000);
    //stopApp('com.sgcc.wsgw.cn');

} catch (error) {
    _common_Function.toast_console('网上国网签到错误:' + error);
}
_common_Function.toast_console('网上国网：签到完成');


//易充电
_common_Function.toast_console('易充电：开始签到');
app.launch('com.sgcc.evs.echarge');
//阻断式等待
id('tv_topmenu').text('易捷版').waitFor();
try {
    id('tvMine').text('我的').findOne(2000).parent().click();
    sleep(1000);
    if (text('签到').depth(13).exists()) {
        //text('签到').depth(13).findOne(2000).click();
        _common_Function.click_by_text('签到');
    }
    sleep(5000);
    //stopApp('com.sgcc.evs.echarge');

} catch (error) {
    _common_Function.toast_console('易充电签到错误:' + error);
}
_common_Function.toast_console('易充电：签到完成');

//能链团油
_common_Function.toast_console('能链团油：开始签到');
app.launch('com.czb.chezhubang');
//阻断式等待
text('签到赚钱').waitFor();
try {
    text('签到赚钱').findOne(2000).parent().click();
    sleep(1000);
    if (textContains('立即领取').exists())
        textContains('立即领取').findOne(2000).parent().parent().click();

    sleep(2000);
    let i = 1;
    while (i <= 10) {
        className('android.view.ViewGroup').indexInParent(12).depth(13).findOne(2000).click();

        textContains('后可领取奖励').findOne(12000);
        if (!textContains('后可领取奖励').exists())
            continue;
        while (true) {
            if (textContains('后可领取奖励').exists()) {
                sleep(1000);
                if (textContains('残忍离开').exists()) {
                    textContains('残忍离开').findOne(2000).click();
                }
                //if (desc('adx').depth(12).exists(0))
                //    desc('adx').depth(12).findOne(2000).click();
                if (text('0s后可领取奖励').exists()) {
                    sleep(2000);
                    break;
                }
            } else {
                break;
            }
        }
        sleep(1000);
        if (textContains('跳过').exists()) {
            textContains('跳过').findOne(2000).click();
            _common_Function.toast_console('1');
        }
        sleep(3000);
        if (className('android.widget.ImageView').depth(5).exists()) {
            className('android.widget.ImageView').depth(5).findOne(2000).click();
            _common_Function.toast_console('2');
        }
        else if (className('android.widget.ImageView').depth(5).indexInParent(3).exists()) {
            _common_Function.toast_console('3');
            className('android.widget.ImageView').depth(5).indexInParent(3).findOne(2000).click();
        }
        else {
            sleep(10000);
            _common_Function.toast_console('4');
            if (className('android.widget.ImageView').depth(5).exists()) {
                _common_Function.toast_console('5');
                className('android.widget.ImageView').depth(5).findOne(2000).click();
            }
            else if (className('android.widget.ImageView').depth(5).indexInParent(3).exists()) {
                _common_Function.toast_console('6');
                className('android.widget.ImageView').depth(5).indexInParent(3).findOne(2000).click();
            }
            else {
                _common_Function.toast_console('7');
                //back();
            }
        }
        sleep(1000);
        i = i + 1;
    }


    //stopApp('com.czb.chezhubang');

} catch (error) {
    _common_Function.toast_console('能链团油签到错误:' + error);
}
_common_Function.toast_console('能链团油：签到完成');
