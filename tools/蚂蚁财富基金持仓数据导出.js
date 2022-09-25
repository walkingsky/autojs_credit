auto.waitFor()

app.launch('com.antfortune.wealth');
sleep(500)

sleep(4000)

if (textContains('资产').exists())
    //text('资产').findOne().click()
    click('资产')
else {
    toast('“资产”按钮未找到，退出')
    exit()
}
sleep(500)
//直接点击坐标点，进入“基金”
click(770, 1150)

textContains('交易记录').waitFor()



var csv_str = "基金名称,基金代码,份额,持仓成本价\n"

let main = className('android.view.View').depth(15).indexInParent(2).findOne()
let num = main.childCount()

for (let i = 0; i < num; i++) {
    main.child(i).child(0).click()
    textContains('资产详情').waitFor()
    sleep(500)

    if (textContains('我知道了').exists()) {
        textContains('我知道了').findOne().click()
        sleep(300)

    }
    let temp = className('android.view.View').depth(14).indexInParent(2).findOne().text()

    if (temp.indexOf('风险') != -1) {
        csv_str += className('android.view.View').depth(14).indexInParent(0).findOne().text() + ','
        csv_str += className('android.view.View').depth(14).indexInParent(1).findOne().text() + ','

    }
    else {
        csv_str += className('android.view.View').depth(14).indexInParent(2).findOne().text() + ','
        csv_str += className('android.view.View').depth(14).indexInParent(3).findOne().text() + ','

    }
    let sub = undefined
    if (textContains('本次开放').exists()) {
        className('android.view.View').depth(15).indexInParent(6).findOne().click()
        sleep(200)
        sub = className('android.view.View').depth(15).indexInParent(7).findOne()

    } else {
        className('android.view.View').depth(15).indexInParent(5).findOne().click()
        sleep(200)
        sub = className('android.view.View').depth(15).indexInParent(6).findOne()

    }
    csv_str += shares_str(sub.child(4).child(1).text()) + ','
    csv_str += sub.child(3).child(1).text() + "\n"
    console.log(csv_str)
    idContains('h5_nav_back').findOne().click()
    textContains('交易记录').waitFor()
    sleep(300)
}

files.write("/sdcard/基金持仓数据.csv", csv_str)
toast('全部执行完毕')

function shares_str(str) {
    return str.replace(',', '')
}
