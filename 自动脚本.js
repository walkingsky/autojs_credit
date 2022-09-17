"ui";
auto();

var tao_live = require('./taobao_live.js');
var _common_Fuction = require('./common.js');
var sign_in = require('./signin.js');
var auto_alipay = require('./alipay_op.js');

if (floaty && floaty.hasOwnProperty("checkPermission") && !floaty.checkPermission()) {
    floaty.requestPermission(); toast("请先开启悬浮窗权限再运行,否则无法显示提示");
    exit();
}



//线程执行其任务
var thread = null;

var ii = 0;
var jj = 0; //定时触发准备的全局变量


ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="自动刷积分脚本" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <frame>
                    <scroll>
                        <vertical >
                            <checkbox text="支付宝会员积分" id="ck_points_task" checked='true' />
                            <checkbox text="支付宝芭芭农场" id="ck_farm_task" checked='true' />
                            <checkbox text="支付宝蚂蚁森林" id="ck_forest_task" checked='true' />
                            <button id="btn_run_main" text="执行选中任务" />
                            <button id="btn_exit" text="退出" />
                        </vertical>
                    </scroll>
                </frame>
                <frame>
                    <scroll>
                        <vertical >
                            <checkbox text="多点签到" id="ck_duodian_signin" checked='true' />
                            <checkbox text="京东签到领京豆" id="ck_jd_signin" checked='true' />
                            <checkbox text="京东金融签到" id="ck_jdjr_signin" checked='true' />
                            <button id="btn_run_signin" text="执行选中的签到任务" />
                        </vertical>
                    </scroll>
                </frame>
                <frame>
                    <scroll>
                        <vertical >
                            <button id="btn_diantao_signin" text="点淘刷签到" />
                            <button id="btn_diantao_yuanbao" text="点淘刷元宝" />
                        </vertical>
                    </scroll>
                </frame>
            </viewpager>
        </vertical>
    </drawer>
);


activity.setSupportActionBar(ui.toolbar);

//设置滑动页面的标题
ui.viewpager.setTitles(["支付宝", "其他签到", "点淘"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);
ui.btn_exit.click(function () { ui.finish() });

//点淘签到
ui.btn_diantao_signin.click(function () {
    if (thread && thread.isAlive()) {
        _common_Fuction.toast_console('当前程序正在执行其他任务,请结束后再运行', true);
        return;
    }
    thread = threads.start(function () {
        //抓屏权限
        requestScreenCapture(false);
        //tao_live.debug(true);
        tao_live.diantao_sign();
        _common_Fuction.toast_console('点淘签到任务完成');
        return;
    })
})

//点淘刷元宝
ui.btn_diantao_yuanbao.click(function () {
    if (thread && thread.isAlive()) {
        _common_Fuction.toast_console('当前程序正在执行其他任务,请结束后再运行', true);
        return;
    }
    thread = threads.start(function () {
        //抓屏权限
        requestScreenCapture(false);
        //tao_live.debug(true);
        tao_live.diantao_yuanbao();
        _common_Fuction.toast_console('点淘刷元宝脚本完成');
        return;
    })
})

//签到任务
ui.btn_run_signin.click(function () {
    if (thread && thread.isAlive()) {
        _common_Fuction.toast_console('当前程序正在执行其他任务,请结束后再运行', true); return
    }
    thread = threads.start(function () {
        //抓屏权限
        requestScreenCapture(false);
        sign_in.debug(false);
        _common_Fuction.toast_console('签到');
        requestScreenCapture(false);
        //多点签到
        if (ui.ck_duodian_signin.checked) {
            sign_in.duodian_signin();
        }
        sleep(2000)
        //京东签到
        if (ui.ck_jd_signin.checked) {
            sign_in.jd_signin();
        }
        sleep(2000)
        //京东金融签到
        if (ui.ck_jdjr_signin.checked) {
            sign_in.jdjr_signin();
        }
        sleep(2000)
        _common_Fuction.toast_console('###***全部签到执行完毕***###');
        return;
    })
})


//支付宝任务
ui.btn_run_main.click(function () {
    if (thread && thread.isAlive()) {
        _common_Fuction.toast_console('当前程序正在执行其他任务,请结束后再运行', true);
        return
    }
    thread = threads.start(function () {
        //抓屏权限
        requestScreenCapture(false);

        auto_alipay.debug(true);

        if (ui.ck_points_task.checked) {
            auto_alipay.alipay_points();
        }
        if (ui.ck_farm_task.checked) {
            auto_alipay.baba_farm_task();
        }
        if (ui.ck_forest_task.checked)
            auto_alipay.ant_forest_task();

        return;
    })
})