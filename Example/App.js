import React from 'react';
import {StackNavigator} from 'react-navigation'
import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator'
import MainPage from "./app/MainPage";
import ScrollPage from "./app/container/ScrollPage";
import NonScrollPage from "./app/container/NonScrollPage";
import FixedRowsPage from "./app/container/FixedRowsPage";
import {CommonSortPage} from "./app/container/CommonSortPage";
import OneRowsPage from "./app/container/OneRowsPage";


const App  = StackNavigator({
    MainPage: {screen: MainPage},
    ScrollPage: {screen: ScrollPage},
    NonScrollPage: {screen: NonScrollPage},
    FixedRowsPage: {screen: FixedRowsPage},
    CommonSortPage: {screen: CommonSortPage},
    OneRowsPage: {screen: OneRowsPage}
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
