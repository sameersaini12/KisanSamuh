import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import StartingHeader from '../components/StartingHeader'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { updateIsLoggedInStatus, updateName, updatePhone, updateToken, updateid } from '../features/userSlice'

const PhoneOTPScreen = ({navigation , route} : any) => {
    const [otp , setOtp] = useState('')


    const dispatch = useDispatch()


    const handleOTPVerifyButton = async () => {
        await fetch("http://10.0.2.2:4000/auth/verify-otp" , {
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
            console.log(JSON.stringify(res))
            await AsyncStorage.setItem('isLoggedIn' , JSON.stringify(true))
            await AsyncStorage.setItem('token' , JSON.stringify(res.data.token))
            await AsyncStorage.setItem('id' , JSON.stringify(res.data._id))
            const loginStatus : any = true
            dispatch(updateIsLoggedInStatus(loginStatus))
            dispatch(updateid(res.data._id))
            dispatch(updateToken(res.data.token))
            dispatch(updatePhone(res.data.phone))
            if(res.data.name) {
                dispatch(updateName(res.data.name))
            }
            navigation.push('Tab')
        })
    }


  return (
    <View>
      <StartingHeader navigation={navigation} />
      <Text style={styles.OTPHeading}>OTP Verification</Text>
      <Text style={styles.OTPInputHeading}>Enter the four digit code sent you at +91****{route.params.number.substr(route.params.number.length - 4)}</Text>

      <TouchableOpacity style={styles.OTPInputContainer}>
          <TextInput 
            inputMode='numeric'
            style={styles.OTPInput}
            maxLength={4}
            placeholder='OTP'
            value={otp}
            onChangeText={setOtp}
          >
            
          </TextInput>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={handleOTPVerifyButton}
            style={styles.NextButtonContainer}
        >
            <Text style={styles.NextButtonText}>Next</Text>
        </TouchableOpacity>
    </View>
  )
}

export default PhoneOTPScreen

const styles = StyleSheet.create({ 
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
        padding :SPACING.space_18
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