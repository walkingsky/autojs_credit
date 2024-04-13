/**
 * 从BYD海洋APP获取油电消耗数据，并记录进文件的autojs脚本
 * author: walkingsky
 * url:https://github.com/walkingsky/autojs_credit
 */

"ui";

importClass(android.view.View);

auto.waitFor();

var storage = storages.create("com.walkingsky.autojs.byd.energy_recoder:energy");

var _functions = {
    get_BYD_record: function () {
        app.launch('com.byd.sea');
        //阻断式等待
        idContains('img_car_model').descContains('比亚迪海洋').waitFor();
        let energy = 0, oil = 0, total_maile = 0;
        if (idContains('energy_tv').indexInParent(1).className('android.widget.TextView').exists()) {
            let s = idContains('energy_tv').indexInParent(1).className('android.widget.TextView').findOne().text();
            energy = Number(s.replace("%", ""));
        }
        if (idContains('oil_tv').indexInParent(1).className('android.widget.TextView').exists()) {
            let s = idContains('oil_tv').indexInParent(1).className('android.widget.TextView').findOne().text();
            oil = Number(s.replace("%", ""));
        }
        if (textContains('车辆状态').id('title_tv').exists()) {
            textContains('车辆状态').id('title_tv').findOne().parent().parent().click();
            sleep(1000);
            if (textMatches(/\d+/).idContains('tv_check_value').indexInParent(1).className('android.widget.TextView').exists()) {
                let s = textMatches(/\d+/).idContains('tv_check_value').indexInParent(1).className('android.widget.TextView').findOne().text();
                total_maile = Number(s);
            }
        }
        back();
        sleep(500);
        back();
        return { "energy": energy, "oil": oil, "total_maile": total_maile };
    },
    set_xiaoxiong_record: function (data) {
        app.launch("com.firebear.androil");
        sleep(5000);
        //className("android.widget.TextView").textContains("综合能耗").waitFor();
        if (className("android.widget.LinearLayout").idContains("oilListLay").indexInParent(3).exists()) {
            className("android.widget.LinearLayout").idContains("oilListLay").indexInParent(3).findOne().click();
            id("addBtn").className("android.widget.ImageView").waitFor();
            id("addBtn").className("android.widget.ImageView").indexInParent(1).findOne().click();
            sleep(500);
            if (data.kind == 'oil') {
                id("fuelCB").textContains("加油").className("android.widget.RadioButton").findOne().click();
                id("lichengTxv").className("android.widget.EditText").findOne().setText(data.after_total_maile.toString());
                id("sum_price_txv").className("android.widget.EditText").findOne().setText(data.oil_cost_1.toString());
                id("liter_txv").className("android.widget.EditText").findOne().setText(data.oil_value.toString());
                id("real_price_txv").className("android.widget.EditText").findOne().setText(data.oil_cost_2.toString());
                let percet = id("percentTxv").className("android.widget.EditText").find();
                if (percet.length == 3) {
                    percet[0].setText(data.before_oil.toString());
                    percet[1].setText(data.after_oil.toString());
                    percet[2].setText(data.after_energy.toString());
                }


            } else {
                id("lichengTxv").className("android.widget.EditText").findOne().setText(data.after_total_maile.toString());

                id("sumPriceTxv").className("android.widget.EditText").findOne().setText(data.charge_cost.toString());
                id("literTxv").className("android.widget.EditText").findOne().setText(data.charge_value.toString());

                let percet = id("percentTxv").className("android.widget.EditText").find();
                if (percet.length == 3) {
                    percet[0].setText(data.before_energy.toString());
                    percet[1].setText(data.after_energy.toString());
                    percet[2].setText(data.after_oil.toString());
                }
            }
            textContains("添加").idContains("saveBtn").findOne().click();
        }

    }

}

//测试代码
//_functions.get_BYD_record();
/*
_functions.set_xiaoxiong_record({
    "kind": "oil", "before_energy": 1, "before_oil": 2, "before_total_maile": 3,
    "after_oil": 4, "after_energy": 5, "after_total_maile": 8000, "oil_cost_1": 200, "oil_cost_2": 195, "oil_value": 25
});

_functions.set_xiaoxiong_record({
    "kind": "energy", "before_energy": 1, "before_oil": 2, "before_total_maile": 3,
    "after_oil": 4, "after_energy": 50, "after_total_maile": 8100, "charge_cost": 10, "charge_value": 10
});
exit();
*/

ui.layout(

    <vertical>
        <frame w="*" h="300dp">
            <vertical gravity="center_vertical">
                <horizontal h="100dp" w="*" gravity="center">
                    <text w="auto" textSize="20sp" text=" 加油充电之前   " layout_gravity="center" />
                </horizontal>
                <horizontal gravity="center_horizontal" h="50dp">
                    <text w="auto" text="总公里数：" />
                    <text w="auto" id="before_total_maile" textSize="18sp" textColor="blue" text="" />
                    <text w="auto" text="剩余电量：" />
                    <text w="auto" id="before_energy" textSize="18sp" textColor="blue" text=""></text>
                    <text w="auto" text="剩余油量：" />
                    <text w="auto" id="before_oil" textSize="18sp" textColor="blue" text=""></text>
                </horizontal>
                <horizontal h="100dp" w="*" gravity="center">
                    <text w="auto" textSize="20sp" text=" 加油充电之后   " layout_gravity="center" />
                </horizontal>
                <horizontal gravity="center_horizontal" h="50dp">
                    <text w="auto" text="总公里数：" />
                    <text w="auto" id="after_total_maile" textSize="18sp" textColor="blue" text="" />
                    <text w="auto" text="剩余电量：" />
                    <text w="auto" id="after_energy" textSize="18sp" textColor="blue" text=""></text>
                    <text w="auto" text="剩余油量：" />
                    <text w="auto" id="after_oil" textSize="18sp" textColor="blue" text=""></text>
                </horizontal>
            </vertical>
        </frame>
        <vertical h="400dp" >
            <vertical h="300dp" id="cost" >
                <horizontal h="50dp" gravity="">
                    <radiogroup orientation="horizontal">
                        <radio id="radio_energy" text="充电" checked="true" />
                        <radio id="radio_oil" text="加油" />
                    </radiogroup>
                </horizontal>
                <vertical h="150dp" id="cost_energy" visibility="gone">
                    <horizontal h="50">
                        <text w="150dp" gravity="center">充电金额：</text>
                        <input inputType="numberDecimal" w="100dp" id="charge_cost" value="0"></input>
                        <text>元</text>
                    </horizontal>
                    <horizontal h="50">
                        <text w="150dp" gravity="center">充电电量：</text>
                        <input inputType="numberDecimal" w="100dp" id="charge_value" value="0" ></input>
                        <text>度</text>
                    </horizontal>
                    <horizontal h="50">
                        <text w="150dp" gravity="center" value="0">折合电价：</text>
                        <text w="100dp" id="charge_price" value="0" ></text>
                        <text>元/度</text>
                    </horizontal>
                </vertical>
                <vertical h="250dp" id="cost_oil" visibility="visible">
                    <horizontal h="50">
                        <text w="150dp" gravity="center">机显金额：</text>
                        <input inputType="numberDecimal" w="50dp" id="oil_cost_1" value="0"></input>
                        <text>元</text>
                    </horizontal>
                    <horizontal h="50">
                        <text w="150dp" gravity="center">加油油量：</text>
                        <input inputType="numberDecimal" w="50dp" id="oil_value" value="0"></input>
                        <text>升</text>
                        <text w="100dp" gravity="center" >机显单价：</text>
                        <text id="oil_price_1" >0</text><text> 元/升</text>
                    </horizontal>
                    <horizontal h="50">
                        <text w="150dp" gravity="center" >实付金额：</text>
                        <input inputType="numberDecimal" w="50dp" id="oil_cost_2" value="0"></input>
                        <text>元</text>
                    </horizontal>
                    <horizontal h="50">
                        <text w="150dp" gravity="center" >优惠金额：</text>
                        <text id="oil_discount_amount">0</text><text>元</text>
                        <text w="150dp" gravity="center" >实付单价：</text>
                        <text id="oil_price_2" >0</text><text> 元/升</text>
                    </horizontal>
                </vertical>
            </vertical>

            <horizontal h="50dp" gravity="center">
                <horizontal >
                    <button layout_gravity="center" w="auto" id="get_data_before" text="获取前数据" />
                </horizontal>
                <horizontal >
                    <button layout_gravity="center" w="auto" id="get_data_after" text="获取后数据" />
                </horizontal>
                <horizontal >

                </horizontal>
                <horizontal >
                    <button layout_gravity="center" w="auto" id="record_data" text="记录数据" />
                </horizontal>
            </horizontal>
            <text h="50dp" id="log" textColor="red" gravity="center"></text>
        </vertical>

        <horizontal gravity="bottom" >
            <button layout_gravity="left" w="auto" id="clear_cache" text="清除缓存" />
            <text w="200dp"></text>
            <button layout_gravity="right" id="btn_exit" text="退出" />
        </horizontal>
    </vertical >

);

/**
 * 初始化 UI
 */
init_ui = function () {
    ui.run(() => {
        ui.log.setText("");
        if (storage.contains("before")) {
            let _values = storage.get("before", null);
            if (_values) {
                ui.before_total_maile.setText(_values.total_maile.toString() + "公里 ");
                ui.before_energy.setText(_values.energy.toString() + "% ");
                ui.before_oil.setText(_values.oil.toString() + "% ");
            }
            //ui.get_data_after.setEnabled(true);
        } else {
            ui.before_total_maile.setText("");
            ui.before_energy.setText("");
            ui.before_oil.setText("");
            //ui.get_data_after.setEnabled(false);
        };
        if (storage.contains("after")) {
            let _values = storage.get("after", null);
            if (_values) {
                ui.after_total_maile.setText(_values.total_maile.toString() + "公里 ");
                ui.after_energy.setText(_values.energy.toString() + "% ");
                ui.after_oil.setText(_values.oil.toString() + "% ");
            }
        } else {
            ui.after_total_maile.setText("");
            ui.after_energy.setText("");
            ui.after_oil.setText("");
        };
        //先不禁用“获取前数据”按钮，这样更方便修改
        /*if (storage.contains("before"))
            ui.get_data_before.setEnabled(false);
            
        else */if (storage.contains("before") && !storage.contains("after")) {
            ui.record_data.setEnabled(false);
            ui.get_data_after.setEnabled(true);
        }
        else if (storage.contains("after") && storage.contains("before")) {
            ui.record_data.setEnabled(true);
            //ui.get_data_after.setEnabled(false);
        }
        else if (!storage.contains("before")) {
            ui.get_data_before.setEnabled(true);
            ui.get_data_after.setEnabled(false);
        }



        if (storage.contains("before") && storage.contains("after")) {
            ui.cost.setVisibility(View.VISIBLE);
            if (storage.get("kind") == "oil")
                ui.radio_oil.setChecked(true);
            else
                ui.radio_energy.setChecked(false);
            charging_or_refuel();
            //ui.record_data.setEnabled(true);
        } else {
            ui.cost.setVisibility(View.GONE);
            ui.record_data.setEnabled(false);
        }
        if (storage.contains("before") || storage.contains("after"))
            ui.clear_cache.setEnabled(true);
        else
            ui.clear_cache.setEnabled(false);

    });
}

/**
 *  radio (加油，充电) 改变
 */
charging_or_refuel = function () {
    if (ui.radio_energy.isChecked()) {
        ui.cost_energy.setVisibility(android.view.View.VISIBLE);
        ui.cost_oil.setVisibility(android.view.View.GONE);
    } else {
        ui.cost_energy.setVisibility(android.view.View.GONE);
        ui.cost_oil.setVisibility(android.view.View.VISIBLE);
    }
}


ui.get_data_before.click(function () {
    threads.start(function () {
        ui.log.setText("");
        let result = _functions.get_BYD_record();
        console.log(result.energy);
        if (result.total_maile.valueOf() > 1000 && result.energy.valueOf() > 1 && result.oil.valueOf() > 0) {
            if (!storage.contains("before")) {
                ui.run(() => {
                    ui.before_total_maile.setText(result.total_maile.toString() + "公里 ");
                    ui.before_energy.setText(result.energy.toString() + "% ");
                    ui.before_oil.setText(result.oil.toString() + "% ");
                });

                storage.put("before", result);
                ui.get_data_before.setEnabled(false);
                ui.get_data_after.setEnabled(true);
                ui.clear_cache.setEnabled(true);

            } else {
                toastLog("数据都已缓存");
                ui.log.setText("数据都已缓存");
            }
        } else {
            toastLog("获取的数据不准确！");
            ui.log.setText("获取的数据不准确！");
        }
    });
});

ui.get_data_after.click(function () {
    threads.start(function () {
        ui.log.setText("");
        let result = _functions.get_BYD_record();
        if (result.total_maile.valueOf() > 1000 && result.energy.valueOf() > 10 && result.oil.valueOf() > 0) {

            let temp = storage.get("before");
            console.log(temp);
            //测试用修改该判断条件
            if (temp.total_maile <= result.total_maile && (temp.energy <= result.energy || temp.oil <= result.oil)) {
                //if ((temp.energy >= result.energy || temp.oil > result.oil)) {
                ui.run(() => {
                    ui.after_total_maile.setText(result.total_maile.toString() + "公里 ");
                    ui.after_energy.setText(result.energy.toString() + "% ");
                    ui.after_oil.setText(result.oil.toString() + "% ");
                });
                storage.put("after", result);
                ui.clear_cache.setEnabled(true);
                ui.get_data_after.setEnabled(false);
                ui.record_data.setEnabled(true);

                ui.cost.setVisibility(View.VISIBLE);
                if (temp.oil < result.oil || temp.energy >= result.energy) {
                    storage.put("kind", "oil");
                    ui.radio_oil.setChecked(true);
                } else {
                    storage.put("kind", "energy");
                    ui.radio_energy.setChecked(true);
                }
                charging_or_refuel();
            } else {
                toastLog("不符合充电、加油后的数据条件");
                ui.log.setText("不符合充电、加油后的数据条件");
            }
        } else {
            toastLog("获取的数据不准确！");
            ui.log.setText("获取的数据不准确！");
        }
    });
});

ui.clear_cache.click(function () {
    storage.remove("before");
    storage.remove("after");
    init_ui();
});

ui.radio_energy.click(() => {
    charging_or_refuel();
});

ui.radio_oil.click(() => {
    charging_or_refuel();
});

ui.charge_cost.addTextChangedListener({
    afterTextChanged: (str) => {
        let cost = parseFloat(str);
        let v = parseFloat(ui.charge_value.getText());

        console.log(cost + ":" + v);
        if (v > 0 && cost > 0)
            ui.charge_price.setText((cost / v).toFixed(2) + "");
    }
});

ui.charge_value.addTextChangedListener({
    afterTextChanged: (str) => {
        let cost = parseFloat(ui.charge_cost.getText());
        let v = parseFloat(str);

        console.log(cost + ":" + v);
        if (v > 0 && cost > 0)
            ui.charge_price.setText((cost / v).toFixed(2) + "");
    }
});

ui.oil_cost_1.addTextChangedListener({
    afterTextChanged: (str) => {
        let cost1 = parseFloat(str);
        let v = parseFloat(ui.oil_value.getText());

        if (v > 0 && cost1 > 0)
            ui.oil_price_1.setText((cost1 / v).toFixed(2) + "");
    }
});

ui.oil_cost_2.addTextChangedListener({
    afterTextChanged: (str) => {
        let cost2 = parseFloat(str);
        let v = parseFloat(ui.oil_value.getText());
        let cost1 = parseFloat(ui.oil_cost_1.getText());

        if (cost1 > 0 && cost2 > 0 && cost2 <= cost1) {
            let tmp = cost1 - cost2;
            ui.oil_discount_amount.setText(tmp + "");
        }

        if (cost1 > 0 && cost2 > 0 && cost1 >= cost2 && v > 0)
            ui.oil_price_2.setText((cost2 / v).toFixed(2) + "")

    }
});

ui.oil_value.addTextChangedListener({
    afterTextChanged: (str) => {
        let cost1 = parseFloat(ui.oil_cost_1.getText());
        let v = parseFloat(str);
        let cost2 = parseFloat(ui.oil_cost_2.getText());

        if (v > 0 && cost1 > 0)
            ui.oil_price_1.setText((cost1 / v).toFixed(2) + "");

        if (cost1 > 0 && cost2 > 0 && cost1 >= cost2 && v > 0)
            ui.oil_price_2.setText((cost2 / v).toFixed(2) + "")
    }
});

ui.record_data.on("click", () => {
    let _before = storage.get("before");
    let _after = storage.get("after");
    let before_total_maile = _before.total_maile;
    let before_energy = _before.energy;
    let before_oil = _before.oil;
    let after_total_maile = _after.total_maile;
    let after_energy = _after.energy;
    let after_oil = _after.oil;
    let kind = storage.get("kind");

    let charge_cost = 0;
    let charge_value = 0;

    let oil_cost_1 = 0;
    let oil_cost_2 = 0;
    let oil_value = 0;

    let timestamp = new Date().getTime();
    let date = new Date();

    let datetime = date.getFullYear() + "-" + ((date.getMonth()) + 1) + "-" + date.getDate() + " "
        + date.getHours() + ":" + date.getMinutes();

    if (ui.radio_energy.isChecked()) {
        charge_cost = ui.charge_cost.getText();
        charge_value = ui.charge_value.getText();
    } else {
        oil_cost_1 = ui.oil_cost_1.getText();
        oil_cost_2 = ui.oil_cost_2.getText();
        oil_value = ui.oil_value.getText();
    }

    let str_1 = "timestamp:" + timestamp + "," +
        "datetime:" + datetime + "," +
        "before_total_maile:" + before_total_maile + "," +
        "before_energy:" + before_energy + "," +
        "before_oil:" + before_oil + "," +
        "after_total_maile:" + after_total_maile + "," +
        "after_energy:" + after_energy + "," +
        "after_oil:" + after_oil + "," +
        "kind:" + kind + "," +
        "charge_cost:" + charge_cost + "," +
        "charge_value:" + charge_value + "," +
        "oil_cost_1:" + oil_cost_1 + "," +
        "oil_cost_2:" + oil_cost_2 + "," +
        "oil_value:" + oil_value;
    console.log(str_1);

    let str = timestamp + "," +
        datetime + "," +
        before_total_maile + "," +
        before_energy + "," +
        before_oil + "," +
        after_total_maile + "," +
        after_energy + "," +
        after_oil + "," +
        kind + "," +
        charge_cost + "," +
        charge_value + "," +
        oil_cost_1 + "," +
        oil_cost_2 + "," +
        oil_value + "\n";

    files.append("./recorder.txt", str, encoding = "utf-8");

    //暂时先不自动清空缓存
    //storage.remove("kind");
    //storage.remove("before");
    //storage.remove("after");
    init_ui();
    ui.log.setText(str_1);

    threads.start(function () {
        let data = {
            "kind": kind, "before_energy": before_energy, "before_oil": before_oil, "before_total_maile": before_total_maile,
            "after_oil": after_oil, "after_energy": after_energy, "after_total_maile": after_total_maile, "oil_cost_1": oil_cost_1,
            "oil_cost_2": oil_cost_2, "oil_value": oil_value, "charge_cost": charge_cost, "charge_value": charge_value
        };
        _functions.set_xiaoxiong_record(data);
    });

});

ui.btn_exit.click(function () {
    ui.finish();
});

init_ui();
charging_or_refuel();
