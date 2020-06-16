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

export { DragSortableView, AutoDragSortableView }
```

### Performance（GIF）

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

##### AutoDragSortableView、DragSortableView

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
- **maxScale**: PropTypes.number;
- **minOpacity**: PropTypes.number;

##### The following attributes belong only to AutoDragSortableView

- **scaleDuration**: PropTypes.number;
- **slideDuration**: PropTypes.number;
- **autoThrottle**: PropTypes.number; 
- **autoThrottleDuration**: PropTypes.number;
- **renderHeaderView**: PropTypes.element,
- **headerViewHeight**: PropTypes.number,
- **renderBottomView**: PropTypes.element,
- **bottomViewHeight**: PropTypes.number,

### Example

``` react
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

```

