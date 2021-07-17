import React from 'react';
import {StackNavigator} from 'react-navigation'
import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator'
import MainPage from "./app/MainPage";
import ScrollPage from "./app/container/ScrollPage";
import ScrollFixedAddPage from "./app/container/ScrollFixedAddPage";
import NonScrollPage from "./app/container/NonScrollPage";
import FixedRowsPage from "./app/container/FixedRowsPage";
import {CommonSortPage} from "./app/container/CommonSortPage";
import OneRowsPage from "./app/container/OneRowsPage";
import {SortAndFixedPage} from "./app/container/SortAndFixedPage";
import {DragDeletePage} from "./app/container/DragDeletePage";
import AutomaticSlidingOnePage from "./app/container/AutomaticSlidingOnePage";
import AutomaticSlidingThreePage from "./app/container/AutomaticSlidingThreePage";
import AnyThreePage from "./app/container/AnyThreePage";

const App  = StackNavigator({
    MainPage: {screen: MainPage},
    ScrollPage: {screen: ScrollPage},
    ScrollFixedAddPage: {screen: ScrollFixedAddPage},
    NonScrollPage: {screen: NonScrollPage},
    FixedRowsPage: {screen: FixedRowsPage},
    CommonSortPage: {screen: CommonSortPage},
    OneRowsPage: {screen: OneRowsPage},
    SortAndFixedPage: {screen: SortAndFixedPage},
    DragDeletePage: {screen: DragDeletePage},
    AutomaticSlidingOnePage: {screen: AutomaticSlidingOnePage},
    AutomaticSlidingThreePage: {screen: AutomaticSlidingThreePage},
    AnyThreePage: {screen: AnyThreePage}
},{
    navigationOptions: {
        gesturesEnabled: true
    },
    headerMode: 'none',
    transitionConfig: (()=>({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal
    })),
})

export default App
