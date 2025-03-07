import { Dimensions, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import StartingHeader from '../components/StartingHeader'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { updateEmail, updateEnterInAppStatus, updateIsAdmin, updateIsLoggedInStatus, updateName, updatePhone, updateToken, updateid } from '../features/userSlice'
import {BASE_URL} from "@env"
import CustomIcon from '../components/CustomIcon'
import { useTranslation } from 'react-i18next' 

const PhoneOTPScreen = ({navigation , route} : any) => {
    const [otp , setOtp] = useState('')
    const [loading , setLoading] = useState(false)
    const [incorrectOTP , setIncorrectOTP] = useState(false)
    const {t } = useTranslation()

    const dispatch = useDispatch()

    const backButtonHandler = () => {
        navigation.pop()
    }


    const handleOTPVerifyButton = async () => {
        setLoading(true)
        await fetch(`${BASE_URL}/auth/verify-otp` , {
            method : "POST",
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                phone : route.params.number,
                otp : otp
            })
        })
        .then((resp) => resp.json())
        .then(async (res) => {
            if(res.message==="OTP is incorrect") {
                ToastAndroid.show(t('incorrect otp'), ToastAndroid.SHORT)
                setIncorrectOTP(true)
            }else{
                const loginStatus : any = true
                dispatch(updateIsLoggedInStatus(loginStatus))
                dispatch(updateid(res.data._id))
                dispatch(updateToken(res.data.token))
                dispatch(updatePhone(res.data.phone))
                dispatch(updateEmail(res.data.email))
                if(res.data.name) {
                    dispatch(updateName(res.data.name))
                }
                dispatch(updateIsAdmin(res.data.isAdmin))
                const enterInAppStatus : any = true
                dispatch(updateEnterInAppStatus(enterInAppStatus))
                navigation.push('Tab')
            }
        })
        .catch((err) => {
            console.log(err)
        })
        setLoading(false)
    }


  return (
    <View>
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
        </View>
      <Text style={styles.OTPHeading}>{t('otp verification')}</Text>
      <Text style={styles.OTPInputHeading}>{t('enter the four digit code sent you at')} +91****{route.params.number.substr(route.params.number.length - 4)}</Text>
      <Text style={styles.OTPInputHeading}>{t('your otp is')} {route.params.otp}</Text>

      <TouchableOpacity style={[styles.OTPInputContainer , {borderColor : incorrectOTP ? COLORS.primaryRedHex : "" , borderWidth : incorrectOTP ? 1 : 0}]}>
          <TextInput 
            inputMode='numeric'
            style={styles.OTPInput}
            maxLength={4}
            placeholder={t('otp')}
            value={otp}
            onChangeText={setOtp}
            placeholderTextColor={COLORS.primaryLightGreyHex}
          >
          </TextInput>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={handleOTPVerifyButton}
            style={[styles.NextButtonContainer , {opacity : loading ? 0.5 : 1}]}
        >
            <Text style={styles.NextButtonText}>{t('next')}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default PhoneOTPScreen

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
        fontFamily : FONTFAMILY.poppins_regular
    },
    OTPHeading : {
        fontSize : FONTSIZE.size_20,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
        margin : SPACING.space_18,
    },
    OTPInputHeading : {
        fontSize : FONTSIZE.size_16,
        margin  :SPACING.space_18,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryBlackHex,
    },
    OTPInputContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        margin : SPACING.space_18,
        justifyContent : "center"
    },
    OTPInput : {
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium,
        padding :SPACING.space_18,
        color : COLORS.primaryBlackHex,
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