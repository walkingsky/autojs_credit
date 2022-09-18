/**
 * taobao的操作
 */

var _common_Fuction = require('./common.js');

var auto_taobao = {};

auto_taobao.debug = function (debug) {
    _common_Fuction.debug = debug;
}
//上划屏幕
function my_swipe() {
    swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 700);
}
//浏览15秒
function view(title) {
    let have = _common_Fuction.click_by_text(title);
    if (have === false)
        return;
    sleep(2000);
    my_swipe();
    while (!textContains('浏览完成').exists()) {
        sleep(1000);
    }
    _common_Fuction.click_by_text('返回');
}
function do_task(title) {
    let have = _common_Fuction.click_by_text(title);
    if (have === false)
        return;
    sleep(6000);
    app.launch('com.taobao.taobao');
    _common_Fuction.click_by_desc('转到上一层级');
}
function search() {
    let have = _common_Fuction.click_by_text('搜一搜你心仪的宝贝(0/1)');
    if (have === false)
        return;
    sleep(2000);
    let search_key = className('android.view.View').depth(11).indexInParent(0).findOne();
    search_key.click();
    my_swipe();
    let i = 0;
    while (!textContains('当前页下单').exists() || i < 16) {
        sleep(1000);
        i++;
    }
    if (textContains('逛精品好货').exists())
        _common_Fuction.click_by_desc('转到上一层');
    if (idContains('tbvideo_back').exists())
        _common_Fuction.click_by_id('tbvideo_back');
    else {
        className('android.widget.Button').depth(13).indexInParent(0).findOne().click();
        sleep(1000);
        className('android.view.View').depth(10).indexInParent(0).findOne().click();
    }

}

//打开淘宝-芭芭农场
function open_app() {
    app.launch('com.taobao.taobao');
    sleep(5000);
    _common_Fuction.click_by_text('芭芭农场');
    sleep(4000);
}

auto_taobao.farm = function () {
    open_app();
    //领肥料
    _common_Fuction.my_click(880, 1500);
    //未完成。。。
    sleep(1000);
    //按时领取
    _common_Fuction.my_click(230, 1570);
    sleep(500);
    if (textContains('关闭').exists())
        _common_Fuction.click_by_text('关闭');


    let i = 0;
    for (; i < 3; i++) {
        //集肥料
        className('android.widget.Image').clickable(true).depth(13).indexInParent(2).findOne().click();
        sleep(1000);
        for (let j = 0; j < 2; j++) {
            view('逛精选好物(0/1)');
            sleep(1000)
            //搜心仪的宝贝
            search();
            sleep(1000);
            view('逛精选好货(0/1)');
            sleep(1000);
            do_task('去蚂蚁庄园领饲料喂鸡(0/1)');
            sleep(1000);
            //do_task('去陶特领好礼(0/1)');
            //sleep(1000);
            view('浏览短视频(0/1)');
            sleep(1000);
            do_task('逛逛支付宝芭芭农场(0/1)');
            sleep(1000);
            my_swipe();
            sleep(1000);
        }
        _common_Fuction.click_by_text('关闭');
        sleep(500);
    }
    _common_Fuction.click_by_text('去领取');
    sleep(1000);
    _common_Fuction.click_by_text('关闭');
    sleep(500);
    while (true) {
        _common_Fuction.my_click(540, 2000);
        sleep(1000);
        if (textContains('农场百科问答(0/1)').exists())
            break;
        _common_Fuction.my_click(539, 1596);
        sleep(1000);
        _common_Fuction.click_by_text('关闭');
        sleep(2000);
    }
    _common_Fuction.click_by_text('关闭');
    sleep(2000);
    //className('android.widget.Image').depth(15).indexInParent(0).findOne().click();
    _common_Fuction.my_click(76, 167);
    return;
}

module.exports = auto_taobao;
