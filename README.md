# react-native-drag-sort
Drag and drop sort control for react-native

![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)
[![npm](https://img.shields.io/npm/v/react-native-drag-sort.svg?style=flat)](https://npmjs.com/package/react-native-drag-sort)

### Language
- [English](https://github.com/mochixuan/react-native-drag-sort/blob/master/README.md) 
- [中文](https://github.com/mochixuan/react-native-drag-sort/blob/master/README_ZH.md)

### [Download Android example](https://fir.im/dragsort)

### Update Progress

#### 2019.10
> Add a new scene based on user needs.

- Add attribute (isDragFreely): Whether to limit the drag space.
- Add property callback function (onDragging)
- Add demo Demo: DragDeletePage

![dragdelete.gif](https://upload-images.jianshu.io/upload_images/2646598-4d22ddb8f92a6563.gif?imageMogr2/auto-orient/strip)

#### 2019.7 
> The 1.x version ends, the optimizations are optimized, and the problems that have occurred have been resolved. The 2.x version will be written next, and it is expected to add an auto-compatible ScrollView slide, slide delete function, and so on.

- Fix a small problem.
- Add a familiar keyExtractor:(item,index) => key to achieve performance optimization, similar to FlatList's keyExtractor, will not flash (repaint) when deleting Item.
- Add the delayLongPress property: press to the time of the trigger, customize how long to start

#### 2019.6 
> Added the top fixed function, you can set the start of several consecutive non-dragable functions, similar to today's headlines, this function is the same as today's headline drag and drop, you can compare

![ezgif.com-resize.gif](https://upload-images.jianshu.io/upload_images/2646598-405b01d61547c972.gif?imageMogr2/auto-orient/strip)

#### 2019.3
> Add a single-line drag-and-drop demo. In fact, this function is consistent. This drag-and-drop plug-in is inherently adaptive. It will take time to optimize the ScrollView problem and make the control bring the ScrollView function。

![one-line.gif](https://upload-images.jianshu.io/upload_images/2646598-dd17c76291514316.gif?imageMogr2/auto-orient/strip)

#### 2019.2: 
> Optimize drag and drop automatically when not moving, now this plugin should have no problems. Add a real-world demo example, and there will be time to animate this example. When deleting, the item goes down to the item animation to be selected, and the item to be selected is selected. And automatically slide down the animation when sliding。

![demo.gif](https://upload-images.jianshu.io/upload_images/2646598-bd118152420cc0a9.gif?imageMogr2/auto-orient/strip)

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
- **delayLongPress**: PropTypes.number
- **isDragFreely**: PropTypes.bool, // Whether to limit the drag space
- **onDragging**: PropTypes.func
- **maxScale**: PropTypes.number;
- **minOpacity**: PropTypes.number;
- **scaleDuration**: PropTypes.number;
- **slideDuration**: PropTypes.number;