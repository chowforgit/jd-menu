$(document).ready(function() {
    var sub = $('#sub');

    // 一级菜单列表项
    var activeRow;
    // 二级菜单
    var activeMenu;

    // 保存setTimeout返回的
    var timer;
    
    // 标识当前鼠标是否在子菜单里面
    var mouseInsub = false;
    sub.on('mouseenter', function(e) {
        mouseInsub = true;
    }).on('mouseleave', function(e) {
        mouseInsub = false;
    })

    // 跟踪记录鼠标的位置
    var mouseTrack = [];

    var moveHandler = function(e) {
        mouseTrack.push({
            x: e.pageX,
            y: e.pageY
        })
        // 鼠标的位置记录只需用到当前位置和上一次位置，保存有限个即可，多余的就把它弹出
        if (mouseTrack.length > 3) {
            mouseTrack.shift();
        }
    }

    $('#test li')
        .on('mouseenter', function(e) {
            sub.removeClass('none');
        })

    $('#test')
        // 当鼠标进入一级菜单时，显示相应的二级菜单
        .on('mouseenter', function(e) {
            // mousemove一般绑定在document上
            $(document).bind('mousemove', moveHandler)
        })
        // 鼠标移出菜单栏时
        .on('mouseleave', function(e) {
            // 隐藏二级菜单
            sub.addClass('none');

            // 清除列表项的特效，并清除activeRow变量
            if (activeRow) {
                activeRow.removeClass('active');
                activeRow = null;
            }

            // 隐藏当前打开的二级菜单
            if (activeMenu) {
                activeMenu.addClass('none');
                activeMenu = null;
            }

            // 鼠标离开菜单是把事件解绑，以免影响页面其他组件
            $(document).unbind('mousemove', moveHandler);
        })
        // 鼠标移入菜单栏时，绑定事件代理
        .on('mouseenter', 'li', function() {
            if (!activeRow) {
                activeRow = $(this).addClass('active');
                // 绑定当前列表项ID相对应的二级菜单
                activeMenu = $('#' + activeRow.data('id'));
                activeMenu.removeClass('none');
                return
            }

            // debounce去抖技术，在事件被频繁触发时，只执行一次处理
            // 如果事件触发的时候计时器还没有执行，那么就把计时器清除掉
            if (timer) {
                clearTimeout(timer);
            }

            // 拿到鼠标当前坐标
            var currMousePos = mouseTrack[mouseTrack.length - 1];
            // 拿到鼠标上一次的坐标，开始移动之前的坐标
            var leftCorner = mouseTrack[mouseTrack.length - 2]; 

            var delay = needDelay(sub, leftCorner, currMousePos);

            // 判断是否需要延迟，即预测用户是否将要从当前列表项移动到二级菜单中
            if (delay) {

                // 操作优化，在事件触发时设置一个缓冲期，如果回调函数执行时鼠标还在当前子菜单里面就不进行切换操作
                timer = setTimeout(function() {
                    if (mouseInsub) {
                        // 如果鼠标在子菜单里面就不做任何操作
                        return
                    }
                    // 从一个列表项移动到另一个列表项时，清除上一个列表项的状态
                    activeRow.removeClass('active');
                    activeMenu.addClass('none');

                    // 指向当前的列表项
                    activeRow = $(this);
                    activeRow.addClass('active');
                    activeMenu = $('#' + activeRow.data('id'));
                    activeMenu.removeClass('none');
                    // 计时器回调之后设置为null,为了上一步debounce的判断
                    timer = null;
                }, 300);
            } else {
                // 如果判断不在三角形之内，就直接进行列表项的切换
                // 把前面生成的行块赋值给prev…
                var prevActiveRow = activeRow;
                var prevActiveMenu = activeMenu;

                // 把当前的行块赋值给active…
                activeRow = $(this);
                activeMenu = $('#' + activeRow.data('id'));

                // 把之前的行块隐藏
                prevActiveRow.removeClass('active');
                prevActiveMenu.addClass('none');
                // 展示当前的行块
                activeRow.addClass('active');
                activeMenu.removeClass('none');
            }

            

            
        })
})
