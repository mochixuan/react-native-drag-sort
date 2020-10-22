import React, {Component} from 'react'
import {Animated, Dimensions, Easing, PanResponder, StyleSheet, TouchableOpacity, View} from 'react-native'

const PropTypes = require('prop-types')
const {width} = Dimensions.get('window')

const defaultZIndex = 8
const touchZIndex = 99

export default class DragSortableView extends Component{

    constructor(props) {
        super(props)

        this.sortRefs = new Map()

        const itemWidth = props.childrenWidth+props.marginChildrenLeft+props.marginChildrenRight
        const itemHeight = props.childrenHeight+props.marginChildrenTop+props.marginChildrenBottom

        // this.reComplexDataSource(true,props) // react < 16.3
        // react > 16.3 Fiber
        const rowNum = parseInt(props.parentWidth/itemWidth);
        const dataSource = props.dataSource.map((item,index)=>{
            const newData = {}
            const left = (index%rowNum)*itemWidth
            const top = parseInt((index/rowNum))*itemHeight

            newData.data = item
            newData.originIndex = index
            newData.originLeft = left
            newData.originTop = top
            newData.position = new Animated.ValueXY({
                x: parseInt(left+0.5),
                y: parseInt(top+0.5),
            })
            newData.scaleValue = new Animated.Value(1)
            return newData
        });
        this.state = {
            dataSource: dataSource,
            curPropsDataSource: props.dataSource,
            height: Math.ceil(dataSource.length / rowNum) * itemHeight,
            itemWidth,
            itemHeight,
        };

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                this.isMovePanResponder = false
                return false
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => this.isMovePanResponder,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.isMovePanResponder,

            onPanResponderGrant: (evt, gestureState) => {},
            onPanResponderMove: (evt, gestureState) => this.moveTouch(evt,gestureState),
            onPanResponderRelease: (evt, gestureState) => this.endTouch(evt),

            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onShouldBlockNativeResponder: (evt, gestureState) => false,
        })
    }

    // react < 16.3
    // componentWillReceiveProps(nextProps) {
    //     if (this.props.dataSource != nextProps.dataSource) {
    //         this.reComplexDataSource(false,nextProps)
    //     }
    // }

    // react > 16.3 Fiber
    static getDerivedStateFromProps(nextprops, prevState) {
        const itemWidth = nextprops.childrenWidth + nextprops.marginChildrenLeft + nextprops.marginChildrenRight
        const itemHeight = nextprops.childrenHeight + nextprops.marginChildrenTop + nextprops.marginChildrenBottom
        if (nextprops.dataSource != prevState.curPropsDataSource || itemWidth !== prevState.itemWidth || itemHeight !== prevState.itemHeight) {
            
            const rowNum = parseInt(nextprops.parentWidth / itemWidth);
            const dataSource = nextprops.dataSource.map((item, index) => {
                const newData = {};
                const left = index % rowNum * itemWidth;
                const top = parseInt(index / rowNum) * itemHeight;

                newData.data = item;
                newData.originIndex = index;
                newData.originLeft = left;
                newData.originTop = top;
                newData.position = new Animated.ValueXY({
                    x: parseInt(left + 0.5),
                    y: parseInt(top + 0.5),
                });
                newData.scaleValue = new Animated.Value(1);
                return newData;
            });
            return {
                dataSource: dataSource,
                curPropsDataSource: nextprops.dataSource,
                height: Math.ceil(dataSource.length / rowNum) * itemHeight,
                itemWidth,
                itemHeight,
            }
        }
        return null;
    }

    startTouch(touchIndex) {

        //防止拖动
        const fixedItems = this.props.fixedItems;
        if (fixedItems.length > 0 && fixedItems.includes(touchIndex)){
            return;
        }

        this.isHasMove = false

        if (!this.props.sortable) return

        const key = this._getKey(touchIndex);
        if (this.sortRefs.has(key)) {
            if (this.props.onDragStart) {
                this.props.onDragStart(touchIndex)
            }
            Animated.timing(
                this.state.dataSource[touchIndex].scaleValue,
                {
                    toValue: this.props.maxScale,
                    duration: this.props.scaleDuration,
                    useNativeDriver: false,
                }
            ).start(()=>{
                this.touchCurItem = {
                    ref: this.sortRefs.get(key),
                    index: touchIndex,
                    originLeft: this.state.dataSource[touchIndex].originLeft,
                    originTop: this.state.dataSource[touchIndex].originTop,
                    moveToIndex: touchIndex,
                }
                this.isMovePanResponder = true
            })
        }
    }



    moveTouch (nativeEvent,gestureState) {

        this.isHasMove = true

        //if (this.isScaleRecovery) clearTimeout(this.isScaleRecovery)

        if (this.touchCurItem) {

            let dx = gestureState.dx
            let dy = gestureState.dy
            const itemWidth = this.state.itemWidth;
            const itemHeight = this.state.itemHeight;

            const rowNum = parseInt(this.props.parentWidth/itemWidth);
            const maxWidth = this.props.parentWidth-itemWidth
            const maxHeight = itemHeight*Math.ceil(this.state.dataSource.length/rowNum) - itemHeight

            // Is it free to drag
            if (!this.props.isDragFreely) {
                // Maximum or minimum after out of bounds
                if (this.touchCurItem.originLeft + dx < 0) {
                    dx = -this.touchCurItem.originLeft
                } else if (this.touchCurItem.originLeft + dx > maxWidth) {
                    dx = maxWidth - this.touchCurItem.originLeft
                }
                if (this.touchCurItem.originTop + dy < 0) {
                    dy = -this.touchCurItem.originTop
                } else if (this.touchCurItem.originTop + dy > maxHeight) {
                    dy = maxHeight - this.touchCurItem.originTop
                }
            }

            let left = this.touchCurItem.originLeft + dx
            let top = this.touchCurItem.originTop + dy

            this.touchCurItem.ref.setNativeProps({
                style: {
                    zIndex: touchZIndex,
                }
            })

            this.state.dataSource[this.touchCurItem.index].position.setValue({
                x: left,
                y: top,
            })

            let moveToIndex = 0
            let moveXNum = dx/itemWidth
            let moveYNum = dy/itemHeight
            if (moveXNum > 0) {
                moveXNum = parseInt(moveXNum+0.5)
            } else if (moveXNum < 0) {
                moveXNum = parseInt(moveXNum-0.5)
            }
            if (moveYNum > 0) {
                moveYNum = parseInt(moveYNum+0.5)
            } else if (moveYNum < 0) {
                moveYNum = parseInt(moveYNum-0.5)
            }

            moveToIndex = this.touchCurItem.index+moveXNum+moveYNum*rowNum

            if (moveToIndex > this.state.dataSource.length-1) {
                moveToIndex = this.state.dataSource.length-1
            } else if (moveToIndex < 0) {
                moveToIndex = 0;
            }

            if (this.props.onDragging) {
                this.props.onDragging(gestureState, left, top, moveToIndex)
            }

            if (this.touchCurItem.moveToIndex != moveToIndex ) {
                const fixedItems = this.props.fixedItems;
                if (fixedItems.length > 0 && fixedItems.includes(moveToIndex)) return;
                this.touchCurItem.moveToIndex = moveToIndex
                this.state.dataSource.forEach((item,index)=>{

                    let nextItem = null
                    if (index > this.touchCurItem.index && index <= moveToIndex) {
                        nextItem = this.state.dataSource[index-1]

                    } else if (index >= moveToIndex && index < this.touchCurItem.index) {
                        nextItem = this.state.dataSource[index+1]

                    } else if (index != this.touchCurItem.index &&
                        (item.position.x._value != item.originLeft ||
                            item.position.y._value != item.originTop)) {
                        nextItem = this.state.dataSource[index]

                    } else if ((this.touchCurItem.index-moveToIndex > 0 && moveToIndex == index+1) ||
                        (this.touchCurItem.index-moveToIndex < 0 && moveToIndex == index-1)) {
                        nextItem = this.state.dataSource[index]
                    }

                    if (nextItem != null) {
                        Animated.timing(
                            item.position,
                            {
                                toValue: {x: parseInt(nextItem.originLeft+0.5),y: parseInt(nextItem.originTop+0.5)},
                                duration: this.props.slideDuration,
                                easing: Easing.out(Easing.quad),
                                useNativeDriver: false,
                            }
                        ).start()
                    }

                })
            }

        }
    }

    endTouch (nativeEvent) {

        //clear
        if (this.touchCurItem) {
            if (this.props.onDragEnd) {
                this.props.onDragEnd(this.touchCurItem.index,this.touchCurItem.moveToIndex)
            }
            //this.state.dataSource[this.touchCurItem.index].scaleValue.setValue(1)
            Animated.timing(
                this.state.dataSource[this.touchCurItem.index].scaleValue,
                {
                    toValue: 1,
                    duration: this.props.scaleDuration,
                    useNativeDriver: false,
                }
            ).start(()=>{
                this.touchCurItem.ref.setNativeProps({
                    style: {
                        zIndex: defaultZIndex,
                    }
                })
                this.changePosition(this.touchCurItem.index,this.touchCurItem.moveToIndex)
                this.touchCurItem = null
            })
            
        }
    }

    onPressOut () {
        this.isScaleRecovery = setTimeout(()=> {
            if (this.isMovePanResponder && !this.isHasMove) {
                this.endTouch()
            }
        },220)
    }

    changePosition(startIndex,endIndex) {

        if (startIndex == endIndex) {
            const curItem = this.state.dataSource[startIndex]
            if (curItem != null) {
                curItem.position.setValue({
                    x: parseInt(curItem.originLeft + 0.5),
                    y: parseInt(curItem.originTop + 0.5),
                })
            }
            return;
        }

        let isCommon = true
        if (startIndex > endIndex) {
            isCommon = false
            let tempIndex = startIndex
            startIndex = endIndex
            endIndex = tempIndex
        }

        const newDataSource = [...this.state.dataSource].map((item,index)=>{
            let newIndex = null
            if (isCommon) {
                if (endIndex > index && index >= startIndex) {
                    newIndex = index+1
                } else if (endIndex == index) {
                    newIndex = startIndex
                }
            } else {
                if (endIndex >= index && index > startIndex) {
                    newIndex = index-1
                } else if (startIndex == index) {
                    newIndex = endIndex
                }
            }

            if (newIndex != null) {
                const newItem = {...this.state.dataSource[newIndex]}
                newItem.originLeft = item.originLeft
                newItem.originTop = item.originTop
                newItem.position = new Animated.ValueXY({
                    x: parseInt(item.originLeft+0.5),
                    y: parseInt(item.originTop+0.5),
                })
                item = newItem
            }

            return item
        })

        this.setState({
            dataSource: newDataSource
        },()=>{
            if (this.props.onDataChange) {
                this.props.onDataChange(this.getOriginalData())
            }
            // Prevent RN from drawing the beginning and end
            const startItem = this.state.dataSource[startIndex]
            this.state.dataSource[startIndex].position.setValue({
                x: parseInt(startItem.originLeft+0.5),
                y: parseInt(startItem.originTop+0.5),
            })
            const endItem = this.state.dataSource[endIndex]
            this.state.dataSource[endIndex].position.setValue({
                x: parseInt(endItem.originLeft+0.5),
                y: parseInt(endItem.originTop+0.5),
            })
        })

    }

    reComplexDataSource(isInit,props) {
        const itemWidth = this.state.itemWidth;
        const itemHeight = this.state.itemHeight;
        const rowNum = parseInt(props.parentWidth/itemWidth);
        const dataSource = props.dataSource.map((item,index)=>{
            const newData = {}
            const left = (index%rowNum)*itemWidth
            const top = parseInt((index/rowNum))*itemHeight

            newData.data = item
            newData.originIndex = index
            newData.originLeft = left
            newData.originTop = top
            newData.position = new Animated.ValueXY({
                x: parseInt(left+0.5),
                y: parseInt(top+0.5),
            })
            newData.scaleValue = new Animated.Value(1)
            return newData
        })

        if (isInit) {
            this.state = {
                dataSource: dataSource,
                height: Math.ceil(dataSource.length/rowNum)*itemHeight
            }
        } else {
            this.setState({
                dataSource: dataSource,
                height: Math.ceil(dataSource.length/rowNum)*itemHeight
            })
        }

    }

    getOriginalData () {
        return this.state.dataSource.map((item,index)=> item.data)
    }

    render() {
        return (
            <View
                //ref={(ref)=>this.sortParentRef=ref}
                style={[styles.container,{
                    width: this.props.parentWidth,
                    height: this.state.height,
                }]}
                //onLayout={()=> {}}
                >
                {this._renderItemView()}
            </View>
        )
    }

    _getKey = (index) => {
        const item = this.state.dataSource[index];
        return this.props.keyExtractor ? this.props.keyExtractor(item.data, index) : item.originIndex;
    }

    _renderItemView = () => {
        const {maxScale, minOpacity} = this.props
        const inputRange = maxScale >= 1 ? [1, maxScale] : [maxScale, 1]
        const outputRange = maxScale >= 1 ? [1, minOpacity] : [minOpacity, 1]
        return this.state.dataSource.map((item,index)=>{
            const transformObj = {}
            transformObj[this.props.scaleStatus] = item.scaleValue
            const key = this._getKey(index);
            return (
                <Animated.View
                    key={key}
                    ref={(ref) => this.sortRefs.set(key,ref)}
                    {...this._panResponder.panHandlers}
                    style={[styles.item,{
                        marginTop: this.props.marginChildrenTop,
                        marginBottom: this.props.marginChildrenBottom,
                        marginLeft: this.props.marginChildrenLeft,
                        marginRight: this.props.marginChildrenRight,
                        left: item.position.x,
                        top: item.position.y,
                        opacity: item.scaleValue.interpolate({inputRange,outputRange}),
                        transform: [transformObj]
                    }]}>
                    <TouchableOpacity
                        activeOpacity = {1}
                        delayLongPress={this.props.delayLongPress}
                        onPressOut={()=> this.onPressOut()}
                        onLongPress={()=>this.startTouch(index)}
                        onPress={()=>{
                            if (this.props.onClickItem) {
                                this.props.onClickItem(this.getOriginalData(),item.data,index)
                            }
                        }}>
                        {this.props.renderItem(item.data,index)}
                    </TouchableOpacity>
                </Animated.View>
            )
        })
    }

    componentWillUnmount() {
        if (this.isScaleRecovery) clearTimeout(this.isScaleRecovery)
    }

}

DragSortableView.propTypes = {
    dataSource: PropTypes.array.isRequired,
    parentWidth: PropTypes.number,
    childrenHeight: PropTypes.number.isRequired,
    childrenWidth: PropTypes.number.isRequired,

    marginChildrenTop: PropTypes.number,
    marginChildrenBottom: PropTypes.number,
    marginChildrenLeft: PropTypes.number,
    marginChildrenRight: PropTypes.number,

    sortable: PropTypes.bool,

    onClickItem: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDataChange: PropTypes.func,
    renderItem: PropTypes.func.isRequired,
    scaleStatus: PropTypes.oneOf(['scale','scaleX','scaleY']),
    fixedItems: PropTypes.array,
    keyExtractor: PropTypes.func,
    delayLongPress: PropTypes.number,
    isDragFreely: PropTypes.bool,
    onDragging: PropTypes.func,
    maxScale: PropTypes.number,
    minOpacity: PropTypes.number,
    scaleDuration: PropTypes.number,
    slideDuration: PropTypes.number
}

DragSortableView.defaultProps = {
    marginChildrenTop: 0,
    marginChildrenBottom: 0,
    marginChildrenLeft: 0,
    marginChildrenRight: 0,
    parentWidth: width,
    sortable: true,
    scaleStatus: 'scale',
    fixedItems: [],
    isDragFreely: false,
    maxScale: 1.1,
    minOpacity: 0.8,
    scaleDuration: 100,
    slideDuration: 300,
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    item: {
        position: 'absolute',
        zIndex: defaultZIndex,
    },
})
