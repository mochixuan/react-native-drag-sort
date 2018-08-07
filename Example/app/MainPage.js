import React,{Component} from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import ScrollPage from "./container/ScrollPage";
import NonScrollPage from "./container/NonScrollPage";
const {width}  = Dimensions.get('window')

export default class MainPage extends Component{

    render() {
        return (
            <View style={styles.container}>
                {
                    this.renderButtonStyle('ScrollView Page',()=>{
                        this.props.navigation.navigate('ScrollPage')
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
            </View>
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
        alignItems: 'center'
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