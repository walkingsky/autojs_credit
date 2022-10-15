var _common_Fuction = require('./自动脚本/common.js');

var thread_swipe = null;
var thread_egg = null;
var thread_egg_id = null;
var thread_swipe_id = null;

/**
 * 应用
 */
var app_taolive = {};


/**
 * 点淘签到任务 （从元宝中心开始）
*/
app_taolive.diantao_sign = function () {

    //每日收益
    if (_common_Fuction.click_by_text('每日收益')) {
        sleep(4000);
        className('android.view.View').depth(16).indexInParent(1).find()[0].click();
    }
    yuanbaozhongxin();
    //签到
    sign();
    yuanbaozhongxin();
    //提现
    let tixian = _common_Fuction.click_by_text('提现');
    if (tixian == false)
        return;
    sleep(2000);
    _common_Fuction.click_by_text('提现到支付宝');
    sleep(2000);
    try {
        if (textContains('看60秒直播才能提现').exists()) {
            _common_Fuction.click_by_text('看直播');
            view_live();
            sleep(1000);
            _common_Fuction.click_by_text('提现到支付宝');
        }
        _common_Fuction.click_by_text('确认提现');
        let tixianchenggong = textContains('提现成功').findOne(6000);
        if (tixianchenggong) {
            _common_Fuction.click_by_textcontains('查看提现进度');
            descContains('转到上一层').findOne(2000).click();
        }
        descContains('转到上一层').findOne(2000).click();
    } catch (error) {
        _common_Fuction.toast_console('签到错误' + error);
    }

    //className("android.view.View").clickable(true).depth(25).indexInParent(1).findOne().click();
}

//走路鸭
app_taolive.zouluduck = {};


/**
 * 领取饮料奖励
 * @param {bool} finish 点击完成后是否打开转步数任务列表，true 为不打开任务列表
 */
app_taolive.zouluduck.drink = function (finish) {
    try {
        let zhanbushu_button_text = 'O1CN01IeRzpJ1hSSJ53VxuH_!!6000000004276-2-tps-116-132.png_';
        //点击空白，关闭可能打开的任务列表
        click(150, 300);
        sleep(1000);
        let lingqu_button = idContains('page').findOne(2000);
        // 饮料领取剩余时间
        let lingqu_button_text = lingqu_button.child(1).child(7).child(0).child(1).text();
        _common_Fuction.toast_console('领取饮料奖励:' + lingqu_button_text);
        if (lingqu_button_text == '领取') {
            lingqu_button.child(1).child(7).child(0).child(1).click();
            sleep(3000);
        }
        if (undefined == finish)
            _common_Fuction.click_by_text(zhanbushu_button_text);
        sleep(3000);
    } catch (error) {
        _common_Fuction.toast_console('领取饮料奖励drink:' + error);
    }
}
/**
 * 打工鸭：执行打工鸭的领步数任务（从元宝中心开始）
 */
app_taolive.dagongya = function () {
    var zhuantili_button_text = '';
    textContains('打工赚元宝').findOne(3000).click();

}
/**
 * 看直播,赚元宝
 */
app_taolive.kanzhibo = function () {
    _common_Fuction.toast_console('进入看直播，赚元宝');
    let kanzhibo = textContains('看直播，赚元宝').depth(26).indexInParent(1).findOne(2000);
    try {
        if (kanzhibo) {
            kanzhibo.parent().click();
            //此处等待很有必要，否则找不到元宝计数控件
            sleep(2000);
            var i = 0;
            while (true) {
                //翻倍操作
                if (id('gold_action_text').exists())
                    if (id('gold_action_text').findOne().text() == '点击翻倍' || id('gold_action_text').findOne().text() == '点击 x4 倍')
                        _common_Fuction.click_by_id('gold_action_layout');
                if (!id('gold_turns_text').depth(6).exists())
                    break;
                if (id('gold_egg_image').depth(6).indexInParent(1).exists() && null == thread_egg) {
                    _common_Fuction.toast_console('点击领蛋倒计时');
                    thread_egg = threads.start(function () {
                        thread_egg_id = setTimeout(() => {
                            if (id('gold_egg_image').depth(6).indexInParent(1).exists()) {
                                id('gold_egg_image').depth(6).indexInParent(1).findOne().parent().parent().click();
                                _common_Fuction.toast_console('点击金蛋领奖');
                            } else {
                                _common_Fuction.toast_console('划屏自动领奖');
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
        _common_Fuction.toast_console('看直播，赚元宝:' + error);
    }
    _common_Fuction.toast_console('完成看直播，赚元宝');
}

/**
 * 赚步数；领取步数奖励（从元宝中心开始）
 */
app_taolive.zouluduck.lingbushu = function (second) {
    var zhanbushu_button_text = 'O1CN01IeRzpJ1hSSJ53VxuH_!!6000000004276-2-tps-116-132.png_';
    textContains('走路赚元宝').findOne(3000).click();
    let temp = textContains(zhanbushu_button_text).findOne(5000);
    if (!temp && second == undefined) {
        _common_Fuction.toast_console('赚步数函数：没有找到赚步数按钮，返回');
        return;
    }
    _common_Fuction.toast_console('进入领取步数奖励');
    try { //出发按钮
        let chufa_button = text('出发').depth(18).indexInParent(2).findOne();
        if (chufa_button) {
            chufa_button.parent().click();
            sleep(5000);
            //点击空白，关闭可能打开的任务列表
            click(150, 300);
            if (text('O1CN012FPExu1acnrUXXUgf_!!6000000003351-2-tps-120-120.png_').exists())
                text('O1CN012FPExu1acnrUXXUgf_!!6000000003351-2-tps-120-120.png_').findOne().click();
            let yuanbao = textContains('88元宝').depth(16).find();
            let did = false;
            yuanbao.forEach(element => {
                element.click();
                sleep(2000);
                let zhibo = textContains('看直播60秒得').findOne(3000);
                if (zhibo) {
                    view_live();
                    did = true;
                } else {
                    _common_Fuction.toast_console('点击了无法领取的元宝:' + element.text());
                }
            });
            //没领到就再做一次
            if (did == false && second == undefined) {

                sleep(2000);
                //退出到元宝中心
                className('android.view.View').depth(16).indexInParent(1).findOne(2000).click();
                sleep(2000);
                _common_Fuction.toast_console('没能正常领取，再试一遍');
                this.lingbushu(true);
            }


        }
        //点击返回按钮，退出到元宝中心
        className('android.view.View').depth(16).indexInParent(1).findOne(2000).click();
    } catch (error) {
        _common_Fuction.toast_console('领取步数奖励error:' + error);
    }
    _common_Fuction.toast_console('完成领取步数奖励');
}
/**
 * 赚步数；执行赚步数 任务（从元宝中心开始）
 */
app_taolive.zouluduck.zhuanbushu = function () {
    var zhanbushu_button_text = 'O1CN01IeRzpJ1hSSJ53VxuH_!!6000000004276-2-tps-116-132.png_';
    textContains('走路赚元宝').findOne(3000).click();

    let temp = textContains(zhanbushu_button_text).findOne(5000);
    if (!temp) {
        _common_Fuction.toast_console('赚步数函数：没有找到赚步数按钮，返回');
        return;
    }

    sleep(3000);
    //喝水任务
    this.drink();

    //看视频60秒
    try {
        while (true) {
            let kanshipin60miao = textContains('看视频60秒').findOne(3000);
            if (!kanshipin60miao)
                break;
            _common_Fuction.toast_console('看视频60秒:' + kanshipin60miao.parent().child(5).text());
            if (kanshipin60miao.parent().child(5).text() == '去完成') {
                kanshipin60miao.click();
                //看60秒视频，完成后，并返回
                view();
                sleep(3000);
                //重新打开任务列表
                let temp = text(zhanbushu_button_text).findOne(5000);
                if (temp)
                    temp.click();

            } else {
                break;
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('看视频60秒:' + error);
    }

    //喝水任务
    this.drink();

    //看黄金8点档直播3分钟
    try {
        while (true) {
            let kanhuangjin8 = textContains('看黄金8点档直播3分钟').findOne(3000);
            if (!kanhuangjin8)
                break;
            _common_Fuction.toast_console('看黄金8点档直播3分钟:' + kanhuangjin8.parent().child(5).text());
            if (kanhuangjin8.parent().child(5).text() == '去完成') {
                kanhuangjin8.click();
                //看视频，完成后，并返回
                view();
                sleep(3000);
                //重新打开任务列表
                let temp = text(zhanbushu_button_text).findOne(5000);
                if (temp)
                    temp.click();

            } else {
                break;
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('看视频60秒:' + error);
    }

    //喝水任务
    this.drink();

    //看晚间惊喜视频60秒
    try {
        while (true) {
            let kanwanjianshipin = textContains('看晚间惊喜视频60秒').findOne(3000);
            if (!kanwanjianshipin)
                break;
            _common_Fuction.toast_console('看晚间惊喜视频60秒:' + kanwanjianshipin.parent().child(5).text());
            if (kanwanjianshipin.parent().child(5).text() == '去完成') {
                kanwanjianshipin.click();
                //看视频，完成后，并返回
                view();
                sleep(3000);
                //重新打开任务列表
                let temp = text(zhanbushu_button_text).findOne(5000);
                if (temp)
                    temp.click();

            } else {
                break;
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('看视频60秒:' + error);
    }

    //喝水任务
    this.drink();

    //浏览好货卖场30秒
    try {
        let liulanhaohuo = textContains('浏览好货卖场30秒').findOne(2000);
        if (liulanhaohuo) {
            _common_Fuction.toast_console('浏览好货卖场30秒:' + liulanhaohuo.parent().child(4).text());
            if (liulanhaohuo.parent().child(4).text() == '去完成') {
                liulanhaohuo.click();
                sleep(1000);
                view_web('30');
                sleep(3000);
            }
        } else {
            _common_Fuction.toast_console('浏览好货卖场30秒:任务按钮没找到');
        }
    } catch (error) {
        _common_Fuction.toast_console('浏览好货卖场30秒:' + error);
    }


    this.drink();

    //看精彩内容3分钟
    try {
        while (true) {
            let jingcaineirong = textContains('看精彩内容3分钟').findOne(2000);
            if (!jingcaineirong)
                break;
            _common_Fuction.toast_console('看精彩内容3分钟:' + jingcaineirong.parent().child(5).text());
            if (jingcaineirong.parent().child(5).text() == '去完成') {
                jingcaineirong.click();
                view();
                sleep(3000);
                let temp = text(zhanbushu_button_text).findOne(5000);
                if (temp)
                    temp.click();
            } else {
                break;
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('看精彩内容3分钟:' + error);
    }

    this.drink();

    //看精彩内容60秒
    let jingcaineirong60 = textContains('看精彩内容60秒').findOne(2000);
    try {
        if (jingcaineirong60) {
            _common_Fuction.toast_console('看精彩内容60秒:' + jingcaineirong60.parent().child(4).text());
            if (jingcaineirong60.parent().child(4).text() == '去完成') {
                jingcaineirong60.click();
                view();
                sleep(1000);
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('看精彩内容60秒:' + error);
    }

    this.drink();

    //搜索商品或主播
    let sousuo = textContains('搜索商品或主播').findOne(2000);
    try {
        if (sousuo) {
            _common_Fuction.toast_console('搜索商品或主播:' + sousuo.parent().child(4).text());
            if (sousuo.parent().child(4).text() == '去完成') {
                sousuo.click();
                let key_word = id('taolive_search_edit_text').findOne(2000);
                key_word.setText('衣服');
                _common_Fuction.click_by_id('taolive_search_textView');
                sleep(3000);
                idContains('taolive_search_icon_back').findOne(2000).click();
                sleep(1000);
                idContains('taolive_search_icon_back').findOne(2000).click();
                sleep(3000);
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('搜索商品或主播:' + error);
    }


    this.drink();

    //浏览上新日历30秒
    let shangxinrili = textContains('浏览上新日历30秒').findOne(2000);
    try {
        if (shangxinrili) {
            _common_Fuction.toast_console('浏览上新日历30秒:' + shangxinrili.parent().child(4).text());
            if (shangxinrili.parent().child(4).text() == '去完成') {
                shangxinrili.click();
                view_web('30');
                sleep(3000);
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('浏览上新日历30秒:' + error);
    }

    this.drink();

    //浏览精选推荐20秒
    let jingxuantuijian = textContains('浏览精选推荐20秒').findOne(2000);
    try {
        if (jingxuantuijian) {
            _common_Fuction.toast_console('浏览精选推荐20秒:' + jingxuantuijian.parent().child(4).text());
            if (jingxuantuijian.parent().child(4).text() == '去浏览') {
                jingxuantuijian.click();
                view_web('20');
                sleep(3000);
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('浏览精选推荐20秒:' + error);
    }

    this.drink();
    //看直播60秒
    try {
        while (true) {

            let kanzhibo60miao = textContains('看直播60秒').findOne(3000);
            if (!kanzhibo60miao)
                break;
            _common_Fuction.toast_console('看直播60秒:' + kanzhibo60miao.parent().child(5).text());
            if (kanzhibo60miao.parent().child(5).text() == '去完成') {
                kanzhibo60miao.click();
                view(true);
                sleep(3000);
                let temp = text(zhanbushu_button_text).findOne(5000);
                if (temp)
                    temp.click();

            } else {
                break;
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('看直播60秒:' + error);
    }


    this.drink();

    //浏览元宝商城30秒
    let yuanbaoshangcheng = textContains('浏览元宝商城30秒').findOne(2000);
    try {
        if (yuanbaoshangcheng) {
            _common_Fuction.toast_console('浏览元宝商城30秒:' + yuanbaoshangcheng.parent().child(4).text());
            if (yuanbaoshangcheng.parent().child(4).text() == '去浏览') {
                yuanbaoshangcheng.click();
                view_shangcheng();
                sleep(3000);
            }
        }
    } catch (error) {
        _common_Fuction.toast_console('浏览元宝商城30秒:' + error);
    }


    this.drink(true);


    //看商品赚步数
    _common_Fuction.toast_console('看商品赚步数');
    swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
    swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
    try {

        var i = 0;
        while (true) {
            if (i % 2 == 0)
                swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.7, 600);
            sleep(500);
            let temp = textContains('秒').className('android.view.View').depth(18).indexInParent(0).findOne(2000);
            if (temp == null)
                break;
            i++;
        }
        sleep(2000);
        swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);

        className('android.view.View').depth(14).indexInParent(9).findOne().click();
        sleep(1000);
    } catch (error) {
        _common_Fuction.toast_console('看商品赚步数错误:' + error);
    }


    //textContains('出发').click();

    sleep(2000);
    className('android.view.View').depth(16).indexInParent(1).findOne(2000).click();
}


/**
 * 点淘刷元宝任务（从元宝中心开始）
*/
app_taolive.diantao_yuanbao = function () {
    var remaining = 0 //领奖剩余时间，单位秒
    sleep(4000);
    var retry_count = 6;
    while (true) {
        remaining = get_remaining();
        if (remaining == 0) {
            remaining = get_remaining();
            retry_count = 6;
        }
        else if (remaining == -1) {
            retry_count--;
            sleep(1000);
            if (retry_count < 0)
                break;//没找到领奖标志，就退出
        }
        else {
            retry_count = 6;
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
            if (textContains('悬浮窗').exists())
                _common_Fuction.click_by_id('positive');
            sleep(3000);
        }
    }
    return;
}

//浏览元宝商城
function view_shangcheng() {
    //定时划屏
    for (let i = 0; i < 60; i++) {
        if (i % 3 == 0)
            swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.7, 800);
        sleep(1000);
    }
    sleep(2000);
    //返回按钮
    className('android.view.View').depth(16).indexInParent(0).findOne(1000).click();
}

/**
 * 浏览视频的任务
 * @param {bool} live 是否是直播（关闭按钮的id 不一样） true：是直播；其他：视频
 */
function view(live) {
    _common_Fuction.toast_console('进入view函数:(' + live + ')');
    sleep(1000);
    let i = 0;
    try {
        while (true) {
            //翻倍操作
            if (id('gold_action_text').exists())
                if (id('gold_action_text').findOne().text() == '点击翻倍' || id('gold_action_text').findOne().text() == '点击 x4 倍')
                    _common_Fuction.click_by_id('gold_action_layout');

            if (!textContains('后完成').exists())
                break;
            sleep(1000);
            i++;
            //定时划屏
            if (i % 10 == 0)
                swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
        }
        //如果是直播
        if (live) {
            _common_Fuction.click_by_id('taolive_close_btn');
        } else
            _common_Fuction.click_by_id('back');

    } catch (error) {
        _common_Fuction.toast_console(error);
    }
    _common_Fuction.toast_console('退出view函数');
}

/**
 * 浏览网页的任务
 * @param {string} miao 浏览的秒数
 */
function view_web(miao) {
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
                _common_Fuction.toast_console('view_web:' + button.text());
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
        _common_Fuction.toast_console('view_web 执行错误:' + error);
    }
    try {
        if (text('TB1QlFqglFR4u4jSZFPXXanzFXa-40-72').exists())
            _common_Fuction.click_by_text('TB1QlFqglFR4u4jSZFPXXanzFXa-40-72');
        if (textContains('返回>').indexInParent(0).exists())
            textContains('返回>').indexInParent(0).findOne().click();
    } catch (error) {
        _common_Fuction.toast_console('view_web 返回错误:' + error);
    }


}

/**
 * 查找元宝中心按钮
 */
function find_yuanbaozhongxin_button() {
    if (idContains('gold_common_image').exists()) {
        _common_Fuction.click_by_id('gold_common_image');
        return true;
    } else {
        return false;
    }
}

/**
 * 看直播60秒
 */
function view_live() {
    sleep(1000);
    if (textContains('后完成').exists()) {  //直接进入的，不用点击“看直播60秒按钮”
        var live = true;
    } else
        var live = _common_Fuction.click_by_textcontains('看直播60秒'); //看直播的按钮
    sleep(1000);
    if (live) {
        while (true) {
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

/**
 * 判断页面是否在元宝中心，如果不在的话就重启应用 
*/
function yuanbaozhongxin() {
    let elment = textContains('提现').findOne(2000);
    if (elment)
        _common_Fuction.toast_console('成功进入元宝中心');
    else
        restart();
}


/**
 * 打开应用，进入到元宝中心
 */
function start() {
    //let result = shell('am start com.taobao.live/com.taobao.live.home.activity.TaoLiveHomeActivity');
    app.launch('com.taobao.live');
    //阻断式等待
    id('tl_home_capture_video_btn').waitFor();
    sleep(500);
    //每天第一次进入app ，有个青少年模式提示，点击任意地方会关闭这个弹层提示
    if (textContains('青少年守护模式').exists())
        _common_Fuction.click_by_id('tv_teenager_close');

    find_yuanbaozhongxin_button();
    //阻断式等待
    textContains('提现').waitFor();
    _common_Fuction.toast_console('成功启动app并进入元宝中心');
}

/** 
 * 结束应用
*/
function stop() {
    _common_Fuction.toast_console('关闭应用');
    app.openAppSetting('com.taobao.live');
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
    find_yuanbaozhongxin_button();
    var remaining = 0;
    var lingjiang = false;
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
    } catch (error) {
        //_common_Fuction.toast_console(error);
    }
    if (lingjiang === true)
        _common_Fuction.toast_console('完成领取奖励');
    else
        _common_Fuction.toast_console('领奖剩余时间：' + remaining);
    return remaining;
}

/**
 * 设置调试模式
 * @param {bool} debug 
 */
function deubg(debug) {
    _common_Fuction.debug = debug;
}


auto.waitFor()


start();
//签到
app_taolive.diantao_sign();



//转到元宝中心
yuanbaozhongxin();
sleep(2000);
//走路赚步数
app_taolive.zouluduck.zhuanbushu();

//转到元宝中心
yuanbaozhongxin();
sleep(2000);
//领取步数奖励
app_taolive.zouluduck.lingbushu();

//转到元宝中心
yuanbaozhongxin();
sleep(2000);
//看直播，赚元宝
app_taolive.kanzhibo();


//刷视频
//app_taolive.diantao_yuanbao();



