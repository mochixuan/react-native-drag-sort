import React,{Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity
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

export default class ScrollFixedAddPage extends Component {

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
                            if (!this.state.isEnterEdit) {
                                this.setState({
                                    isEnterEdit: true,
                                    scrollEnabled: false
                                })
                            } else {
                                this.setState({
                                    scrollEnabled: false
                                })
                            }
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
                            if (this.state.isEnterEdit) {
                                const newData = [...data]
                                newData.splice(index,1)
                                this.setState({
                                    data: newData
                                })
                            }
                        }}
                        keyExtractor={(item,index)=> item.txt} // FlatList作用一样，优化
                        renderItem={(item,index)=>{
                            return this.renderItem(item,index)
                        }}
                    />
                    <View style={[
                        {
                            width: childrenWidth,
                            height: childrenHeight,
                            marginTop: marginChildrenTop,
                            marginLeft: marginChildrenLeft,
                            marginBottom: marginChildrenBottom,
                            marginRight: marginChildrenRight,
                            justifyContent: 'center',
                            alignItems: 'center'
                        },
                        this.state.data.length % 4 !== 0 ? {
                            position: 'absolute',
                            zIndex: 999,
                            top: parseInt(this.state.data.length / 4) * (childrenHeight + marginChildrenBottom + marginChildrenTop),
                            left: parseInt(this.state.data.length % 4) * (childrenWidth + marginChildrenLeft + marginChildrenRight)
                        } : {}
                    ]}>
                        <TouchableOpacity 
                            style={styles.item_children} 
                            onPress={()=> {
                                this.index = this.index + 1;
                                const  newData = [...this.state.data] //pointer problem
                                newData.push( {icon: require('../data/img/animal10.png'),txt: 'New'+this.index})
                                this.setState({
                                    data: newData
                                })
                            }}
                        >
                            <Text style={{fontSize: 24,color: '#000'}}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.txt}>{TXT}</Text>
                <Text style={styles.txt}>{TXT}</Text>
                <Text style={styles.txt}>{TXT}</Text>
                <Text style={styles.txt}>{TXT}</Text>
            </ScrollView>
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
        marginLeft: 20,
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
})
