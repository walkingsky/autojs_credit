/**
 * 支付宝的操作
 */

var _common_Fuction = require('./common.js');

var tao_live = {};
var thread_swipe = null;
var thread_egg = null;
var thread_egg_id = null;
var thread_swipe_id = null;

tao_live.debug = function (debug) {
    _common_Fuction.debug = debug;
}

//看直播60秒
function view_live() {
    sleep(1000);
    if (textContains('后完成').exists()) {  //直接进入的，不用点击“看直播60秒按钮”
        var live = true;
    } else
        var live = _common_Fuction.click_by_textcontains('看直播60秒'); //看直播的按钮
    sleep(1000);
    if (live) {
        while (true) {
            //if (id('gold_egg_image').exists()) { click_by_id('gold_egg_image'); console.log('点击金蛋领奖') }
            //翻倍操作
            if (id('gold_action_text').exists())
                if (id('gold_action_text').findOne().text() == '点击翻倍' || id('gold_action_text').findOne().text() == '点击 x4 倍')
                    _common_Fuction.click_by_id('gold_action_layout');

            if (!textContains('后完成').exists())
                break;
            sleep(1000);
        }
        _common_Fuction.click_by_id('taolive_close_btn');
    }
}

//签到
function sign() {
    _common_Fuction.click_by_text('今日签到');
    sleep(2000);
    view_live();
    className("android.view.View").clickable(true).depth(16).findOne().click(); //返回元宝中心
}

//点淘签到任务
tao_live.diantao_sign = function () {
    app.launch('com.taobao.live');
    sleep(5000);
    //每天第一次进入app ，有个青少年模式提示，点击任意地方会关闭这个弹层提示
    if (textContains('青少年守护模式'))
        _common_Fuction.click_by_id('tv_teenager_close');
    _common_Fuction.find_images(3, './img/元宝中心按钮.jpg', undefined, true);
    sleep(3000);
    //每日收益
    if (_common_Fuction.click_by_text('每日收益')) {
        sleep(4000);
        _common_Fuction.click_bounds(0, 84, 123, 213);
    }
    sleep(1000);
    //领取奖励
    //_common_Fuction.click_by_text('领取奖励');
    //sleep(500);
    //view_live();
    //sleep(1000);
    sign();
    sleep(1000);
    //click_by_text('text = O1CN01LxFPWH1Mmy2hurJW4_!!6000000001478-2-tps-54-54.png_') //关闭弹层按钮
    //提现
    _common_Fuction.click_by_text('提现');
    sleep(2000);
    _common_Fuction.click_by_text('提现到支付宝');
    sleep(2000);
    if (textContains('看60秒直播才能提现')) {
        _common_Fuction.click_by_text('看直播');
        view_live();
    }
    _common_Fuction.click_by_text('确认提现');
    sleep(2000);
    _common_Fuction.click_by_desc('转到上一层级');
    sleep(1000);
    className("android.view.View").clickable(true).depth(25).indexInParent(1).findOne().click();
    return;
}


//转换时间字符串到秒钟
function str_to_seconds(str) {
    let arr = str.split(':');
    if (arr.length == 3)
        return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
    else
        return false;
}

function get_remaining() {
    _common_Fuction.toast_console('获取领奖剩余时间');
    _common_Fuction.find_images(3, './img/元宝中心按钮.jpg', undefined, true); //防止退出元宝中心，强行点回元宝按钮返回；
    let remaining = 0;
    let lingjiang = false;
    let a = className('android.view.View').depth(28).indexInParent(1).find()
    try {
        var re = /\d{2}:\d{2}:\d{2}/;
        a.forEach(element => {
            if (element.text() == '领取奖励') {
                _common_Fuction.toast_console('领取奖励');
                element.click();
                view_live();
                sleep(1000);
                lingjiang = true;
                throw new Error()
            }
            if (re.exec(element.text())) {
                remaining = str_to_seconds(element.text());
                throw new Error()
            }
        });
        return -1; //没找到领奖标识，返回-1 
    } catch (e) {
        //console.log(e.msg)
    }
    if (lingjiang === true)
        _common_Fuction.toast_console('完成领取奖励');
    else
        _common_Fuction.toast_console('领奖剩余时间：' + remaining);
    return remaining;
}


//点淘刷元宝任务
tao_live.diantao_yuanbao = function () {
    let remaining = 0 //领奖剩余时间，单位秒
    app.launch('com.taobao.live')
    sleep(5000)
    if (textContains('青少年守护模式'))
        _common_Fuction.click_by_id('tv_teenager_close');
    let yuanbao = _common_Fuction.find_images(3, './img/元宝中心按钮.jpg', undefined, true);
    if (yuanbao === false) {
        _common_Fuction.toast_console('没找到元宝中心按钮，点淘已关闭领元宝');
        return;
    }
    sleep(4000);
    let retry_count = 6;
    while (true) {
        remaining = get_remaining();
        if (remaining == 0)
            remaining = get_remaining();
        else if (remaining == -1) {
            retry_count--;
            sleep(1000);
            if (retry_count < 0)
                break;//没找到领奖标志，就退出
        }
        else {
            let start = Date.parse(new Date()) / 1000;  //开始计时

            //返回视频列表
            if (!id('taolive_close_btn').exists()) {
                if (className('android.view.View').depth(25).indexInParent(1).findOne())
                    className('android.view.View').depth(25).indexInParent(1).findOne().click();
                sleep(1000);
                _common_Fuction.click_by_text('观看');
            }
            ii = 0;
            jj = 0;
            _common_Fuction.toast_console('jj:' + jj + 'ii:' + ii);
            while (Date.parse(new Date()) / 1000 - start <= remaining) {

                if (id('gold_egg_image').exists() && jj == 0) {
                    jj = 1;
                    _common_Fuction.toast_console('jj:' + jj + 'ii:' + ii);
                    thread_egg = threads.start(function () {
                        thread_egg_id = setTimeout(() => {
                            jj = 0;
                            _common_Fuction.click_by_id('gold_egg_image');
                            _common_Fuction.toast_console('点击金蛋领奖');
                            return;
                        }, 40000);
                    })

                }
                if (ii == 0) {
                    ii = 1;
                    console.log('jj:' + jj + 'ii:' + ii);
                    thread_swipe = threads.start(function () {
                        thread_swipe_id = setTimeout(() => {
                            ii = 0;
                            swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 700);
                            _common_Fuction.toast_console('划屏操作');
                            return;
                        }, 30000)
                    })
                }
                //翻倍操作
                if (id('gold_action_text').exists())
                    if (id('gold_action_text').findOne().text() == '点击翻倍' || id('gold_action_text').findOne().text() == '点击 x4 倍')
                        _common_Fuction.click_by_id('gold_action_layout');


                //关闭广告弹层
                _common_Fuction.click_by_text('O1CN0157Hhvw1cdq2jrQoth_!!6000000003624-2-tps-72-72');

                //判断还有没有元宝中心按钮
                if (!id('gold_progress_bar').exists())
                    break;
            }
            if (null != thread_egg)
                thread_egg.interrupt();
            if (null != thread_swipe)
                thread_swipe.interrupt();
            if (null != thread_egg_id)
                clearTimeout(thread_egg_id);
            if (null != thread_swipe_id)
                clearTimeout(thread_swipe_id);

            if (idContains('taolive_close_btn').exists() && !idContains('gold_progress_bar').exists())
                _common_Fuction.click_by_id('taolive_close_btn');
            else
                _common_Fuction.click_by_id('gold_progress_bar');
            sleep(500);
            if (id('gold_egg_image').exists()) //防止点击到领取满蛋积分，而不能进入元宝中心的操作
                id('gold_egg_image').click();
            sleep(500);
            if (textContains('悬浮窗'))
                _common_Fuction.click_by_id('positive');
            sleep(3000);
        }
    }
    return;
}

module.exports = tao_live;