import React, {Component} from 'react'
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native'
import DragSortableView from '../widget/DragSortableView'
import {TEST_DATA, TXT} from '../data/base/BaseConstant'

const {width} = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width/5
const childrenHeight = 48
const marginChildrenTop = 10

export default class FixedRowsPage extends Component{

    constructor(props) {
        super()

        this.state = {
            data: TEST_DATA,
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.sort}>
                    <DragSortableView
                        dataSource={this.state.data}

                        parentWidth={parentWidth}

                        childrenWidth= {childrenWidth}
                        childrenHeight={childrenHeight}

                        marginChildrenTop={marginChildrenTop}

                        onDataChange = {(data)=>{
                            // delete or add data to refresh
                            if (data.length != this.state.data.length) {
                                this.setState({
                                    data: data
                                })
                            }
                        }}
                        onClickItem={(data,item,index)=>{
                            // if (this.state.isEnterEdit) {
                            //     const newData = [...data]
                            //     newData.splice(index,1)
                            //     this.setState({
                            //         data: newData
                            //     })
                            // }
                        }}
                        renderItem={(item,index)=>{
                            return this.renderItem(item,index)
                        }}/>
                </View>
                <Text style={styles.txt}>Fixed 3 lines</Text>
            </View>
        )
    }

    renderItem(item,index) {
        return (
            <View style={styles.item}>
                <View style={styles.item_children}>
                    <Image
                        style={styles.item_icon}
                        source={item.icon}/>
                    <Text style={styles.txt}>{item.txt}</Text>
                </View>
            </View>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    txt: {
        fontSize: 18,
        lineHeight: 24,
        padding: 5,
    },
    sort: {
        marginLeft: 10,
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
    },
    item_children: {
        width: childrenHeight,
        height: childrenHeight,
        backgroundColor: '#f0ffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    item_icon: {
        width: childrenHeight-8,
        height: childrenHeight-8,
        resizeMode: 'contain',
        position: 'absolute'
    }
})