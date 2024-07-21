import { Dimensions, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import StartingHeader from '../components/StartingHeader'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'

const PhoneLoginScreen = ({navigation} : any) => {
  const [phoneNumber , setPhoneNumber] = useState('')

  const handleSendOTPButton = async () => {
    await fetch("http://10.0.2.2:4000/auth/send-otp" , {
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
      navigation.push('PhoneOTPScreen' , {
        number : '+91'+phoneNumber
      })
    })
  }

  return (
    <View>
      <StartingHeader navigation={navigation} />
      <Text style={styles.PhoneLoginHeading}>Login or Sign up</Text>
      <Text style={styles.PhoneInputHeading}>Enter your mobile number</Text>

      <View style={styles.PhoneNumberContainer}>
        <TouchableOpacity style={styles.PhoneNumberCountryContainer}>
          <Text style={styles.PhoneNumberCountry}>🇮🇳  +91</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.PhoneNumberInputContainer}
        >
          <TextInput 
            inputMode='numeric'
            style={styles.PhoneNumberInput}
            value={phoneNumber}
            maxLength={10}
            placeholder='1234567890'
            onChangeText={setPhoneNumber}
          >
            
          </TextInput>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
            onPress={handleSendOTPButton}
            style={styles.NextButtonContainer}
        >
            <Text style={styles.NextButtonText}>Next</Text>
        </TouchableOpacity>

    </View>
  )
}

export default PhoneLoginScreen

const styles = StyleSheet.create({
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