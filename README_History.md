# react-native-drag-sort
Drag and drop sort control for react-native

![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)
[![npm](https://img.shields.io/npm/v/react-native-drag-sort.svg?style=flat)](https://npmjs.com/package/react-native-drag-sort)

### Language 
- [English](https://github.com/mochixuan/react-native-drag-sort/blob/master/README.md) 
- [中文](https://github.com/mochixuan/react-native-drag-sort/blob/master/README_ZH.md)

### Installation

```bash
yarn add react-native-drag-sort
or
npm i react-native-drag-sort --save 

export { DragSortableView, AutoDragSortableView }
```

### important hint
1. [Download Android example](https://fir.im/dragsort)
2. You must write the attribute keyExtractor = {(item, index) => item.id} id is the unique identification of your data, there is no index to replace item.id.
3. If Android Debug mode is compared to the card. Please package and install and test, release will not get stuck. Or test animation is very smooth under iOS.

#### 2020.2 New Demo Fixed Add Button Demo

[ScrollFixedAddPage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/ScrollFixedAddPage.js)

![](https://user-gold-cdn.xitu.io/2020/2/10/1702ea81299f097d?w=240&h=400&f=gif&s=863218)

#### 2020.2 Removed componentWillReceiveProps / componentWillMount method
> Using Fiber after React 16.3, React rendering has become asynchronous rendering. For details, please Google React Fiber.

- React <16.3 Please quote react-native-drag-sort@2.0.1
- React> 16.3 Please quote react-native-drag-sort@ latest

### Update Progress

#### 2020.1 Added auto swipe function

##### If you do not need the auto-sliding function to use or are not satisfied with the Android effect, you can temporarily use DragSortableView (stable, reliable, long-term no-issus bug), if you want to use auto-sliding please use AutoDragSortableView。

##### The auto slide function is complete. iOS implements smooth auto-sliding. Android implements sliding an Item at a fixed time. After Android calls scrollTo, the refresh is relatively slow, causing jitter, so using a fixed time to slide 1 Item, this compromise method. You can also pass parameters: autoThrottle (sliding distance per unit time), autoThrottleDuration (time to slide a distance regularly)。
1. It is recommended to use Demo settings: Android automatically slides an item height every 400ms, and iOS automatically slides 2 every 10ms.
2. If you want to achieve the same effect as Android and iOS, you can configure autoThrottle = {2}, autoThrottleDuration = {10}
3. There will be time to optimize in the later period: trigger sliding condition optimization, Android jitter optimization when sliding.

[AutomaticSlidingOnePage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/AutomaticSlidingOnePage.js)

![](https://user-gold-cdn.xitu.io/2020/1/31/16ff953e160a4a8c?w=240&h=514&f=gif&s=3394945)

[AutomaticSlidingThreePage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/AutomaticSlidingThreePage.js)

![](https://user-gold-cdn.xitu.io/2020/1/31/16ff9538f47c623a?w=240&h=514&f=gif&s=4241359)

#### 2019.10
> Add a new scene based on user needs.

- Add attribute (isDragFreely): Whether to limit the drag space.
- Add property callback function (onDragging)
- Add demo Demo: DragDeletePage

[DragDeletePage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/DragDeletePage.js)

![dragdelete.gif](https://upload-images.jianshu.io/upload_images/2646598-4d22ddb8f92a6563.gif?imageMogr2/auto-orient/strip)

#### 2019.7 
> The 1.x version ends, the optimizations are optimized, and the problems that have occurred have been resolved. The 2.x version will be written next, and it is expected to add an auto-compatible ScrollView slide, slide delete function, and so on.

- Fix a small problem.
- Add a familiar keyExtractor:(item,index) => key to achieve performance optimization, similar to FlatList's keyExtractor, will not flash (repaint) when deleting Item.
- Add the delayLongPress property: press to the time of the trigger, customize how long to start

#### 2019.6 
> Added the top fixed function, you can set the start of several consecutive non-dragable functions, similar to today's headlines, this function is the same as today's headline drag and drop, you can compare

[SortAndFixedPage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/SortAndFixedPage.js)

![ezgif.com-resize.gif](https://upload-images.jianshu.io/upload_images/2646598-405b01d61547c972.gif?imageMogr2/auto-orient/strip)

#### 2019.3
> Add a single-line drag-and-drop demo. In fact, this function is consistent. This drag-and-drop plug-in is inherently adaptive. It will take time to optimize the ScrollView problem and make the control bring the ScrollView function。

[OneRowsPage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/OneRowsPage.js)

![one-line.gif](https://upload-images.jianshu.io/upload_images/2646598-dd17c76291514316.gif?imageMogr2/auto-orient/strip)

#### 2019.2: 
> Optimize drag and drop automatically when not moving, now this plugin should have no problems. Add a real-world demo example, and there will be time to animate this example. When deleting, the item goes down to the item animation to be selected, and the item to be selected is selected. And automatically slide down the animation when sliding。

[CommonSortPage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/CommonSortPage.js)

![demo.gif](https://upload-images.jianshu.io/upload_images/2646598-bd118152420cc0a9.gif?imageMogr2/auto-orient/strip)

### Performance

[ScrollPage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/ScrollPage.js)

![Demonstration.gif](https://upload-images.jianshu.io/upload_images/2646598-f3ece6209cb07e43.gif?imageMogr2/auto-orient/strip)

### Example
- [ScrollView](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/ScrollPage.js)
- [View](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/NonScrollPage.js)
- [Fixed Rows](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/FixedRowsPage.js)

```jsx
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
    keyExtractor={(item,index)=> item.id}
    onClickItem={(data,item,index)=>{}}
    renderItem={(item,index)=>{
        return this.renderItem(item,index)
    }}/>
```

### API

isRequired if there is a * in the name field

|name|Proptypes|Description|
----|----|-----|
**dataSource** *|array
**parentWidth**|number|parent width
**childrenHeight** *|number|Each item height
**childrenWidth** *|number|Each item width
**marginChildrenTop**|number|So the item's outermost view adds margin, you can only use this method.
**marginChildrenBottom**|number
**marginChildrenLeft**|number
**marginChildrenRight**|number
**sortable**|bool|Do not allow dragging
**onClickItem**|func|click
**onDragStart**|func
**onDragEnd**|func
**onDataChange**|func|This method is called every time the data changes.
**renderItem** *|func|render item view
**fixedItems**|array|no remove
**keyExtractor**|func|(item,index) => key
**delayLongPress**|number
**isDragFreely**|bool|Whether to limit the drag space
**onDragging**|func
**maxScale**|number
**minOpacity**|number
**scaleDuration**|number
**slideDuration**|number
**autoThrottle**|number
**autoThrottleDuration**|number