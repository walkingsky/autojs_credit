/**
 * 点淘刷元宝autojs脚本
 * author: walkingsky
 * url:https://github.com/walkingsky/autojs_credit
 */

var _common_Function = require('./自动脚本/common.js');


var thread_egg = null;


////------------通用函数----------------

var _function = {

    /**
     * 打开应用，进入到元宝中心
     */
    start: function () {
        //let result = shell('am start com.taobao.live/com.taobao.live.home.activity.TaoLiveHomeActivity');
        app.launch('com.taobao.live');
        //阻断式等待
        id('tl_home_capture_video_btn').waitFor();
        sleep(500);
        //每天第一次进入app ，有个青少年模式提示，点击任意地方会关闭这个弹层提示
        if (textContains('青少年守护模式').exists())
            _common_Function.click_by_id('tv_teenager_close');

        this.find_yuanbaozhongxin_button();
        //阻断式等待
        textContains('提现').waitFor();
        _common_Function.toast_console('成功启动app并进入元宝中心');
    },

    /** 
     * 结束应用
    */
    stop: function () {
        _common_Function.toast_console('关闭应用');
        app.openAppSetting('com.taobao.live');
        sleep(500);
        textContains('强行停止').waitFor();
        textContains('强行停止').click();
        sleep(500);
        textContains('确定').waitFor();
        textContains('确定').click();
        sleep(1000);
        back();
        _common_Function.toast_console('成功关闭应用');
    },

    /** 
     * 重启应用 
    */
    restart: function () {
        this.stop();
        this.start();
    },

    /**
     * 转换时间字符串到秒钟
     * @param {string} str 要转换的字符串
     * @returns  int 数字秒数
     */
    str_to_seconds: function (str) {
        let arr = str.split(':');
        if (arr.length == 3)
            return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
        else
            return false;
    },
    /**
     * 处理 “访问被拒绝” 页面出现
     */
    op_refuse: function () {
        if (textContains('访问被拒绝').exists() || id('baxia-punish').exists()) {
            _common_Function.toast_console('++出现“访问被拒绝”');
            back();
            sleep(1000);
            if (textContains('访问被拒绝').exists() || id('baxia-punish').exists()) {
                _common_Function.toast_console('==出现“访问被拒绝”');
                back();
                sleep(1000);
            }
        }
    },

    /**
     * 浏览视频的操作
     * @param {bool} live 是否是直播（关闭按钮的id 不一样） true：是直播；其他：视频
     */
    view: function (live) {
        _common_Function.toast_console('进入view函数:(' + live + ')');
        sleep(5000);

        // 判断是否有活动弹层
        if (id('bg-img').className('android.widget.Image').exists()) {
            swipe(100, 1400, 990, 1430, 400);
        }

        let i = 0;
        try {
            while (true) {
                this.op_refuse();
                //翻倍操作
                if (id('gold_action_text').exists())
                    if (id('gold_action_text').findOne().text() == '点击翻倍' || id('gold_action_text').findOne().text() == '点击 x4 倍')
                        _common_Function.click_by_id('gold_action_layout');

                //判断广告弹窗
                if (textContains('6000000007641-2-tps').exists())
                    textContains('6000000007641-2-tps').findOne().click();

                if (!(textContains('后完成').exists() || textContains('后发奖').exists() || textContains('后领奖').exists())) {
                    sleep(3000); //偶尔会有未完成任务提示，故增加延时
                    break;
                }
                sleep(2000);
                i++;
                //定时划屏
                if (i % 10 == 0) {
                    swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
                    sleep(2000);
                }

            }
            //模拟点击返回按钮
            if (back()) {
                _common_Function.toast_console('按键返回操作返回成功');
            } else {
                ////原来点击按钮的操作，作为一个备份方案
                if (live) {
                    if (!_common_Function.click_by_id('taolive_close_btn'))
                        _common_Function.click_by_id('back');
                } else
                    _common_Function.click_by_id('back');
            }
            sleep(2000);
            //有时会出现 “残忍离开” 弹层提示
            if (textContains('残忍离开').id('negative').exists())
                textContains('残忍离开').id('negative').findOne().click();

        } catch (error) {
            _common_Function.toast_console(error);
        }
        _common_Function.toast_console('退出view函数');
    },

    /**
     * 看直播
     */
    view_live: function () {
        _common_Function.toast_console('进入view_live函数');
        sleep(4000);
        this.op_refuse();
        live_title = '';
        if (textContains('后完成').exists() || textContains('后发奖').exists() || textContains('滑动浏览').exists() || textContains('后领奖').exists()) {  //直接进入的，不用点击“看直播60秒按钮”
            var live = true;
            live_title = '后完成';
            if (textContains('后发奖').exists())
                live_title = '后发奖';
            else if (textContains('后领奖').exists())
                live_title = '后领奖';
            else if (textContains('滑动浏览').exists())
                live_title = '滑动浏览';
        } else
            var live = _common_Function.click_by_textcontains('看直播60秒'); //看直播的按钮
        sleep(1000);

        if (live) {
            var i = 0;
            while (true) {
                this.op_refuse();
                //翻倍操作
                if (id('gold_action_text').exists())
                    if (id('gold_action_text').findOne().text() == '点击翻倍' || id('gold_action_text').findOne().text() == '点击 x4 倍')
                        _common_Function.click_by_id('gold_action_layout');

                if (!textContains(live_title).exists())
                    break;
                if (live_title != '后完成') //先划一次屏
                    swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
                sleep(2000);
                i++;
                //定时划屏
                if (i % 5 == 0) {
                    swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
                    sleep(2000);
                }
            }
            //返回
            if (!back()) { //原来点击按钮的操作，作为一个备份方案
                _common_Function.toast_console('按键返回没有生效');
                if (!_common_Function.click_by_id('taolive_close_btn')) {
                    if (textContains('返回').indexInParent(0).exists())
                        textContains('返回').indexInParent(0).findOne().click();
                    else if (id('back').indexInParent(0).exists())
                        id('back').indexInParent(0).findOne().click();
                    else
                        _common_Function.click_by_text('TB1QlFqglFR4u4jSZFPXXanzFXa-40-72');
                }
            } else {
                _common_Function.toast_console('按键返回操作返回成功');
            }
        }
        _common_Function.toast_console('退出view_live函数');
    },


    /**
     * 查找元宝中心按钮
     */
    find_yuanbaozhongxin_button: function () {
        if (idContains('gold_common_image').exists()) {
            _common_Function.click_by_id('gold_common_image');
            return true;
        } else {
            _common_Function.toast_console("gold_common_image 没找到");
            return false;
        }
    },


    /**
     * 额外领，貌似是一个比较老的功能了
     */
    view_ewailing: function () {
        sleep(1000);
        _common_Function.toast_console('进入额外领');
        try {
            while (true) {
                let remain = textContains('|跳过').indexInParent(1).findOne(5000);
                if (remain)
                    sleep(1000);
                else
                    break;
            }
            idContains("tt_reward_full_count_down_after").findOne(5000).click();
            sleep(3000);
        } catch (e) {
            _common_Function.toast_console('进入额外领错误：' + e);
        }
        _common_Function.toast_console('退出额外领');
    },

    //签到
    sign: function () {
        textContains('去签到').depth(23).indexInParent(4).findOne().click();
        //_common_Function.click_by_text('去签到');
        sleep(2000);
        this.view_live();
        className("android.view.View").clickable(true).depth(16).findOne(3000).click(); //返回元宝中心
    },

    /**
     * 判断页面是否在元宝中心，如果不在的话就重启应用 
    */
    yuanbaozhongxin: function () {
        let elment = textContains('提现').findOne(2000);
        if (elment)
            _common_Function.toast_console('成功进入元宝中心');
        else
            this.restart();
    },

    /**
     * 获取领奖剩余时间（从元宝中心开始）
     * @returns init 开奖剩余秒数；-1： 没找到领奖标识，返回-1
     */
    get_lingjiang_remaining: function () {
        _common_Function.toast_console('获取领奖剩余时间');
        var remaining = 0;
        try {
            while (true) {
                let b = className('android.view.View').depth(29).indexInParent(1).find();
                let c = className('android.view.View').depth(26).indexInParent(1).find();
                let d = className('android.view.View').depth(30).indexInParent(1).find();
                let e = className('android.view.View').depth(27).indexInParent(1).find();
                let a = [].concat(b, c, d, e);
                if (a.length == 0) {
                    _common_Function.toast_console('没找到组件');
                    return -1;
                }
                let re = /\d{2}:\d{2}:\d{2}/;
                a.forEach(element => {
                    if (element.text() == '领取奖励') {
                        _common_Function.toast_console('领取奖励');
                        element.click();
                        sleep(1000);
                        if (textContains('浏览30秒得至少').exists()) {
                            textContains('浏览30秒得至少').findOne().parent().click();
                            sleep(2000);
                            this.view_live();
                        }
                        else if (text('O1CN01LxFPWH1Mmy2hurJW4_!!6000000001478-2-tps-54-54.png_').exists())
                            text('O1CN01LxFPWH1Mmy2hurJW4_!!6000000001478-2-tps-54-54.png_').findOne().click();
                        else if (text('O1CN01X0rl5C1sKAxZ9QxCt_!!6000000005747-2-tps-512-276.png_').exists())
                            text('O1CN01X0rl5C1sKAxZ9QxCt_!!6000000005747-2-tps-512-276.png_').findOne().click();
                        sleep(3000);
                        lingjiang = true;
                        _common_Function.toast_console('完成领取奖励');
                    }
                    if (re.exec(element.text())) {
                        remaining = _function.str_to_seconds(element.text());
                    }
                });
                if (remaining != 0 && remaining != false)
                    break;
            }
        } catch (error) {
            _common_Function.toast_console(error);
            return -1;
        }
        _common_Function.toast_console('领奖剩余时间：' + remaining);
        return remaining;
    },

    /**
     * 获取走路鸭喝饮料的剩余时间（从元宝中心开始）
     * @returns int  -1:执行错误
     */
    get_drink_remaining: function () {
        sleep(5000);
        var remaining = 0;
        _common_Function.toast_console('获取走路鸭喝饮料的剩余时间');
        try {
            var zhanbushu_button_text = 'O1CN01IeRzpJ1hSSJ53VxuH_!!6000000004276-2-tps-116-132.png_';
            textContains('走路赚元宝').findOne(3000).click();
            sleep(2000);
            let temp = textContains(zhanbushu_button_text).findOne(5000);
            if (!temp) {
                _common_Function.toast_console('获取走路鸭喝饮料的剩余时间：没有找到赚步数按钮，返回');
                return -1;
            }
            while (true) {
                //点击空白，关闭可能打开的任务列表
                click(150, 300);
                sleep(1000);
                let lingqu_button = idContains('page').findOne(2000);
                // 饮料领取剩余时间
                let lingqu_button_text = lingqu_button.child(1).child(7).child(0).child(1).text();
                _common_Function.toast_console('领取饮料奖励:' + lingqu_button_text);
                if (lingqu_button_text == '领取') {
                    lingqu_button.child(1).child(7).child(0).child(1).click();
                    sleep(3000);
                }
                if (lingqu_button_text == '明日再来') {
                    remaining = -1;
                    break;
                }
                let re = /\d{2}:\d{2}:\d{2}/;
                if (re.exec(lingqu_button_text)) {
                    remaining = _function.str_to_seconds(lingqu_button_text);
                }
                if (remaining != 0 && remaining != false)
                    break;
            }

        } catch (error) {
            _common_Function.toast_console('获取走路鸭喝饮料的剩余时间:' + error);
            if (className('android.view.View').depth(16).indexInParent(1).exists())
                className('android.view.View').depth(16).indexInParent(1).findOne(2000).click();
            return -1;
        }

        _common_Function.toast_console('领奖剩余时间：' + remaining);
        className('android.view.View').depth(16).indexInParent(1).findOne(2000).click();
        return remaining;
    },

    /**
     * 获取打工鸭领取体力的剩余时间（从元宝中心开始）
     * @returns int  -1:执行错误
     */
    get_tili_remaining: function () {
        sleep(5000);
        var remaining = 0;
        _common_Function.toast_console('获取工鸭领取体力的剩余时间');
        try {
            var zhuantili_button_text = 'O1CN01vWC7gg20DmKvWaURW_!!6000000006816-2-tps-248-246.png_';
            textContains('打工赚元宝').findOne(3000).click();
            sleep(2000);
            let temp = textContains(zhuantili_button_text).findOne(5000);
            if (!temp) {
                _common_Function.toast_console('获取工鸭领取体力的剩余时间：没有找到赚体力按钮，返回');
                return -1;
            }
            while (true) {
                //点击空白，关闭可能打开的任务列表
                click(400, 300);
                sleep(1000);
                let lingqu_button = idContains('action-drink').findOne(2000);
                if (text('已领完').exists()) { //体力已领完
                    remaining = -1;
                    break;
                }
                // 饮料领取剩余时间
                let lingqu_button_text = lingqu_button.child(2).text();
                if (lingqu_button_text == '0') {
                    lingqu_button_text = lingqu_button.child(2).text() + lingqu_button.child(3).text() + ':';
                    lingqu_button_text = lingqu_button_text + lingqu_button.child(5).text() + lingqu_button.child(6).text() + ':';
                    lingqu_button_text = lingqu_button_text + lingqu_button.child(8).text() + lingqu_button.child(9).text();
                }
                _common_Function.toast_console('领取体力:' + lingqu_button_text);
                if (lingqu_button_text == '去领取') {
                    lingqu_button.click();
                    sleep(3000);
                } else {
                    lingqu_button_text = lingqu_button.child(2).text() + lingqu_button.child(3).text() + lingqu_button.child(4).text() + lingqu_button.child(5).text()
                        + lingqu_button.child(6).text() + lingqu_button.child(7).text() + lingqu_button.child(8).text() + lingqu_button.child(9).text();
                }
                let re = /\d{2}:\d{2}:\d{2}/;
                if (re.exec(lingqu_button_text)) {
                    remaining = _function.str_to_seconds(lingqu_button_text);
                }
                if (remaining != 0 && remaining != false)
                    break;
            }

        } catch (error) {
            _common_Function.toast_console('获取工鸭领取体力的剩余时间:' + error);
            if (className('android.view.View').depth(16).indexInParent(0).exists())
                className('android.view.View').depth(16).indexInParent(0).findOne(2000).click();
            return -1;
        }

        _common_Function.toast_console('领取剩余时间：' + remaining);
        className('android.view.View').depth(16).indexInParent(0).findOne(2000).click();
        return remaining;
    },


    //浏览元宝商城
    view_shangcheng: function () {
        //定时划屏
        let tmp = false;
        for (let i = 0; i < 60; i++) {
            if (className('android.widget.ImageView').depth(9).indexInParent(3).exists() && tmp == false) {
                className('android.widget.ImageView').depth(9).indexInParent(3).findOne().click();
                tmp = true;
            }
            if (i % 3 == 0)
                swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.7, 800);
            sleep(1000);
        }
        sleep(2000);
        //返回按钮
        className('android.view.View').depth(16).indexInParent(0).findOne(1000).click();
    },


    /**
     * 浏览网页的任务
     * @param {string} miao 浏览的秒数
     */
    view_web: function (miao) {
        let button = className('android.view.View').depth(22).indexInParent(0).findOne(2000);
        try {
            if (button) {
                var i = 0;
                while (true) {
                    //let button = className('android.view.View').depth(22).indexInParent(0).findOne(2000);
                    let button = textContains('滑动浏览').findOne(2000);
                    if (button == null)
                        button = textContains('任务').indexInParent(0).findOne(2000);
                    if (button == null)
                        button = textContains('任务').indexInParent(1).findOne(2000);
                    _common_Function.toast_console('view_web:' + button.text());
                    if (button.text() != '滑动浏览' + miao + '秒')
                        break;
                    i++;
                    if (i % 3 == 0) {
                        swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.5, 800);
                        sleep(10);
                        swipe(device.width / 2, device.height * 0.4, device.width / 2, device.height * 0.9, 800);
                    }
                    sleep(1000);
                }
            }
        } catch (error) {
            _common_Function.toast_console('view_web 执行错误:' + error);
        }
        try {
            if (text('TB1QlFqglFR4u4jSZFPXXanzFXa-40-72').exists())
                _common_Function.click_by_text('TB1QlFqglFR4u4jSZFPXXanzFXa-40-72');
            else if (textContains('返回>').indexInParent(0).exists())
                textContains('返回>').indexInParent(0).findOne().click();
            else if (text('TB1Iax1R.T1gK0jSZFrXXcNCXXa-40-72').exists()) {
                _common_Function.click_by_text('TB1Iax1R.T1gK0jSZFrXXcNCXXa-40-72');
            } else {
                _common_Function.toast_console('没找到返回按钮，可能会导致后面的执行出错');
            }
        } catch (error) {
            _common_Function.toast_console('view_web 返回错误:' + error);
        }

    }
}


////////////////////////  应用

var app_taolive = {
    /**
 * 点淘签到任务 （从元宝中心开始）
*/
    diantao_sign: function () {

        //双11预热广告弹窗
        if (className('android.widget.ImageView').depth(9).indexInParent(3).exists()) {
            _common_Function.toast_console('双11预热广告弹窗');
            className('android.widget.ImageView').depth(9).indexInParent(3).findOne().click();
        }

        //每日收益
        if (_common_Function.click_by_text('每日收益')) {
            sleep(4000);
            className('android.view.View').depth(16).indexInParent(1).find()[0].click();
        }
        _function.yuanbaozhongxin();
        //签到
        _function.sign();
        _function.yuanbaozhongxin();
        /*  取消提现操作
        //提现
        let tixian = _common_Function.click_by_text('提现');
        if (tixian == false)
            return;
        sleep(2000);
        _common_Function.click_by_text('提现到支付宝');
        sleep(2000);
        try {
            if (textContains('看60秒直播才能提现').exists()) {
                _common_Function.click_by_text('看直播');
                _function.view_live();
                sleep(1000);
                _common_Function.click_by_text('提现到支付宝');
            }
            _common_Function.click_by_text('确认提现');
            let tixianchenggong = textContains('提现成功').findOne(6000);
            if (tixianchenggong) {
                _common_Function.click_by_textcontains('查看提现进度');
                descContains('转到上一层').findOne(2000).click();
            }
            descContains('转到上一层').findOne(2000).click();
        } catch (error) {
            _common_Function.toast_console('签到错误' + error);
        }
        */
        //className("android.view.View").clickable(true).depth(25).indexInParent(1).findOne().click();
    },

    //走路鸭
    duke: {
        /**
         * 领取饮料奖励
         * @param {bool} finish 点击完成后是否打开转步数任务列表，true 为不打开任务列表
         */
        drink: function (finish) {
            sleep(3000);
            try {
                let zhanbushu_button_text = 'O1CN01IeRzpJ1hSSJ53VxuH_!!6000000004276-2-tps-116-132.png_';
                //点击空白，关闭可能打开的任务列表
                click(150, 300);
                sleep(1000);
                let lingqu_button = idContains('page').findOne(2000);
                // 饮料领取剩余时间
                let lingqu_button_text = '';
                if (textContains('今日步数已完成').exists()) {
                    _common_Function.toast_console('今日步数已完成，不用领取');
                    return;
                }
                else
                    lingqu_button_text = lingqu_button.child(1).child(7).child(0).child(1).text();
                _common_Function.toast_console('领取饮料奖励:' + lingqu_button_text);
                if (lingqu_button_text == '领取') {
                    _common_Function.click_by_text('领取');
                    //lingqu_button.child(1).child(7).child(0).child(1).click();
                    sleep(3000);
                }
                if (undefined == finish)
                    _common_Function.click_by_text(zhanbushu_button_text);
                sleep(3000);
            } catch (error) {
                _common_Function.toast_console('领取饮料奖励drink:' + error);
            }
        },
        /**
         * 领取体力奖励
         * @param {bool} finish 点击完成后是否打开转步数任务列表，true 为不打开任务列表
         */
        lingtili: function (finish) {
            sleep(3000);
            try {
                let zhantili_button_text = 'O1CN01vWC7gg20DmKvWaURW_!!6000000006816-2-tps-248-246.png_';
                //点击空白，关闭可能打开的任务列表
                click(400, 300);
                sleep(1000);
                let lingqu_button = idContains('action-drink').findOne(2000);
                if (text('已领完').exists()) { //体力已领完
                    _common_Function.toast_console('领取体力:已领完');
                    if (undefined == finish) {
                        _common_Function.click_by_text(zhantili_button_text);
                        sleep(3000);
                    }
                    return;
                }
                // 体力领取剩余时间
                let lingqu_button_text = lingqu_button.child(2).text();
                _common_Function.toast_console('领取体力:' + lingqu_button_text);
                if (lingqu_button_text == '去领取') {
                    if (text('签到').exists())
                        //text('签到').findOne().click();
                        _common_Function.click_by_text('签到');
                    lingqu_button.click();
                    sleep(3000);
                }
                //console.log(lingqu_button_text);
                if (undefined == finish)
                    _common_Function.click_by_text(zhantili_button_text);
                sleep(3000);
            } catch (error) {
                _common_Function.toast_console('领取体力error:' + error);
            }
        },
        /**
         * 赚步数；领取步数奖励（从元宝中心开始）
         */
        lingbushu: function (second) {
            var zhanbushu_button_text = 'O1CN01IeRzpJ1hSSJ53VxuH_!!6000000004276-2-tps-116-132.png_';
            textContains('走路赚元宝').findOne(3000).click();
            let temp = textContains(zhanbushu_button_text).findOne(5000);
            if (!temp && second == undefined) {
                _common_Function.toast_console('赚步数函数：没有找到赚步数按钮，返回');
                return;
            }
            _common_Function.toast_console('进入领取步数奖励');
            try { //出发按钮
                let chufa_button = text('出发').depth(18).indexInParent(2).findOne(3000);
                if (!chufa_button)
                    chufa_button = text('今日步数已完成').depth(16).indexInParent(1).findOne(3000);
                if (chufa_button) {
                    chufa_button.parent().click();
                    sleep(5000);
                    //点击空白，关闭可能打开的任务列表
                    click(150, 300);
                    if (text('O1CN012FPExu1acnrUXXUgf_!!6000000003351-2-tps-120-120.png_').exists())
                        text('O1CN012FPExu1acnrUXXUgf_!!6000000003351-2-tps-120-120.png_').findOne().click();
                    let did = false;
                    while (true) {
                        let yuanbao = textContains('88元宝').depth(16).findOne(1000);
                        if (yuanbao) {
                            yuanbao.click();
                            sleep(2000);
                            //let zhibo = textContains('看直播60秒得').findOne(3000);
                            let zhibo = textContains('浏览30秒再得').findOne(3000);
                            if (zhibo) {
                                textContains('浏览30秒再得').findOne().click();
                                _function.view_live();
                                did = true;
                            } else if (textContains('我知道了').exists()) {
                                textContains('我知道了').indexInParent(5).click();
                            } else if (textContains('额外领最高').exists()) {
                                let ewailing = textContains('额外领最高').findOne(3000);
                                if (ewailing) {
                                    ewailing.click();
                                    sleep(2000);
                                    _function.view_ewailing();
                                    did = true;
                                }
                            } else {
                                _common_Function.toast_console('点击了无法领取的元宝:' + yuanbao.text());
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    //没领到就再做一次
                    if (did == false && second == undefined) {

                        sleep(2000);
                        //退出到元宝中心
                        className('android.view.View').depth(16).indexInParent(1).findOne(2000).click();
                        sleep(2000);
                        _common_Function.toast_console('没能正常领取，再试一遍');
                        this.lingbushu(true);
                    }


                }
                //点击返回按钮，退出到元宝中心
                className('android.view.View').depth(16).indexInParent(1).findOne(2000).click();
            } catch (error) {
                _common_Function.toast_console('领取步数奖励error:' + error);
            }
            _common_Function.toast_console('完成领取步数奖励');
        },
        /**
         * 赚元宝的看直播任务
         * @param {text} title 看直播类型标题
         * @param {text} zhanbushu_button_text 上层传过来的任务按钮文本
         * @param {text} live 浏览类型，‘live’直播，‘view’滑动浏览
         */
        kanzhibo: function (title, zhanbushu_button_text, live) {
            try {
                while (true) {
                    var kanzhibo = textContains(title).find();
                    if (kanzhibo.length == 0)
                        break;
                    let j = 0;
                    let i = 0;
                    for (; i < kanzhibo.length; i++) {
                        let kanzhibo_temp = kanzhibo[i];

                        let _temp_bool = false;
                        if (kanzhibo_temp.parent().childCount() > 8) {
                            if (kanzhibo_temp.parent().child(7).text() == '去完成')
                                _temp_bool = true;
                            _common_Function.toast_console('看直播:' + kanzhibo_temp.parent().child(0).text() + kanzhibo_temp.parent().child(7).text());
                        } else if (kanzhibo_temp.parent().childCount() > 7) {
                            if (kanzhibo_temp.parent().child(6).text() == '去完成')
                                _temp_bool = true;
                            _common_Function.toast_console('看直播:' + kanzhibo_temp.parent().child(0).text() + kanzhibo_temp.parent().child(6).text());
                        }
                        else if (kanzhibo_temp.parent().child(5).text() == '去完成' || kanzhibo_temp.parent().child(5).text() == '去观看') {
                            _common_Function.toast_console('看直播:' + kanzhibo_temp.parent().child(0).text() + kanzhibo_temp.parent().child(5).text());
                            _temp_bool = true;
                        }
                        if (_temp_bool) {
                            //if ((kanzhibo_temp.parent().child(5).text() == '去完成' || kanzhibo_temp.parent().child(5).text() == '去观看') && kanzhibo_temp.parent().child(0).text().search('分钟') == -1) {
                            kanzhibo_temp.click();
                            if (live == 'live')
                                _function.view(true);
                            else if (live == 'view')
                                _function.view_live();
                            sleep(3000);
                            let temp = text(zhanbushu_button_text).findOne(5000);
                            if (temp) {
                                temp.click();
                                sleep(2000);
                            }
                            i++;
                            break;
                        } else {
                            j++;
                        }
                    }
                    sleep(2000);
                    if (i == j)
                        break;
                }
            } catch (error) {
                _common_Function.toast_console('看直播:' + error);
            }
        },
        /**
         * 赚元宝任务（从元宝中心开始）
         * @param {bool} dagong 是否是打工任务，还是走路任务
         */
        zhuanyuanbao: function (dagong) {
            var zhanbushu_button_text = 'O1CN01IeRzpJ1hSSJ53VxuH_!!6000000004276-2-tps-116-132.png_';
            var zhuantili_button_text = 'O1CN01vWC7gg20DmKvWaURW_!!6000000006816-2-tps-248-246.png_';
            var zhuanqu_button_text = '';
            if (dagong) {
                textContains('打工赚元宝').findOne(3000).click();
                let temp = textContains(zhuantili_button_text).findOne(5000);
                if (!temp) {
                    _common_Function.toast_console('赚步数函数：没有找到赚步数按钮，返回');
                    return;
                }
                zhuanqu_button_text = zhuantili_button_text;
            }
            else {
                textContains('走路赚元宝').findOne(3000).click();
                let temp = textContains(zhanbushu_button_text).findOne(5000);
                if (!temp) {
                    _common_Function.toast_console('赚步数函数：没有找到赚步数按钮，返回');
                    return;
                }
                zhuanqu_button_text = zhanbushu_button_text;
            }


            sleep(3000);
            if (dagong)
                //领体力
                this.lingtili();
            else
                //喝水任务
                this.drink();

            if (dagong) {
                // 打工鸭
                sleep(2000);
                app_taolive.duke.kanzhibo('看小视频30秒', zhanbushu_button_text, 'live');
                sleep(4000);
                this.lingtili();
                app_taolive.duke.kanzhibo('看直播3分钟', zhanbushu_button_text, 'live');
                sleep(4000);
                this.lingtili();
                app_taolive.duke.kanzhibo('浏览精选推荐', zhanbushu_button_text, 'view');
                sleep(4000);
                app_taolive.duke.kanzhibo('浏览当季上新好物', zhanbushu_button_text, 'view');
                sleep(4000);
                app_taolive.duke.kanzhibo('浏览省钱专区', zhanbushu_button_text, 'view');
                sleep(4000);
                app_taolive.duke.kanzhibo('浏览上新日历', zhanbushu_button_text, 'view');
                sleep(4000);
                app_taolive.duke.kanzhibo('浏览好货卖场', zhanbushu_button_text, 'view');
                sleep(4000);
                this.lingtili();
                app_taolive.duke.kanzhibo('看点淘羊毛直播间', zhanbushu_button_text, 'live');
            } else {
                //走路鸭
                sleep(2000);
                app_taolive.duke.kanzhibo('看直播60秒', zhanbushu_button_text, 'live');
                sleep(4000);
                this.drink();
                app_taolive.duke.kanzhibo('看好物视频60秒', zhanbushu_button_text, 'live');
                sleep(4000);
                this.drink();
                app_taolive.duke.kanzhibo('看精彩内容30秒', zhanbushu_button_text, 'live');
                sleep(4000);
                app_taolive.duke.kanzhibo('浏览省钱专区', zhanbushu_button_text, 'view');
                sleep(4000);
                app_taolive.duke.kanzhibo('浏览当季上新好物', zhanbushu_button_text, 'view');
                sleep(4000);
                this.drink();
                app_taolive.duke.kanzhibo('浏览好货卖场30秒', zhanbushu_button_text, 'view');
                sleep(4000);
                this.drink();
                app_taolive.duke.kanzhibo('浏览精选推荐60秒', zhanbushu_button_text, 'view');
                sleep(4000);
                app_taolive.duke.kanzhibo('看直播2分钟', zhanbushu_button_text, 'live');
                sleep(4000);
                this.drink();
                sleep(4000);
                app_taolive.duke.kanzhibo('看好看直播间2分钟', zhanbushu_button_text, 'live');
                this.drink();
                //sleep(4000); //暂时跳过，太耗时间
                //app_taolive.duke.kanzhibo('看直播回放5分钟', zhanbushu_button_text, 'live');
                sleep(3000);
            }

            if (dagong)
                //领体力
                this.lingtili();
            else
                //喝水任务
                this.drink();
            /*
            //逛一逛支付宝芭芭农场
            try {
                let babanongchang = textContains('芭芭农场').findOne(2000);
                if (babanongchang) {
                    if (babanongchang.parent().child(4).text() == '去完成') {
                        babanongchang.click();
                        sleep(5000);
                        //切回点淘
                        app.launch('com.taobao.live');
                        sleep(3000);
                    }
                } else {
                    _common_Function.toast_console('逛一逛支付宝芭芭农场:任务按钮没找到');
                }
            } catch (error) {
                _common_Function.toast_console('逛一逛支付宝芭芭农场error:' + error);
            }
            */

            //看黄金8点档直播3分钟
            try {
                while (true) {
                    var kanhuangjin8 = textContains('看黄金8点档直播').find();
                    if (kanhuangjin8.length == 0)
                        break;
                    let j = 0;
                    let i = 0;
                    for (; i < kanhuangjin8.length; i++) {
                        let kanhuangjin8_temp = kanhuangjin8[i];
                        _common_Function.toast_console('看黄金8点档直播:' + kanhuangjin8_temp.parent().child(5).text());
                        if (kanhuangjin8_temp.parent().child(5).text() == '去完成' || kanhuangjin8_temp.parent().child(5).text() == '去观看') {
                            kanhuangjin8_temp.click();
                            //看视频，完成后，并返回
                            _function.view(true);
                            sleep(3000);
                            //重新打开任务列表
                            let temp = text(zhuanqu_button_text).findOne(5000);
                            if (temp) {
                                temp.click();
                                sleep(2000);
                            }
                            i++;
                            break;
                        } else {
                            j++;
                        }
                    }
                    if (i == j)
                        break;
                }
            } catch (error) {
                _common_Function.toast_console('看黄金8点档直播:' + error);
            }

            if (dagong)
                //领体力
                this.lingtili();
            else
                //喝水任务
                this.drink();

            //看晚间惊喜视频60秒 、看晚间精彩内容60秒
            try {
                while (true) {
                    var kanwanjianshipin = textContains('看晚间').find();
                    if (kanwanjianshipin.length == 0)
                        break;
                    let j = 0;
                    let i = 0;
                    for (; i < kanwanjianshipin.length; i++) {
                        let kanwanjianshipin_temp = kanwanjianshipin[i];
                        _common_Function.toast_console('看晚间:' + kanwanjianshipin_temp.parent().child(0).text() + kanwanjianshipin_temp.parent().child(5).text());
                        if (kanwanjianshipin_temp.parent().child(5).text() == '去完成') {
                            kanwanjianshipin_temp.click();
                            //看视频，完成后，并返回
                            _function.view();
                            sleep(3000);
                            //重新打开任务列表
                            let temp = text(zhuanqu_button_text).findOne(5000);
                            if (temp) {
                                temp.click();
                                sleep(2000);
                            }
                            i++;
                            break;
                        } else {
                            j++;
                        }
                    }
                    if (i == j)
                        break;
                }
            } catch (error) {
                _common_Function.toast_console('看晚间:' + error);
            }

            if (dagong)
                //领体力
                this.lingtili();
            else
                //喝水任务
                this.drink();


            //搜索商品或主播
            let sousuo = textContains('搜索宝贝后浏览').findOne(2000);
            try {
                if (sousuo) {
                    _common_Function.toast_console('搜索宝贝后浏览:' + sousuo.parent().child(4).text());
                    if (sousuo.parent().child(4).text() == '去完成') {
                        sousuo.click();
                        let key_word = id('taolive_search_edit_text').findOne(2000);
                        key_word.setText('衣服');
                        _common_Function.click_by_id('taolive_search_textView');
                        sleep(3000);
                        idContains('taolive_search_icon_back').findOne(2000).click();
                        sleep(1000);
                        idContains('taolive_search_icon_back').findOne(2000).click();
                        sleep(3000);
                    }
                }
            } catch (error) {
                _common_Function.toast_console('搜索宝贝后浏览:' + error);
            }


            if (dagong)
                //领体力
                this.lingtili();
            else
                //喝水任务
                this.drink();

            if (dagong)
                //点击空白，关闭可能打开的任务列表
                click(400, 300);
            else
                //点击空白，关闭可能打开的任务列表
                click(150, 300);

            sleep(1000);

            // 打工赚体力的页面总是莫名卡住进入死循环，所以暂时先略过
            if (dagong == undefined) {
                //看商品赚步数
                _common_Function.toast_console('看商品赚步数');
                swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
                swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
                try {

                    var i = 0;
                    while (true) {
                        if (i % 2 == 0)
                            swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.7, 600);
                        sleep(1000);
                        if (textContains('今日任务已完成').exists())
                            break;
                        i++;
                    }
                    sleep(2000);
                    swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);

                    className('android.view.View').depth(14).indexInParent(9).findOne(3000).click();
                    sleep(1000);
                } catch (error) {
                    _common_Function.toast_console('看商品赚步数错误:' + error);
                }
                _common_Function.toast_console('完成看商品赚步数');
            }

            if (dagong) {
                //看商品赚体力
                _common_Function.toast_console('看商品赚体力');
                swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
                swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
                try {

                    var i = 0;
                    while (textContains('看商品赚体力').exists()) {
                        if (i % 2 == 0)
                            swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 300);
                        sleep(1000);
                        if (textContains('今日任务已完成').exists())
                            break;
                        i++;
                    }
                    sleep(2000);
                    swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);

                    className('android.view.View').depth(14).indexInParent(9).findOne(3000).click();
                    sleep(1000);
                } catch (error) {
                    _common_Function.toast_console('看商品赚体力错误:' + error);
                }
                _common_Function.toast_console('完成看商品赚体力');
            }


            sleep(2000);
            if (dagong) {
                if (className('android.view.View').depth(16).indexInParent(0).exists())
                    className('android.view.View').depth(16).indexInParent(0).findOne(2000).click();
            } else {
                if (className('android.view.View').depth(16).indexInParent(1).exists())
                    className('android.view.View').depth(16).indexInParent(1).findOne(2000).click();
            }

            sleep(1000);
            //有个是否使用的 提示，选择不使用
            if (textContains('残忍离开').exists())
                textContains('残忍离开').indexInParent(6).findOne().click();
        }

    },
    /**
     * 赚钱任务(从元宝中心开始)
     * @param {int} 结束时间（整数），秒
     */
    kanzhibo: function (renwu, remaining_time) {
        _common_Function.toast_console('进入' + renwu);
        let renwu_button = textContains(renwu).depth(24).indexInParent(2).findOne(2000);
        if (!renwu_button)
            renwu_button = textContains(renwu).depth(23).indexInParent(2).findOne(2000);
        if (!renwu_button)
            renwu_button = textContains(renwu).depth(27).indexInParent(2).findOne(2000);
        try {
            _function.op_refuse();
            if (renwu_button) {
                var start = Date.parse(new Date()) / 1000;
                renwu_button.parent().click();
                //此处等待很有必要，否则找不到元宝计数控件
                sleep(2000);
                var i = 0;
                while (true) {
                    _function.op_refuse();
                    //翻倍操作
                    if (id('gold_action_text').exists())
                        if (id('gold_action_text').findOne().text() == '点击翻倍' || id('gold_action_text').findOne().text() == '点击 x4 倍')
                            _common_Function.click_by_id('gold_action_layout');
                    if (!id('gold_turns_text').depth(6).exists() && !id('gold_turns_text').depth(9).exists())
                        break;
                    if (Date.parse(new Date()) / 1000 - start > remaining_time) {
                        break;
                    } else {
                        if ((Date.parse(new Date()) / 1000 - start) % 120 == 0)
                            _common_Function.toast_console('持续时间(秒):' + (Date.parse(new Date()) / 1000 - start));
                    }
                    //进详情，领元宝(猜你喜欢 赚元宝 中的判断)
                    if (text('进详情赚元宝').depth(23).exists()) {
                        _common_Function.click_by_textcontains('进详情赚元宝');
                        //text('进详情赚元宝').depth(23).findOne().parent().parent().parent().click();
                        _common_Function.toast_console('进详情赚元宝');
                        //进详情页后，等待3秒钟
                        sleep(3000);
                        while (true) {
                            if (!textContains('力中').exists())
                                break;
                            sleep(1000);
                        }
                        if (desc('返回').indexInParent(0).depth(9).exists()) {
                            _common_Function.click_by_desc('返回');
                        }
                    }
                    //自动点击领蛋
                    if (id('gold_egg_image').depth(6).indexInParent(1).exists() && null == thread_egg) {
                        _common_Function.toast_console('点击领蛋倒计时');
                        thread_egg = threads.start(function () {
                            thread_egg_id = setTimeout(() => {
                                if (id('gold_egg_image').depth(6).indexInParent(1).exists()) {
                                    id('gold_egg_image').depth(6).indexInParent(1).findOne().parent().parent().click();
                                    _common_Function.toast_console('点击金蛋领奖');
                                } else {
                                    _common_Function.toast_console('划屏自动领奖');
                                }
                                thread_egg_id = null;
                                if (null != thread_egg) {
                                    thread_egg.interrupt();
                                    thread_egg = null;
                                }
                                return;
                            }, 41000);
                        })
                    }
                    sleep(1000);
                    i++;
                    //定时划屏
                    if (i % 20 == 0)
                        swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
                }
            }
        } catch (error) {
            _common_Function.toast_console(renwu + ':' + error);
        }
        //点击返回按钮，回到元宝中心
        if (id('taolive_close_btn').exists())
            id('taolive_close_btn').findOne().click()
        if (id('back').depth(12).exists())
            id('back').depth(12).findOne().click();
        _common_Function.toast_console('完成' + renwu);
    }

};



/////////////////////开始执行操作

auto.waitFor()

//设置起始步骤
let start_step = 3;
sleep(5000);

if (start_step <= 1)
    _function.start();

if (start_step <= 2) {

    //签到
    app_taolive.diantao_sign();
}

if (start_step <= 3) {
    //转到元宝中心
    _function.yuanbaozhongxin();
    sleep(2000);
    //走路赚元宝
    app_taolive.duke.zhuanyuanbao();
}

if (start_step <= 4) {
    //转到元宝中心
    _function.yuanbaozhongxin();
    sleep(2000);
    //领取步数奖励
    app_taolive.duke.lingbushu();
}

if (start_step <= 5) {
    //转到元宝中心
    _function.yuanbaozhongxin();
    sleep(2000);
    //打工赚元宝
    app_taolive.duke.zhuanyuanbao(true);
}

if (start_step <= 6) {
    //转到元宝中心
    _function.yuanbaozhongxin();
    sleep(2000);
    //长线任务
    let i = 1;
    while (true) {
        sleep(2000);
        let lingjiang_remaining = _function.get_lingjiang_remaining();
        sleep(2000);
        let drink_remaining = _function.get_drink_remaining();
        sleep(2000);
        let tili_remaining = _function.get_tili_remaining();
        //找到最小的等待时间
        let remaining_time = lingjiang_remaining < drink_remaining ? (lingjiang_remaining < tili_remaining ? lingjiang_remaining : tili_remaining) : (drink_remaining < tili_remaining ? drink_remaining : tili_remaining);
        //如果有一个时间获取异常，则找到最小的一个非异常时间
        if (remaining_time == -1) {
            let array_tmp = [lingjiang_remaining, drink_remaining, tili_remaining];
            array_tmp.sort(function (a, b) { return a - b });
            if (array_tmp[1] != -1)
                remaining_time = array_tmp[1];
            else if (array_tmp[2] != -1)
                remaining_time = array_tmp[2];
            else
                remaining_time = 1800
        }
        _common_Function.toast_console('领奖剩余时间(秒):' + remaining_time);
        sleep(3000);
        //按顺序 轮询执行不同任务
        if (i == 1)
            app_taolive.kanzhibo('猜你喜欢 赚元宝', remaining_time);
        else if (i == 2)
            app_taolive.kanzhibo('看直播，赚元宝', remaining_time);
        else {
            i = 0;
            app_taolive.kanzhibo('看视频，赚元宝', remaining_time);
        }
        i++;
    }
}
