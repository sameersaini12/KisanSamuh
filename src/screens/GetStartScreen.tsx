import { Dimensions, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'

const GetStartScreen = ({navigation} : any) => {
  return (
    <View style={styles.GetStartContainer}>
        <View style={styles.GetStartUpper}>
            <Text style={styles.GetStartAppNameFirst}> Kisan 
            <Text style={styles.GetStartAppNameSecond}> Samuh</Text>
            </Text>
            <Text style={styles.GetStartTagLine}>Welcome to Kisan Samuh, Let's connected</Text>
        </View>
        <LottieView
            style={styles.GetStartGif}
            source={require("../components/lottie/GetStart.json")}
            autoPlay
            loop
        />
        <TouchableOpacity
            onPress={() =>  {
                navigation.push("LanguageScreen")
            }}
            style={styles.GetStartButtonContainer}
        >
            <Text style={styles.GetStartButtonText}>Get Start</Text>
        </TouchableOpacity>
    </View>
  )
}

export default GetStartScreen

const styles = StyleSheet.create({
    GetStartContainer : {
        alignItems : 'center',
    },
    GetStartGif: {
        height: 500,
        width : 300
    },
    GetStartUpper : {
        marginTop : SPACING.space_36*2
    },
    GetStartAppNameFirst : {
        textAlign : "center",
        fontSize : FONTSIZE.size_24,
        fontFamily : FONTFAMILY.poppins_bold,
        color : COLORS.primaryLightGreenHex

    },
    GetStartAppNameSecond : {
        color : COLORS.primaryLightGreyHex
    },
    GetStartTagLine : {
        fontSize : FONTSIZE.size_12,
        fontFamily : FONTFAMILY.poppins_medium,
        marginTop : -5,
    },
    GetStartButtonContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : SPACING.space_18,
        borderRadius : BORDERRADIUS.radius_15,
        width : Dimensions.get('window').width - SPACING.space_18*2
    },
    GetStartButtonText : {
        color : COLORS.primaryWhiteHex,
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        textAlign : "center"
    }
})