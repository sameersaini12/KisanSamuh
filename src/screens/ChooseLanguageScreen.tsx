import { Dimensions, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import StartingHeader from '../components/StartingHeader'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import languages from '../data/languageList'
import { useDispatch, useSelector } from 'react-redux'
import { updateLanguage } from '../features/userSlice'
import CustomIcon from '../components/CustomIcon'
import { useTranslation } from 'react-i18next';


const ChooseLanguageScreen = ({navigation} : any) => {
    const selectedLanguage = useSelector((state : any) => state.user.language)
    const { t, i18n } = useTranslation();


    const dispatch = useDispatch()

    const backButtonHandler = () => {
        navigation.pop()
    }

    const changeLanguageHandler = (id : any) => {
        dispatch(updateLanguage(id))
        if(id===0) {
            changeLanguage('en')
        }else if(id==1) {
            changeLanguage('hi')
        }
    }

    const changeLanguage = (lng : any) => {
        i18n.changeLanguage(lng);
    };

  return (
    <View style={{height : "100%"}}>
        <View style={styles.StartingHeaderContainer}>
            <TouchableOpacity 
                onPress={backButtonHandler}
                style={styles.StartingHeaderBackButton}
            >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryBlackHex}
                />
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => {
                    const language_index : any = 0
                    dispatch(updateLanguage(language_index))
                    navigation.push("PhoneLoginScreen")
                }}
                style={styles.StartingHeaderSkipButton}>
                <Text style={styles.StartingHeaderSkipButtonText}>{t('skip')}</Text>
            </TouchableOpacity>

        </View>
        <Text style={styles.LanguageHeading}>{t('choose a language')}</Text>
        {languages.map((item : any , index : any) => {
            return (
                <View key={index}>
                    <TouchableOpacity 
                        style={[styles.LanguageButtonContainer , {backgroundColor : (selectedLanguage==item.id) ? COLORS.primaryLightGreenHex : COLORS.primaryLightestGreyHex}]}
                        onPress={() => {
                            changeLanguageHandler(item.id)
                        }}
                    >
                        <Text style={[styles.LanguageButtonText , {color : (selectedLanguage==item.id) ? COLORS.primaryWhiteHex : COLORS.primaryBlackHex}]}>{t(item.name.toLowerCase())}</Text>
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
            <Text style={styles.NextButtonText}>{t('next')}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default ChooseLanguageScreen

const styles = StyleSheet.create({
    StartingHeaderContainer : {
        flexDirection : 'row',
        padding : SPACING.space_18,
        alignItems : "center",
        justifyContent : 'space-between',
    },
    StartingHeaderBackButton : {

    },
    StartingHeaderSkipButton : {

    },
    StartingHeaderSkipButtonText : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryBlackHex
    },
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
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular
    },
    NextButtonContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : SPACING.space_16,
        width : "100%",
        position : "absolute",
        bottom : 0,
    },
    NextButtonText : {
        color : COLORS.primaryWhiteHex,
        fontSize : FONTSIZE.size_16*1.1,
        fontFamily : FONTFAMILY.poppins_regular,
        textAlign : "center"
    }
})