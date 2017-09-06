
function init(){

	$(document).ready(function(){
//定义全局变量 map
var map;
	var m={
		initCenter:[116.397428, 39.90923],
		panel_toggle:ko.observable(false),
		jump:false,
		panel:$('#panel'),
		menu_btn:$('#menu_btn'),
		list:$('#list li'),
		header_title_width:$('#header_title').width()+40, 
		markers:[],
		infowindows:[],
		transform_width:ko.observable(0),
		locations:[
			{
				name:'天安门',
				position:[116.397391,39.908743]
			},
			{
				name:'故宫博物院',
				position:[116.396919,39.917959]
			},
			{
				name:'汉庭酒店',
				position:[116.403227,39.911376]
			},
			{
				name:'医院',
				position:[116.403914,39.920362]
			},
			{
				name:'王府井百货',
				position:[116.409922,39.91345]
			}
		],
		mapMarker:function(index){
			//点击列表项 对应的marker跳动

			for(let i=0;i<m.markers.length;i++){
				if(i===index){
						m.markers[i].setAnimation('AMAP_ANIMATION_BOUNCE');
				}
				else{
					m.markers[i].setAnimation('AMAP_ANIMATION_NONE');
				}
			}
		}
	};

	var v={
		
	};

	var vm={
		self:this,
		initMap:function(){
			//TODO 初始化地图 控件
			//创建地图实例
			map = new AMap.Map('map', {
				resizeEnable: true,
				zoom:11,
				center: m.initCenter,
				mapStyle:'amap://styles/04736ff583c7a006b6300e746254d625'  
			});

			//添加控件
			AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],function(){
				 map.addControl(new AMap.ToolBar({position:'RT',autoPosition:false}));
				
			});
			AMapUI.loadUI(['control/BasicControl'],function(BasicControl){
				 map.addControl(new BasicControl.LayerSwitcher({position: 'rb'}));
			});
			//初始化markers 和infowindows
			for(let i=0;i<m.locations.length;i++){
				vm.setMarker(m.locations[i].position,m.locations[i].name);
				vm.setInfowindow(m.locations[i].name);
			}

			//初始化marker 和事件添加
			for(let i=0;i<m.locations.length;i++){
				  AMap.event.addListener(m.markers[i], 'click', function() {
            		m.infowindows[i].open(map, m.markers[i].getPosition());
            		//为标记添加点击动画
            		if(m.jump){
            			m.markers[i].setAnimation('AMAP_ANIMATION_NONE');
            		}
            		else{
            			m.markers[i].setAnimation('AMAP_ANIMATION_BOUNCE');
            		}
            		m.jump=!m.jump;
       			});
			}
		},
		initMain:function(){
			//TODO 初始化函数
			ko.applyBindings(m);
			vm.initMap();
			vm.eventAdd();
			

		},
		eventAdd:function(){
			//TODO DOM事件添加
			m.menu_btn.bind('click',function(){
				vm.panel_animation();
			});

		},
		setMarker:function(position,title){
			//TODO 设置marker并存入marker数组
			var marker=new AMap.Marker({
				position:position,
				title:title,
				map:map,
				animation:'AMAP_ANIMATION_DROP',
				offset:{x:-10,y:0}
			});
			m.markers.push(marker);
		},
		getMarker:function(index){
			//TODO 在markers数组取marker
			return m.markers[index];

		},
		setInfowindow:function(info){
			//TODO 设置infowindow 并存入infowindows数组
			var infowindow=new AMap.InfoWindow({
				content:info
			});
			m.infowindows.push(infowindow);
		},
		getInfowindow:function(index){
			//TODO 从infowindows中取infowindow
			return m.infowindows[index];
		},
		panel_animation:function(){
			//TODO 	修改transform_width 实现panel动画
			m.panel_toggle?m.transform_width(-m.header_title_width):m.transform_width(0);
			m.panel_toggle=!m.panel_toggle;	
		},
		getInfoFromWiki:function(location){
			//TODO 第三方API获取地点相关数据
		}

	};

	vm.initMain();
	map.setFitView();

});

	




}

