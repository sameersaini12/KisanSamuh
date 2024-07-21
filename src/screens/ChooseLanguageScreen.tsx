import { Dimensions, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import StartingHeader from '../components/StartingHeader'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import languages from '../data/languageList'
import { useDispatch, useSelector } from 'react-redux'
import { updateLanguage } from '../features/userSlice'

const ChooseLanguageScreen = ({navigation} : any) => {
    const selectedLanguage = useSelector((state : any) => state.user.language)

    const dispatch = useDispatch()

    const changeLanguageHandler = ({id} : any) => {
        dispatch(updateLanguage(id))
    }
  return (
    <View>
        <StartingHeader navigation={navigation} />
        <Text style={styles.LanguageHeading}>Choose a Language</Text>
        {languages.map((item : any , index : any) => {
            return (
                <View key={index}>
                    <TouchableOpacity 
                        style={[styles.LanguageButtonContainer , {backgroundColor : (selectedLanguage==item.id) ? COLORS.primaryLightGreenHex : COLORS.primaryLightestGreyHex}]}
                        onPress={() => {
                            changeLanguageHandler(item.id)
                        }}
                    >
                        <Text style={[styles.LanguageButtonText , {color : (selectedLanguage==item.id) ? COLORS.primaryWhiteHex : COLORS.primaryBlackHex}]}>{item.name}</Text>
                    </TouchableOpacity>
                </View>
            )
        })}

        <TouchableOpacity
            onPress={() =>  {
                navigation.push("PhoneLoginScreen")
            }}
            style={styles.NextButtonContainer}
        >
            <Text style={styles.NextButtonText}>Next</Text>
        </TouchableOpacity>
    </View>
  )
}

export default ChooseLanguageScreen

const styles = StyleSheet.create({
    LanguageHeading : {
        fontSize : FONTSIZE.size_20,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
        margin : SPACING.space_18,
        
    },
    LanguageButtonContainer : {
        padding : SPACING.space_18,
        margin : SPACING.space_18,
        marginTop : -SPACING.space_4,
        borderRadius : BORDERRADIUS.radius_10
    },
    LanguageButtonText : {
        textAlign : "center",
        fontSize : FONTSIZE.size_14,
        fontFamily : FONTFAMILY.poppins_regular
    },
    NextButtonContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : SPACING.space_18,
        borderRadius : BORDERRADIUS.radius_15,
        width : Dimensions.get('window').width - SPACING.space_18*2,
        margin : SPACING.space_18,
    },
    NextButtonText : {
        color : COLORS.primaryWhiteHex,
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        textAlign : "center"
    }
})