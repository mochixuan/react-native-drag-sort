import React,{Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Dimensions
} from 'react-native'
const {width} = Dimensions.get('window')
import DragSortableView from '../widget/DragSortableView'
import {TEST_DATA,TXT} from '../data/base/BaseConstant'

const parentWidth = width - 18
const childrenWidth = 76
const childrenHeight = 76
const marginChildrenTop = 7
const marginChildrenBottom = 0
const marginChildrenLeft = 0
const marginChildrenRight = 7

export default class ScrollPage extends Component{

    constructor(props) {
        super()

        this.state = {
            data: TEST_DATA,
            scrollEnabled: true,
        }
    }

    render() {
        return (
            <ScrollView
                ref={(scrollView)=> this.scrollView = scrollView}
                scrollEnabled = {this.state.scrollEnabled}
                style={styles.container}>
                <Text style={styles.txt}>{TXT}</Text>
                <View style={styles.sort}>
                    <DragSortableView
                        dataSource={this.state.data}
                        parentWidth={parentWidth}

                        childrenWidth= {childrenWidth}
                        childrenHeight={childrenHeight}

                        marginChildrenTop={marginChildrenTop}
                        marginChildrenBottom={marginChildrenBottom}
                        marginChildrenLeft={marginChildrenLeft}
                        marginChildrenRight={marginChildrenRight}

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
                            // delete or add data to refresh
                            if (data.length != this.state.data.length) {
                                this.setState({
                                    data: data
                                })
                            }
                        }}
                        onClickItem={(data,item,index)=>{
                            // click delete
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
                        }}
                    />
                </View>
                <Text style={styles.txt}>{TXT}</Text>
                <Text style={styles.txt}>{TXT}</Text>
                <Text style={styles.txt}>{TXT}</Text>
                <Text style={styles.txt}>{TXT}</Text>
            </ScrollView>
        )
    }

    renderItem(item,index) {

        return (
            <View style={styles.item}>
                <Image
                    style={styles.item_icon}
                    source={item.icon}/>
                <Text style={styles.txt}>{item.txt}</Text>
            </View>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    txt: {
        fontSize: 18,
        lineHeight: 24,
        padding: 5,
    },
    sort: {
        marginLeft: 18
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
        backgroundColor: '#f0ffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    item_icon: {
        width: childrenWidth-4,
        height: childrenHeight-4,
        resizeMode: 'contain',
        position: 'absolute'
    }
})