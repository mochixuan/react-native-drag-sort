import React, { Component } from 'react'
import { NativeSyntheticEvent, NativeScrollEvent, StyleProp,ViewStyle } from 'react-native'

interface IProps{
  dataSource: any[];
  parentWidth: number;
  childrenHeight: number;
  childrenWidth: number;

  marginChildrenTop?: number;
  marginChildrenBottom?: number;
  marginChildrenLeft?: number;
  marginChildrenRight?: number;

  sortable?: boolean;

  onClickItem?: (data: any[],item: any,index: number) => void;
  onDragStart?: (fromIndex: number) => void;
  onDragEnd?: (fromIndex: number,toIndex: number) => void;
  onDataChange?: (data: any[]) => void;
  renderItem: (item: any,index: number) => React.ReactElement<any>;
  scaleStatus?: 'scale' | 'scaleX' |'scaleY';
  fixedItems?: number[];
  keyExtractor?: (item: any,index: number) => any;
  delayLongPress?: number;
  isDragFreely?: boolean;
  onDragging?: (gestureState: any, left: number, top: number, moveToIndex: number) => void;

  maxScale?: number;
  minOpacity?: number;
  scaleDuration?: number;
  slideDuration?: number;
}

interface AutoIProps extends IProps {
  autoThrottle?: number,
  autoThrottleDuration?: number,
  renderHeaderView?: any,
  headerViewHeight?: number,
  scrollIndicatorInsets?: {top: number, left: number, bottom: number, right: number},
  renderBottomView?: any,
  bottomViewHeight?: number,
  onScrollListener?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void,
  onScrollRef?: (ref: any) => void
}

interface AnySizeIProps{
  dataSource: any[],
  keyExtractor: (item: any,index: number) => any,
  renderItem: (item: any,index: number|null, isMoved: boolean) => React.ReactElement<any>;
  onDataChange: (data: any[], callback) => void,
  renderHeaderView?: any,
  headerViewHeight?: number,
  renderBottomView?: any,
  bottomViewHeight?: number,
  autoThrottle?: number,
  autoThrottleDuration?: number,
  onDragEnd: () => void,
  scrollIndicatorInsets?: {top: number, left: number, bottom: number, right: number},
  onScrollListener?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void,
  onScrollRef?: (ref: any) => void
  areaOverlapRatio?: number,
  movedWrapStyle: StyleProp<ViewStyle>,
  childMarginTop?: number,
  childMarginBottom?: number,
  childMarginLeft?: number,
  childMarginRight?: number,
}

declare class DragSortableView extends Component<IProps>{}
declare class AutoDragSortableView extends Component<AutoIProps> {}
declare class AnySizeDragSortableView extends Component<AnySizeIProps> {}

export {DragSortableView, AutoDragSortableView, AnySizeDragSortableView};
