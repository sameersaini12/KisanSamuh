import { Dimensions, Pressable, StyleSheet, Text, Touchable, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { useDispatch, useSelector } from 'react-redux'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'

const ModalWidth = Dimensions.get('window').width*0.5 - SPACING.space_18*1.5;

const ChangeAddressModal = ({navigation , closeBottomModel , fetchAllAddresses , setSelectedAddressName , setSelectedAddress} : any) => {
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


    const userId = useSelector((state : any) => state.user.id)
    const userToken = useSelector((state : any) => state.user.token)

    const dispatch = useDispatch()

    const AddAddressButtonHandler = () => {
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
            fetch(`http://10.0.2.2:4000/users/add-address/${userId}`, {
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
                Enter New Address Details
            </Text>
        </View>
      <View style={styles.AddressModalFormContainer}>
        <TextInput
            style={[styles.AddressInput , {borderColor : addAddressError ? "red" : COLORS.secondaryLightGreyHex}]}
            value={address}
            onChangeText={setAddress}
            placeholder='Address*'
         />
         <View style={styles.AddressModalInputContainer}>
            <TextInput 
                style={[styles.AddressInput , {width : ModalWidth , borderColor : addLandmarkError ? "red" : COLORS.secondaryLightGreyHex}]}
                value={landmark}
                onChangeText={setLandMark}
                placeholder='Landmark*'
            />
            <TextInput
                style={[styles.AddressInput , {width : ModalWidth , borderColor : addCityError ? "red" : COLORS.secondaryLightGreyHex}]}
                value={city}
                onChangeText={setCity}
                placeholder='City*'
            />
         </View>
         <View style={styles.AddressModalInputContainer}>
            <TextInput
                keyboardType='numeric'
                style={[styles.AddressInput , {width : ModalWidth,borderColor : addPincodeError ? "red" : COLORS.secondaryLightGreyHex}]}
                value={pincode}
                maxLength={6}
                onChangeText={setPincode}
                placeholder='Pincode*'
            />
            <TextInput
                style={[styles.AddressInput , {width : ModalWidth, borderColor : addStateError ? "red" : COLORS.secondaryLightGreyHex}]}
                value={state}
                onChangeText={setState}
                placeholder='State*'
            />
         </View>
         <Pressable 
            onPress={() => {
                console.log("address new ")
                AddAddressButtonHandler()
            }}
            style={styles.AddressModalSubmitButtonContainer}
        >
            <Text style={styles.AddressModalSubmitButtonText}>Add new Address</Text>
         </Pressable>

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