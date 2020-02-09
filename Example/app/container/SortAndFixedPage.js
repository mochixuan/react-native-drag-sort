import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView
} from 'react-native'
import DragSortableView from '../widget/DragSortableView'

const deviceWidth = Dimensions.get('window').width
const childrenWidth = deviceWidth/4;
const childrenHeight = deviceWidth/8;
const itemWidth = 72
const itemHeight = 36
const sortWidth = deviceWidth
const items = [
    {text: '关注',isSelect: true},
    {text: '推荐',isSelect: true},
    {text: '热点',isSelect: true},
    {text: 'NBA',isSelect: true},
    {text: '体育',isSelect: true},
    {text: '动漫',isSelect: true},
    {text: '精品课',isSelect: true},
    {text: '科技',isSelect: true},
    {text: '股票',isSelect: true},
    {text: '军事',isSelect: true},
    {text: '科学',isSelect: true},
    {text: '娱乐',isSelect: true},
    {text: '健康',isSelect: true},
    {text: '微头条',isSelect: true},
    {text: '财经',isSelect: true},
    {text: '手机',isSelect: true},
    {text: '历史',isSelect: true},
    {text: '新时代',isSelect: true},
    {text: '国风',isSelect: true},
    {text: '小视频',isSelect: true},
    {text: '值点',isSelect: true},
    {text: '问答',isSelect: true},
    {text: '小说',isSelect: true},
    {text: '音频',isSelect: false},
    {text: '深圳',isSelect: false},
    {text: '视频',isSelect: false},
    {text: '时尚',isSelect: false},
    {text: '美食',isSelect: false},
    {text: '养生',isSelect: false},
    {text: '电影',isSelect: false},
    {text: '宠物',isSelect: false},
    {text: '家具',isSelect: false},
    {text: '情感',isSelect: false},
    {text: '文化',isSelect: false},
    {text: '精选',isSelect: false},
    {text: '图片',isSelect: false},
    {text: '正能量',isSelect: false},
    {text: '冬奥',isSelect: false},
    {text: '收藏',isSelect: false},
    {text: '公益',isSelect: false},
    {text: '彩票',isSelect: false},
]
const fixedItems = [0,1];

export class SortAndFixedPage extends Component{

    constructor(props){
        super(props)

        this.state = {
            scrollEnabled: true,
            isEditState: false,
            selectedItems: items.filter((item,index)=>item.isSelect),
            unselectedItems: items.filter((item,index)=> !item.isSelect)
        }
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: '#fff',flex: 1}}>
                <ScrollView
                scrollEnabled = {this.state.scrollEnabled}
                style={styles.container}>
                <View style={styles.hurdle}>
                    <Text style={styles.hurdle_title}>{'我的频道'}</Text>
                    <TouchableOpacity style={styles.hurdle_edit} onPress={this.onEditClick}>
                        <Text style={styles.hurdle_edit_text}>{this.state.isEditState ? '完成' : '编辑'}</Text>
                    </TouchableOpacity>
                </View>
                <DragSortableView
                    dataSource={this.state.selectedItems}
                    parentWidth={sortWidth}
                    childrenWidth= {childrenWidth}
                    childrenHeight={childrenHeight}
                    fixedItems={fixedItems} //只能是前面的，不能断断续续例如[0,2,4]不行，[0,1,2,3,4]可以
                    marginChildrenTop={10}
                    onDragStart={this.onSelectedDragStart}
                    onDragEnd={this.onSelectedDragEnd}
                    onDataChange = {(data)=>{this.setState({selectedItems: data})}}
                    onClickItem={this.onSelectedClickItem}
                    keyExtractor={(item,index)=> item.text} // FlatList作用一样，优化
                    renderItem={this.renderSelectedItemView}/>
                <View style={[styles.hurdle,{justifyContent: 'flex-start',marginTop: 40}]}>
                    <Text style={styles.hurdle_title}>{'推荐频道'}</Text>
                </View>
                <DragSortableView
                    dataSource={this.state.unselectedItems}
                    parentWidth={sortWidth}
                    sortable = {false}
                    childrenWidth= {childrenWidth}
                    childrenHeight={childrenHeight}
                    marginChildrenTop={10}
                    onDataChange = {(data)=>{this.setState({unselectedItems: data})}}
                    onClickItem={this.onUnSelectedClickItem}
                    keyExtractor={(item,index)=> item.text} // FlatList作用一样，优化
                    renderItem={this.renderUnSelectedItemView}/>
            </ScrollView>
            </SafeAreaView>
        )
    }

    renderSelectedItemView = (item,index) => {
        const isFixed = fixedItems.includes(index)
        const clearIcon = this.state.isEditState && !isFixed ? <Image style={styles.selected_item_icon} source={require('../data/img/clear.png')}/> : undefined
        return (
            <View style={styles.selected_container}>
                <View style={isFixed ? styles.selected_item_fixed : styles.selected_item}>
                    <Text style={isFixed ? styles.selected_item_text_fixed : styles.selected_item_text}>{item.text}</Text>
                </View>
                {clearIcon}
            </View>
        )
    }

    renderUnSelectedItemView = (item,index) => {
        return (
            <View style={styles.selected_container}>
                <View style={styles.unselected_item}>
                    <Image style={styles.unselected_item_icon} source={require('../data/img/add.png')}/>
                    <Text style={styles.selected_item_text}>{item.text}</Text>
                </View>
            </View>
        )
    }

    onSelectedDragEnd = () => this.setState({scrollEnabled: true})

    onSelectedDragStart = () => {
        if (!this.state.isEditState) {
            this.setState({
                isEditState: true,
                scrollEnabled: false
            })
        } else {
            this.setState({
                scrollEnabled: false
            })
        }
    }

    onSelectedClickItem = (data,item,index) => {
        // delete, data 是最新的数据
        if (this.state.isEditState) {
            this.setState({
                selectedItems: [...data].filter((wItem,windex)=> windex !== index),
                unselectedItems: [item, ...this.state.unselectedItems]
            })
        }
    }

    onUnSelectedClickItem = (data,item,index) => {
        this.setState({
            selectedItems: [...this.state.selectedItems,item],
            unselectedItems: [...data].filter((wItem,windex)=> windex !== index)
        })
    }

    onEditClick = () => {
        this.setState({isEditState: !this.state.isEditState})
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    hurdle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },
    hurdle_title: {
        color: '#333',
        fontSize: 18,
        marginLeft: 15
    },
    hurdle_edit: {
        height: 24,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ff6548',
        marginRight: 15,
        borderRadius: 12
    },
    hurdle_edit_text: {
        color: '#ff6548',
        fontSize: 16
    },
    selected_container: {
        width: childrenWidth,
        height: childrenHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selected_item: {
        width: 72,
        height: 36,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selected_item_fixed: {
        width: 72,
        height: 36,
        backgroundColor: '#949494',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selected_item_text: {
        fontSize: 16,
        color: '#444'
    },
    selected_item_text_fixed: {
        fontSize: 16,
        color: '#f0f0f0'
    },
    selected_item_icon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        position: 'absolute',
        top: (childrenHeight - itemHeight - 16) / 2 + 16*0.25, //下移点
        left: (childrenWidth + itemWidth - 16) / 2 - 16*0.25 //右移点，也可以换个布局
    },
    unselected_item: {
        width: 72,
        height: 36,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    unselected_item_icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
        marginLeft: 6
    }
})
