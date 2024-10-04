/**
 * 定时检测手机电池电量，电量不够时操作“合家亲”打开智能开关
 * author: walkingsky
 * url:https://github.com/walkingsky/autojs_credit
 */

auto.waitFor();

function hejiaqinApp(turn_on) {
    //if (!device.isScreenOn())
    //    device.wakeUp();
    device.wakeUpIfNeeded();
    device.keepScreenOn(60 * 1000);
    sleep(1000);
    app.launch('com.cmri.universalapp');
    //text('全屋智能').id('tv.quanwu').waitFor();
    sleep(2000);
    if (id('sm_device_name_tv').text('手机').exists()) {
        var btn = id('sm_device_name_tv').text('手机').findOne();
        btn.parent().click();
        id('image_socket_switch').className('android.widget.ImageView').waitFor();

    } else if (id('image_socket_switch').className('android.widget.ImageView').exists()) {

    } else {
        toastLog('打开应用不正确，没找到对应元素');
    }
    let status = id('multiple_switch_status_tv').className('android.widget.TextView').findOne();
    if (status) {
        if (turn_on) {
            if (status.text() == '已关闭') {
                status.parent().click();
                toastLog('打开')
            }

        } else {
            if (status.text() == '已打开') {
                status.parent().click();
                toastLog('关闭')
            }

        }
        sleep(5000);
    }

}

var battery = device.getBattery();
var isCharging = device.isCharging();
toastLog('电池电量：' + battery + '%，');
toastLog(isCharging ? '正在充电' : '没有在充电');

if (battery == 100 && isCharging) {
    hejiaqinApp(false);

} else if (battery < 10 && !isCharging) {
    hejiaqinApp(true);
}

//hejiaqinApp(false);



