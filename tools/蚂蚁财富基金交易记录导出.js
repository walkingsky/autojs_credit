auto.waitFor()

app.launch('com.antfortune.wealth');
sleep(500)

//导出交易记录的条数（不是实际导出数，在实际数据条数大于这个数时，实际导出数会大于这个数量）
var max_records = 305

function danweijingzhi(str) {
    return str.replace(/\([\d\-]+\)/g, '')
}
function jine(str) {
    str = str.replace(',', '')
    return str.replace(/([\d\.]+)[^\d\.]*/g, "$1")
}
function riqi(str) {
    return str.replace(/ \d{2}:\d{2}:\d{2}/, '')
}
//记录转换数据
function zhuanhuan() {
    if (textContains('已撤销').exists())
        return ''
    let str = ''
    //先记录转出基金
    let texts = className('android.view.View').depth(13).find()[0]
    str = texts.child(6).text() + ',' //基金名称
    str = str + texts.child(34).text() + ',' //交易日期
    str = str + '转出,' //买卖方向
    str = str + jine(texts.child(10).text()) + ',' //份额
    str = str + danweijingzhi(texts.child(12).text()) + ',' //单位净值
    str = str + jine(texts.child(14).text()) + ',' //交易金额
    str = str + '0,' //手续费
    str = str + "0\n" //退回金额
    //记录转入基金
    str = str + texts.child(16).text() + ',' //基金名称
    str = str + texts.child(34).text() + ',' //交易日期
    str = str + '转入,' //买卖方向
    str = str + jine(texts.child(18).text()) + ',' //份额
    str = str + danweijingzhi(texts.child(20).text()) + ',' //单位净值
    str = str + jine(texts.child(22).text()) + ',' //交易金额
    str = str + jine(texts.child(24).text()) + ',' //手续费
    str = str + jine(texts.child(26).text()) + "\n" //退回金额
    console.log(str)
    return str
}

//记录买入数据
function mairu() {
    if (textContains('已撤销').exists() || textContains('交易关闭').exists())
        return ''
    let str = ''
    let texts = className('android.view.View').depth(13).find()[0]
    str = texts.child(4).child(1).text() + ',' //基金名称
    if (textContains('福利抵扣').exists()) {
        str = str + texts.child(25).text() + ',' //交易日期
        str = str + '买入,' //买卖方向
        str = str + jine(texts.child(19).text()) + ',' //份额
        str = str + danweijingzhi(texts.child(21).text()) + ',' //单位净值
        str = str + jine(texts.child(17).text()) + ',' //交易金额
        str = str + jine(texts.child(23).text()) + ',' //手续费
    } else {
        str = str + texts.child(21).text() + ',' //交易日期
        str = str + '买入,' //买卖方向
        str = str + jine(texts.child(15).text()) + ',' //份额
        str = str + danweijingzhi(texts.child(17).text()) + ',' //单位净值
        str = str + jine(texts.child(13).text()) + ',' //交易金额
        str = str + jine(texts.child(19).text()) + ',' //手续费
    }

    str = str + "0\n" //退回金额

    console.log(str)
    return str
}

//记录卖出数据
function maichu() {
    if (textContains('已撤销').exists() || textContains('交易关闭').exists())
        return ''
    let str = ''
    let texts = className('android.view.View').depth(13).find()[0]
    str = texts.child(6).text() + ',' //基金名称
    str = str + riqi(texts.child(10).text()) + ',' //交易日期
    str = str + '卖出,' //买卖方向
    str = str + jine(texts.child(13).child(0).text()) + ',' //份额
    str = str + danweijingzhi(texts.child(15).text()) + ',' //单位净值
    str = str + jine(texts.child(19).text()) + ',' //交易金额
    str = str + jine(texts.child(17).text()) + ',' //手续费
    str = str + "0\n" //退回金额

    console.log(str)
    return str
}


//记录分红数据
function fenhong() {
    let str = ''
    let texts = className('android.view.View').depth(13).find()[0]
    str = texts.child(5).text() + ',' //基金名称
    str = str + riqi(texts.child(11).text()) + ',' //交易日期
    str = str + '分红,' //买卖方向
    if (textContains('现金分红').exists()) {
        str = str + '0,' //份额
        str = str + '0,' //单位净值
        str = str + jine(texts.child(9).text()) + ',' //交易金额
    } else {
        str = str + jine(texts.child(9).child(0).text()) + ',' //份额
        str = str + '0,' //单位净值
        str = str + '0,' //交易金额
    }
    str = str + '0,' //手续费
    str = str + "0\n" //退回金额

    console.log(str)
    return str
}



//记录增加份额数据
function zengjiafene() {
    let str = ''
    let texts = className('android.view.View').depth(13).find()[0]
    str = texts.child(5).text() + ',' //基金名称
    str = str + riqi(texts.child(11).text()) + ',' //交易日期
    str = str + '增强,' //买卖方向
    str = str + '0,' //份额
    str = str + '0,' //单位净值
    str = str + jine(texts.child(9).text()) + ',' //交易金额
    str = str + '0,' //手续费
    str = str + "0\n" //退回金额

    console.log(str)
    return str
}


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
textContains('交易记录').click()
sleep(3000)

//提前翻到最大页数
var records = null
do {
    var records = className('android.view.View').depth(15).indexInParent(0).find()
    swipe(device.width * 0.5, device.height * 0.9, device.width * 0.5, 100, 300)
    sleep(100)
} while (records[0].child(0).childCount() < 305)


var csv_str = ''
//files.write("/sdcard/基金交易记录.csv", csv_str)

for (let n = 252; n < records[1].child(0).childCount(); n++) {
    records[1].child(0).child(n).click()
    textContains('记录详情').waitFor()
    sleep(1000)
    if (textContains('分红信息').exists()) {
        console.log('分红信息')
        csv_str += fenhong()
    } else if (textContains('买入信息').exists()) {
        console.log('买入信息')
        if (textContains('受理失败').exists())
            console.log('受理失败')
        else
            csv_str += mairu()
    } else if (textContains('卖出信息').exists()) {
        console.log('卖出信息')
        csv_str += maichu()
    } else if (textContains('转出基金').exists()) {
        console.log('基金转换')
        csv_str += zhuanhuan()
    } else if (textContains('增加份额').exists()) {
        console.log('增加份额')
        csv_str += zengjiafene()
    }
    desc('返回').click()
    textContains('交易记录').waitFor()
    sleep(100)
    console.log(n)
    files.write("/sdcard/基金交易记录.csv", csv_str)
}

console.log(csv_str)
toast('全部执行完毕')

