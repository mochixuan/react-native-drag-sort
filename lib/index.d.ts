import React, { Component } from 'react'

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
  keyExtractor?: (item: any,index: number) => any
}

export default class DragSortableView extends Component<IProps>{}