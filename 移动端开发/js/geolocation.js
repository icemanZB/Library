// 定位
function GetLocation(callback) {
	if (!navigator.geolocation) {
		Common.Popup.ok("抱歉，您的设备不支持地理定位！");
		return;
	}

	var loadingPopup = Common.Popup({content: '<div class="loading">正在获取您的当前位置…</div>'});

	navigator.geolocation.getCurrentPosition(function (position) {
		var latlon = position.coords.latitude + ',' + position.coords.longitude;
		// 经纬度反向解析
		$.ajax({
			url     : 'http://api.map.baidu.com/geocoder/v2/?ak=wqeaYUovMiCHOrXXAQGg283A&location=' + latlon + '&coordtype=wgs84ll&output=json&callback=?',
			dataType: 'jsonp',
			timeout : 5000,
			cache   : true,
			success : function (data) {
				loadingPopup.close();
				if (!data || data.status != 0 || !data.result || !data.result.addressComponent || !data.result.addressComponent.city) {
					Common.Popup.ok("经纬度解析失败，请手动选择城市！");
					// console.log(data);
					return;
				}
				var city = data.result.addressComponent.city.replace("市", "");
				callback(city);
			},
			error   : function (req) {
				loadingPopup.close();
				Common.Popup.ok("经纬度解析失败，请手动选择城市！");
				// console.log('getCurrentPosition error:');
				// console.log(req);
			}
		});
	}, function (error) {
		var msg = "获取当前位置信息失败，请手动选择城市！";
		if (error.code == error.TIMEOUT) {
			msg = "定位超时，请手动选择城市！";
		} else if (error.code == error.PERMISSION_DENIED) {
			msg = "您拒绝了位置共享服务，请开启位置共享或手动选择城市！";
		}
		loadingPopup.close();
		Common.Popup.ok(msg);
		// console.log('getCurrentPosition error:');
		// console.log(error);
	}, {
		maximumAge        : 5000,
		timeout           : 15000,
		enableHighAccuracy: true
	});
}