var _common_Fuction = require('./common.js');

var sign_in = {};

sign_in.debug = function (debug) {
    _common_Fuction.debug = debug;
}
// 多点签到
sign_in.duodian_signin = function () {
    app.launch('com.wm.dmall');
    sleep(10000);
    //关闭广告
    if (!_common_Fuction.click_by_desc('多点'))
        _common_Fuction.click_by_id('com.wm.dmall:id/iv_close');
    sleep(2000);
    _common_Fuction.click_by_text('及时达');
    sleep(2000);
    swipe(device.width / 2, device.height / 2, device.width / 2, device.height / 5, 500)
    sleep(2000);
    _common_Fuction.find_images(3, './img/多点签到按钮.jpg');
    let i = 0
    while (i < 20) {
        if (textContains('积分商城').exists())
            break;
        sleep(500);
        i++
    }
    _common_Fuction.click_by_text('bdbb222e-ecbe-4bb5-bd42-ce7b93013fd4');
    _common_Fuction.toast_console('多点签到完成')
}

// 京东签到------------------------------------

sign_in.jd_signin = function () {
    app.launch('com.jingdong.app.mall');
    sleep(7000);

    //click_by_text('领京豆')  //第一次打开京东，会找不到这个text按钮，换用图片查找
    _common_Fuction.find_images(3, './img/领京豆按钮.jpg', undefined, true);
    sleep(2000);
    _common_Fuction.click_by_textcontains('签到领');

    _common_Fuction.toast_console('京东签到完成');
}

// 京东金融签到
sign_in.jdjr_signin = function () {
    app.launch('com.jd.jrapp');
    sleep(10000);

    //有弹窗广告

    _common_Fuction.click_by_text('签到');
    sleep(5000);

    _common_Fuction.click_by_text('签到领金贴');
    _common_Fuction.toast_console('京东金融签到完成');
}

module.exports = sign_in;

