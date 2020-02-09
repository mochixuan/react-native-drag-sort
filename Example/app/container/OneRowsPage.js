import React, {Component} from 'react'
import {Dimensions, Image, StyleSheet, Text, View,ScrollView,SafeAreaView} from 'react-native'
import DragSortableView from '../widget/DragSortableView'
import {TEST_DATA} from '../data/base/BaseConstant'

const {width} = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width
const childrenHeight = 48

export default class OneRowsPage extends Component{

    constructor(props) {
        super()

        this.state = {
            data: TEST_DATA,
            scrollEnabled: true,
        }
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: '#fff',flex: 1}}>
                <ScrollView
                ref={(scrollView)=> this.scrollView = scrollView}
                scrollEnabled = {this.state.scrollEnabled}
                style={styles.container}>
                <DragSortableView
                    dataSource={this.state.data}

                    parentWidth={parentWidth}

                    childrenWidth= {childrenWidth}
                    childrenHeight={childrenHeight}

                    scaleStatus={'scaleY'}

                    onDragStart={(startIndex,endIndex)=>{
                        this.setState({
                            scrollEnabled: false
                        })
                    }}
                    onDragEnd={(startIndex)=>{
                        this.setState({
                            scrollEnabled: true
                        })
                    }}
                    onDataChange = {(data)=>{
                        if (data.length != this.state.data.length) {
                            this.setState({
                                data: data
                            })
                        }
                    }}
                    keyExtractor={(item,index)=> item.txt} // FlatList作用一样，优化
                    onClickItem={(data,item,index)=>{

                    }}
                    renderItem={(item,index)=>{
                        return this.renderItem(item,index)
                    }}
                />
            </ScrollView>
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
    item: {
        width: childrenWidth,
        height: childrenHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_children: {
        width: childrenWidth,
        height: childrenHeight-4,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    item_icon: {
        width: childrenHeight*0.6,
        height: childrenHeight*0.6,
        marginLeft: 15,
        resizeMode: 'contain',
    },
    item_text: {
        marginRight: 15,
        color: '#2ecc71'
    }
})
