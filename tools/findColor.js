/**
 * 在当前屏幕中设定的区域中，查找能够被findcolor函数检测出来的颜色值
 */

auto()

requestScreenCapture(false)
//设置查找颜色的区域
var rangPoint = [294, 690, 366, 760]

function getColor() {
    let img = captureScreen()
    let pColor = null
    for (let i = rangPoint[0]; i <= rangPoint[2]; i++)
        for (let j = rangPoint[1]; j <= rangPoint[3]; j++) {
            pColor = images.pixel(img, i, j)
            //console.log('pColor:' + colors.toString(pColor))
            point = findColor(img, pColor)
            if (null != point) {
                //console.log(point)
                if (point.x == i && point.y == j) {
                    console.log('找到了颜色值：' + colors.toString(pColor))
                    return
                }
            }
        }

    toast("没有找到对应的颜色")
}


//启用按键监听
events.observeKey()
//监听音量上键按下
events.onKeyDown("volume_up", function (event) {
    console.log("音量上键被按下了")
    getColor()
})

events.onKeyDown("volume_down", function (event) {
    toast("音量下键被按下了")
    exit()
})

