import React, {Component} from 'react'
import {
    View, Text, Dimensions, Image, StyleSheet,StatusBar,SafeAreaView
} from 'react-native'
import DragSortableView from '../widget/DragSortableView'
import {TEST_DATA} from "../data/base/BaseConstant";

const {width,height} = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width/5
const childrenHeight = width/5
const deleteHeight = 60

export class DragDeletePage extends Component {

    constructor(props) {
        super()

        this.state = {
            data: TEST_DATA,
            deleteStatus: 0, // 0: common 1: wait 2. delete
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.sort}>
                    <DragSortableView
                        dataSource={this.state.data}
                        parentWidth={parentWidth}
                        isDragFreely={true}
                        childrenWidth= {childrenWidth}
                        childrenHeight={childrenHeight}
                        onDragging={this.onDragging}
                        onDragStart={this.onDragStart}
                        onDragEnd={this.onDragEnd}
                        onDataChange = {(data)=>{
                            if (this.deleteIndex != null) {
                                const deleteIndex = this.deleteIndex;
                                this.deleteIndex = null;
                                const newData = [...data]
                                newData.splice(deleteIndex,1)
                                this.setState({
                                    data: newData,
                                })
                            } else if (data.length != this.state.data.length) {
                                this.setState({
                                    data: data
                                })
                            }
                        }}
                        keyExtractor={(item,index)=> item.txt} // FlatList作用一样，优化
                        renderItem={this.renderItem}/>
                </View>
                {this.renderDeleteView()}
            </View>
        )
    }

    onDragStart = () => {
        this.setState({
            deleteStatus: 1,
        })
    }

    onDragEnd = (startIndex,endIndex) => {
        if (this.state.deleteStatus === 2) {
            if (startIndex === endIndex) {
                const newData = [...this.state.data]
                newData.splice(startIndex,1)
                this.setState({
                    data: newData,
                    deleteStatus: 0,
                })
            } else {
                this.deleteIndex = endIndex;
                this.setState({
                    deleteStatus: 0,
                })
            }
        } else {
            this.setState({
                deleteStatus: 0,
            })
        }

    }

    onDragging = (gestureState, left, top) => {
        if (this.isBuffer) return;

        if (gestureState.moveY + (StatusBar.currentHeight | 0) + deleteHeight >= height) {
            this.isBuffer = true;
            this.setState({deleteStatus: 2},() => {this.isBuffer = false})
        } else if (this.state.deleteStatus !== 1) {
            this.isBuffer = true;
            this.setState({deleteStatus: 1},() => {this.isBuffer = false})
        }
    }

    renderDeleteView = () => {
        const deleteStatus = this.state.deleteStatus
        if (deleteStatus === 1 || deleteStatus === 2) {
            return (
                <View style={styles.delete}>
                    <Image style={styles.delete_icon} source={require('../data/img/delete.png')}/>
                    <Text style={styles.delete_txt}>{deleteStatus === 2 ? 'Release your hand to delete' : 'Delete'}</Text>
                </View>
            )
        }
        return null;
    }

    renderItem(item,index) {
        return (
            <View style={styles.item}>
                <View style={styles.item_children}>
                    <Image
                        style={styles.item_icon}
                        source={item.icon}/>
                    <Text style={styles.item_txt}>{item.txt}</Text>
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
    sort: {
        flex: 1,
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
    },
    item_children: {
        //margin: 4,
        width: childrenWidth-4,
        height: childrenHeight-4,
        margin: 2,
        backgroundColor: '#957be7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_icon: {
        width: childrenHeight/2,
        height: childrenHeight/2,
        resizeMode: 'contain',
    },
    item_txt: {
        fontSize: 18,
        color: '#fff'
    },
    delete: {
        width: width,
        height: deleteHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e64e0b',
        zIndex: 9999,
    },
    delete_icon: {
        width: 24,
        height: 24
    },
    delete_txt: {
        fontSize: 16,
        color: '#fff'
    }
})
