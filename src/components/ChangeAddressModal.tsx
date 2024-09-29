import { Dimensions, TouchableOpacity, StyleSheet, Text, Touchable, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import {BASE_URL} from "@env"
import { useTranslation } from 'react-i18next'

const ModalWidth = Dimensions.get('window').width*0.5 - SPACING.space_18*1.5;

const ChangeAddressModal = ({navigation , closeBottomModel , fetchAllAddresses , setSelectedAddressName , setSelectedAddress} : any) => {

    const {t} = useTranslation()
    const [address , setAddress] = useState('')
    const [landmark , setLandMark ] = useState('')
    const [city , setCity] = useState('')
    const [pincode, setPincode] = useState('')
    const [state , setState] = useState('')

    const [addAddressError , setAddAddressError] = useState(false)
    const [addLandmarkError , setAddLandmarkError] = useState(false)
    const [addCityError , setAddCityError] = useState(false)
    const [addPincodeError , setAddPincodeError ] = useState(false)
    const [addStateError , setAddStateError] = useState(false)
    const [buttonLoading , setButtonLoading ] = useState(false)


    const userId = useSelector((state : any) => state.user.id)
    const userToken = useSelector((state : any) => state.user.token)

    const dispatch = useDispatch()

    const AddAddressButtonHandler = async () => {
        if(address==='' || landmark==='' || city==='' || state==='' || pincode==='') {
            if(address==='') {
                setAddAddressError(true)
            }
            if(landmark==='') {
                setAddLandmarkError(true)
            }
            if(city==='') {
                setAddCityError(true)
            }
            if(pincode==='') {
                setAddPincodeError(true)
            }
            if(state==='') {
                setAddStateError(true)
            }
        }
        else {
            setButtonLoading(true)
            await fetch(`${BASE_URL}/users/add-address/${userId}`, {
                method : "POST",
                headers : {
                    Accept : "application/json",
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${userToken}`
                },
                body : JSON.stringify({
                    address,
                    landmark,
                    city,
                    pincode,
                    state
                })
            })
            .then((res) => res.json())
            .then((res) => {
                closeBottomModel()
                fetchAllAddresses()
            })
            .catch((err) => {
                console.log(err)
            })
            setButtonLoading(false)
        }
    }

    useEffect(() => {
        if(address!=='') {
            setAddAddressError(false)
        }
        if(city!=='') {
            setAddCityError(false)
        }
        if(pincode!=='') {
            setAddPincodeError(false)
        }
        if(landmark!=='') {
            setAddLandmarkError(false)
        }
        if(state!=='') {
            setAddStateError(false)
        }
    } , [address, city, pincode, landmark, state])
    

  return (
    <View style={styles.AddressModalContainer}>
        <View style={styles.AddressFormTitleContainer}>
            <Text style={styles.AddressFormTitle}>
                {t("Enter New Address Details")}
            </Text>
        </View>
      <View style={styles.AddressModalFormContainer}>
        <TextInput
            style={[styles.AddressInput , {borderColor : addAddressError ? "red" : COLORS.secondaryLightGreyHex}]}
            value={address}
            onChangeText={setAddress}
            placeholder={t("Address")+"*"}
            placeholderTextColor={COLORS.secondaryLightGreyHex}
         />
         <View style={styles.AddressModalInputContainer}>
            <TextInput 
                style={[styles.AddressInput , {width : ModalWidth , borderColor : addLandmarkError ? "red" : COLORS.secondaryLightGreyHex}]}
                value={landmark}
                onChangeText={setLandMark}
                placeholder={t("Landmark")+"*"}
                placeholderTextColor={COLORS.secondaryLightGreyHex}
            />
            <TextInput
                style={[styles.AddressInput , {width : ModalWidth , borderColor : addCityError ? "red" : COLORS.secondaryLightGreyHex}]}
                value={city}
                onChangeText={setCity}
                placeholder={t("City")+"*"}
                placeholderTextColor={COLORS.secondaryLightGreyHex}
            />
         </View>
         <View style={styles.AddressModalInputContainer}>
            <TextInput
                keyboardType='numeric'
                style={[styles.AddressInput , {width : ModalWidth,borderColor : addPincodeError ? "red" : COLORS.secondaryLightGreyHex}]}
                value={pincode}
                maxLength={6}
                onChangeText={setPincode}
                placeholder={t("Pincode")+"*"}
                placeholderTextColor={COLORS.secondaryLightGreyHex}
            />
            <TextInput
                style={[styles.AddressInput , {width : ModalWidth, borderColor : addStateError ? "red" : COLORS.secondaryLightGreyHex}]}
                value={state}
                onChangeText={setState}
                placeholder={t("State")+"*"}
                placeholderTextColor={COLORS.secondaryLightGreyHex}
            />
         </View>
         <TouchableOpacity 
            disabled={buttonLoading}
            onPress={() => {
                if(!buttonLoading) {
                    AddAddressButtonHandler()
                }

            }}
            style={styles.AddressModalSubmitButtonContainer}
        >
            <Text style={styles.AddressModalSubmitButtonText}>{t("Add new Address")}</Text>
         </TouchableOpacity>

      </View>
    </View>
  )
}

export default ChangeAddressModal

const styles = StyleSheet.create({
    AddressModalContainer : {
        padding : SPACING.space_18,
    },
    AddressFormTitleContainer : {
        marginBottom : SPACING.space_18
    },
    AddressFormTitle : {
        fontFamily : FONTFAMILY.poppins_regular,
        fontSize : FONTSIZE.size_16,
        color : COLORS.primaryBlackHex,
    },
    AddressModalFormContainer : {

    },
    AddressModalInputContainer : {
        flexDirection : "row",
        justifyContent : "space-between",
        flexWrap : "wrap"
    },
    AddressInput: {
        borderWidth : 1,
        borderColor : COLORS.secondaryLightGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        paddingLeft : SPACING.space_10,
        fontFamily : FONTFAMILY.poppins_regular,
        marginBottom : SPACING.space_16,
        color : COLORS.primaryLightGreyHex
        
    },
    AddressModalSubmitButtonContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : SPACING.space_18,
        borderRadius : BORDERRADIUS.radius_10
    },
    AddressModalSubmitButtonText : {
        color : COLORS.primaryWhiteHex,
        textAlign : "center",
        fontFamily : FONTFAMILY.poppins_regular,
    },
})