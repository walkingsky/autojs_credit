/**
 * 支付宝的操作
 */

var _common_Fuction = require('./common.js');

var auto_alipay = {};

auto_alipay.debug = function (debug) {
    _common_Fuction.debug = debug;
}
// 浏览15秒钟页面操作
function view_15seconds() {
    swipe(device.width / 2, device.height / 2, device.width / 2, device.height / 5, 1500);
    sleep(15500);
}

// 浏览3次 的任务，人工计时15秒
// title 点击任务名称
// num 执行次数
// 
function view(title, num, close) {
    let i = 0;
    for (; i < num; i++) {
        if (_common_Fuction.click_by_textcontains(title) == false)
            return;
        //i = 3
        sleep(2000);
        my_btn = text("去完成").clickable(true).depth(16).findOne(3000);
        if (!my_btn) {
            _common_Fuction.toast_console('没找到‘' + title + '’弹层按钮');
            return;
        } else
            _common_Fuction.btn_position_click(my_btn);
        sleep(2000);
        view_15seconds();

        if (descContains('返回').exists())
            _common_Fuction.click_by_desc('返回');
        else if (descContains('关闭').exists())
            _common_Fuction.click_by_desc('关闭');

        sleep(2000);
    }

}

//做任务
function do_task(title) {
    if (_common_Fuction.click_by_textcontains(title) == false)
        return;
    sleep(2000);
    my_btn = text("去完成").clickable(true).depth(16).findOne(3000);
    if (!my_btn) {
        _common_Fuction.toast_console('没找到‘' + title + '’弹层按钮');
        return;
    } else
        _common_Fuction.btn_position_click(my_btn);
    sleep(5000);
    //重新激活 支付宝
    for (let i = 1; i < 6; i++) {
        app.launch("com.eg.android.AlipayGphone");
        sleep(1000)
        if (descContains('返回').exists()) {
            _common_Fuction.click_by_desc('返回');
            return;
        }
        else if (descContains('关闭').exists()) {
            _common_Fuction.click_by_desc('关闭');
            return;
        }
        _common_Fuction.toast_console('没找到关闭按钮');
    }
    return;
}

// 支付宝领积分的操作函数
auto_alipay.alipay_points = function () {
    _common_Fuction.toast_console('支付宝积分领取任务开始执行');
    app.launch("com.eg.android.AlipayGphone");
    sleep(5000);
    let my_btn = text('我的').findOne(5000);
    if (!my_btn) {
        _common_Fuction.toast_console('没找到‘我的’按钮，退出');
        return;
    }
    _common_Fuction.btn_position_click(my_btn);
    sleep(3000);
    click(540, 500);//直接点击坐标点
    sleep(3000);
    _common_Fuction.click_by_text('全部领取');
    sleep(2000);
    _common_Fuction.click_by_textcontains('每日');
    sleep(2000);
    _common_Fuction.click_by_text('逛15秒赚3积分');
    my_btn = textContains('已完成浏览任务').findOne(3000);
    //toast_console(my_btn)
    if (!my_btn)
        sleep(16000);
    sleep(5000)
    _common_Fuction.click_by_text('做任务赚积分');
    sleep(2000);
    let i = 3
    do {
        view('逛精选好物会场15秒', 3);
        sleep(2000);
        view('逛红包会场15秒', 3);
        sleep(2000);
        view('逛红包优品会场15秒', 3);
        sleep(2000);
        view('逛15s医保服务', 1, true);
        sleep(2000);
        view('去百度逛一逛领好礼', 1);
        sleep(2000);
        view('逛15秒天猫超市', 1, true);
        sleep(2000);
        view('15s逛一逛商品橱窗', 1);
        sleep(2000);
        do_task('逛淘票票领红包');
        sleep(2000);
        do_task('逛一逛芭芭农场');
        sleep(2000);
        do_task('逛一逛蚂蚁森林');
        sleep(2000);
        do_task('逛淘金币小镇领金币');
        sleep(3000);
        do_task('蚂蚁庄园');
        sleep(2000);
        i--
    } while (i > 0) // 循环执行多次，防止有些项排在下边展示不出来


    _common_Fuction.click_by_desc('返回');
    sleep(2000);

    _common_Fuction.click_by_desc('返回');
    sleep(2000);

    _common_Fuction.click_by_text('首页');
    sleep(2000);

    _common_Fuction.toast_console('支付宝积分领取任务执行结束');
}
//-------------芭芭农场 -----------------------------------
//领取奖励
function farm_lingjiang() {
    _common_Fuction.click_by_textcontains('点击领奖')
    sleep(500)
    _common_Fuction.click_by_text('立即领取')
}

//浏览得肥料
function farm_view() {
    swipe(device.width / 2, device.height / 2, device.width / 2, device.height / 5, 1500)
    sleep(15500)
    if (!_common_Fuction.click_by_desc('返回'))
        _common_Fuction.click_by_id('J-farm-cpc-countdown')
}

auto_alipay.baba_farm_task = function () {
    _common_Fuction.toast_console('芭芭农场任务开始执行');
    app.launch("com.eg.android.AlipayGphone");
    sleep(5000);
    _common_Fuction.click_by_text('芭芭农场');
    sleep(5000);
    //签到领肥料
    _common_Fuction.find_images(3, './img/芭芭农场_领取肥料.jpg');
    //打开领肥料任务列表
    sleep(2000);
    task = _common_Fuction.find_images(3, './img/芭芭农场_领取肥料任务按钮.jpg');
    if (task) {
        sleep(2000);
        //签到领取
        _common_Fuction.click_by_text('领取');
        sleep(2000);

        while (_common_Fuction.find_images(3, './img/芭芭农场任务列表去完成.jpg')) {
            sleep(5000);
            farm_view();
        }
        //关闭任务弹层
        _common_Fuction.click_by_text('关闭');
    }
    //施肥
    sleep(2000);
    let keyi_shifei = true
    while (keyi_shifei) {
        if (_common_Fuction.find_images(3, './img/芭芭农场_施肥按钮.jpg')) {
            sleep(500)
            if (text('已领取').findOne(5000)) {
                _common_Fuction.toast_console('任务列表弹出，说明不能再施肥了');
                keyi_shifei = false;
                //关闭任务弹层
                _common_Fuction.click_by_text('关闭');
            }
            sleep(500)
            if (_common_Fuction.click_by_textcontains('点击领取')) {
                farm_lingjiang();
                sleep(500);
            }
        }

    }
    sleep(3000);
    //领奖
    while (_common_Fuction.click_by_textcontains('点击领取')) {
        farm_lingjiang();
        sleep(1000);
    }
    //关闭，退出
    _common_Fuction.click_by_desc('关闭');
    _common_Fuction.toast_console('芭芭农场任务执行结束');
}

// -------蚂蚁森林-------------------
function paopao() {
    for (let i = 0; i < 5; i++)
        _common_Fuction.find_images(3, './img/大气泡color.jpg', undefined, true);
}
//蚂蚁森林的任务
function do_forest_task() {
    if (textContains('观看视频').exists()) {
        var video = _common_Fuction.click_by_text('观看视频');
        if (video) {
            sleep(2000);
            _common_Fuction.click_by_desc('返回');
        }
    }
    if (textContains('追寻踪迹').exists()) {
        var have = _common_Fuction.click_by_text('追寻踪迹');
        if (have) {
            sleep(2000);
            if (textContains('立即合成').exists()) {
                _common_Fuction.click_by_textcontains('立即合成');
            }
            _common_Fuction.click_by_desc('继续前进');
        }
    }
    if (textContains('获得拼图奖励').exists())
        _common_Fuction.click_by_textcontains('获得拼图奖励');
}

auto_alipay.ant_forest_task = function () {
    _common_Fuction.toast_console('蚂蚁森林任务开始执行');
    app.launch("com.eg.android.AlipayGphone");
    sleep(5000);
    _common_Fuction.click_by_text('蚂蚁森林');
    sleep(3000);
    paopao();
    _common_Fuction.find_images(3, './img/小气泡.jpg', undefined, true);
    sleep(1000);
    let a = _common_Fuction.find_images(3, './img/保护地.jpg');
    if (!a) //如果没找到图片就直接点击位置
        _common_Fuction.click_bounds(80, 1230, 200, 1370);
    sleep(2000);

    while (textContains('开始巡护').exists()) {
        _common_Fuction.click_by_textcontains('开始巡护');
        sleep(6000);
        do_forest_task();
        sleep(4000);
        if (textContains('继续前进').exists())
            _common_Fuction.click_by_text('继续前进');
    }
    sleep(2000);
    //关闭，退出
    _common_Fuction.click_by_desc('关闭');
    if (textContains('点击开启').exists())
        _common_Fuction.click_by_desc('关闭');
    _common_Fuction.toast_console('蚂蚁森林任务执行结束');

}


module.exports = auto_alipay;