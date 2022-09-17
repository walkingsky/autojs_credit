//import common from './common.js';

auto();
requestScreenCapture(false);

var co = require('../common.js');

app.launch('com.wm.dmall');
sleep(2000);

//关闭广告
//if (!co.click_by_desc('多点')) 
// co.click_by_id('com.wm.dmall:id/iv_close')
//sleep(2000)
//co.debug = true;
while (true) {
    co.find_images(3, './img/多点券.jpg');
    co.toast_console('222');
    var find1 = co.find_images(3, './img/多点券-未抢到.jpg');
    co.toast_console('find1' + find1);
    if (!find1) {
        while (true) {
            co.find_images(3, './img/多点券2.jpg');
            var find2 = co.find_images(3, './img/多点券-未抢到.jpg');
            if (find2)
                exit();
        }
    }
}