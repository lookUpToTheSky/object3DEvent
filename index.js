import {
    Raycaster,
    Vector2,
    Object3D
} from 'three'

var eventList = [], 
    lastObj = null, 
    lastTarget = null;

class Event {
    constructor(element, camera) {
        if ( element === undefined ) {
            console.error( 'Parameter element cannot be empty' ); 
            return;
        }
        if ( camera === undefined ) {
            console.error( 'Parameter camera cannot be empty' ); 
            return;
        }
        this.element = element
        this.width = element.clientWidth
        this.height = element.clientHeight
        this.camera = camera
        this.raycaster  = new Raycaster()
        this.mouse = new Vector2()
        Object3D.prototype.on = this.object3DEvent
        Object3D.prototype.off = this.removeEvent

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
    // 移除事件对象
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
    //鼠标事件
    mouseEvent(clickType) {
		event.preventDefault();
        const mousedownList = eventList.filter(item => item.type === clickType)
        if(mousedownList.length === 0) return;

        this.mouse.x = (event.clientX / this.width) * 2 - 1;
        this.mouse.y = - (event.clientY / this.height) * 2 + 1;

        const list = mousedownList.map(item => item.object)

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

        const list = mouseHoverList.map(item => item.object)

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

    // 移除所有事件
    removeAll() {
        eventList = []
        lastObj = null
        lastTarget = null
        
        this.element.removeEventListener( 'mousedown', this.mouseEvent, false );

        this.element.removeEventListener( 'mouseup', this.mouseEvent, false );

        this.element.removeEventListener( 'click', this.mouseEvent, false );

        this.element.removeEventListener( 'dblclick', this.mouseEvent, false );

        this.element.removeEventListener( 'mousemove', this.hoverFun, false );
    }
}

export default Event