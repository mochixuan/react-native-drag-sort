import React,{Component} from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    ScrollView,
} from 'react-native'
const {width}  = Dimensions.get('window')

export default class MainPage extends Component{

    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.container}>
                        {
                            this.renderButtonStyle('AnyThreePage', () => {
                                this.props.navigation.navigate('AnyThreePage')
                            })
                        }
                        {
                            this.renderButtonStyle('AutomaticSlidingOnePage', () => {
                                this.props.navigation.navigate('AutomaticSlidingOnePage')
                            })
                        }
                        {
                            this.renderButtonStyle('AutomaticSlidingThreePage', () => {
                                this.props.navigation.navigate('AutomaticSlidingThreePage')
                            })
                        }
                        {
                            this.renderButtonStyle('ScrollView Page',()=>{
                                this.props.navigation.navigate('ScrollPage')
                            })
                        }
                        {
                            this.renderButtonStyle('ScrollFixedAddPage', () => {
                                this.props.navigation.navigate('ScrollFixedAddPage')
                            })
                        }
                        {
                            this.renderButtonStyle('Non-ScrollView Page',()=>{
                                this.props.navigation.navigate('NonScrollPage')
                            })
                        }
                        {
                            this.renderButtonStyle('Fixed number of rows',()=>{
                                this.props.navigation.navigate('FixedRowsPage')
                            })
                        }
                        {
                            this.renderButtonStyle('CommonSortPage',()=>{
                                this.props.navigation.navigate('CommonSortPage')
                            })
                        }
                        {
                            this.renderButtonStyle('OneRowsPage',()=>{
                                this.props.navigation.navigate('OneRowsPage')
                            })
                        }
                        {
                            this.renderButtonStyle('SortAndFixedPage', () => {
                                this.props.navigation.navigate('SortAndFixedPage')
                            })
                        }
                        {
                            this.renderButtonStyle('DragDeletePage', () => {
                                this.props.navigation.navigate('DragDeletePage')
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    renderButtonStyle = (text,click) => {
        return (
            <TouchableOpacity style={styles.button} onPress={()=> {
                if (click != null) {
                    click()
                }
            }}>
                <Text style={styles.button_text}>{text}</Text>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width,
        marginBottom: 20,
    },
    button: {
        width: width*0.6,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7da6ff',
        borderRadius: 2,
        marginTop: 20,
    },
    button_text: {
        fontSize: 18,
        color: '#fff'
    },
})
