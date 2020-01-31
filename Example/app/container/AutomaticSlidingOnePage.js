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
                    <Text style={styles.header_title}>Automatic Sliding: One</Text>
                </View>
                <AutoDragSortableView
                    dataSource={this.state.data}
                    
                    parentWidth={parentWidth}
                    childrenWidth= {childrenWidth}
                    marginChildrenBottom={10}
                    marginChildrenRight={10}
                    marginChildrenLeft = {10}
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
                <View style={styles.item_children}>
                    <Image
                        style={styles.item_icon}
                        source={item.icon}/>
                    <Text style={styles.item_text}>{item.txt}</Text>
                </View>
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
        color: '#2ecc71',
        fontSize: 24,
        fontWeight: 'bold'
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_children: {
        width: childrenWidth,
        height: childrenHeight-4,
        backgroundColor: '#2ecc71',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginTop: 4,
    },
    item_icon: {
        width: childrenHeight*0.2,
        height: childrenHeight*0.2,
        resizeMode: 'contain',
    },
    item_text: {
        color: '#fff',
        marginTop: 10
    }
})
