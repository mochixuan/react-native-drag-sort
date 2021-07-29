import React from 'react';
import {
  NativeModules,
  StyleSheet,
  ScrollView,
  View,
  PanResponder,
  LayoutAnimation,
  Platform
} from 'react-native';
const PropTypes = require('prop-types')
const ANIM_DURATION = 300
const { UIManager } = NativeModules;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default class AnySizeDragSortableView extends React.PureComponent {

  constructor(props) {
    super(props)

    this.layoutMap = new Map();
    this.keyToIndexMap = new Map();

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        this.isMovePanResponder = false;
        return false;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => this.isMovePanResponder,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.isMovePanResponder,
      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: (evt, gestureState) => this.moveTouch(evt, gestureState),
      onPanResponderRelease: (evt, gestureState) => this.endTouch(evt),
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onShouldBlockNativeResponder: (evt, gestureState) => false,
    });

    this.state = {
      selectedItem: null,
      selectedKey: null,
      selectedOriginLayout: null,
      selectedPosition: null,

      scrollEnabled: true
    }
  }

  componentWillUnmount() {
    if (this.isScaleRecovery) clearTimeout(this.isScaleRecovery)
     this.clearAutoInterval()
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
      setTimeout(() => {
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

  isStartupAuto = () => {
    if (this.curScrollData == null) {
      return false;
    }
    return true;
  }

  // Unified processing
  dealtScrollStatus = () => {
    const scrollData = this.curScrollData;
    if (scrollData == null || scrollData.offsetY == null) return;
    const {
      totalHeight,
      windowHeight,
      offsetY
    } = scrollData;
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
      } else if (this.autoObj.forceScrollStatus === -1) {
        this.autoObj.scrollDy = this.autoObj.scrollDy - this.props.autoThrottle;
      }
      this.scrollTo(this.autoObj.scrollDy, false);
      this.dealtScrollStatus();
      // Android slide time 30ms-50ms, iOS close to 0ms, optimize Android jitter
      if (Platform.OS === 'android') {
        setTimeout(() => {
          if (this.isHasMove) this.moveTouch(null, {
             ...(this.preGestureState || {}),
            dx: this.autoObj.scrollDx,
            dy: this.autoObj.curDy + this.autoObj.scrollDy
          })
        }, 1)
      } else {
        this.moveTouch(null, {
          ...(this.preGestureState || {}),
          dx: this.autoObj.scrollDx,
          dy: this.autoObj.curDy + this.autoObj.scrollDy
        })
      }

    }, this.props.autoThrottleDuration)
  }

  startTouch = (item, index) => {
    const {keyExtractor, headerViewHeight} = this.props
    this.isHasMove = false
    this.isHasMeasure = true
    this.preMoveKeyObj = null
    // Initialization data
    if (this.isStartupAuto()) {
      this.autoObj.scrollDy = this.autoObj.hasScrollDy = this.curScrollData.offsetY;
    }
    const key = keyExtractor(item, index);
    const curLayout = this.layoutMap.get(key)
    const firstOffsetY = (this.curScrollData && this.curScrollData.offsetY) || 0
    const initTop = parseInt(curLayout.y - firstOffsetY + headerViewHeight + 0.5)
    this.setState({ 
      scrollEnabled: false,
      selectedItem: item,
      selectedKey: key,
      selectedOriginLayout: {...curLayout},
      selectedPosition: {
        left: parseInt(curLayout.x+0.5),
        top: initTop,
        initTop,
        width: curLayout.width,
        height: curLayout.height
      }
    }, () => {
      this.isMovePanResponder = true
    })
  };

  moveTouch = (nativeEvent, gestureState) => {
    this.isHasMove = true
    // record
    if (nativeEvent) {
      this.preGestureState = gestureState
    }
    const { selectedKey, selectedOriginLayout, selectedPosition } = this.state
    const {
      areaOverlapRatio, headerViewHeight,
      childMarginTop, childMarginBottom, childMarginLeft, childMarginRight
    } = this.props
    const curLayout = this.layoutMap.get(selectedKey)

    let {dx, dy, vy, moveY, y0} = gestureState;

    if (!selectedOriginLayout) return

    if (this.isStartupAuto()) {
      const curDis = selectedOriginLayout.y + dy - this.autoObj.hasScrollDy;
      if (nativeEvent != null) {
        const tempStatus = this.autoObj.forceScrollStatus;
        // Automatic sliding
        const minDownDiss = curDis + selectedPosition.height + headerViewHeight;
        const maxUpDiss = curDis + headerViewHeight;
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
    if (!this.isUpdating) {
      const moveX1 = selectedOriginLayout.x + dx + childMarginLeft
      const moveX2 = moveX1 + selectedOriginLayout.width - childMarginRight
      const moveY1 = selectedOriginLayout.y + dy + childMarginTop
      const moveY2 = moveY1 + selectedOriginLayout.height - childMarginBottom
      const nextLineY = curLayout.y + curLayout.height
      const moveArea = selectedOriginLayout.width * selectedOriginLayout.height
      const layouts = this.layoutMap.values()
      let nextLineLastLayout = null
      for (let layout of layouts) {
        const tempX1 = layout.x + childMarginLeft
        const tempX2 = tempX1 + layout.width - childMarginRight
        const tempY1 = layout.y + childMarginTop
        const tempY2 = tempY1 + layout.height - childMarginBottom
        // record next line Layout start
        if (nextLineY === layout.y && (!nextLineLastLayout || nextLineLastLayout.x < layout.x)) {
          nextLineLastLayout = layout
        }
        if (layout.key === curLayout.key) continue;
        const w = Math.min(moveX2, tempX2) - Math.max(moveX1, tempX1)
        const h = Math.min(moveY2, tempY2) - Math.max(moveY1, tempY1)
        if (w <= 0 || h <= 0) continue;
        const overlapArea = w * h
        const minArea = Math.min(layout.width * layout.height, moveArea)
        if (overlapArea < minArea * areaOverlapRatio || !overlapArea) continue;
        this.move(curLayout.key, layout.key, vy, curLayout.y !== layout.y)
        break
      }
      // When sliding to the end, there is no assistance
      if (!this.isUpdating && nextLineLastLayout && 
        moveX1 >= nextLineLastLayout.x + nextLineLastLayout.width && (moveY2 + moveY1) / 2 > nextLineLastLayout.y
      ) {
        this.move(curLayout.key, nextLineLastLayout.key, vy, curLayout.y !== nextLineLastLayout.y)
      }
    }

    const preLeft = selectedPosition.left
    const preTop = selectedPosition.top
    const nextLeft = parseInt(selectedOriginLayout.x + dx + 0.5)
    const nextTop = parseInt(selectedPosition.initTop + (moveY - y0) + 0.5)

    if (preLeft !== nextLeft || preTop !== nextTop) {
      this.setState({
        selectedPosition: {
          ...selectedPosition, 
          left: nextLeft,
          top: nextTop
        }
      })
    }
  };

  move = (fromKey, toKey, vy, isDiffline) => {
    this.isUpdating = true
    const { onDataChange ,dataSource } = this.props
    const length = dataSource.length
    const fromIndex = this.keyToIndexMap.get(fromKey)
    const toIndex = this.keyToIndexMap.get(toKey)
    if (fromIndex < 0 || fromIndex >= length || toIndex < 0 || toIndex >= length) {
      this.isUpdating = false
      return
    }
    if (
      this.preMoveKeyObj && this.preMoveKeyObj.fromKey === fromKey && this.preMoveKeyObj.toKey === toKey && 
      isDiffline && ((toIndex - fromIndex > 0 && vy <= 0.01) || (toIndex - fromIndex < 0 && vy >= -0.01))
    ) {
      this.isUpdating = false
      return
    }
    this.preMoveKeyObj = {
      fromKey, toKey
    }
    const newDataSource = [...dataSource];
    const deleteItem = newDataSource.splice(fromIndex, 1);
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        ANIM_DURATION,
        LayoutAnimation.Types.linear,
        LayoutAnimation.Properties.opacity
      )
    );
    newDataSource.splice(toIndex, 0, deleteItem[0]);
    onDataChange(newDataSource, () => {
      setTimeout(() => {
        this.isUpdating = false
      }, ANIM_DURATION)
    })
  };

  endTouch = (evt) => {
    this.isHasMove = false;
    this.initTag()
    if (this.props.onDragEnd) this.props.onDragEnd()
    this.setState({
      selectedItem: null,
      selectedKey: null,
      selectedOriginLayout: null,
      selectedPosition: null,
      scrollEnabled: true
    })
  };

  onPressOut() {
    this.isScaleRecovery = setTimeout(() => {
      if (this.isMovePanResponder && !this.isHasMove) {
        this.endTouch()
      }
    }, 220)
  }

  _setLayoutData = (key, event) => {
    this.layoutMap.set(key, {...event.nativeEvent.layout, key})
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
    if (nativeEvent.contentOffset.y !== 0) this.isHasMeasure = true
    if (this.props.onScrollListener) this.props.onScrollListener(event);
  }

  render() {
    const {selectedItem, selectedPosition, scrollEnabled} = this.state
    const {dataSource, keyExtractor, renderItem, movedWrapStyle} = this.props
    return (
      <View style={styles.box}>
        {
          selectedPosition && (
            <View style={[movedWrapStyle, { left: selectedPosition.left, top: selectedPosition.top, position: 'absolute', zIndex: 999 }]}>
              {renderItem(selectedItem, null, true)}
            </View>
          )
        }
        <ScrollView
          bounces={false}
          scrollEventThrottle={1}
          scrollIndicatorInsets={this.props.scrollIndicatorInsets}
          ref={(scrollRef)=> {
              if (this.props.onScrollRef) this.props.onScrollRef(scrollRef)
              this.scrollRef = scrollRef
              return this.scrollRef
          }}
          scrollEnabled = {scrollEnabled}
          onScroll={this.onScrollListener}
          style={styles.scroll}>
          {this.props.renderHeaderView ? this.props.renderHeaderView : null} 
          <View style={styles.container}>
            {
              dataSource.map((item, index) => {
                const key = keyExtractor(item, index)
                this.keyToIndexMap.set(key, index)
                return (
                  <View
                    key={key}
                    {...this._panResponder.panHandlers}
                    onLayout={event => this._setLayoutData(key, event)}
                  >
                    {renderItem(item, index, false)}
                  </View>
                )
              })
            }
          </View>
          {this.props.renderBottomView ? this.props.renderBottomView : null}
        </ScrollView>
      </View>
    )
  }
  
}

AnySizeDragSortableView.propTypes = {
  dataSource: PropTypes.array.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  onDataChange: PropTypes.func,
  headerViewHeight: PropTypes.number,
  renderBottomView: PropTypes.element,
  bottomViewHeight: PropTypes.number,
  renderHeaderView: PropTypes.element,
  autoThrottle: PropTypes.number,
  onDragEnd: PropTypes.func,
  autoThrottleDuration: PropTypes.number,
  scrollIndicatorInsets: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
  }),
  onScrollListener: PropTypes.func,
  onScrollRef: PropTypes.func,
  areaOverlapRatio: PropTypes.number,
  movedWrapStyle: PropTypes.object,
  /** 
   * childMarginxx: Must be greater than > 0
   * Optimize the calculation of the size of the rectangle where the two components 
   *  intersect to prevent repeated switching caused by triggering the critical point .
   */
  childMarginTop: PropTypes.number,
  childMarginBottom: PropTypes.number,
  childMarginLeft: PropTypes.number,
  childMarginRight: PropTypes.number
}

AnySizeDragSortableView.defaultProps = {
  areaOverlapRatio: 0.55, // Must be greater than 0.5
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
  movedWrapStyle: {
    backgroundColor: 'blue',
    zIndex: 999,
  },
  childMarginTop: 10,
  childMarginBottom: 10,
  childMarginLeft: 10,
  childMarginRight: 10
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    position: 'relative'
  },
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});