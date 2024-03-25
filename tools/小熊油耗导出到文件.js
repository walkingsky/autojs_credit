/**
 * 从小熊油耗的能耗详单列表，把所有数据导出到 csv 文件
 * author: walkingsky
 * url:https://github.com/walkingsky/autojs_credit
 * 
 * 手动打开软件，点击进入到详单列表页，再执行该脚本
 */

auto.waitFor();
app.launch('com.firebear.androil');

sleep(1000);

// 是否是新建文件，否的话则追加记录到已有文件后
var new_file = false;
// 文件名
var file_name = './能耗记录.csv';

var list = [];

if (new_file || !files.exists(file_name)) {
    let csv_header = "日期时间,总里程(公里),充能方式,充电金额(元),充电量(度),折合电价(元/度),开始电量(%),结束电量(%),剩余油量(%),实付金额(元),加油量(升),机显单价(元/升),机显金额(元),实际单价(元/升),加油前油量(%),加油后油量(%)\n";
    files.write(file_name, csv_header, encoding = "GB2312");
} else {
    let str = files.read(file_name, encoding = "GB2312").split("\n");
    for (let i = 0; i < str.length; i++)
        list.push(str[i].split(",")[0]);
}


while (!textContains('上次漏记').idContains('v6_1').exists()) {
    //let lists_layout = idContains('infoLay').className('android.widget.LinearLayout').find();
    let lists_layout = idContains('infoLay').className('android.widget.LinearLayout').findOne();

    lists_layout.click();
    sleep(500);
    let datetime = idContains('dateTxv').className('android.widget.TextView').findOne(2000).text();

    if (list.indexOf(datetime) > -1) {
        back();
        sleep(500);
        my_swip();
        if (new_file)
            continue;
        else
            break;
    }
    recording();
}
if (new_file) {
    let lists_layout = idContains('infoLay').className('android.widget.LinearLayout').find();
    for (let i = 0; i < lists_layout.length; i++) {
        lists_layout[i].click();
        sleep(500);
        let datetime = idContains('dateTxv').className('android.widget.TextView').findOne(2000).text();

        if (list.indexOf(datetime) > -1) {
            back();
            sleep(500);
            my_swip();
            continue;
        }
        recording();
    }
}

function recording() {

    let datetime = idContains('dateTxv').className('android.widget.TextView').findOne(2000).text();
    let total_maile = idContains('lichengTxv').className('android.widget.EditText').findOne(2000).text();
    let method = '加油';
    let charge_amount = '';
    let charge_capacity = '';
    let charge_price = '';
    let before_charge_percent = '';
    let after_charge_percent = '';
    let oil_quantity = '';
    let refuel_amount = '';
    let refuel_quantity = '';
    let oil_price = '';
    let oil_amount = '';
    let real_oil_price = '';
    let before_refuel_percent = '';
    let after_refuel_percent = '';

    if (textContains('加油量').idContains('addUTag').exists()) {
        method = '加油';
        refuel_amount = idContains('real_price_txv').className('android.widget.EditText').findOne(2000).text();
        refuel_quantity = idContains('liter_txv').className('android.widget.EditText').findOne(2000).text();
        oil_price = idContains('price_txv').className('android.widget.EditText').indexInParent(8).findOne(2000).text();
        oil_amount = idContains('sum_price_txv').className('android.widget.EditText').findOne(2000).text();
        real_oil_price = idContains('price_txv').className('android.widget.EditText').indexInParent(5).findOne(2000).text();
        let percet = idContains("percentTxv").className("android.widget.EditText").find();
        if (percet.length == 3) {
            before_refuel_percent = percet[0].text();
            after_refuel_percent = percet[1].text();
            after_charge_percent = percet[2].text();
        }
    } else {
        method = '充电';
        charge_amount = idContains('sumPriceTxv').className('android.widget.EditText').findOne(2000).text();
        charge_capacity = idContains('literTxv').className('android.widget.EditText').findOne(2000).text();
        charge_price = idContains('priceTxv').className('android.widget.EditText').findOne(2000).text();
        let percet = idContains("percentTxv").className("android.widget.EditText").find();
        if (percet.length == 3) {
            before_charge_percent = percet[0].text();
            after_charge_percent = percet[1].text();
            oil_quantity = percet[2].text();
        }
    }

    let line_str = datetime + ',' +
        total_maile + ',' +
        method + ',' +
        charge_amount + ',' +
        charge_capacity + ',' +
        charge_price + ',' +
        before_charge_percent + ',' +
        after_charge_percent + ',' +
        oil_quantity + ',' +
        refuel_amount + ',' +
        refuel_quantity + ',' +
        oil_price + ',' +
        oil_amount + ',' +
        real_oil_price + ',' +
        before_refuel_percent + ',' +
        after_refuel_percent + "\n";
    console.log(line_str);
    files.append(file_name, line_str, encoding = "GB2312");
    back();
    list.push(datetime);
    sleep(1000);
    my_swip();
}

function my_swip() {
    swipe(device.width / 2, device.height * 0.5, device.width / 2, device.height * 0.5 - 400, 400);
}



