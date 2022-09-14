auto()

requestScreenCapture(false)

//点击控件所在坐标
function btn_position_click(x) { if (x) click(x.bounds().centerX(), x.bounds().centerY()) }

// 按desc文本查找按钮，并点击
function click_by_desc(txt) {
    let btn = desc(txt).findOne(5000);
    if (!btn) {
        console.log('没找到‘' + txt + '’按钮')
        return;
    }
    btn_position_click(btn)
}

// 按id文本查找按钮，并点击
function click_by_id(id_str) {
    let btn = id(id_str).findOne(5000);
    if (!btn) {
        console.log('没找到‘' + id_str + '’按钮')
        return;
    }
    btn_position_click(btn)
}

//在屏幕上匹配图片，匹配到就点击
function find_images(num, img_file, flipup, threshold) {
    let templ = images.read(img_file);
    //toast_console('color:' + color + ';threshold:' + threshold)
    while (num--) {
        let img = captureScreen()
        if (flipup != undefined) img = images.rotate(img, 180)
        if (threshold != undefined) threshold = 0.9
        else
            threshold = threshold
        let point = findImage(img, templ, {
            threshold: threshold //图片相似度
        })
        if (point) {
            if (flipup != undefined) {
                point.x = img.getWidth() - point.x; point.y = img.getHeight() - point.y
            }
            console.log('找到了‘' + img_file + '’图片');
            return click(point.x, point.y);
        }
        if (num) sleep(500)
    }
    console.log('没找到‘' + img_file + '’图片');
    return false
}

app.launch('com.wm.dmall')
sleep(2000)

//关闭广告
//if (!click_by_desc('多点')) click_by_id('com.wm.dmall:id/iv_close')
//sleep(2000)

while (true) {
    find_images(3, './img/多点券.jpg')
    var find1 = find_images(3, './img/多点券-未抢到.jpg')
    if (!find1) {
        while (true) {
            find_images(3, './img/多点券2.jpg')
            var find2 = find_images(3, './img/多点券-未抢到.jpg')
            if (find2)
                exit()
        }
    }
}