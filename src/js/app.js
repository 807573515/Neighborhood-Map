
function init(){

	$(document).ready(function(){
//定义全局变量 map
var map;

	var m={
		initCenter:[116.397428, 39.90923],
		panel_toggle:ko.observable(false),
		panel:$('#panel'),
		menu_btn:$('#menu_btn'),
		filter_btn:$('#filter_btn'),
		list:$('#list li'),
		header_title_width:$('#header_title').width()+40,
		markers:[],
		infowindows:[],
		transform_width:ko.observable(0),
		html:new Array(5),
		search:ko.observable(""),
		names:['天安门','故宫博物院','汉庭酒店','医院','王府井百货'],
		locations:[
			{
				name:'天安门',
				ENname:'tiananmen',
				position:[116.397391,39.908743]
			},
			{
				name:'故宫博物院',
				ENname:'Forbidden City',
				position:[116.396919,39.917959]
			},
			{
				name:'汉庭酒店',
				ENname:'Huazhu Hotels',
				position:[116.403227,39.911376]
			},
			{
				name:'医院',
				ENname:'Hospital',
				position:[116.403914,39.920362]
			},
			{
				name:'王府井百货',
				ENname:'Wangfujing Department Store',
				position:[116.409922,39.91345]
			}
		],
		mapMarker:function(name){
			//点击列表项 对应的marker跳动
			let index;
			//根据传进来的name计算index
			for(let i=0;i<m.names.length;i++){
				if(name===m.names[i]){
					index=i;
				}
			}
			for(let i=0;i<m.markers.length;i++){
				if(i===index){
						m.markers[i].setAnimation('AMAP_ANIMATION_BOUNCE');
						vm.setInfowindow(m.html[i]).open(map, m.markers[i].getPosition());
						setTimeout(function(){
								m.markers[i].setAnimation('AMAP_ANIMATION_NONE');
						},2400);
				}
				else{
					m.markers[i].setAnimation('AMAP_ANIMATION_NONE');
				}
			}
		}
	};
	m.filteredList=ko.computed(function(){
			if(!m.search()){
				return m.names;
			}
			else{
				return m.names.filter(function(name){
					return name.indexOf(m.search())!=-1;
				});
			}
			
		});
	m.filteredList.subscribe(function(){
				let index=[];
				let len=domLi.length;
				//获取需要显示的marker下标数组 index
				for(let i=0;i<len;i++){
					let showedName=m.filteredList()[i]; //获取筛选后需要显示的地点数组 用来计算index数组
					if(m.names.indexOf(showedName)!=-1){
						index.push(m.names.indexOf(showedName));
					}
				}
				console.log(index);
				//隐藏所有marker
				for(let i=0;i<m.markers.length;i++){
						m.markers[i].hide();
				}
				//显示正确的marker
				for(let i=0;i<index.length;i++){
					m.markers[index[i]].show();
				}
	});



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
			//初始化markers 
			for(let i=0;i<m.locations.length;i++){
				vm.setMarker(m.locations[i].position,m.locations[i].name,m.locations[i].ENname);
				vm.getWiki(m.locations[i].ENname);
				
			}
			//初始化marker 和事件添加
			for(let i=0;i<m.locations.length;i++){

				  AMap.event.addListener(m.markers[i], 'click', function() {
			            		vm.setInfowindow(m.html[i]).open(map, m.markers[i].getPosition());
			            		//为标记添加点击动画
			            		m.markers[i].setAnimation('AMAP_ANIMATION_BOUNCE'); 
			            		setTimeout(function(){
							m.markers[i].setAnimation('AMAP_ANIMATION_NONE');
						},2400);
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
			// m.filter_btn.bind('click',function(){
			// 	let index=[];
			// 	let domLi=$('#list li');
			// 	let len=domLi.length;
			// 	//获取需要显示的marker下标数组
			// 	for(let i=0;i<len;i++){
			// 		let html=domLi[i].innerHTML;
			// 		if(m.names.indexOf(html)!=-1){
			// 			index.push(m.names.indexOf(html));
			// 		}
			// 	}
			// 	//隐藏所有marker
			// 	for(let i=0;i<m.markers.length;i++){
			// 			m.markers[i].hide();
			// 	}
			// 	//显示正确的marker
			// 	for(let i=0;i<index.length;i++){
			// 		m.markers[index[i]].show();
			// 	}
				

				
			// });

		},
		setMarker:function(position,title,ENname){
			//TODO 设置marker并存入marker数组
			var marker=new AMap.Marker({
				position:position,
				title:title,
				map:map,
				animation:'AMAP_ANIMATION_DROP',
				offset:{x:-10,y:0},
				extData:ENname
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
			// m.infowindows.push(infowindow);
			return infowindow;
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
		},
		getWiki:function(location){
			//TODO 获取wiki数据
			var url='https://en.wikipedia.org/w/api.php?action=opensearch&search=';
			var requestUrl=url+location+'&prop=revisions&rvprop=content&format=json';
				$.ajax({
					url:requestUrl,
					dataType:'jsonp',
					method:'get'
				}).done(function(data){
					var html='<h1><a href='+data[3][0]+'>'+data[0]+'</a></h1>';
					html+='<p>'+data[2][0]+'</p>';
					switch(location){
						case 'tiananmen':m.html[0]=html;break;
						case 'Forbidden City':m.html[1]=html;break;
						case 'Huazhu Hotels':m.html[2]=html;break;
						case 'Hospital':m.html[3]=html;break;
						case 'Wangfujing Department Store':m.html[4]=html;break;
					}					
				}).fail(function(){
					alert('数据请求出错 请刷新试一下');
				});
		},
		filter:function(m){
			console.log(m);
			if(!m.search()){
				return names;
			}
			else{
				return names.filter(function(){
					return names.indexOf(m.search())!=-1;
				});
			}
		}

	};

	vm.initMain();
	map.setFitView();
	

});






}
