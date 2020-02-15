import React, {Component} from 'react'
import {Dimensions, Image, StyleSheet, Text, View,ScrollView,Platform,SafeAreaView} from 'react-native'
import AutoDragSortableView from '../widget/AutoDragSortableView'
import {AUTO_TEST_DATA} from '../data/base/BaseConstant'

const {width} = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width/3 - 20
const childrenHeight = 48*4
const headerViewHeight = 160
const bottomViewHeight = 40

export default class AutomaticSlidingThreePage extends Component {

    constructor(props) {
        super()

        this.state = { 
            data: AUTO_TEST_DATA, 
        }
    }

    render() {
        // Write a temporary example
        const renderHeaderView = (
            <View style={styles.aheader}>
                <Image source={{uri: 'https://avatars0.githubusercontent.com/u/15728691?s=460&v=4'}} style={styles.aheader_img}/>
                <View style={styles.aheader_context}>
                    <Text style={styles.aheader_title}>mochixuan</Text>
                    <Text style={styles.aheader_desc}>Android, React-Native, Flutter, React, Web。Learn new knowledge and share new knowledge.</Text>
                </View>
            </View>
        )
        const renderBottomView = (
            <View style={styles.abottom}>
                <Text style={styles.abottom_desc}>yarn add react-native-drag-sort</Text>
            </View>
        )


        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={styles.header}>
                    <Text style={styles.header_title}>Automatic Sliding: Three Line</Text>
                </View>
                <AutoDragSortableView
                    dataSource={this.state.data}
                    
                    parentWidth={parentWidth}
                    childrenWidth= {childrenWidth}
                    marginChildrenBottom={10}
                    marginChildrenRight={10}
                    marginChildrenLeft = {10}
                    marginChildrenTop = {10}
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
                    renderHeaderView = {renderHeaderView}
                    headerViewHeight={headerViewHeight}
                    renderBottomView = {renderBottomView}
                    bottomViewHeight={bottomViewHeight}
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
                <View style={styles.item_text_swipe}>
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
        color: '#333',
        fontSize: 24,
        fontWeight: 'bold'
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f39c12',
        borderRadius: 4,
    },
    item_icon_swipe: {
        width: childrenWidth*0.7,
        height: childrenWidth*0.7,
        backgroundColor: '#fff',
        borderRadius: childrenWidth*0.35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_icon: {
        width: childrenWidth*0.5,
        height: childrenWidth*0.5,
        resizeMode: 'contain',
    },
    item_text_swipe: {
        backgroundColor: '#fff',
        width: 56,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_text: {
        color: '#444',
        fontSize: 20,
        fontWeight: 'bold',
    },

    aheader: {
        height: headerViewHeight,
        flexDirection: 'row',
        borderBottomColor: '#2ecc71',
        borderBottomWidth: 2,
        zIndex: 100,
        backgroundColor: '#fff'
    },
    aheader_img: {
        width: headerViewHeight * 0.6,
        height: headerViewHeight * 0.6,
        resizeMode: 'cover',
        borderRadius: headerViewHeight * 0.3,
        marginLeft: 16,
        marginTop: 10,
    },
    aheader_context: {
        marginLeft: 8,
        height: headerViewHeight * 0.4,
        marginTop: 10
    },
    aheader_title: {
        color: '#333',
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    aheader_desc: {
        color: '#444',
        fontSize: 16,
        width: width - headerViewHeight * 0.6 - 32
    },
    abottom: {
        justifyContent: 'center',
        alignItems: 'center',
        height: bottomViewHeight,
        backgroundColor: '#fff',
        zIndex: 100,
        borderTopColor: '#2ecc71',
        borderTopWidth: 2,
    },
    abottom_desc: {
        color: '#333',
        fontSize: 20,
        fontWeight: 'bold'
    }
})
