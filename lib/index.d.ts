declare module "react-native-drag-sort" {
  import React from "react";

  export interface DragSortableViewProps<T> {
    dataSource: T[];
    parentWidth: number;
    childrenHeight: number;
    childrenWidth: number;

    marginChildrenTop?: number;
    marginChildrenBottom?: number;
    marginChildrenLeft?: number;
    marginChildrenRight?: number;

    sortable?: boolean;

    onClickItem?: (data: T[],item: any,index: number) => void;
    onDragStart?: (fromIndex: number) => void;
    onDragEnd?: (fromIndex: number,toIndex: number) => void;
    onDataChange?: (data: T[]) => void;
    renderItem: (item: T,index: number) => React.ReactNode; 
    scaleStatus?: 'scale' | 'scaleX' |'scaleY';
    scaleNumber?: number;
    fixedItems?: number[];
    keyExtractor?: (item: T,index: number) => string | number,
    delayLongPress?: number
  }

  export default class DragSortableView<T> extends React.Component<DragSortableViewProps<T>>{}
}
