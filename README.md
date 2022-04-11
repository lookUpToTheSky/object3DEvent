# 基于three.js的事件插件

### 安装：
`npm install object3d-events --save`

### 引入：
`import Event from 'object3d-events'`

### 使用：
```
    //初始化事件对象，参数(element事件元素，scene场景实例， camera 摄像机实例)
    const objEvent = new Event(element, scene, camera);

    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry( 10, 10, 10 ),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )

    //点击事件
    mesh.on('click', obj => {
        obj.material.color.set( 0x00ffff );
    })
    //双击事件
    mesh.on('dblclick', obj => {
        obj.material.color.set( 0x00ffff );
    })
    //鼠标按下事件
    mesh.on('mousedown', obj => {
        obj.material.color.set( 0x00ffff );
    })
    //鼠标松开事件
    mesh.on('mouseup', obj => {
        obj.material.color.set( 0x00ffff );
    })
    //鼠标hover事件
    mesh.on('hover', obj => {
        obj.material.color.set( 0x00ffff );
    }, obj => {
        obj.material.color.set( 0xff0000 );
    })

    //移除点击事件
    mesh.off('click');
    //移除所有事件
    mesh.offAll();
    
    //事件元素大小变化，需要重置事件对象：
    element.oresize = () => {
        objEvent.resize();  
    }
```
