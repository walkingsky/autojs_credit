/**
 * 网约车（滴滴出行、哈啰、嘀嗒车主）刷单软件
 * author: walkingsky
 * url:https://github.com/walkingsky/autojs_credit
 */


"ui";
importClass(android.view.View);
auto.waitFor();

var storage = storages.create("com.walkingsky.autojs.didi.order.grabbing:data");


//哪个app（1 滴滴，2 嘀嗒 ，3 哈啰），订单类型（1 临时订单 2 顺路订单）
var app_kind, order_type;
//筛选订单的时间范围，单位分钟 （数值类型）
var start_time, end_time;
//接单距离，行程距离，顺路指数，终点距离 （数值类型）
var distance_from, distance, shunlu, distance_to;
//独享，已支付，多人，分摊高速费 （布尔类型）
var exclusive, paid, multiple_passenger, share_expenses;
// 读取订单数量后刷新，刷新间隔
var order_cnt = 30, refresh_interval = 1;
//存储匹配到的订单
var matched_order_list = [];
//刷到订单后是否要停止
var should_stop = true;

var current_app_name = currentPackage();


var functions = {
    init_data: function () {
        app_kind = storage.get("app_kind", 1);
        order_type = storage.get("order_type", 1);
        start_time = storage.get("start_time", 15);
        end_time = storage.get("end_time", 30);
        distance_from = storage.get("distance_from", 5);
        distance = storage.get("distance", 30);
        shunlu = storage.get("shunlu", 80);
        distance_to = storage.get("distance_to", 35);
        exclusive = storage.get("exclusive", false);
        paid = storage.get("paid", false);
        multiple_passenger = storage.get("multiple_passenger", false);
        share_expenses = storage.get("share_expenses", false);
        order_cnt = storage.get("order_cnt", order_cnt);
        refresh_interval = storage.get("refresh_interval", refresh_interval);
    },
    save_data: function () {
        storage.get("app_kind", app_kind);
        storage.put("order_type", order_type);
        storage.put("start_time", start_time);
        storage.put("end_time", end_time);
        storage.put("distance_from", distance_from);
        storage.put("distance", distance);
        storage.put("shunlu", shunlu);
        storage.put("distance_to", distance_to);
        storage.put("exclusive", exclusive);
        storage.put("paid", paid);
        storage.put("multiple_passenger", multiple_passenger);
        storage.put("share_expenses", share_expenses);
    },
    /**
     * @param {String} time_str 获取到的时间字符串 
     * @reten boolean
     */
    judge_time: function (time_str) {
        let d = new Date();
        let h = d.getHours();
        let m = d.getMinutes();
        let m1 = m + start_time;
        let h1 = h, h2 = h;
        if (m1 >= 60) {
            h1 = h + parseInt(m1 / 60);
            m1 = m1 - 60 * parseInt(m1 / 60);
        }
        let m2 = m + end_time;
        if (m2 >= 60) {
            h2 = h + parseInt(m2 / 60);
            m2 = m2 - 60 * parseInt(m2 / 60);
        }
        //h1:m1 最早时间，h2:m2 最晚时间 
        let arry = /(\d\d):(\d\d)-(\d\d):(\d\d)/g.exec(time_str);
        //console.log(h1 + ":" + m1 + "-" + h2 + ":" + m2);
        //console.log((Number(arry[1]) + Number(arry[2]) / 100) + "-" + (h2 + m2 / 100) + "-" + (Number(arry[3]) + Number(arry[4]) / 100) + "-" + (h1 + m1 / 100));
        if (arry) {
            //console.log((Number(arry[1]) + Number(arry[2]) / 100) + "-" + (h2 + m2 / 100) + "-" + (Number(arry[3]) + Number(arry[4]) / 100) + "-" + (h1 + m1 / 100));
            if ((Number(arry[1]) + Number(arry[2]) / 100) <= (h2 + m2 / 100) || (Number(arry[3]) + Number(arry[4]) / 100) >= (h1 + m1 / 100)) {
                console.log("时间在范围内");
                return true;
            }
            else
                return false;
        } else {
            let arry = /(\d\d):(\d\d)/g.exec(time_str);
            if (arry) {
                console.log((Number(arry[1]) + Number(arry[2]) / 100) + "-" + (h2 + m2 / 100) + "-" + (h1 + m1 / 100));
                if ((Number(arry[1]) + Number(arry[2]) / 100) <= (h2 + m2 / 100) && (Number(arry[1]) + Number(arry[2]) / 100) >= (h1 + m1 / 100)) {
                    console.log("时间在范围内");
                    return true;
                }
                else
                    return false;
            } else {
                return false;
            }
        }


    },
    滴滴刷单: function () {
        threads.start(function () {
            app.launch("com.sdu.didi.psnger");
            //idContains('normal_icon').waitFor();
            className("android.widget.TextView").textContains("车主").waitFor();
            if (className("android.widget.RelativeLayout").idContains("main_rl").exists())
                descContains("关闭弹窗").idContains("close_dialog").findOne().click();
            if (className("android.widget.TextView").textContains("车主").findOne(2000).parent().clickable())
                className("android.widget.TextView").textContains("车主").findOne(2000).parent().click();
            else
                className("android.widget.TextView").textContains("车主").findOne(2000).parent().parent().click();
            sleep(2000);
            if (descContains("关闭弹窗").idContains("popClose").exists())
                descContains("关闭弹窗").idContains("popClose").findOne(1000).click();
            sleep(500);
            //判断是否为顺路单
            if (order_type == 2) {
                let a = idContains("home_drv_suspense_address_detail").className("android.widget.LinearLayout").findOne(1000);
                if (a) {
                    a.parent().click();
                    sleep(1000);
                }
            }
            //临时单
            let i = 0;
            let list = [];
            while (i < order_cnt + 1) {
                sleep(500);
                if (i >= order_cnt) {//30个订单
                    //等待1分钟
                    sleep(60000 * refresh_interval);
                    let btn_refresh = idContains("bt_refresh").className("android.widget.ImageView").findOne(1000);
                    if (btn_refresh)
                        btn_refresh.click();
                    else {
                        console.log("没找到刷新按钮");
                        if (order_type == 2) { //顺丰单就退出重进，重刷
                            back();
                            sleep(500);
                            let a = idContains("home_drv_suspense_address_detail").className("android.widget.LinearLayout").findOne(1000);
                            if (a) {
                                a.parent().click();
                                sleep(1000);
                                swipe(device.width / 2, device.height * 0.5 - 600, device.width / 2, device.height * 0.5, 400);
                            }
                        }
                    }
                    sleep(1000);
                    i = 0;
                    list = []; //清空数组
                }

                let order_items_arry = idContains("sfc_wait_list_item_layout").className("android.view.ViewGroup").find();
                for (let cnt = 0; cnt < order_items_arry.size(); cnt++) {
                    order_items = order_items_arry.get(cnt);
                    //判断是否已经查找过该记录
                    let a = order_items.findOne(idContains("order_card_time_title").className("android.widget.TextView"));
                    let b = order_items.findOne(idContains("from_tv").className("android.widget.TextView"));
                    let c = order_items.findOne(idContains("to_tv").className("android.widget.TextView"));
                    let temp = "";
                    if (a)
                        temp = temp + a.text();
                    if (b)
                        temp = temp + b.text();
                    if (c)
                        temp = temp + c.text();

                    if (list.indexOf(temp) > -1) {
                        //swipe(device.width / 2, device.height * 0.5, device.width / 2, device.height * 0.5 - 600, 400);
                        //sleep(500);
                        continue;
                    } else
                        i = i + 1;
                    list.push(temp);

                    //判断顺路
                    if (order_type == 2) {
                        let shunlu_elment = order_items.findOne(idContains("order_card_degree_title").className("android.widget.TextView"));
                        if (shunlu_elment) {
                            let shunlu_str = /(\d+)%顺路/g.exec(shunlu_elment.text());
                            if (parseInt(shunlu_str) < shunlu)
                                continue;
                        }
                    }

                    let time = order_items.findOne(idContains("order_card_time_title").className("android.widget.TextView"));
                    if (!functions.judge_time(time))
                        continue;
                    //起点距离
                    let _from = order_items.findOne(idContains("from_tv_tag").className("android.widget.TextView"));
                    if (_from) {
                        let _from_str = _from.text().replace("km", "");
                        if (parseFloat(_from_str) > distance_from) {
                            console.log("起点距离不在范围内" + _from_str + "-" + distance_from);
                            continue;
                        }
                        //console.log("_from_str" + parseFloat(_from_str));
                    } else {
                        continue;
                    }
                    //终点距离
                    if (order_type == 2) {
                        let _to = order_items.findOne(idContains("to_tv_tag").className("android.widget.TextView"));
                        if (_to) {
                            let _to_str = _to.text().replace("km", "");
                            if (parseFloat(_to_str) > distance_to) {
                                console.log("终点距离不在范围内" + _to_str + "-" + _to_str);
                                continue;
                            }
                            //console.log("_to_str" + parseFloat(_to_str));
                        } else {
                            continue;
                        }
                    }
                    //里程判断
                    let tips_content = order_items.findOne(idContains("sfc_order_card_tips_content").className("android.widget.TextView"));
                    if (tips_content != null) {
                        let tips_content_str = tips_content.text();
                        let tips_arry = /里程([\d\.]+)km/g.exec(tips_content_str);
                        //console.log(tips_arry);
                        if (tips_arry) {
                            if (parseFloat(tips_arry[1]) > distance) {
                                console.log("里程超范围" + parseFloat(tips_arry[1]));
                                continue;
                            }
                        }
                        //是否独享判断
                        if (exclusive) {
                            if (!tips_content_str.includes("独享")) {
                                console.log("不是独享订单");
                                continue;
                            }

                        }
                        //判读是否多人
                        if (multiple_passenger)
                            if (tips_content_str.includes("1人")) {
                                console.log("不是多人订单");
                                continue;
                            }

                    } else {
                        console.log("tips_content没找到");
                    }
                    //判断是否已支付                    
                    let cost = order_items.findOne(idContains("sfc_order_price_content").className("android.widget.TextView"));
                    if (cost) {
                        if (paid) {
                            let cost_str = cost.text();
                            if (!cost_str.includes("已支付"))
                                continue;
                        }
                    }

                    let is_in_list = false;
                    let is_in_list_enable = false;
                    for (let v in matched_order_list) {
                        if (matched_order_list[v].list_contens == temp) {
                            is_in_list = true;
                            if (matched_order_list[v].list_enable)
                                is_in_list_enable = true;
                            break;
                        }
                    }

                    if (!is_in_list || is_in_list_enable) {
                        if (!is_in_list) {//加入列表
                            matched_order_list.push({
                                list_time: a.text(),
                                list_price: cost.text(),
                                list_from: b.text(),
                                list_to: c.text(),
                                list_msg: tips_content.text(),
                                list_enable: true,
                                list_contens: temp
                            });
                            ui.run(() => {
                                ui.list.setDataSource(matched_order_list);
                            });
                        }
                        //到了最后就是刷到了合适的订单
                        for (let j = 0; j < 15; j++) {
                            device.vibrate(500);
                            sleep(3000);
                        }
                        //停止刷新并提醒
                        if (should_stop) {
                            if (order_items.bounds().top > 2000) {
                                swipe(device.width / 2, device.height * 0.8, device.width / 2, device.height * 0.6, 1000);
                                sleep(100);
                                order_items = idContains("from_tv").textContains(a.text).findOne(1000).parent();
                            }
                            var x1 = order_items.bounds().left;
                            var x2 = order_items.bounds().right;
                            var y1 = order_items.bounds().top;
                            var y2 = order_items.bounds().bottom;
                            /*
                            ui.run(() => {
                                let w2 = floaty.rawWindow(
                                    <vertical id="root" bg="#ff0000" gravity="center" w="*" h="*">
                                        <canvas id="board" w="*" h="*"></canvas>
                                    </vertical>
                                );
                                w2.setSize(-1, -1);
                                w2.setPosition(0, 0);
                                w2.board.on("draw", (canvas) => {
                                    //canvas.drawColor(colors.parseColor("#0000ff"));
                                    var paint = new Paint();
                                    //设置画笔为填充，则绘制出来的图形都是实心的
                                    paint.setStyle(Paint.Style.FILL);
                                    paint.setStrokeWidth(6);
                                    //设置画笔颜色为红色
                                    paint.setColor(colors.RED);
                                    //paint.setColor(colors.parseColor("#ff0000"));
                                    //绘制一个从坐标(0, 0)到坐标(100, 100)的正方形
                                    canvas.drawRect(x1, y1, x2, y2, paint);
                                    //canvas.drawColor(colors.parseColor("#0000ff"));
                                });

                                //w2.setAdjustEnabled(false);
                                w2.root.on("click", () => {
                                    w2.close();
                                });
                            });
                            */
                            return;
                        }
                        console.log(temp);
                    }
                }
                swipe(device.width / 2, device.height * 0.8 - 50, device.width / 2, device.height * 0.3, 1000);
            }
        });
    }
}

ui.layout(
    <vertical>
        <radiogroup orientation="horizontal" w="*" margin="15 5 0 10" id="radio_app">
            <radio layout_weight="1" id="didi" text="滴滴出行" checked="true"></radio>
            <radio layout_weight="1" id="dida" text="嘀嗒车主"></radio>
            <radio layout_weight="1" id="hello" text="哈啰"></radio>
        </radiogroup>
        <radiogroup orientation="horizontal" w="*" margin="15 5 0 10" id="订单类型">
            <radio layout_weight="1" id="temp_order" text="临时订单" checked="true"></radio>
            <radio layout_weight="1" id="Hitchhiking_order" text="顺风订单"></radio>
        </radiogroup>
        <vertical margin="5" w="*">
            <horizontal w="*" margin="5" >
                <text layout_weight="1" text="时间设置:" />
                <text layout_weight="1" id="start_time" textSize="18sp" textColor="blue" text="5" />
                <text layout_weight="1" text="分钟后" />
                <seekbar w="200" id="start_seek_bar" layout_gravity="center" bg='#00eeee' step="4" />
            </horizontal>
            <horizontal w="*" margin="5" >
                <text layout_weight="1" text="时间设置:" />
                <text layout_weight="1" id="end_time" textSize="18sp" textColor="blue" text="15" />
                <text layout_weight="1" text="分钟前" />
                <seekbar w="200" id="end_seek_bar" layout_gravity="center" bg='#00eeee' step="4" />
            </horizontal>
            <horizontal w="*" margin="5 0 5 0" >
                <horizontal layout_weight="1">
                    <text text="距始发地小于" />
                    <spinner id="distance_from" entries="5km|10km|15km|20km|25km|30km|35km|40km" />
                </horizontal>
                <horizontal layout_weight="1">
                    <text text="订单里程小于" />
                    <spinner id="distance" entries="20km|30km|40km|50km|60km|70km|90km|120km|150km|200km|300km|500km" />
                </horizontal>
            </horizontal>
            <horizontal w="*" margin="5 0 5 0" id="顺风单选项">
                <horizontal layout_weight="1">
                    <text text="顺路大于" />
                    <spinner id="shunlu" entries="95%|90%|85%|80%|75%|70%|65%|60%|55%|50%" />
                </horizontal>
                <horizontal layout_weight="1">
                    <text text="距离目的地小于" />
                    <spinner id="distance_to" entries="5km|10km|15km|20km|25km|30km|35km|40km" />
                </horizontal>
            </horizontal>
            <horizontal w="*" margin="5 0 5 0" >
                <checkbox text="独享" layout_weight="1" id="exclusive" />
                <checkbox text="已支付" layout_weight="1" id="paid" />
                <checkbox text="多人" layout_weight="1" id="multiple_passenger" />
                <checkbox text="分摊高速费" layout_weight="1" id="share_expenses" />
            </horizontal>
            <horizontal w="*" margin="5" >
                <text layout_weight="1" text="读取订单数量:" />
                <text layout_weight="1" id="order_cnt" textSize="18sp" textColor="blue" text="30" />
                <text layout_weight="1" text="次" />
                <seekbar w="200" id="order_cnt_seek_bar" layout_gravity="center" bg='#00eeee' step="20" />
            </horizontal>
            <horizontal w="*" margin="5" >
                <text layout_weight="1" text="刷新时间间隔:" />
                <text layout_weight="1" id="refresh_interval" textSize="18sp" textColor="blue" text="1" />
                <text layout_weight="1" text="分钟" />
                <seekbar w="200" id="refresh_interval_seek_bar" layout_gravity="center" bg='#00eeee' step="20" />
            </horizontal>
        </vertical>
        <card w="*" margin="2 0 2 0" h="420">
            <list id="list">
                <card w="*" h="auto" margin="5 5" cardCornerRadius="2dp"
                    cardElevation="1dp" gravity="center_vertical">
                    <vertical padding="15 5" h="auto">
                        <horizontal w="*">
                            <text text="{{list_time}}" textColor="#222222" padding="28 0" textSize="16sp" gravity="left" />
                            <text text="{{list_price}}" textColor="#f44336" padding="28 0" textSize="16sp" gravity="right" />
                        </horizontal>
                        <text text="从：{{list_from}}" textColor="#4caf50" textSize="14sp" w="*" />
                        <text text="到：{{list_to}}" textColor="#2196f3" textSize="14sp" w="*" />
                        <text text="{{list_msg}}" textColor="#222222" textSize="14sp" />
                    </vertical>
                    <View bg="{{list_enable?'#4caf50':'#f44336'}}" h="*" w="10" id="list_status" />
                </card>
            </list>
        </card>
        <horizontal gravity="bottom" w="*" margin="10">
            <checkbox text="刷到后停止" id="should_stop" checked="{{should_stop}}" />
            <button id="btn_start" text="开始刷单" />
            <button layout_gravity="right" id="btn_exit" text="退出" />
        </horizontal>
    </vertical >

);

/**
 * 初始化 UI
 */
init_ui = function () {
    if (order_type == 1)
        ui.temp_order.setChecked(true);
    else
        ui.Hitchhiking_order.setChecked(true);

    ui.start_time.setText(String(start_time));
    ui.start_seek_bar.setProgress(start_time / 5 * 2);
    if (end_time < start_time + 10) {
        end_time = start_time + 10;
        ui.end_time.setText(String(end_time));
        ui.end_seek_bar.setProgress(end_time / 5 * 2);
    } else {
        ui.end_time.setText(String(end_time));
        ui.end_seek_bar.setProgress(end_time / 5 * 2);
    }

    ui.order_cnt.setText(String(order_cnt));
    ui.order_cnt_seek_bar.setProgress(order_cnt * 2);
    ui.refresh_interval.setText(String(refresh_interval));
    ui.refresh_interval_seek_bar.setProgress(refresh_interval * 20);


    ui.distance_from.setSelection(ui.distance_from.getAdapter().getPosition(distance_from + "km"));
    ui.distance.setSelection(ui.distance.getAdapter().getPosition(distance + "km"));
    ui.shunlu.setSelection(ui.shunlu.getAdapter().getPosition(shunlu + "%"));
    ui.distance_to.setSelection(ui.distance_to.getAdapter().getPosition(distance_to + "km"));

    if (exclusive)
        ui.exclusive.setChecked(true);
    if (paid)
        ui.paid.setChecked(true);
    if (multiple_passenger)
        ui.multiple_passenger.setChecked(true);
    if (share_expenses)
        ui.share_expenses.setChecked(true);

    //显隐关系
    if (order_type == 1) {
        ui.顺风单选项.setEnabled(false);
        ui.shunlu.setEnabled(false);
        ui.distance_to.setEnabled(false);
    } else {
        ui.顺风单选项.setEnabled(true);
        ui.shunlu.setEnabled(true);
        ui.distance_to.setEnabled(true);
    }
}

/**
 * radio 选择app
 */
ui.radio_app.setOnCheckedChangeListener((group, checkedId) => {
    let checkedRadio = ui.radio_app.findViewById(checkedId);
    switch (checkedRadio) {
        case ui.didi:
            app_kind = 1;
            break;
        case ui.dida:
            app_kind = 2;
            break;
        case ui.hello:
            app_kind = 3;
            break;
    }
    storage.put("app_kind", app_kind);
});

ui.订单类型.setOnCheckedChangeListener((group, checkedId) => {
    // 根据整数id获取勾选的radio控件
    let checkedRadio = ui.订单类型.findViewById(checkedId);
    switch (checkedRadio) {
        case ui.temp_order:
            ui.顺风单选项.setEnabled(false);
            ui.shunlu.setEnabled(false);
            ui.distance_to.setEnabled(false);
            order_type = 1;
            break;
        case ui.Hitchhiking_order:
            ui.顺风单选项.setEnabled(true);
            ui.shunlu.setEnabled(true);
            ui.distance_to.setEnabled(true);
            order_type = 2;
            break;
    }
    storage.put("order_type", order_type);
});

/**
 * 拖动起始时间seekbar
 */
ui.start_seek_bar.setOnSeekBarChangeListener({
    onProgressChanged: function (seekBar, progress, fromUser) {
        if (fromUser) {
            start_time = Math.round(progress / 2) * 5;
            ui.start_time.setText(String(start_time));
            if (!end_time || end_time < (start_time + 10)) {
                end_time = start_time + 10;
                ui.end_time.setText(String(end_time));
                ui.end_seek_bar.setProgress(end_time / 5 * 2);
                storage.put("end_time", end_time);
            }
            storage.put("start_time", start_time);
        }
    }
});
/**
 * 拖动最大时间seekbar
 */
ui.end_seek_bar.setOnSeekBarChangeListener({
    onProgressChanged: function (seekBar, progress, fromUser) {
        if (fromUser) {
            end_time = Math.round(progress / 2) * 5;
            ui.end_time.setText(String(end_time));
            if (!start_time || end_time < (start_time + 10)) {
                start_time = start_time - 10;
                ui.start_time.setText(String(start_time));
                ui.start_seek_bar.setProgress(start_time / 5 * 2);
                storage.put("start_time", start_time);
            }
            storage.put("end_time", end_time);
        }
    }
});

ui.order_cnt_seek_bar.setOnSeekBarChangeListener({
    onProgressChanged: function (seekBar, progress, fromUser) {
        if (fromUser) {
            order_cnt = Math.round(progress / 20) * 10;
            ui.order_cnt.setText(String(order_cnt));
            storage.put("order_cnt", order_cnt);
        }
    }
});

ui.refresh_interval_seek_bar.setOnSeekBarChangeListener({
    onProgressChanged: function (seekBar, progress, fromUser) {
        if (fromUser) {
            refresh_interval = Math.round(progress / 10) * 0.5;
            ui.refresh_interval.setText(String(refresh_interval));
            storage.put("refresh_interval", refresh_interval);
        }
    }
});

ui.btn_start.on("click", () => {
    threads.shutDownAll();
    if (app_kind == 1)
        functions.滴滴刷单();
});

/**
 * 距离始发地的距离
 */
ui.distance_from.setOnItemSelectedListener({
    onItemSelected: function (parent, view, position, id) {
        let a = ui.distance_from.getSelectedItem();
        distance_from = Number(a.replace("km", ""));
        storage.put("distance_from", distance_from);
    }
});

ui.distance.setOnItemSelectedListener({
    onItemSelected: function (parent, view, position, id) {
        let a = ui.distance.getSelectedItem();
        distance = Number(a.replace("km", ""));
        storage.put("distance", distance);
    }
});

ui.shunlu.setOnItemSelectedListener({
    onItemSelected: function (parent, view, position, id) {
        let a = ui.shunlu.getSelectedItem();
        shunlu = Number(a.replace("%", ""));
        storage.put("shunlu", shunlu);
    }
});

ui.distance_to.setOnItemSelectedListener({
    onItemSelected: function (parent, view, position, id) {
        let a = ui.distance_to.getSelectedItem();
        distance_to = Number(a.replace("km", ""));
        storage.put("distance_to", distance_to);
    }
});

ui.exclusive.on("check", (checked) => {
    exclusive = checked;
    storage.put("exclusive", exclusive);
});
ui.paid.on("check", (checked) => {
    paid = checked;
    storage.put("paid", paid);
});
ui.multiple_passenger.on("check", (checked) => {
    multiple_passenger = checked;
    storage.put("multiple_passenger", multiple_passenger);
});
ui.share_expenses.on("check", (checked) => {
    share_expenses = checked;
    storage.put("share_expenses", share_expenses);
});
ui.should_stop.on("check", (checked) => {
    should_stop = checked;
});

ui.list.on("item_click", function (item, i, itemView, listView) {
    if (itemView.list_status.attr("bg") == "#4caf50") {//绿色转红色，代表标记该记录要被过滤

        confirm("忽略该订单", "该记录订单不会再被提醒", function (ok) {
            if (ok) {
                itemView.list_status.attr("bg", "#f44336");
                matched_order_list[i].list_enable = false;
            }
        });
        //toast("该记录订单不会在被提醒");
    } else {

        confirm("不再忽略该订单", "该记录订单会再被提醒", function (ok) {
            if (ok) {
                itemView.list_status.attr("bg", "#4caf50"); //红色转绿色，代表该记录不被过滤
                matched_order_list[i].list_enable = true;
            }
        });
    }
});

ui.list.on("item_long_click", function (e, item, i, itemView, listView) {
    //ui.list.setDataSource(matched_order_list);
    confirm("确定要清除该订单吗？", "确定后该订单会被清除出列表", function (clear) {
        if (clear) {
            //items.splice(i, 1);
            //ui.list.setDataSource(items);
            matched_order_list.splice(i, 1);
            ui.list.setDataSource(matched_order_list);
        }
    });
    e.consumed = true;
});

var window = floaty.window(
    <vertical>
        <button id="stop_threads" text="停止刷单" />
    </vertical>
);
window.stop_threads.on("click", () => {
    threads.shutDownAll();
    app.launch(current_app_name);
});
window.stop_threads.on("long_click", () => {
    window.setAdjustEnabled(!window.isAdjustEnabled());
});
window.setPosition(770, 2095);

ui.btn_exit.click(function () {
    threads.shutDownAll();
    window.close();
    ui.finish();
});


/** --------------------------------------------------------- */

functions.init_data();
init_ui();


var items = [{
    list_time: "今天22:30-22:45",
    list_price: "已支付29.17元",
    list_from: "华联商厦(上地店)-东一门",
    list_to: "西山奥园-东门",
    list_msg: "1人愿拼~订单里程19.0km",
    list_enable: true
}, {
    list_time: "今天22:30-22:45",
    list_price: "已支付29.17元",
    list_from: "东方美颜美发美甲沙龙三两地分居三定了放假斯蒂芬斯蒂芬记录记录斯蒂芬",
    list_to: "广安门内-地铁站",
    list_msg: "3人独享~订单里程24.2km",
    list_enable: false
}
];
//ui.list.setDataSource(items);

