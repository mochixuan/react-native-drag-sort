import React, {Component} from 'react'
import {Animated, Dimensions, Easing, PanResponder, StyleSheet, TouchableOpacity, View, ScrollView,Platform} from 'react-native'

const PropTypes = require('prop-types')
const {width,height} = Dimensions.get('window')

const defaultZIndex = 8
const touchZIndex = 99

export default class AutoDragSortableView extends Component{

    constructor(props) {
        super(props)

        this.sortRefs = new Map()

        const itemWidth = props.childrenWidth+props.marginChildrenLeft+props.marginChildrenRight
        const itemHeight = props.childrenHeight + props.marginChildrenTop + props.marginChildrenBottom

        // this.reComplexDataSource(true,props) // react < 16.3
        // react > 16.3 Fiber
        const rowNum = parseInt(props.parentWidth / itemWidth);
        const dataSource = props.dataSource.map((item, index) => {
            const newData = {}
            const left = (index % rowNum) * itemWidth
            const top = parseInt((index / rowNum)) * itemHeight

            newData.data = item
            newData.originIndex = index
            newData.originLeft = left
            newData.originTop = top
            newData.position = new Animated.ValueXY({
                x: parseInt(left + 0.5),
                y: parseInt(top + 0.5),
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
            onPanResponderMove: (evt, gestureState) => this.moveTouch(evt, gestureState),
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

    componentDidMount() {
        this.initTag()
        this.autoMeasureHeight()
    }

    componentDidUpdate() {
        this.autoMeasureHeight()
    }

    // Compatible with different systems and paging loading
    autoMeasureHeight = () => {
        if (!this.isHasMeasure) {
            setTimeout(()=>{
                this.scrollTo(1, false)
                this.scrollTo(0, false)
            }, 30)
        }
    }

    // Initialization tag
    initTag = () => {
        this.clearAutoInterval();
        this.autoObj = {
            curDy: 0,
            scrollDx: 0,
            scrollDy: 0,
            hasScrollDy: null,
            forceScrollStatus: 0, // 0: NONE 1: DOWN 2: ONLY_DOWN -1: UP -2: ONLY_UP
        }
    }

    // Unified processing
    dealtScrollStatus = () => {
        const scrollData = this.curScrollData;
        if (scrollData == null || scrollData.offsetY == null) return;
        const { totalHeight, windowHeight, offsetY } = scrollData;
        if (totalHeight <= windowHeight + offsetY) {
            this.autoObj.forceScrollStatus = -2;
        } else if (offsetY <= 0) {
            this.autoObj.forceScrollStatus = 2;
        }
    }

    // Handle automatic slide timer
    clearAutoInterval = () => {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    }

    startAutoScroll = () => {
        if (this.autoInterval != null) {
            return;
        }

        // Start automatic swipe
        this.autoInterval = setInterval(() => {
            if (this.autoObj.forceScrollStatus === 0 ||
                this.autoObj.forceScrollStatus === 2 ||
                this.autoObj.forceScrollStatus === -2) {
                this.clearAutoInterval();
                return;
            }
            // Anti-shake 1.x1
            if (!this.curScrollData.hasScroll) {
                return;
            }
            if (this.autoObj.forceScrollStatus === 1) {
                this.autoObj.scrollDy = this.autoObj.scrollDy + this.props.autoThrottle;
            } else if (this.autoObj.forceScrollStatus === -1){
                this.autoObj.scrollDy = this.autoObj.scrollDy - this.props.autoThrottle;
            }
            this.scrollTo(this.autoObj.scrollDy, false);
            this.dealtScrollStatus();
            // Android slide time 30ms-50ms, iOS close to 0ms, optimize Android jitter
            if (Platform.OS === 'android') {
                setTimeout(()=>{ 
                    if (this.isHasMove) this.moveTouch(null,{dx: this.autoObj.scrollDx, dy: this.autoObj.curDy + this.autoObj.scrollDy})
                },1)
            } else {
                this.moveTouch(null,{dx: this.autoObj.scrollDx, dy: this.autoObj.curDy + this.autoObj.scrollDy})
            }
            
        }, this.props.autoThrottleDuration)
    }

    startTouch(touchIndex) {

        //Prevent drag
        const fixedItems = this.props.fixedItems;
        if (fixedItems.length > 0 && fixedItems.includes(touchIndex)){
            return;
        }

        this.isHasMove = false
        this.isHasMeasure = true

        if (!this.props.sortable) return

        const key = this._getKey(touchIndex);
        if (this.sortRefs.has(key)) {

            // Initialization data
            if (this.isStartupAuto()) {
                this.autoObj.scrollDy = this.autoObj.hasScrollDy = this.curScrollData.offsetY;
            }

            this.setState({
                scrollEnabled: false
            })
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

        this.isHasMove = true;

        //if (this.isScaleRecovery) clearTimeout(this.isScaleRecovery)

        if (this.touchCurItem) {

            let {dx, dy, vy} = gestureState;
            const itemWidth = this.state.itemWidth;
            const itemHeight = this.state.itemHeight;

            const rowNum = parseInt(this.props.parentWidth/itemWidth);
            const maxWidth = this.props.parentWidth-itemWidth;
            const maxHeight = itemHeight*Math.ceil(this.state.dataSource.length/rowNum) - itemHeight;

            // Is it free to drag
            if (!this.props.isDragFreely) {
                // Maximum or minimum after out of bounds
                if (this.touchCurItem.originLeft + dx < 0) {
                    dx = -this.touchCurItem.originLeft
                } else if (this.touchCurItem.originLeft + dx > maxWidth) {
                    dx = maxWidth - this.touchCurItem.originLeft
                }
                if (!this.isStartupAuto()) {
                    if (this.touchCurItem.originTop + dy < 0) {
                        dy = -this.touchCurItem.originTop
                    } else if (this.touchCurItem.originTop + dy > maxHeight) {
                        dy = maxHeight - this.touchCurItem.originTop
                    }
                }
            }

            if (this.isStartupAuto()) {
                const curDis = this.touchCurItem.originTop + dy - this.autoObj.hasScrollDy;
                if (nativeEvent != null) {
                    const tempStatus = this.autoObj.forceScrollStatus;
                    // Automatic sliding
                    const minDownDiss = curDis + this.props.childrenHeight * (1 + (this.props.maxScale - 1) / 2) + this.props.marginChildrenTop + this.props.headerViewHeight;
                    const maxUpDiss = curDis + this.props.marginChildrenTop + this.props.headerViewHeight;
                    if ((tempStatus === 0 || tempStatus === 2) && vy > 0.01 && minDownDiss > this.curScrollData.windowHeight) {
                        this.autoObj.curDy = dy;
                        this.autoObj.forceScrollStatus = 1;
                        this.startAutoScroll();
                    } else if ((tempStatus === 0 || tempStatus === -2) && -vy > 0.01 && maxUpDiss < 0) {
                        this.autoObj.curDy = dy;
                        this.autoObj.forceScrollStatus = -1;
                        this.startAutoScroll();
                    }
                }
                
                // Determine whether to change steering
                if (vy != null) {
                    // Slide down 1、2
                    if (this.autoObj.forceScrollStatus >= 1 && -vy > 0.01) {
                        this.autoObj.forceScrollStatus = 0;
                        // Slide up -1、-2
                    } else if (this.autoObj.forceScrollStatus <= -1 && vy > 0.01) {
                        this.autoObj.forceScrollStatus = 0;
                    }
                }

                // Remember the X axis
                this.autoObj.scrollDx = dx;
                // Correction data 1
                dy = dy - this.autoObj.hasScrollDy;
                if (nativeEvent != null) {
                    // Correction data 2
                    dy = dy + this.autoObj.scrollDy; 
                    // Prevent fingers from sliding when sliding automatically
                    if (this.autoObj.forceScrollStatus === 1 || this.autoObj.forceScrollStatus === -1) {
                        return;
                    }                    
                }
            }

            const left = this.touchCurItem.originLeft + dx;
            const top = this.touchCurItem.originTop + dy;

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
        this.isHasMove = false;

        this.initTag()
        //clear
        if (this.touchCurItem) {
            this.setState({
                scrollEnabled: true
            })
            //this.state.dataSource[this.touchCurItem.index].scaleValue.setValue(1)
            Animated.timing(
                this.state.dataSource[this.touchCurItem.index].scaleValue,
                {
                    toValue: 1,
                    duration: this.props.scaleDuration,
                    useNativeDriver: false,
                }
            ).start(()=>{
                if (this.touchCurItem) {
                    this.touchCurItem.ref.setNativeProps({
                        style: {
                            zIndex: defaultZIndex,
                        }
                    })
                    this.changePosition(this.touchCurItem.index,this.touchCurItem.moveToIndex)
                    if (this.props.onDragEnd) {
                      this.props.onDragEnd(this.touchCurItem.index,this.touchCurItem.moveToIndex)
                    }
                    this.touchCurItem = null
                }
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
                scrollEnabled: true,
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

    isStartupAuto = () => {
        if (this.curScrollData == null) {
            return false;
        }
        return true;
    }

    scrollTo = (height, animated = true) => {
        // Prevent iOS from sliding when elastically sliding negative numbers
        if (this.curScrollData) {
            if (this.autoObj.forceScrollStatus < 0 && this.curScrollData.offsetY <= 0) {
                this.autoObj.scrollDy = 0; // Correcting data system deviations
                return;
            } else if (this.autoObj.forceScrollStatus > 0 && this.curScrollData.windowHeight + this.curScrollData.offsetY >= this.curScrollData.totalHeight) {
                this.autoObj.scrollDy = this.curScrollData.offsetY; //Correcting data system deviations
                return;
            }
            //Barrel effect, the slowest is 1.x1
            this.curScrollData.hasScroll = false;
        }
        this.scrollRef && this.scrollRef.scrollTo({x: 0, y: height, animated});
    }

    onScrollListener = (event) => {
        const nativeEvent = event.nativeEvent
        this.curScrollData = {
            totalHeight: nativeEvent.contentSize.height,
            windowHeight: nativeEvent.layoutMeasurement.height,
            offsetY: nativeEvent.contentOffset.y,
            hasScroll: true,
        }
        if (nativeEvent.contentOffset.y !== 0) this.isHasMeasure = true;
        if (this.props.onScrollListener) this.props.onScrollListener(event)
    }

    render() {
        return (
            <ScrollView
                bounces={false}
                scrollEventThrottle={1}
                scrollIndicatorInsets={this.props.scrollIndicatorInsets}
                ref={(scrollRef)=> {
                    if (this.props.onScrollRef) this.props.onScrollRef(scrollRef)
                    this.scrollRef = scrollRef
                    return this.scrollRef
                }}
                scrollEnabled = {this.state.scrollEnabled}
                onScroll={this.onScrollListener}
                style={styles.container}>  
                {this.props.renderHeaderView ? this.props.renderHeaderView : null} 
                <View
                    //ref={(ref)=>this.sortParentRef=ref}
                    style={[styles.swipe,{
                        width: this.props.parentWidth,
                        height: this.state.height,
                    }]}
                    //onLayout={()=> {}}
                    >
                    {this._renderItemView()}
                </View>
                {this.props.renderBottomView ? this.props.renderBottomView : null}
            </ScrollView>
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
            const key = this.props.keyExtractor ? this.props.keyExtractor(item.data,index) : item.originIndex
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
                                this.isHasMeasure = true
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
        this.clearAutoInterval()
    }

}

AutoDragSortableView.propTypes = {
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
    slideDuration: PropTypes.number,
    autoThrottle: PropTypes.number,
    autoThrottleDuration: PropTypes.number,
    renderHeaderView: PropTypes.element,
    scrollIndicatorInsets: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
      bottom: PropTypes.number,
      right: PropTypes.number,
    }),
    headerViewHeight: PropTypes.number,
    renderBottomView: PropTypes.element,
    bottomViewHeight: PropTypes.number,
    onScrollListener: PropTypes.func,
    onScrollRef: PropTypes.func
}

AutoDragSortableView.defaultProps = {
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
    autoThrottle: 2,
    autoThrottleDuration: 10,
    scrollIndicatorInsets: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 1,
    },
    headerViewHeight: 0,
    bottomViewHeight: 0,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    swipe: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    item: {
        position: 'absolute',
        zIndex: defaultZIndex,
    },
})
