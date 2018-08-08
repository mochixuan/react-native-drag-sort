# react-native-drag-sort
Drag and drop sort control for react-native


![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)
[![npm](https://img.shields.io/npm/v/react-native-drag-sort.svg?style=flat)](https://npmjs.com/package/react-native-drag-sort)

### Performance

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



