/**
 * 通用自动操作功能
 */

var common = {};
var debug = false;
var find_text_time = 3000;

common.debug = debug;
//消息提示
common.toast_console = function (msg) {
    console.log(msg);
    if (this.debug)
        toast(msg);
}
//点击控件所在坐标
common.btn_position_click = function (x) {
    if (x)
        click(x.bounds().centerX(), x.bounds().centerY());
}
// 按文本查找按钮，并点击
common.click_by_text = function (txt) {
    let btn = text(txt).findOne(find_text_time);
    if (!btn) {
        this.toast_console('没找到‘' + txt + '’按钮')
        return false;
    }
    this.toast_console('找到了‘' + txt + '’按钮');
    this.btn_position_click(btn);
    return true;
}
// 按desc文本查找按钮，并点击
common.click_by_desc = function (txt) {
    let btn = desc(txt).findOne(find_text_time);
    if (!btn) {
        this.toast_console('没找到‘' + txt + '’按钮');
        return false;
    }
    this.toast_console('找到了‘' + txt + '’按钮');
    this.btn_position_click(btn);
    return true;
}
// 按id文本查找按钮，并点击
common.click_by_id = function (id_str) {
    let btn = id(id_str).findOne(find_text_time);
    if (!btn) {
        this.toast_console('没找到‘' + id_str + '’按钮');
        return false;
    }
    this.toast_console('找到了‘' + id_str + '’按钮');
    this.btn_position_click(btn);
    return true;
}

// 按文本包含内容查找按钮，并点击
common.click_by_textcontains = function (txt) {
    let btn = textContains(txt).findOne(find_text_time);
    if (!btn) {
        this.toast_console('没找到‘' + txt + '’按钮');
        return false;
    }
    this.toast_console('找到了‘' + txt + '’按钮');
    this.btn_position_click(btn);
    return true;
}
// 点击区域
common.click_bounds = function (x1, y1, x2, y2) {
    x = x1 + (x2 - x1) / 2;
    y = y1 + (y2 - y1) / 2;
    click(x, y);
}

// 截屏查找图片颜色并单击对应的点
/**
 * @param num 重试次数
 * @param rgb 颜色值 ‘#112233’
 *@param xr,yr,wr,hr,  区域坐标（起点x，起点y，宽，高），小数时，是按照屏幕长宽按照给定的值按照比例动态算出的坐标。
 * @param flipup 反转屏幕
 */
common.cs_click = function (num, rgb, xr, yr, wr, hr, flipup) {
    while (num--) {
        let img = captureScreen();
        if (flipup != undefined)
            img = images.rotate(img, 180);
        if (xr < 1)
            var region = [
                parseInt(img.getWidth() * xr),
                parseInt(img.getHeight() * yr),
                parseInt(img.getWidth() * wr),
                parseInt(img.getHeight() * hr)
            ];
        else
            var region = [
                xr, yr, wr, hr
            ];
        let point = findColor(img, rgb,
            {
                region: region,
                threshold: 8
            });
        if (point) {
            if (flipup != undefined) {
                point.x = img.getWidth() - point.x;
                point.y = img.getHeight() - point.y;
            }
            return click(point.x, point.y);
        }
        if (num) sleep(1000);
    }
    return false;
}

//在屏幕上匹配图片，匹配到就点击
common.find_images = function (num, img_file, flipup, color, region, threshold) {
    let templ = images.read(img_file);
    //toast_console('color:' + color + ';threshold:' + threshold)
    if (color == undefined)
        templ = images.grayscale(templ);
    while (num--) {
        let img = captureScreen();
        if (flipup != undefined)
            img = images.rotate(img, 180);
        if (color == undefined)
            img = images.grayscale(img);
        if (threshold != undefined)
            threshold = 0.9;
        else
            threshold = threshold;
        if (region != undefined)
            var point = findImage(img, templ, {
                threshold: threshold, //图片相似度
                region: region
            });
        else
            var point = findImage(img, templ, {
                threshold: threshold //图片相似度
            });

        if (point) {
            if (flipup != undefined) {
                point.x = img.getWidth() - point.x; point.y = img.getHeight() - point.y;
            }
            this.toast_console('找到了‘' + img_file + '’图片');
            return click(point.x, point.y);
        }
        if (num)
            sleep(1000);
    }
    this.toast_console('没找到‘' + img_file + '’图片');
    return false;
}

module.exports = common;