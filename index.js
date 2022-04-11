import {
    Raycaster,
    Vector2,
    Object3D
} from 'three'

var eventList = [], 
    lastObj = null, 
    lastTarget = null;

class Event {
    constructor(element, scene, camera) {
        if ( element === undefined ) {
            console.error( 'Three parameters are required' ); 
            return;
        }
        if ( scene === undefined ) {
            console.error( 'Three parameters are required' ); 
            return;
        }
        if ( camera === undefined ) {
            console.error( 'Three parameters are required' ); 
            return;
        }
        this.element = element
        this.width = element.clientWidth
        this.height = element.clientHeight
        this.camera = camera
        this.scene = scene
        this.raycaster  = new Raycaster()
        this.mouse = new Vector2()
        Object3D.prototype.on = this.object3DEvent
        Object3D.prototype.off = this.removeEvent
        Object3D.prototype.offAll = this.removeAll

        element.addEventListener( 'mousedown', this.mouseEvent.bind(this, 'mousedown'), false );

        element.addEventListener( 'mouseup', this.mouseEvent.bind(this, 'mouseup'), false );

        element.addEventListener( 'click', this.mouseEvent.bind(this, 'click'), false );

        element.addEventListener( 'dblclick', this.mouseEvent.bind(this, 'dblclick'), false );

        element.addEventListener( 'mousemove', this.mouseHover.bind(this), false );
    }

    //设置事件对象
    object3DEvent(type, callBack, callBack1) {
        eventList.push({ type, callBack, callBack1, object: this})
    }
    // 移除object3D对象事件
    removeEvent(type) {
        let index = null
        eventList.forEach((ele, i) => {
           if( ele.type === type && this.uuid === ele.object.uuid ) {
                index = i
           }
        })
        if(index !== null) {
            eventList.splice(index, 1)
        }else{
            console.warn("There is no method called '" + type + "';");
        }
    }
    // 移除object3D对象的所有事件
    removeAll() {
        eventList = eventList.filter( ele => this.uuid === ele.object.uuid )
    }

    //鼠标事件
    mouseEvent(clickType) {
		event.preventDefault();
        const mousedownList = eventList.filter(item => item.type === clickType)
        if(mousedownList.length === 0) return;

        this.mouse.x = (event.clientX / this.width) * 2 - 1;
        this.mouse.y = - (event.clientY / this.height) * 2 + 1;
        // const list = eventList.map(item => item.object)
        const list = this.scene.children

        // 通过摄像机和鼠标位置更新射线
        this.raycaster.setFromCamera( this.mouse, this.camera );
        // 计算物体和射线的焦点
        var intersects = this.raycaster.intersectObjects( list, true );

        if(intersects.length > 0) {
            const target = intersects[0].object
            const obj = this.getEventObj( target, mousedownList)

            if( !!obj && obj.type === clickType) {

                obj.callBack(obj.object, target)

            }
        }
    }
    //hover事件
    mouseHover() {
		event.preventDefault();
        const mouseHoverList = eventList.filter(item => item.type === 'hover')
        this.mouse.x = (event.clientX / this.width) * 2 - 1;
        this.mouse.y = - (event.clientY / this.height) * 2 + 1;

        if(mouseHoverList.length === 0) return;

        // const list = eventList.map(item => item.object)
        const list = this.scene.children

        // 通过摄像机和鼠标位置更新射线
        this.raycaster.setFromCamera( this.mouse, this.camera );

        // 计算物体和射线的焦点
        var intersects = this.raycaster.intersectObjects( list, true);
        
        if(intersects.length > 0) {
            const target = intersects[0].object
            const active = this.getEventObj(target, mouseHoverList)

            if( !!active && active.type === 'hover' ) {
                if( lastObj === null || lastObj.object.uuid !== active.object.uuid ) {
                    if(lastObj !== null && lastObj.callBack1 !== undefined) lastObj.callBack1(lastObj.object, lastTarget)
                    lastObj = active
                    lastTarget = target
                    active.callBack(active.object, target)

                }else if(lastObj.object.uuid !== active.object.uuid){
                    if(lastObj.callBack1 !== undefined) lastObj.callBack1(lastObj.object, lastTarget)
                }
            }else if( lastObj !== null ){
                if(lastObj.callBack1 !== undefined) lastObj.callBack1(lastObj.object, lastTarget)
                lastObj = null 
            }
        }else if( lastObj !== null ) {

            if(lastObj.callBack1 !== undefined) lastObj.callBack1(lastObj.object, lastTarget)

            lastObj = null
        }
    }
    // 获取事件对象
    getEventObj(target, list) {
        const uuid = [ target.uuid ]

        target.traverseAncestors(parent => {
           if(!parent.isScene) uuid.push(parent.uuid)
        })

        const object = list.find(item => uuid.includes(item.object.uuid))

        return object
    }

    // 重置事件元素长宽
    resize() {
        this.width = this.element.clientWidth
        this.height = this.element.clientHeight  
    }

    // 清空
    clear() {
        eventList = []
        lastObj = null
        lastTarget = null
    }
}

export default Event