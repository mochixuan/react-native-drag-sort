# react-native-drag-sort
Drag and drop sort control for react-native

![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)
[![npm](https://img.shields.io/npm/v/react-native-drag-sort.svg?style=flat)](https://npmjs.com/package/react-native-drag-sort)

### Language
- [English](https://github.com/mochixuan/react-native-drag-sort/blob/master/README.md) 
- [中文](https://github.com/mochixuan/react-native-drag-sort/blob/master/README_ZH.md)

### [Android版演示地址](https://fir.im/dragsort)

#### 2019.10
> 根据网友需求添加一个新的场景。

- 添加属性(isDragFreely): 是否限制拖动空间。
- 添加属性移动时回调函数(onDragging)
- 添加演示Demo: DragDeletePage 

![dragdelete.gif](https://upload-images.jianshu.io/upload_images/2646598-4d22ddb8f92a6563.gif?imageMogr2/auto-orient/strip)

#### 2019.7 
> 1.x版本结束，该优化的都优化，而且出现的问题都已经解决。接下来将编写2.x版本，预计添加自动兼容ScrollView滑动、滑动删除功能等。

- 修复一个小问题。
- 添加一个熟悉keyExtractor:(item,index) => key 实现性能优化，类似FlatList的keyExtractor，当删除Item时不会再闪烁(重绘)。
- 添加delayLongPress属性:按下到触发的时间，自定义长按多久出发

#### 2019.6 
> 新增顶部固定功能，可以设置开始连续几个为不可拖动功能，类似今日头条一样，该功能和今日头条拖拽一样，可以去对比一下。

![ezgif.com-resize.gif](https://upload-images.jianshu.io/upload_images/2646598-405b01d61547c972.gif?imageMogr2/auto-orient/strip)

#### 2019.3: 
> 新增单行拖拽演示，其实这个功能一致，这个拖拽插件本来就是自适应行,有时间会整体优化下ScrollView问题，使控件自带ScrollView功能。

![one-line.gif](https://upload-images.jianshu.io/upload_images/2646598-dd17c76291514316.gif?imageMogr2/auto-orient/strip)

#### 2019.2: 
> 优化拖拽不移动时自动恢复，现在这个插件应该没有任何问题。新加一个实战演示例子，后面有时间会对这个例子进行加动画，删除时item向下到待选的item动画，和待选到item。还有滑动时自动向下滑动动画。

![ezgif.com-video-to-gif.gif](https://upload-images.jianshu.io/upload_images/2646598-bd118152420cc0a9.gif?imageMogr2/auto-orient/strip)

----

### Performance
![Demonstration.gif](https://upload-images.jianshu.io/upload_images/2646598-f3ece6209cb07e43.gif?imageMogr2/auto-orient/strip)

### Installation

```bash
yarn add react-native-drag-sort
or
npm i react-native-drag-sort --save 
```

### Example
- [ScrollView](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/ScrollPage.js)
- [View](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/NonScrollPage.js)
- [Fixed Rows](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/FixedRowsPage.js)

``` react
<DragSortableView
    dataSource={this.state.data}
    parentWidth={parentWidth}
    childrenWidth= {childrenWidth}
    childrenHeight={childrenHeight}
    marginChildrenTop={marginChildrenTop}
    onDataChange = {(data)=>{
        // delete or add data to refresh
        if (data.length != this.state.data.length) {
            this.setState({
                data: data
            })
        }
    }}
    onClickItem={(data,item,index)=>{}}
    renderItem={(item,index)=>{
        return this.renderItem(item,index)
    }}/>

```

### API
- **dataSource**: PropTypes.array.isRequired :
- **parentWidth**: PropTypes.number //parent width
- **childrenHeight**: PropTypes.number.isRequired, //Each item height
- **childrenWidth**: PropTypes.number.isRequired,//Each item width

- **marginChildrenTop**: PropTypes.number,  //So the item's outermost view adds margin, you can only use this method.
- **marginChildrenBottom**: PropTypes.number,
- **marginChildrenLeft** : PropTypes.number,
- **marginChildrenRight** : PropTypes.number,

- **sortable**: PropTypes.bool, //Do not allow dragging

- **onClickItem**: PropTypes.func, //click
- **onDragStart**: PropTypes.func, 
- **onDragEnd** : PropTypes.func,
- **onDataChange** : PropTypes.func, //This method is called every time the data changes.
- **renderItem** : PropTypes.func.isRequired, //render item view
- **fixedItems**:PropTypes.array //no remove
- **keyExtractor**: keyExtractor: PropTypes.func //(item,index) => key
- **delayLongPress**: PropTypes.number,
- **isDragFreely**: PropTypes.bool, // Whether to limit the drag space
- **onDragging**: PropTypes.func



