function getStyle(obj, name) {
	// 兼容
	if (obj.currentStyle) {
		return obj.currentStyle[name];
	} else {
		return getComputedStyle(obj, false)[name];
	}
}

/*
 * 1、到达终点之前做的事情，和到达终点以后做的事情，这两件事情不应该同事发生
 * 2、当前位置和目标点推出 speed 是正还是负 (当前位置  > 目标点  speed 为负)
 * 3、缓冲运动： 距离大速度大，距离小速度小速度和距离成正比 speed = 目标点-div.offsetLeft(div当前的位置)
 *   此时速度如果是小数会出问题，解决方案：速度是正数就向上取整，负数就向下取整 Math.ceil(speed) 、Math.floor(speed)
 * 注：缓冲运动 一定要取整
 * 4、 目标点需要取整 parseInt(iTarget)
 * 5、匀速运动停止条件：目标-物体小于等于速度在取绝对值  Math.abs((iTarget-oDiv.offsetLeft)) < speed，之后就清除定时器, 在把目标点的值付给物体 oDiv.style.left=iTarget+"px";
 * 6、 obj 参数 是指 哪个物体动
 * 7、定时器作为一个物体的属性存在上面，使每个定时器都互不干扰
 * 8、多物体框架运动中，所有东西都不能共用。 解决方案，像定时器一样作为一个属性加到物体上
 * 9、 offsetWidth 如果某个 div 上加了边框就会出现 "bug"  div.width=200px border=1 padding:10px;  那么 offsetWidth=222px
 *     这样，如果一个 div 变小 原本的大小 =202-1=201 这样本来 200 的 div 会越来越大，可不用 offsetWidth
 *     解决方案：把 div 的宽放到行样式 oDiv.style.width 机会取到 200px 在取整 就可以了，如果是写到样式表就用 getStyle();
 * 10、 运动属性的参数
 * 11、 运动执行完成调用
 * 12、 json：{width:500,height:400}  for(var name in json){json[name]=500}
 * 13、 等所有的东西都到了才关闭定时器
 */

function startMove(obj, json, fnEnd) {
	var MAX = 18;
	// 每次调用就只有一个定时器在工作 (开始运动时关闭已有定时器)
	// 并且关闭或者开启都是当前物体的定时器，已防止与页面上其他定时器的冲突，使每个定时器都互不干扰
	clearInterval(obj.timer);
	obj.timer = setInterval(function () {

		var bStop = true; // 假设：所有的值都已经到了

		for (var name in json) {
			var iTarget = json[name]; // 目标点

			// 处理透明度，不能使用 parseInt 否则就为 0 了

			if (name == 'opacity') {

				// *100 会有误差 0000007 之类的 所以要用 Math.round() 会四舍五入
				var cur = Math.round(parseFloat(getStyle(obj, name)) * 100);
			} else {
				var cur = parseInt(getStyle(obj, name)); // cur 当前移动的数值
			}

			var speed = (iTarget - cur) / 5; // 物体运动的速度 数字越小动的越慢  /5 : 自定义的数字

			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

			if (Math.abs(speed) > MAX) speed = speed > 0 ? MAX : -MAX;

			if (name == "opacity") {
				obj.style.filter = "alpha(opacity:" + (cur + speed) + ")"; //IE
				obj.style.opacity = (cur + speed) / 100; //ff chrome
			} else {
				obj.style[name] = cur + speed + "px";
			}

			// 某个值不等于目标点
			if (cur != iTarget) {
				bStop = false;
			}
		}

		// 都达到了目标点
		if (bStop) {
			clearInterval(obj.timer);

			if (fnEnd) // 只有传了这个函数才去调用
			{
				fnEnd();
			}
		}

	}, 20);
}


