function addLoadEvent(func){
	var oldLoad = window.onload;
	if(typeof oldLoad != 'function'){
		window.onload = func();
	}else{
		window.onload = function(){
			oldLoad();
			func();
		}
	}
}
var untilEvent = {
	addEvent:function(element,type,hander){
		if(element.addEventListener){
			element.addEventListener(type,hander,false);
		}else if(element.attachEvent){
			element.attachEvent('on'+type,hander);
		}else{
			element['on'+type] = hander;
		}
	},
	getEvent:function(event){
		return event?event:window.event;
	},
	getTarget:function(event){
		return event.target||event.srcElement;
	},
	getRelated:function(event){
		if(event.relatedTarget){
			//兼容DOM的浏览器将相关元素保持在relatedTarget属性中
			return event.relatedTarget;
		}else if(event.toElement){
			//在IE浏览器中mouseout事件的相关元素保存在toElement属性中
			return event.toElement;
		}else if(event.fromElement){
			//在IE浏览器中mouseover事件的相关元素保持在fromElement属性中
			return event.fromElement;
		}else{
			return null;
		}
	}

};
//下面这四个元素用于表示四个定时器的标识，最开始我只使用两个定时器，当快速移动时
//动画会乱。
var timeDec1,timeAdd1,timeAdd2,timeDec2;
function getOuter(){
	var outerList1 = document.getElementById('outerList1');
	var outerList2 = document.getElementById('outerList2');
	var outer = document.getElementById('outer');
	untilEvent.addEvent(outer,'mouseover',callBackOver);
	untilEvent.addEvent(outerList1,'mouseout',callBackOut1);
	untilEvent.addEvent(outerList2,'mouseout',callBackOut2);
}
//mouseout事件：当鼠标从一个元素移入另一个元素时在鼠标离开的那个元素
//上触发，获得鼠标的元素可能在失去鼠标元素的外部也可能在失去鼠标元素的
//内部.所以需要判断mouseout事件的相关元素是否为外部li（即id为outerList或id为outerList2）元素
//的子孙元素，如果是子孙元素，则内部无序列表无须收起。
function callBackOut1(event){
	var event = untilEvent.getEvent(event);
	var relatedTarget = untilEvent.getRelated(event);
	var outerList1 = document.getElementById('outerList1');
	var inter1 = document.getElementById('inter1');
	var flag = false;
	if(relatedTarget !== null){
		var parented = relatedTarget.parentNode;
		do{
			if(parented === outerList1 || relatedTarget === outerList1){
				flag = true;
				break;
			}else{
				parented = parented.parentNode;
			}
		}while(parented !== null);
	}
	if(!flag){
		changeHeightDec1(inter1);
	}
}
function callBackOut2(event){
	var event = untilEvent.getEvent(event);
	var relatedTarget = untilEvent.getRelated(event);
	var outerList2 = document.getElementById('outerList2');
	var inter2 = document.getElementById('inter2');
	var flag = false;
	if(relatedTarget !== null){
		var parented = relatedTarget.parentNode;
		do{
			if(parented === outerList2 || relatedTarget === outerList2){
				flag = true;
				break;
			}else{
				parented = parented.parentNode;
			}
		}while(parented !== null);
	}
	if(!flag){
		changeHeightDec2(inter2);
	}
}
function changeHeightDec1(element){
	var offHeight = 70;
	clearTimeout(timeAdd1);
	change1();
	function change1(){
		var height = parseInt(element.style.height);
		if(height > 0){
			if(height%offHeight){
				//当鼠标快速移动，确保height能够被offheight整除
				//如果不能整除，内部ul的高度可能不能减小到零
				height = height-height%offHeight;
			}
			if(height >= offHeight){
			element.style.height = height - 50 +'px';
			}else{
				element.style.height = 0+'px';
			}
			timeDec1 = setTimeout(change1,10);
		}
	}
}
function changeHeightDec2(element){
	var offHeight = 70;
	//清除定时器，确保当快速移动鼠标时，动画的流畅性
	//例如：当鼠标移入后，在内部ul的长度还没有变为最大值时，又移除鼠标
	//清除定时器可以保证，鼠标移除后内部ul的长度立即减小。timeAdd2或的timeAdd1
	//是控制内部ul长度增加的定时器
	clearTimeout(timeAdd2);
	change2();
	function change2(){
		var height = parseInt(element.style.height);
		if(height > 0){
			if(height%offHeight){
				height = height-height%offHeight;
			}
			if(height >= offHeight){
			element.style.height = height - 50 +'px';
			}else{
				element.style.height = 0+'px';
			}
			timeDec2 = setTimeout(change2,10);
		}
	}
}
function callBackOver(event){
	var event = untilEvent.getEvent(event);
	var target = untilEvent.getTarget(event);
	var inter1 = document.getElementById('inter1');
	var inter2 = document.getElementById('inter2');
	console.log(target.id);
	if(target.id == 'outerList1' || target.id == "link1"){
		changeHeight(inter1,target);
	}
	if(target.id == 'outerList2' || target.id == 'link2'){
		changeHeight(inter2,target);
	}
}
function changeHeight(element,tar){
	var totalHeight = 200;
	if(tar.id == 'outerList1' || tar.id == 'link1'){
		//当鼠标移入时清除让内部ul长度减小的定时器，保证鼠标移入后
		//内部ul长度立即增加
		clearTimeout(timeDec1);
		change1();
	}
	function change1(){
		var height = parseInt(element.style.height);
		if(!height) height = 0;
		if(element.offsetHeight < 200){
		element.style.height = height + 10 +'px';
			timeAdd1 = setTimeout(change1,20);
			}
		}
	if(tar.id == 'outerList2' || tar.id == 'link2'){
		clearTimeout(timeDec2);
		change2();
	}
	function change2(){
		var height = parseInt(element.style.height);
		if(!height) height = 0;
		if(element.offsetHeight < 200){
		element.style.height = height + 10 +'px';
			timeAdd2 = setTimeout(change2,20);
			}
		}
	
}
// 轮播的函数开始
//设置class为list的高度,因为图片的position为absolute所以.list元素的高度为零
//如果一个元素的父元素高度为0，那么设置这个元素的margin: auto 0; 不起作用
function setListHeight(){
	var list = document.getElementById('list');
	var imgItem = list.getElementsByTagName('img')[0];
	var height = imgItem.offsetHeight;
	var list = document.getElementById('list');
	list.style.height = height + 'px';
}
function setLiIndex(){
	var list = document.getElementById('list');
	var li = list.getElementsByTagName('li');
	var liLen = li.length;
	for(var i = 0;i<liLen;i++){
		li[i].style.zIndex = liLen-i;
	}
}
var index = 1;//index表示当前显示的页面,index是一个全局变量
var timer;
function btnClick(){
	var warp = document.getElementById('warp');
	untilEvent.addEvent(warp,'click',function(event){
		var event = untilEvent.getEvent(event);
		var target = untilEvent.getTarget(event);
		switch(target.id){
			case 'pre': if(index == 1){
					index =3;
				}else{
					--index;
				}
				anmitate();
				break;
			case 'next':if(index == 3){
				index = 1;
				}else{
					++index;
				}
				anmitate();
				break;
		}
	});
}
//减小图片透明度
function decline(cur,inverTime,inverOpacity){
	var opacityed = parseFloat(cur.style.opacity);
	if(opacityed > 0){
		cur.style.opacity = opacityed-inverOpacity;
		setTimeout(function(){
			decline(cur,inverTime,inverOpacity);
		},inverTime);
	}
}
//切换图片的函数
function anmitate(){
	var list = document.getElementById('list');
	var imgs = list.getElementsByTagName('img');
	var imgsLen = imgs.length;
	var whole = 300;//切换一张图片用的时间
	var inverTime = 5;//时间间隔
	var inverOpacity = 1/(whole/inverTime);
	for(var i = 0;i<imgsLen;i++){
		decline(imgs[i],inverTime,inverOpacity);
	}
	var go = function(){
		var opacityed = parseFloat(imgs[index - 1].style.opacity);
		if(opacityed < 1){
			imgs[index-1].style.opacity = opacityed + inverOpacity;
			setTimeout(go,inverTime);
		}
	};
	go();
}
//自动切换函数
function play() {
	timer = setTimeout(function () {
	if(index == 3){
			index = 1;
		}else{
			++index;
		}
		anmitate();
     	play();
     	// 
 }, 3000);
}
//停止切换函数,当鼠标点击了左箭头或者右箭头时会取消自动切换，当鼠标从箭头上移开，又开始自动切换
function stop() {
	clearTimeout(timer);
}
function getWarp(){
	var warp = document.getElementById('warp');
	untilEvent.addEvent(warp,"mouseout",play);
	untilEvent.addEvent(warp,"mouseover",stop);
}
//函数节流
function scrollEvent(){
	untilEvent.addEvent(window,"resize",function(){
		throttle(setListHeight);
	});
}
function throttle(method,context){
	clearTimeout(method.Tid);
	method.Tid = setTimeout(method,70);
}
// 轮播的函数结束
addLoadEvent(scrollEvent);
addLoadEvent(setListHeight);
addLoadEvent(setLiIndex);
addLoadEvent(btnClick);
addLoadEvent(play);
addLoadEvent(getWarp);
addLoadEvent(getOuter);