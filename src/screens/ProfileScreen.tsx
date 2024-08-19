import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import StartingHeader from '../components/StartingHeader'
import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useDispatch, useSelector } from 'react-redux'
import { TextInput } from 'react-native'
import { BottomSheetModal, BottomSheetModalProvider, SCREEN_HEIGHT } from '@gorhom/bottom-sheet'
import ChangeAddressModal from '../components/ChangeAddressModal'
import { updateCurrentAddressIndex, updateLanguage, updateName } from '../features/userSlice'
import languages from '../data/languageList'
import LottieView from 'lottie-react-native'
import {BASE_URL} from "@env"

const SCREEN_WIDTH = Dimensions.get("screen").height

const ProfileScreen = ({navigation} : any) => {

    const phoneNumber = useSelector((state : any) => state.user.phone)
    const email = useSelector((state : any) => state.user.email)
    const userId = useSelector((state : any) => state.user.id)
    const userToken = useSelector((state : any) => state.user.token)
    const currentAddressIndex = useSelector((state : any) => state.user.currentAddressIndex)
    const name = useSelector((state : any) => state.user.name)
    const languageIndex = useSelector((state : any) => state.user.language)
    const isLoggedIn = useSelector((state : any) => state.user.isLoggedIn)

    const [addressList , setAddressList ] = useState([])
    const [addressId , setAddressId] = useState('')
    const [selectedAddressName , setSelectedAddressName] = useState('')
    const [selectedAddress , setSelectedAddress] = useState(currentAddressIndex)
    const [addressListModalStatus , setAddressListModalStatus ] = useState(false)
    const [currentName , setCurrentName] = useState(name)
    const [languageModalStatus , setLanguageModalStatus ]  = useState(false)
    const [selectedLanguageName , setSelectedLanguageName] = useState(languages[languageIndex].name)
    const [selectedLanguageIndex , setSelectedLanguageIndex] = useState(languageIndex)

    const dispatch = useDispatch()

    const bottomSheetModalRef  = useRef<any | null>(null)
    const snapPoints = useMemo(() => ["50%" , "80%"],[])

    const openBottomModel= () => {
        bottomSheetModalRef.current?.present()
    }

    const closeBottomModel = () => {
        bottomSheetModalRef.current?.close()
    }


    const backButtonHandler = () => {
        navigation.pop()
    }

    const saveProfileInfoHandler = async() => {
        await fetch(`${BASE_URL}/users/update/${userId}` , {
            method : "PUT",
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Beared ${userToken}`
            },
            body : JSON.stringify({
                name : currentName
            })
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            dispatch(updateName(res.data.name))
            setCurrentName(res.data.name)
            navigation.pop()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const removeAddressHandler = async (addresId : any, addressIndex : any) => {
        console.log(addressId+ " " + addressIndex)
        await fetch(`${BASE_URL}/users/delete-address/${addressId}`, {
            method : "POST",
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            },
            body : JSON.stringify({
                index : addressIndex
            })
        })
        .then((res) => res.json())
        .then((res) => {
            setAddressList(res.data.address)
            if(currentAddressIndex===addressIndex) {
                const upadtedAddressIndex : any = 0
                dispatch(updateCurrentAddressIndex(upadtedAddressIndex))
            }
            if(res.data.address.length > 0) 
            setSelectedAddressName(res.data.address[currentAddressIndex].address)
            else   
            setSelectedAddressName('')
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const fetchAllAddresses = async () => {
        await fetch(`${BASE_URL}/users/get-address/${userId}`, {
             method : "GET",
             headers : {
                 Accept : "application/json",
                 "Content-Type" : "application/json",
                 Authorization : `Beared ${userToken}`
             },
         })
         .then((res) => res.json())
         .then((res) => {
             if(res.data) {
                setAddressList(res.data.address)
                setAddressId(res.data._id)
                setSelectedAddressName(res.data.address[currentAddressIndex].address)
             }
         })
         .catch((err) => {
             console.log(err)
         })
     }

    useEffect(() => {
        if(isLoggedIn) {
            fetchAllAddresses()
        }
    } , [])

  return (
    <GestureHandlerRootView>
        <BottomSheetModalProvider>
        <View style={styles.StartingHeaderContainer}>
            <TouchableOpacity 
                onPress={backButtonHandler}
                style={styles.StartingHeaderBackButton}
            >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <Pressable 
                onPress={() => {
                    saveProfileInfoHandler()
                }}
                style={styles.StartingHeaderSkipButton}
            >
                <Text style={styles.StartingHeaderSkipButtonText}>Done</Text>
            </Pressable>

        </View>
        <View style={styles.ProfileInfoUpperCard}>
          <View style={styles.DrawerProfilePicContainer}>
            <Image style={styles.DrawerProfilePicImage} source={require("../assets/default_profile_pic.png")} />
          </View>
          <View 
          style={{marginTop : SPACING.space_18}}>
            <TextInput 
                style={[styles.DrawerProfileInfoText , {fontSize :FONTSIZE.size_20*0.95}]}
                placeholder='Enter your Name'
                placeholderTextColor={COLORS.primaryWhiteHex}
                value={currentName}
                onChangeText={setCurrentName}
            >
              </TextInput>
          </View>
        </View>

        <ScrollView style={styles.ProfileInfoLowerCard}>
            <View>
                <Text style={styles.PhoneInputHeading}>Phone Number</Text>

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
                            value={phoneNumber.substr(phoneNumber.length- 10)}
                            maxLength={10}
                            editable={false}
                            // onChangeText={setPhoneNumber}
                        >
                        
                        </TextInput>
                    </TouchableOpacity>
                </View>
                
            </View>

            <View>
                <Text style={styles.PhoneInputHeading}>Email</Text>

                <TouchableOpacity 
                    style={styles.EmailInputContainer}
                >
                    <TextInput 
                        inputMode='text'
                        style={styles.PhoneNumberInput}
                        value={email}
                        // onChangeText={setPhoneNumber}
                    >
                    
                    </TextInput>
                </TouchableOpacity>
            </View>

            <View>
                <Text style={styles.PhoneInputHeading}>Address</Text>

                <TouchableOpacity 
                    style={styles.EmailInputContainer}
                    onPress={() => {
                        setAddressListModalStatus(!addressListModalStatus)
                    }}
                >
                    <Text
                        style={styles.PhoneNumberInput}
                    >
                        {selectedAddressName}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{marginBottom : SPACING.space_18*2}}>
                <Text style={styles.PhoneInputHeading}>Language</Text>

                <TouchableOpacity 
                    style={styles.EmailInputContainer}
                    onPress={() => {
                        setLanguageModalStatus(!languageModalStatus)
                    }}
                >
                    <Text
                        style={styles.PhoneNumberInput}
                    >
                        {selectedLanguageName}
                    </Text>
                </TouchableOpacity>
            </View>


        </ScrollView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={addressListModalStatus}
            onRequestClose={() => {
                setAddressListModalStatus(!addressListModalStatus);
            }}
        >
            <View style={styles.AddressModalContainers}>
                    <View style={styles.BillDetailsContainer}>
                            <Text style={styles.BillDetailsHeading}>Change Address Details</Text>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={styles.AddressListContainer}>
                                {addressList.length==0 ? 
                                <View>
                                    <Text style={{textAlign : "center"}}>No address added yet</Text>
                                    <LottieView
                                        source={require("../components/lottie/Location.json")}
                                        style={{height : 220}}
                                        autoPlay
                                        loop
                                    />
                                </View>
                                 :
                                (
                                    addressList.map((address :any , index : any) => {
                                        return (
                                            <View key={index}>
                                                <Pressable 
                                                    onPress={() => {
                                                        setSelectedAddressName(address.address)
                                                        setSelectedAddress(index)
                                                        dispatch(updateCurrentAddressIndex(index))
                                                    }}
                                                    style={styles.AddressListItem} 
                                                >
                                                    <View style={[styles.AddressListItemRadio , {borderColor : selectedAddress == index ? COLORS.primaryLightGreenHex : COLORS.secondaryLightGreyHex}]}>
                                                        <View style={[styles.AddressListItemRadioSelected , {display : selectedAddress == index ? "flex" : "none"}]}></View>
                                                    </View>
                                                    <Text style={styles.AddressListItemText}>{address.landmark}, {address.address}, {address.city}, {address.state} {" "}
                                                        <Pressable
                                                            onPress={() => removeAddressHandler(address._id, index)}
                                                        >
                                                            <CustomIcon
                                                                name='bin'
                                                                size={17}
                                                                color={COLORS.primaryLightGreenHex}
                                                            />
                                                        </Pressable> 
                                                    </Text>
                                                </Pressable>
                                                <View style={styles.AddressHorizontailRule}>
                                                </View>
                                            </View>
                                            
                                        )
                                    })
                                    
                                )
                                
                            }
                            <Pressable
                                style={styles.AddAddressContainer}
                                onPress={() => {
                                    setAddressListModalStatus(!addressListModalStatus)
                                    openBottomModel()
                                }}
                            >
                                <CustomIcon
                                    name='location21'
                                    size={22}
                                    color={COLORS.primaryLightGreenHex}
                                />
                                <Text style={styles.AddressListItemText}>Add new Address</Text>
                            </Pressable>
                            </ScrollView>

                            <Pressable
                                style={styles.ChangeAddressButtonContainer}
                                onPress={() => setAddressListModalStatus(!addressListModalStatus)}
                                >
                                <Text style={styles.ChangeAddressButtonText}>Done</Text>
                            </Pressable>
                            
                        </View>
            </View>
        </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible={languageModalStatus}
            onRequestClose={() => {
                setLanguageModalStatus(!languageModalStatus);
            }}
        >
            <View style={[styles.AddressModalContainers , {width : 250 , marginTop : SCREEN_HEIGHT*0.34, marginBottom : SCREEN_HEIGHT*0.3, marginLeft : 70}]}>
                    <View style={styles.BillDetailsContainer}>
                            <Text style={styles.BillDetailsHeading}>Select any Language</Text>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={styles.AddressListContainer}>
                                {languages.length==0 ? 
                                <Text>No languages</Text> :
                                (
                                    languages.map((language :any , index : any) => {
                                        return (
                                            <View key={index}>
                                                <Pressable 
                                                    onPress={() => {
                                                        setSelectedLanguageName(language.name)
                                                        setSelectedLanguageIndex(index)
                                                        dispatch(updateLanguage(index))
                                                        setLanguageModalStatus(!languageModalStatus)
                                                    }}
                                                    style={styles.AddressListItem} 
                                                >
                                                    <View style={[styles.AddressListItemRadio , {borderColor : selectedLanguageIndex == index ? COLORS.primaryLightGreenHex : COLORS.secondaryLightGreyHex}]}>
                                                        <View style={[styles.AddressListItemRadioSelected , {display : selectedLanguageIndex == index ? "flex" : "none"}]}></View>
                                                    </View>
                                                    <Text style={styles.AddressListItemText}>{language.name} </Text>
                                                </Pressable>
                                                <View style={styles.AddressHorizontailRule}>
                                                </View>
                                            </View>
                                            
                                        )
                                    })
                                    
                                )
                                
                            }
                            <Pressable
                                style={[styles.ChangeAddressButtonContainer , {marginTop : SPACING.space_16}]}
                                onPress={() => setLanguageModalStatus(!languageModalStatus)}
                                >
                                <Text style={styles.ChangeAddressButtonText}>Okay</Text>
                            </Pressable>
                            </ScrollView>
                        </View>
            </View>
        </Modal>



        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
        >
            <View>
                <ChangeAddressModal navigation={navigation} closeBottomModel={closeBottomModel} fetchAllAddresses={fetchAllAddresses} setSelectedAddressName={setSelectedAddressName} setSelectedAddress={setSelectedAddress} />
            </View>
        </BottomSheetModal>
            
        </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    StartingHeaderContainer : {
        flexDirection : 'row',
        padding : SPACING.space_18,
        alignItems : "center",
        justifyContent : 'space-between',
        backgroundColor : COLORS.primaryLightGreenHex
    },
    StartingHeaderBackButton : {

    },
    StartingHeaderSkipButton : {

    },
    StartingHeaderSkipButtonText : {
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryWhiteHex
    },
    ProfileInfoUpperCard : {
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : SPACING.space_18,
        alignItems : "center",
        borderBottomLeftRadius : BORDERRADIUS.radius_20*1.5,
        borderBottomRightRadius : BORDERRADIUS.radius_20*1.5
    },
    ProfileInfoLowerCard : {
        padding: SPACING.space_18,
    },
    DrawerProfilePicContainer : {
        alignItems : "center",
        justifyContent: 'center',
        borderWidth : 1.5,
        borderRadius : BORDERRADIUS.radius_25*3,
        borderColor : COLORS.primaryWhiteHex,
        backgroundColor : COLORS.secondaryLightGreenHex,
      },
      DrawerProfilePicImage : {
        borderRadius : BORDERRADIUS.radius_25*3,
        height : SPACING.space_30*3,
        width : SPACING.space_30*3,
      },
      DrawerProfileInfoText : {
        fontSize : FONTSIZE.size_20*0.8,
        color : COLORS.primaryWhiteHex,
        fontFamily :FONTFAMILY.poppins_regular,
        textAlign : "center",
        width : 170,
      },
      DrawerEditPencilIcon : {
      },
      ProfilePhoneNumberContainer : {
        flexDirection : "row",
        alignItems : "center"
      },
      ProfilePhoneNumberText : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryLightGreyHex,
        marginLeft : SPACING.space_18
      },
      HorizontalRule : {
        padding : 0.5,
        backgroundColor : COLORS.primaryLightGreyHex,
        marginTop : SPACING.space_18
      },
      PhoneInputHeading : {
        fontSize : FONTSIZE.size_16,
        margin  :SPACING.space_18,
        marginLeft : 0,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryBlackHex,
      },
      PhoneNumberContainer: {
        flexDirection : "row",
        marginTop : - SPACING.space_10,
        justifyContent : "space-between",
      },
      PhoneNumberCountryContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        padding : SPACING.space_18,
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
        width : 240,
      },
      PhoneNumberInput : {
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium,
        padding :SPACING.space_18,
        color : COLORS.primaryBlackHex
      },
      EmailInputContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
      },
      AddressModalContainers : {
        padding : SPACING.space_18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft : 22,
        marginRight : 22,
        marginTop : SCREEN_HEIGHT*0.2,
        marginBottom : SCREEN_HEIGHT*0.2,
        backgroundColor : COLORS.primaryWhiteHex,
        borderRadius : BORDERRADIUS.radius_10,
        elevation : 450,

      },
      BillDetailsContainer : {
    },
    BillDetailsHeading : {
        fontSize :FONTSIZE.size_20,
        fontFamily : FONTFAMILY.poppins_bold,
        color : COLORS.primaryBlackHex
    },
    AddressListContainer : {
        padding : SPACING.space_10,
    },
    AddressListItem : {
        flexDirection : "row",
        alignItems : "center",
        paddingRight : SPACING.space_18
    },
    AddressListItemRadio : {
        borderWidth : 2,
        width: SPACING.space_10*2,
        height : SPACING.space_10*2,
        borderRadius : BORDERRADIUS.radius_25,
        margin : SPACING.space_10,
        marginLeft : 0,
        alignItems : "center",
        justifyContent : "center",
    },
    AddressListItemRadioSelected : {
        width: SPACING.space_10,
        height : SPACING.space_10,
        backgroundColor : COLORS.primaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_25,
    },
    AddressListItemText : {
        fontSize :FONTSIZE.size_16,
        margin : SPACING.space_10,
        color : COLORS.primaryBlackHex,
        fontFamily : FONTFAMILY.poppins_regular
    },
    AddressHorizontailRule : {
        padding : 0.5,
        backgroundColor : COLORS.secondaryLightGreyHex
    },
    AddAddressContainer : {
        flexDirection : "row",
        marginTop : SPACING.space_10,
        alignItems : "center",
        marginBottom : SPACING.space_18
    },
    ChangeAddressButtonContainer : {
        padding: SPACING.space_10,
        backgroundColor : COLORS.primaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_10,

    },
    ChangeAddressButtonText : {
        textAlign : "center",
        fontSize : FONTSIZE.size_16,
        color : COLORS.primaryWhiteHex,
        fontFamily :FONTFAMILY.poppins_regular,
    },
})