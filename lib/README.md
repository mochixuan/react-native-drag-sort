# react-native-drag-sort
Drag and drop sort control for react-native

![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)
[![npm](https://img.shields.io/npm/v/react-native-drag-sort.svg?style=flat)](https://npmjs.com/package/react-native-drag-sort)

### Version Iteration
- [English Version Iteration](https://github.com/mochixuan/react-native-drag-sort/blob/master/README_History.md) 
- [中文版本迭代](https://github.com/mochixuan/react-native-drag-sort/blob/master/README_ZH_History.md)


### Installation

```bash
yarn add react-native-drag-sort
or
npm i react-native-drag-sort --save 

export { DragSortableView, AutoDragSortableView, AnySizeDragSortableView }
```

### Tip

> Use priority: DragSortableView > AutoDragSortableView > AnySizeDragSortableView

- 1、If the width and height are fixed and there is no need to slide, use DragSortableView.
- 2、If the width and height are fixed and you need to slide, use AutoDragSortableView.
- 3、If the width and height are arbitrary and need to slide, please use AnySizeDragSortableView.

### Performance（GIF）

[AnyThreePage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/AnyThreePage.js) | [AnyThreePage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/AnyThreePage.js)
| ------ | ----------- | 
![Anysize](https://github.com/mochixuan/react-native-drag-sort/blob/master/img/any1.gif?raw=true) | ![Anysize](https://github.com/mochixuan/react-native-drag-sort/blob/master/img/any2.gif?raw=true)

[AutomaticSlidingOnePage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/AutomaticSlidingOnePage.js) | [AutomaticSlidingThreePage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/AutomaticSlidingThreePage.js)
| ------ | ----------- | 
| ![](https://user-gold-cdn.xitu.io/2020/2/15/170487f5ce137e15?w=240&h=514&f=gif&s=2527386) | ![](https://user-gold-cdn.xitu.io/2020/2/15/1704896e0729f8b7?w=240&h=514&f=gif&s=4958289) 

[ScrollFixedAddPage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/ScrollFixedAddPage.js) | [DragDeletePage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/DragDeletePage.js)  
| ------ | ----------- |
| ![](https://user-gold-cdn.xitu.io/2020/2/10/1702ea81299f097d?w=240&h=400&f=gif&s=863218)  | ![dragdelete.gif](https://upload-images.jianshu.io/upload_images/2646598-4d22ddb8f92a6563.gif?imageMogr2/auto-orient/strip)  


[SortAndFixedPage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/SortAndFixedPage.js)  | [OneRowsPage](https://github.com/mochixuan/react-native-drag-sort/blob/master/Example/app/container/OneRowsPage.js)  
| ------ | ----------- | 
| ![ezgif.com-resize.gif](https://upload-images.jianshu.io/upload_images/2646598-405b01d61547c972.gif?imageMogr2/auto-orient/strip)  | ![one-line.gif](https://upload-images.jianshu.io/upload_images/2646598-dd17c76291514316.gif?imageMogr2/auto-orient/strip)  

### API

#### AutoDragSortableView、DragSortableView

isRequired if there is a * in the name field

|name|Proptypes|Description|
----|----|-----|
|**dataSource** *|array|
|**parentWidth**|number|parent width
|**childrenHeight** *|number|Each item height
|**childrenWidth** *|number|Each item width
|**marginChildrenTop**|number|So the item's outermost view adds margin, you can only use this method.
|**marginChildrenBottom**|number
|**marginChildrenLeft**|number
|**marginChildrenRight**|number
|**sortable**|bool|Do not allow dragging
|**onClickItem**|func|click
|**onDragStart**|func
|**onDragEnd**|func
|**onDataChange**|func|This method is called every time the data changes.
|**renderItem** *|func|render item view
|**fixedItems**|array|no remove
|**keyExtractor**|func|(item,index) => key
|**delayLongPress**|number
|**isDragFreely**|bool|Whether to limit the drag space
|**onDragging**|func
|**maxScale**|number
|**minOpacity**|number

#### The following attributes belong only to AutoDragSortableView

|name|Proptypes|Description|
----|----|-----|
|**scaleDuration**|number
|**slideDuration**|number
|**autoThrottle**|number
|**autoThrottleDuration**|number
|**renderHeaderView**|element
|**headerViewHeight**|number
|**scrollIndicatorInsets**|({top:number, left:number, bottom:number, right:number})|
|**renderBottomView**|element
|**bottomViewHeight**|number
|**onScrollListener** | (event: NativeSyntheticEvent<NativeScrollEvent>) => void 
|**onScrollRef** | (ref: any) => void

##### AnySizeDragSortableView

|name|Proptypes|Description|
----|----|-----|
|**dataSource** *|array|
|**keyExtractor**|func.isRequired|(item,index) => key
|**renderItem** *|func|render item view
|**onDataChange**|func|This method is called every time the data changes.
|**renderHeaderView**|element
|**headerViewHeight**|number
|**renderBottomView**|element
|**bottomViewHeight**|number
|**autoThrottle**|number
|**autoThrottleDuration**|number
|**onDragEnd**|func
|**scrollIndicatorInsets**|({top:number, left:number, bottom:number, right:number})|
|**onScrollListener** | (event: NativeSyntheticEvent<NativeScrollEvent>) => void 
|**onScrollRef** | (ref: any) => void
|**areaOverlapRatio**|number| Must be greater than 0.5
|**movedWrapStyle**| StyleProp<ViewStyle> |style
|**childMarginTop**|number
|**childMarginBottom**|number
|**childMarginLeft**|number
|**childMarginRight**|number

### Example

```jsx
<DragSortableView
    dataSource={this.state.data}
    parentWidth={parentWidth}
    childrenWidth= {childrenWidth}
    childrenHeight={childrenHeight}
    keyExtractor={(item,index)=> item.id}
    renderItem={(item,index)=>{
        return this.renderItem(item,index)
    }}
/>
    
<AutoDragSortableView
    dataSource={this.state.data}
    parentWidth={parentWidth}
    childrenWidth= {childrenWidth}
    childrenHeight={childrenHeight}
    keyExtractor={(item,index)=> item.id}
    renderItem={(item,index)=>{
        return this.renderItem(item,index)
    }}
/>

// ====== AnySizeDragSortableView start =======

constructor(props) {
    super(props);
    this.sortableViewRef = createRef()
}

<AnySizeDragSortableView
    ref={this.sortableViewRef}
    dataSource={items}
    keyExtractor={(item) => item.text} // 1、isRequired
    renderItem={this._renderItem}
    onDataChange={(data, callback)=> {
        this.setState({items: data},()=>{
            callback() // isRequired
        })
    }}
/>

_renderItem = (item, index, isMoved) => {
    return (
    	<TouchableOpacity
	        onLongPress={() => {
	            this.sortableViewRef.current.startTouch(item, index) // 2、isRequired	        }}
	        onPressOut = {() => {
	        	this.sortableViewRef.current.onPressOut() 3、isRequired
	        }}
	      >
      	<...>
      </TouchableOpacity>
    )
}


// ====== AnySizeDragSortableView end =======
```
