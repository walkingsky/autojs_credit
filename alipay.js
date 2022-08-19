"ui";
auto();

if (floaty && floaty.hasOwnProperty("checkPermission") && !floaty.checkPermission()) {
    floaty.requestPermission(); toast("请先开启悬浮窗权限再运行,否则无法显示提示"); exit()
}

//线程执行其任务
var thread = null


//----------------------------------------------
//消息提示
function toast_console(msg, tshow) {
    console.log(msg);
    tshow = true
    if (tshow) toast(msg);
}

//点击控件所在坐标
function btn_position_click(x) { if (x) click(x.bounds().centerX(), x.bounds().centerY()) }

// 按文本查找按钮，并点击
function click_by_text(txt) {
    let btn = text(txt).findOne(5000)
    if (!btn) {
        toast_console('没找到‘' + txt + '’按钮')
        return;
    }
    btn_position_click(btn)
}

// 按desc文本查找按钮，并点击
function click_by_desc(txt) {
    let btn = desc(txt).findOne(5000);
    if (!btn) {
        toast_console('没找到‘' + txt + '’按钮')
        return;
    }
    btn_position_click(btn)
}

// 按id文本查找按钮，并点击
function click_by_id(id_str) {
    let btn = id(id_str).findOne(5000);
    if (!btn) {
        toast_console('没找到‘' + id_str + '’按钮')
        return;
    }
    btn_position_click(btn)
}


// 按文本包含内容查找按钮，并点击
function click_by_textcontains(txt) {
    let btn = textContains(txt).findOne(5000);
    if (!btn) {
        toast_console('没找到‘' + txt + '’按钮')
        return false;
    }
    btn_position_click(btn)
    return true
}

function click_bounds(x1, y1, x2, y2) {
    x = x1 + (x2 - x1) / 2
    y = y1 + (y2 - y1) / 2
    click(x, y)
}

// 截屏查找图片颜色并单击对应的点
function cs_click(num, rgb, xr, yr, wr, hr, flipup) {
    while (num--) {
        let img = captureScreen()
        if (flipup != undefined) img = images.rotate(img, 180)
        let point = findColor(img, rgb, { region: [img.getWidth() * xr, img.getHeight() * yr, img.getWidth() * wr, img.getHeight() * hr], threshold: 8 })
        if (point) {
            if (flipup != undefined) {
                point.x = img.getWidth() - point.x; point.y = img.getHeight() - point.y
            }
            return click(point.x, point.y);
        }
        if (num) sleep(1000)
    }
    return false
}

//在屏幕上匹配图片，匹配到就点击
function find_images(num, img_file, flipup) {
    let templ = images.read(img_file);
    templ = images.grayscale(templ)
    while (num--) {
        let img = captureScreen()
        if (flipup != undefined) img = images.rotate(img, 180)
        img = images.grayscale(img)
        let point = findImage(img, templ)
        if (point) {
            if (flipup != undefined) {
                point.x = img.getWidth() - point.x; point.y = img.getHeight() - point.y
            }
            toast_console('找到了‘' + img_file + '’图片');
            return click(point.x, point.y);
        }
        if (num) sleep(1000)
    }
    toast_console('没找到‘' + img_file + '’图片');
    return false
}

//浏览15秒钟页面操作
function view_15seconds() {
    swipe(device.width / 2, device.height / 2, device.width / 2, device.height / 5, 1500)
    sleep(18000)
}

// 浏览3次 的任务
function view(title, num) {
    let i = 0
    for (; i < num; i++) {
        if (click_by_textcontains(title) == false)
            return
        //i = 3
        sleep(2000)
        my_btn = text("去完成").clickable(true).depth(16).findOne(3000)
        if (!my_btn) {
            toast_console('没找到‘' + title + '’弹层按钮');
            return
        } else btn_position_click(my_btn)
        sleep(2000)
        view_15seconds()
        //按照返回按钮的颜色点击返回
        //cs_click(2, '#243db3', 0.8, 0.7, 0.1, 0.2)
        find_images(2, './img/返回领积分按钮.jpg')
        sleep(2000)
    }
}

//做任务
function do_task(title) {
    if (click_by_textcontains(title) == false)
        return
    sleep(2000)
    my_btn = text("去完成").clickable(true).depth(16).findOne(3000)
    if (!my_btn) {
        toast_console('没找到‘' + title + '’弹层按钮');
        return
    } else btn_position_click(my_btn)
    sleep(5000)
    //重新激活 支付宝
    app.launch("com.eg.android.AlipayGphone");
    sleep(1000)
    //按照返回按钮的颜色点击返回
    //cs_click(2, '#243db3', 0.8, 0.4, 0.9, 0.8)
    find_images(2, './img/返回领积分按钮.jpg')

}


//------------------------------------------------------------


// 支付宝领积分的操作函数
function alipay_points() {
    app.launch("com.eg.android.AlipayGphone");
    sleep(5000);
    let my_btn = text('我的').findOne(5000)
    if (!my_btn) {
        toast_console('没找到‘我的’按钮，退出');
        //exit();
        return
    }
    btn_position_click(my_btn)
    sleep(3000)
    click(540, 500)//直接点击坐标点
    sleep(3000)
    click_by_text('每日签到')
    sleep(2000)
    click_by_text('逛15秒赚3积分')
    my_btn = textContains('已完成浏览任务').findOne(3000)
    //toast_console(my_btn)
    if (!my_btn)
        sleep(16000)
    sleep(5000)
    click_by_text('做任务赚积分')
    sleep(2000)

    view('逛精选好物会场15秒', 3)
    sleep(2000)
    view('逛红包会场15秒', 3)
    sleep(2000)
    do_task('逛一逛芭芭农场')
    sleep(2000)
    do_task('逛一逛蚂蚁森林')
    sleep(2000)
    do_task('逛淘金币小镇领金币')
    sleep(2000)
    do_task('逛蚂蚁庄园喂小鸡')

    click_by_desc('返回')
    sleep(2000)

    click_by_desc('返回')
    sleep(2000)

    click_by_text('首页')
    sleep(2000)

    toast_console('执行结束');
}
/*
click_by_text('蚂蚁森林')
sleep(5000)
ant_forest_task()
sleep(5000)
*/



//--芭芭农场---------------------------------------------------------------------

//领取奖励
function farm_lingjiang() {
    click_by_textcontains('点击领奖')
    sleep(2000)
    click_by_text('立即领取')
}

//浏览得肥料
function farm_view() {
    swipe(device.width / 2, device.height / 2, device.width / 2, device.height / 5, 1500)
    sleep(18000)
    if (!click_by_desc('返回'))
        click_by_id('J-farm-cpc-countdown')
}

function baba_farm_task() {
    app.launch("com.eg.android.AlipayGphone");
    sleep(5000);
    click_by_text('芭芭农场')
    sleep(5000)
    //签到领肥料
    find_images(2, './img/芭芭农场_领取肥料.jpg')
    //打开领肥料任务列表
    sleep(2000)
    task = find_images(2, './img/芭芭农场_领取肥料任务按钮.jpg')
    if (task) {
        sleep(2000)
        //签到领取
        click_by_text('领取')
        sleep(2000)

        while (find_images(2, './img/芭芭农场任务列表去完成.jpg')) {
            sleep(5000)
            farm_view()
        }
        //关闭任务弹层
        click_by_text('关闭')
    }
    //施肥
    sleep(2000)
    let keyi_shifei = true
    while (keyi_shifei) {
        if (find_images(2, './img/芭芭农场_施肥按钮.jpg')) {
            sleep(2000)
            if (text('已领取').findOne(5000)) {
                toast_console('任务列表弹出，说明不能再施肥了');
                keyi_shifei = false
                //关闭任务弹层
                click_by_text('关闭')
            }
            sleep(2000)
            if (click_by_textcontains('点击领取')) {
                farm_lingjiang()
                sleep(2000)
            }
        }

    }
    sleep(3000)
    //领奖
    while (click_by_textcontains('点击领取')) {
        farm_lingjiang()
        sleep(2000)
    }
    //关闭，退出
    click_by_desc('关闭')
}

// -------蚂蚁森林-------------------
function ant_forest_task() {
    //关闭，退出
    click_by_desc('关闭')
}

//---淘宝芭芭农场(变量太多，不再完成)--------------------------------------------------------------------

function taobao_farm_task() {
    app.launch('com.taobao.taobao')
    sleep(5000)
    click_by_text('芭芭农场')
    sleep(5000)

    find_images(2, './img/淘宝芭芭农场领取肥料.jpg')
    sleep(2000)
    find_images(2, './img/淘宝芭芭农场兔子领取肥料.jpg')
    sleep(2000)
    //点击集肥料
    click_bounds(720, 1926, 885, 2109)
    sleep(2000)
    click_by_text('去签到')
    sleep(2000)

    click_by_text('去逛逛')
    farm_view()
    sleep(2000)
    click_by_text('去浏览')
    farm_view()
    sleep(2000)
    click_by_text('去浏览')
    farm_view()
    sleep(2000)
    click_by_text('去浏览')
    farm_view()
    sleep(2000)
    click_by_text('去领取')
    farm_view()
    sleep(2000)

    click_by_text('关闭')


    let keyi_shifei = true
    while (keyi_shifei) {
        //点击施肥 
        click_bounds(15, 1920, 1068, 2109)
        sleep(2000)
        if (text('关闭').findOne(5000)) {
            toast_console('任务列表弹出，说明不能再施肥了');
            keyi_shifei = false
            //关闭任务弹层
            click_by_text('关闭')
        }
    }


}




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
                            <button id="btn_run_main" text="执行选中任务" />
                            <button id="btn_exit" text="退出" />
                        </vertical>
                    </scroll>
                </frame>
            </viewpager>
        </vertical>
    </drawer>
);


activity.setSupportActionBar(ui.toolbar);

//设置滑动页面的标题
ui.viewpager.setTitles(["支付宝"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);
ui.btn_exit.click(function () { ui.finish() })

//运行选择项
ui.btn_run_main.click(function () {
    if (thread && thread.isAlive()) {
        toast_console('当前程序正在执行其他任务,请结束后再运行', true); return
    }
    thread = threads.start(function () {
        main(); exit()
    })
})

function main() {
    requestScreenCapture(false);
    //console.show();
    taojinbi_task();
    toast_console('###***全部任务执行完毕***###')
}

function taojinbi_task() {
    if (ui.ck_points_task.checked) {
        alipay_points()
    }

    if (ui.ck_farm_task.checked) {
        baba_farm_task()
    }
}