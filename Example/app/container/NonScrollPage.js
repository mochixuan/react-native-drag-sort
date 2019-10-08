import React, {Component} from 'react'
import {Dimensions, Image, StyleSheet, Text, View,TouchableOpacity} from 'react-native'
import DragSortableView from '../widget/DragSortableView'
import {TEST_DATA, TXT} from '../data/base/BaseConstant'

const {width} = Dimensions.get('window')

const parentWidth = width - 10
const childrenWidth = 76+8
const childrenHeight = 76+8

export default class NonScrollPage extends Component{

    constructor(props) {
        super()

        this.state = {
            data: TEST_DATA,
            scrollEnabled: true,
            isEnterEdit: false,
        }

        this.index = 1;
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

                        onDragStart={(startIndex,endIndex)=>{
                            if (!this.state.isEnterEdit) {
                                this.setState({
                                    isEnterEdit: true
                                })
                            }
                        }}

                        onDataChange = {(data)=>{
                            // delete or add data to refresh
                            if (data.length != this.state.data.length) {
                                this.setState({
                                    data: data
                                })
                            }
                        }}
                        keyExtractor={(item,index)=> item.txt} // FlatList作用一样，优化
                        onClickItem={(data,item,index)=>{
                            //delete
                            if (this.state.isEnterEdit) {
                                const newData = [...data]
                                newData.splice(index,1)
                                this.setState({
                                    data: newData
                                })
                            }
                        }}
                        renderItem={(item,index)=>{
                            return this.renderItem(item,index)
                        }}/>
                </View>
                {
                    <TouchableOpacity style={styles.button} onPress={()=> {
                        this.index = this.index + 1;
                        const  newData = [...this.state.data] //pointer problem
                        newData.push( {icon: require('../data/img/animal10.png'),txt: 'New'+this.index})
                        this.setState({
                            data: newData
                        })
                    }}>
                        <Text style={styles.button_text}>Add One</Text>
                    </TouchableOpacity>
                }
                <Text style={styles.txt}>{TXT}</Text>
            </View>
        )
    }

    renderItem(item,index) {
        if (this.state.isEnterEdit) {
            return (
                <View style={styles.item}>
                    <View style={styles.item_children}>
                        <Image
                            style={styles.item_icon}
                            source={item.icon}/>
                        <Text style={styles.txt}>{item.txt}</Text>
                    </View>
                    <Image
                        style={styles.item_delete_icon}
                        source={require('../data/img/clear.png')}
                    />
                </View>
            )
        } else {
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
        width: childrenWidth-8,
        height: childrenHeight-8,
        backgroundColor: '#f0ffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginTop: 8
    },
    item_delete_icon: {
        width: 14,
        height: 14,
        position: 'absolute',
        right: 1,
        top: 1,
    },
    item_icon: {
        width: childrenWidth-4-8,
        height: childrenHeight-4-8,
        resizeMode: 'contain',
        position: 'absolute'
    },
    button: {
        width: width*0.6,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#7da6ff',
        borderRadius: 2,
        marginTop: 20,
    },
    button_text: {
        fontSize: 18,
        color: '#fff'
    },
})
