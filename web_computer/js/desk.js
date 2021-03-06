//-------------------------------左侧菜单栏-----------------

//生成菜单栏
function leftNavHtml(data){
	var html = '';
	for (var i = 0; i < data.length; i++) {
		html += `
			<li title=${data[i].name} data-url=${data[i].url} diaonoff=${data[i].diaOnoff} >
				<img src=${data[i].ico} />
			</li>
		`;
	}
	$('.left_nav').html(html);
}
leftNavHtml(data.leftNav);

$('.left_nav').on('click',function(e){
	var target = e.target.closest('li');
	if ($(target).attr('diaonoff')==='false') {
		$(target).attr('diaonoff',true);
		$.dialog({
			title:target.title,
			url:target.dataset.url,
			ico:$(target).find('img').attr('src'),
			closeBack(){
				$(target).attr('diaonoff',false);
			}
		});
	}
})
$('.sound').on('click',function(){		//声音按钮
	$(this).toggleClass('sound_close');
})
$('.window').on('click',function(e){	
	$('.win_box').toggleClass('win_hide');
	e.stopPropagation();
})

$('.style').attr('diaonoff',false);
$('.style').on('click',function(e){		//主题按钮
	if ($(this).attr('diaonoff') === 'false') {
		$('.style').attr('diaonoff',true);
		var _this = this;
		$.dialog({
			title:'主题设置',
			content:themeHtml(),
			ico:'ico/5.png',
			closeBack(){
				$(_this).attr('diaonoff',false);
			}
		});
	}
	$('.themeList').on('click','li',changeStyle);
})
function changeStyle(){
	$('body').css('background-image','url('+$(this).attr('url')+')');
}
function themeHtml(){
	return `<div class="theme">
				<div class="theme_head">
					<div>系统主题</div>
				</div>
				<ul class="themeList">
					<li url="img/bg/theme_blue.jpg">
						<img src="img/bg/theme_blue.jpg" />
						<div>梦幻光影</div>
					</li>
					<li url="img/bg/theme_pink.jpg">
						<img src="img/bg/theme_pink.jpg" />
						<div>粉红之夜</div>
					</li>
					<li url="img/bg/theme_green.jpg">
						<img src="img/bg/theme_green.jpg" />
						<div>青青世界</div>
					</li>
					<li url="img/bg/theme_wood.jpg">
						<img src="img/bg/theme_wood.jpg" />
						<div>温馨木纹</div>
					</li>
					<li url="img/bg/theme_cartoon.jpg">
						<img src="img/bg/theme_cartoon.jpg" />
						<div>卡通动漫</div>
					</li>
				</ul>
			</div`
}

//-----------------------------顶部导航栏----------------------------

//根据数据生成导航栏
function topNavHtml(data){
	var html = '';
	for (var i = 0; i < data.length; i++) {
		html += `
			<a class="menu_item" href="#" data-url=${data[i].url} diaonoff=${data[i].diaOnoff}>
				<img src=${data[i].ico} />
				<span>${data[i].name}</span>
			</a>
		`;
	}
	$('.top_nav').html(html);
}
topNavHtml(data.topNav);

$(document).on('mousemove',[document,'.menu_item'],appleMenu);
function appleMenu(ev){
	var oEvent = ev||event;
	var oDiv = $('.top_nav');
	var aItem = $('a',oDiv);
	var d=0;		//保存
	var iMax=140;	//
	var i=0;
	
	function getDistance(obj){	//函数，返回鼠标的位置距离目标中心点的距离，勾股定理
		return Math.sqrt
		(
			Math.pow(obj.offsetLeft + obj.offsetWidth/2 - oEvent.clientX,2) +
			Math.pow(obj.offsetTop + obj.offsetHeight/3 - oEvent.clientY,2)
		)
	}
	
	aItem.each(function(index,item){
		d=getDistance(item);
		d=Math.min(d, iMax);
		$(item).css('width',((iMax-d)/iMax)*80+40+"px");
	})
}
//单击出现弹框
$('.menu_item').on('click',function(e){
	var target = $(e.target).closest('a');
	if ($(target).attr('diaonoff')==='false') {
		$(target).attr('diaonoff',true);
		$.dialog({
			title:'顶部',
			url:'weiyun.html',
			ico:'ico/5.png',
			closeBack(){
				$(target).attr('diaonoff',false);
			}
		});
	}
})


//----------------------------------桌面应用------------------------



var appList = $('.appList');
//生成app HTML
function appHtml(fileData){
	var appHtml = '';
	for (var i = 0; i < fileData.length; i++) {
		appHtml += `<li class="appItem" diaonoff=${fileData[i].diaOnoff} data-id=${fileData[i].id} data-name=${fileData[i].name} data-url=${fileData[i].url}>
						<img src=${fileData[i].ico} />
						<span>${fileData[i].name}</span>
					</li>`
	}
	appList.html(appHtml);
}
appHtml(fileData);

//var appItems = $('.appItem',appList);

$(window).on('resize',appPos);	//视口大小改变时候调整app位置
function appPos(){
	var appItems = $('.appItem',appList);
	var verNum = Math.floor(appList.innerHeight()/110);
	appItems.each(function(index,item){
		$(item).css({'left':Math.floor(index/verNum)*100,'top':index%verNum*100})
	});
	
}
appPos();

//拖拽换位置
var disX = null,
	disY = null,
	preLeft = null,  //拖拽目标的原位置
	preTop = null,
	hitLeft = null,	 //碰撞目标的原位置
	hitTop = null,
	target = null,		//拖拽的目标
	hitTarget = null,	//碰撞的目标
	targetId = null,
	hitTargetId = null;
$(document).on('mousedown','.appList',function(e){
	target = $(e.target).closest('.appItem');
	if (!target.is('.appItem')) return;			//判断点击的target
	$(target).addClass('click');
	if (e.which != 1) return; // 必须点数遍左键
	e.preventDefault();		  // 取消默认行为
	preLeft = target.position().left;
	preTop = target.position().top;
	disX = e.clientX - preLeft;
	disY = e.clientY - preTop;
	targetId = target[0].dataset.id;
	$(document).on('mousemove',moveFn);
	$(document).on('mouseup',upFn);
})
function moveFn(e){
	var x = e.clientX - disX;
	var y = e.clientY - disY;
	target.css({'left':x,'top':y});
}
function upFn(){
	var appItems = $('.appItem',appList);
	for (var i = 0; i < appItems.length; i++) {
		if (appItems[i] === target.get(0)) {
			continue;
		}else{
			if (hit(target.get(0),appItems[i])) {	//碰撞到
				hitTarget = appItems[i];
				if (hitTarget.dataset.id == 1) {
					dataFn.deleDataById(target[0].dataset.id,fileData);
					target.remove();
				} else{
					hitLeft = appItems[i].offsetLeft;
					hitTop = appItems[i].offsetTop;
					hitTargetId = hitTarget.dataset.id;
					dataFn.exchangeData(targetId,hitTargetId,fileData);	//交换数据
				}
				break;
			}else{
				hitTarget = null;
				hitLeft = null;
				hitTop = null;
			}
		}
	}
	if (hitLeft!=null && hitTop!=null) {
		target.css({'left':hitLeft,'top':hitTop});
		if (hitTarget.dataset.id != 1) {
			$(hitTarget).css({'left':preLeft,'top':preTop})
		}
	} else{
		target.css({'left':preLeft,'top':preTop});
	}
	$(target).removeClass('click');
	$(document).off('mousemove',moveFn)
	$(document).off('mouseup',upFn);
}
function hit(obj1,obj2){	//pos1拖拽元素   pos2检测元素
	var pos1 = obj1.getBoundingClientRect();
    var pos2 = obj2.getBoundingClientRect();
    var pos2W = obj2.offsetWidth;
    var pos2H = obj2.offsetHeight;
    return pos1.right > (pos2.left + pos2W/2) && pos1.left < (pos2.right - pos2W/2) && pos1.bottom > (pos2.top + pos2H/2) && pos1.top < (pos2.bottom - pos2H/2);
}

//单击选中
appList.on('click',function(ev){
	var target = ev.target.closest('li');
	$('.appItem').removeClass('selected');
	$(target).addClass('selected');
	if ($(target).is('.appItem')) {
		ev.stopPropagation();
	}
})

//双击出现弹框
appList.on('dblclick',function(ev){
	var target = ev.target.closest('li');
	if ($(target).attr('diaonoff')==='false') {
		$(target).attr('diaonoff',true);
		$.dialog({
			title:target.dataset.name,
			content:"<h2>暂无功能</h2>",
			ico:$(target).find('img').attr('src'),
			closeBack(){
				$(target).attr('diaonoff',false);
			}
		});
	}
	
})

//-------------------------------todoapp 任务列表----------------------

$('.todoapp').attr('onoff',true);
$('.todoapp').css({'left':document.documentElement.clientWidth ,'top':20});
$('.todoapp').on('mouseenter',function(){
	if ($('.todoapp').attr('onoff')==='true') {
		$(this).animate({'left':document.documentElement.clientWidth - this.offsetWidth},300,function(){
			$('.todoTip').fadeOut();
		});
	}
})
$('.todoapp').on('mouseleave',function(){
	if ($('.todoapp').attr('onoff')==='true') {
		$(this).animate({'left':document.documentElement.clientWidth},300,function(){
			$('.todoTip').fadeIn();
		});
	}
})
$.drag({
	targetEle:$('.todoapp .header h1'),
	moveEle:$('.todoapp'),
	upGo:function(){	//up时候没有发生边界发生的事情
		$('.todoapp').attr('onoff',false);
	},
	upBack:function(){		//up的时候接触到边界
		$('.todoapp').attr('onoff',true);
	}
});

//-------------------------------右键--------------------------------

$(document).on('contextmenu',function(ev){
	if(ev.which != 3) return;
	var menu = $('.context_menu');
	menu.show();
	menu.css({'left':ev.clientX,'top':ev.clientY})
	return false;
})

//------------------------------document点击---------------------

$(document).on('click',function(ev){
	var target = $(ev.target).closest('li')[0];
	switch(target){
		case $('.menu_list .menu2 li')[0]:			//大图标
			$('.appList li').addClass('big_icon');
			break;
		case $('.menu_list .menu2 li')[1]:			//小图标
			$('.appList li').removeClass('big_icon');
			break;
		case $('.menu_list>li')[2]:					//刷新
			window.location.reload() 
			break;
		case $('.menu_list>li')[3]:				//新建文件夹
			fileData.push(
				{
					name:dataFn.fileNum(fileData),
					ico:"ico/file.png",
					id:Math.random(),
					url:"weiyun.html",
					diaOnoff:false
				});
			appHtml(fileData);
			appPos();
			break;
			
	}
	$('.win_box').removeClass('win_hide');
	$('.context_menu').hide();
	$('.calendar').removeClass('show');
	$('.appItem').removeClass('selected');
})

//------------------------------------时间------------------------

function getTime(){
	var time = new Date();
	$('.time').text(time.getHours()+':'+time.getMinutes()+':'+time.getSeconds());
	$('.date').text(time.getFullYear()+' / '+time.getMonth()+' / '+time.getDate())
}
getTime();
setInterval(function(){
	getTime();
},1000)
$('.time_box').on('click',function(e){
	$('.calendar').toggleClass('show');
	e.stopPropagation();
})