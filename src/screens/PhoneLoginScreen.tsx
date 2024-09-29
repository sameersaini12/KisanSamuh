import { Dimensions, Pressable, StyleSheet, Text, TextInput, ToastAndroid, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import StartingHeader from '../components/StartingHeader'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import CustomIcon from '../components/CustomIcon'
import { useDispatch } from 'react-redux'
import { updateEnterInAppStatus } from '../features/userSlice'
import {BASE_URL} from "@env"
import LottieView from 'lottie-react-native'
import { useTranslation } from 'react-i18next';

const PhoneLoginScreen = ({navigation} : any) => {
  const [phoneNumber , setPhoneNumber] = useState('')
  const [addPhoneNumberError , setAddPhoneNumberError] = useState(false)
  const [otpError , setOtpError ] = useState(false)
  const [loading , setLoading] = useState(false)

  const {t} = useTranslation()

  const backButtonHandler = () => {
      navigation.pop()
  }

  const dispatch = useDispatch()

  const handleSendOTPButton = async () => {
    if(phoneNumber.length!==10) {
      ToastAndroid.show("Phone Number is incorrent" , ToastAndroid.SHORT)
      setAddPhoneNumberError(true)
    }else {
      setLoading(true)
      await fetch(`${BASE_URL}/auth/send-otp` , {
        method : "POST",
        headers : {
          Accept : "application/json",
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          phone : '+91'+phoneNumber
        })
      }).then((resp) => resp.json())
      .then((res) => {
        console.log(JSON.stringify(res))
        if(res.data) {
          navigation.push('PhoneOTPScreen' , {
            number : '+91'+phoneNumber,
            otp : res.data,
          })
        }else {
          setOtpError(true)
          ToastAndroid.show("Error Occurs" , ToastAndroid.SHORT)
        }
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    if(phoneNumber!=='') {
      setAddPhoneNumberError(false)
    }
  }, [phoneNumber])

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
          <TouchableOpacity 
            onPress={() => {
              const enterInAppStatus : any = true
              dispatch(updateEnterInAppStatus(enterInAppStatus))
              navigation.navigate('Tab')
            }}
            style={styles.StartingHeaderSkipButton}>
              <Text style={styles.StartingHeaderSkipButtonText}>{t('skip')}</Text>
          </TouchableOpacity>

      </View>
      <Text style={styles.PhoneLoginHeading}>{t('login or signup')}</Text>
      <Text style={styles.PhoneInputHeading}>{t('enter your mobile number')}</Text>

      <View style={styles.PhoneNumberContainer}>
        <TouchableOpacity style={styles.PhoneNumberCountryContainer}>
          <Text style={styles.PhoneNumberCountry}>🇮🇳  +91</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.PhoneNumberInputContainer , {borderColor : addPhoneNumberError ? COLORS.primaryRedHex : "" , borderWidth : addPhoneNumberError ? 1 : 0}]}
        >
          <TextInput 
            inputMode='numeric'
            style={styles.PhoneNumberInput}
            value={phoneNumber}
            maxLength={10}
            onChangeText={setPhoneNumber}
            placeholderTextColor={COLORS.primaryLightGreyHex}
          >
            
          </TextInput>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
            onPress={() => {
              if(phoneNumber==='') {
                ToastAndroid.show(t('enter your mobile number') , ToastAndroid.SHORT)
                setAddPhoneNumberError(true)
              }else if(!loading)
                handleSendOTPButton()
            }}
            style={[styles.NextButtonContainer , {opacity : loading ? 0.5 : 1}]}
        >
            <Text style={styles.NextButtonText}>{t('next')}
            </Text>
        </TouchableOpacity>

    </View>
  )
}

export default PhoneLoginScreen

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
  PhoneLoginHeading: {
    fontSize : FONTSIZE.size_20,
    fontFamily : FONTFAMILY.poppins_medium,
    color : COLORS.primaryBlackHex,
    margin : SPACING.space_18,
  },
  PhoneInputHeading : {
    fontSize : FONTSIZE.size_16,
    margin  :SPACING.space_18,
    fontFamily : FONTFAMILY.poppins_regular,
    color : COLORS.primaryBlackHex,
  },
  PhoneNumberContainer: {
    margin : SPACING.space_18,
    flexDirection : "row",
    marginTop : - SPACING.space_10
  },
  PhoneNumberCountryContainer : {
    backgroundColor : COLORS.primaryLightestGreyHex,
    padding : SPACING.space_15,
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius : BORDERRADIUS.radius_10,
  },
  PhoneNumberCountry : {
    fontSize : FONTSIZE.size_18,
    fontFamily : FONTFAMILY.poppins_medium,
    color : COLORS.primaryBlackHex
  },
  PhoneNumberInputContainer : {
    backgroundColor : COLORS.primaryLightestGreyHex,
    borderRadius : BORDERRADIUS.radius_10,
    marginLeft : SPACING.space_15,
    flex : 1,
    justifyContent : "center"
  },
  PhoneNumberInput : {
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