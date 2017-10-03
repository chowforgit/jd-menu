/* 基于用户行为预测的切换技术
当用户在鼠标当前的位置和二级菜单上边缘和下边缘组成的三角形区域内移动时，预测用户想要把鼠标移动到二级菜单中。
此时加入算法判断鼠标移动的位置是否处于这个三角形区域之内 */

// 叉乘结果符号判断
function sameSign(a, b) {
    return (a ^ b) >= 0;
}


// 向量计算
function vector(a, b) {
    return {
        // 终点x减去起点x
        x: b.x - a.x,
        // 终点y减去起点y
        y: b.y - a.y
    }
}

// 向量叉乘
function vectorProduct(v1, v2) {
    // 公式
    return v1.x * v2.y - v2.x * v1.y;
}

// 叉乘判断方法
// p-当前的点 a-上一个点 b-二级菜单上缘 c-二级菜单下缘
function isPoinInTrangle(p, a, b, c) {
    var pa = vector(p, a);
    var pb = vector(p, b);
    var pc = vector(p, c);

    // 叉乘结果
    var t1 = vectorProduct(pa, pb);
    var t2 = vectorProduct(pb, pc);
    var t3 = vectorProduct(pc, pa);

    // 叉乘判断条件：判断三者符号是否两两相同
    return sameSign(t1, t2) && sameSign(t2, t3);
}


// 判断是否需要延迟
function needDelay(elem, leftCorner, curMousePos) {
    // jquery方法获取二级菜单上下边缘坐标
    var offset = elem.offset();

    // 左上角坐标
    var topLeft = {
        x: offset.left,
        y: offset.top
    }

    // 左下角坐标
    var bottomLeft = {
        x: offset.left,
        y: offset.top + elem.height()
    }

    return isPoinInTrangle(curMousePos, leftCorner, topLeft, bottomLeft);
}