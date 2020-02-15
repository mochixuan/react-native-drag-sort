import React, {Component} from 'react'
import {Dimensions, Image, StyleSheet, Text, View,SafeAreaView} from 'react-native'
import AutoDragSortableView from '../widget/AutoDragSortableView'
import {AUTO_TEST_DATA} from '../data/base/BaseConstant'

const {width} = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width - 20
const childrenHeight = 48

export default class AutomaticSlidingOnePage extends Component {

    constructor(props) {
        super()

        this.state = { 
            data: AUTO_TEST_DATA,
        }
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.header}>
                    <Text style={styles.header_title}>Automatic Sliding: Single Line</Text>
                </View>
                <AutoDragSortableView
                    dataSource={this.state.data}
                    
                    parentWidth={parentWidth}
                    childrenWidth= {childrenWidth}
                    marginChildrenBottom={10}
                    marginChildrenRight={10}
                    marginChildrenLeft = {10}
                    marginChildrenTop={10}
                    childrenHeight={childrenHeight}
                    
                    onDataChange = {(data)=>{
                        if (data.length != this.state.data.length) {
                            this.setState({
                                data: data
                            })
                        }
                    }}
                    keyExtractor={(item,index)=> item.txt} // FlatList作用一样，优化
                    renderItem={(item,index)=>{
                        return this.renderItem(item,index)
                    }}
                />
            </SafeAreaView>
        )
    }

    renderItem(item,index) {
        return (
            <View style={styles.item}>
                <View style={styles.item_icon_swipe}>
                    <Image style={styles.item_icon} source={item.icon}/>
                </View>
                <Text style={styles.item_text}>{item.txt}</Text>
            </View>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#2ecc71',
        borderBottomWidth: 2,
    },
    header_title: {
        color: '#333',
        fontSize: 24,
        fontWeight: 'bold',
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2ecc71',
        borderRadius: 4,
    },
    item_icon_swipe: {
        width: childrenHeight-10,
        height: childrenHeight-10,
        backgroundColor: '#fff',
        borderRadius: (childrenHeight - 10) / 2,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_icon: {
        width: childrenHeight-20,
        height: childrenHeight-20,
        resizeMode: 'contain',
    },
    item_text: {
        color: '#fff',
        fontSize: 20,
        marginRight: 20,
        fontWeight: 'bold',
    }
})
