import { Button, Pressable, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import CustomIcon from '../components/CustomIcon'
import { useDispatch, useSelector } from 'react-redux'
import CartItem from '../components/CartItem.tsx'
import HeaderBar from '../components/HomeHeaderBar.tsx'
import LottieView from 'lottie-react-native'
import { Modal } from 'react-native-paper'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ChangeAddressModal from '../components/ChangeAddressModal.tsx'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { updateEnterInAppStatus } from '../features/userSlice.ts'
import {BASE_URL} from "@env"
import AddressLoadingSkeleton from '../components/AddressLoadingSkeleton.tsx'
import { Image } from 'react-native'

const CartScreen = ({navigation , route} : any) => {
    const cartItemList = useSelector((state : any) => state.cart.CartList)
    const totalCartPrice = useSelector((state : any) => state.cart.CartPrice)
    const userLoginStatus = useSelector((state : any) => state.user.isLoggedIn)
    const userId = useSelector((state : any) => state.user.id)
    const userToken = useSelector((state : any) => state.user.token)
    const currentAddressIndex = useSelector((state : any) => state.user.currentAddressIndex)


    const [addressList , setAddressList] = useState([])
    const [selectedAddress, setSelectedAddress ] = useState(currentAddressIndex)
    const [selectedAddressName , setSelectedAddressName] = useState('')
    const [openAddressModal , setOpenAddressModal] = useState(false)
    const [addressLoading , setAddressLoading ] = useState(true)
    const [noAddresses, setNoAddresses] = useState(false)

    const dispatch = useDispatch()

    //ref
    const bottomSheetModalRef  = useRef<any | null>(null)
    const snapPoints = useMemo(() => ["50%", "80%"],[])

    const openBottomModel= () => {
        bottomSheetModalRef.current?.present()
    }

    const closeBottomModel = () => {
        bottomSheetModalRef.current?.close()
    }


    const backButtonHandler = () => {
        navigation.pop()
    }

    const fetchAllAddresses = async () => {
       await  fetch(`${BASE_URL}/users/get-address/${userId}`, {
            method : "GET",
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Beared ${userToken}`
            },
        })
        .then((res) => res.json())
        .then((res) => {
            setAddressLoading(true)
            if(res.data) {
                setAddressList(res.data.address)
                if(res.data.address.length>0)
                    setSelectedAddressName(`${res.data.address[currentAddressIndex].landmark}, ${res.data.address[currentAddressIndex].address}, ${res.data.address[currentAddressIndex].city}, ${res.data.address[currentAddressIndex].state}`)
            }else {
                setNoAddresses(true)
            }
            setAddressLoading(false)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        if(userLoginStatus) {
            fetchAllAddresses()
        }
    } , [])
  return (
    <GestureHandlerRootView>
        <BottomSheetModalProvider>
            <StatusBar backgroundColor={COLORS.primaryBlackHex} />

            <View style={styles.CartScreenHeader}>
                <View style={styles.CartScreenHeaderLeft}>
                    <TouchableOpacity
                    onPress={backButtonHandler}
                    >
                    <CustomIcon
                        name='arrow-left2'
                        size={FONTSIZE.size_24}
                        color={COLORS.primaryLightGreyHex}
                    />
                    </TouchableOpacity>
                    <Text style={styles.CartScreenHeaderTitle}>Cart</Text>
                </View>
            </View>

            
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
            >
                <View>
                    <ChangeAddressModal navigation={navigation} closeBottomModel={closeBottomModel} fetchAllAddresses={fetchAllAddresses} />
                </View>
            </BottomSheetModal>
            
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ScrollViewFlex}
            >
                <View>
                    <View>
                    {cartItemList=== (undefined) || cartItemList.length ===0 ? 
                        <View style={styles.EmptyCartContainer}>
                            <LottieView
                                style={styles.EmptyCartAnimation}
                                source={require("../components/lottie/EmptyCart.json")}
                                autoPlay
                                loop
                            />
                            <Text style={styles.EmptyCartText}>Cart is Empty</Text>
                        </View>
                        
                    : 
                    (
                        <View style={styles.ListItemContainer}>
                            {cartItemList.map((item : any , index : any)=> {
                                return (
                                    <CartItem
                                        key={index}
                                        id={item.id}
                                        title={item.title}
                                        price={item.price}
                                        itemPrice = {item.ItemPrice}
                                        navigation={navigation}
                                        image={item.image}
                                    />
                                )
                            })}

                            <View style={styles.BillDetailsContainer}>
                                <Text style={styles.BillDetailsHeading}>Address Details</Text>
                                <View style={styles.AddressListContainer}>
                                    {noAddresses && 
                                        <Text style={{marginLeft : SPACING.space_18 , color : COLORS.primaryLightGreyHex}}>No address added yet</Text>
                                    }
                                    {addressLoading ? 
                                        <AddressLoadingSkeleton />
                                     :
                                    (
                                        addressList.map((address :any , index) => {
                                            return (
                                                <View key={index}>
                                                    <Pressable 
                                                        onPress={() => {
                                                            setSelectedAddressName(`${address.landmark}, ${address.address}, ${address.city}, ${address.state}`)
                                                            setSelectedAddress(index)
                                                        }}
                                                        style={styles.AddressListItem} 
                                                    >
                                                        <View style={[styles.AddressListItemRadio , {borderColor : selectedAddress == index ? COLORS.primaryLightGreenHex : COLORS.secondaryLightGreyHex}]}>
                                                            <View style={[styles.AddressListItemRadioSelected , {display : selectedAddress == index ? "flex" : "none"}]}></View>
                                                        </View>
                                                        <Text style={styles.AddressListItemText}>{address.landmark}, {address.address}, {address.city}, {address.state} </Text>
                                                    </Pressable>
                                                    <View style={styles.AddressHorizontailRule}>
                                                    </View>
                                                </View>
                                                
                                            )
                                        })
                                        
                                    )
                                    
                                }
                                <Pressable
                                    onPress={async () => {
                                        if(userLoginStatus)
                                            openBottomModel()
                                        else {
                                            const enterInAppStatus : any = false
                                            await dispatch(updateEnterInAppStatus(enterInAppStatus))
                                            navigation.push("PhoneLoginScreen")
                                        }
                                    }}
                                    style={styles.AddAddressContainer}
                                >
                                    {/* <View style={[styles.AddressListItemRadio , 
                                        {borderColor : COLORS.secondaryLightGreyHex}
                                    ]}></View> */}
                                    <CustomIcon
                                        name='location21'
                                        size={22}
                                        color={COLORS.primaryLightGreenHex}
                                        style={{marginLeft : SPACING.space_10}}
                                    />
                                    <Text style={[styles.AddressListItemText, {marginLeft : SPACING.space_10}]}>{userLoginStatus ? "Add new Address" : "Login to add new Address"}</Text>
                                </Pressable>
                                
                                </View>
                            </View>

                            <View style={styles.BillDetailsContainer}>
                                <Text style={styles.BillDetailsHeading}>Bill Details</Text>
                                <View style={styles.BillDetailsTotalPriceContainer}>
                                    <Text style={styles.BillDetailsTotalPriceHeading}>Total Price</Text>
                                    <Text style={styles.BillDetailsTotalPrice}>Rs {totalCartPrice}</Text>
                                </View>
                                <View style={styles.BillDetailsTotalPriceContainer}>
                                    <Text style={styles.BillDetailsTotalPriceHeading}>Shipping Charges</Text>
                                    <Text style={styles.BillDetailsTotalPrice}>Rs 70</Text>
                                </View>
                            </View>

                            <View style={styles.HorizontalRule}></View>

                            <View style={styles.NetPriceContainer}>
                                <Text style={styles.NetPriceHeading}>Net Total</Text>
                                <Text style={styles.NetPrice}>{70 + parseFloat(totalCartPrice)}</Text>
                            </View>

                            <View style={{marginBottom : SPACING.space_10}}>
                                <Text style={{textAlign : "center" , fontSize : FONTSIZE.size_16, color : COLORS.primaryLightGreyHex, fontFamily :FONTFAMILY.poppins_regular }}>You will get {Math.floor(totalCartPrice/10)} <Image style={{height: 20, width:35, }} source={require("../assets/reward_coin.png")} /> coins</Text>
                            </View>

                            <Pressable 
                                onPress={userLoginStatus===false ? 
                                    async () => {
                                        const enterInAppStatus : any = false
                                        await dispatch(updateEnterInAppStatus(enterInAppStatus))
                                        navigation.push("PhoneLoginScreen")
                                    } :
                                    () => {
                                        if(selectedAddressName==='') {
                                            ToastAndroid.show("Select Delivery Address" , ToastAndroid.SHORT)
                                        }else {
                                            navigation.push("PaymentCheckoutScreen", {
                                                address : selectedAddressName,
                                                totalCartPrice : parseFloat(totalCartPrice)
                                                
                                            })
                                        }
                                    }
                                }
                                style={styles.CheckOutButtonContainer}>
                                <Text style={styles.CheckOutButtonText}>{userLoginStatus ? "Proceed to Checkout" : "Login to Proceed"}</Text>
                            </Pressable>
                            <Pressable 
                                onPress={userLoginStatus===false ? 
                                    async () => {
                                        const enterInAppStatus : any = false
                                        await dispatch(updateEnterInAppStatus(enterInAppStatus))
                                        navigation.push("PhoneLoginScreen")
                                    }:
                                    () => {
                                        navigation.push("SelectGroupScreen", {
                                            totalCartPrice : parseFloat(totalCartPrice)
                                        })
                                    }
                                }
                                style={[styles.CheckOutButtonContainer , {backgroundColor : COLORS.primaryOrangeHex}]}>
                                <Text style={styles.CheckOutButtonText}>{userLoginStatus ? "Buy in group and Save Money" : "Login to buy in group"}</Text>
                            </Pressable>
                        </View>
                    )
                    }      
                    </View>
                </View>   
            </ScrollView>   
        </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default CartScreen

const styles = StyleSheet.create({
    CartScreenHeader : {
        flexDirection : "row",
        padding : SPACING.space_18,
        alignItems: 'center',
        justifyContent : 'space-between',
        backgroundColor : COLORS.primaryLightGreenHex
    },
    CartScreenHeaderLeft : {
        flexDirection : "row",
        alignItems : "center"
    },
    CartScreenHeaderTitle : {
        marginLeft : SPACING.space_10,
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryLightGreyHex
    },
    ScrollViewFlex : {

    },
    EmptyCartContainer : {

    },
    EmptyCartAnimation : {
        height: 600,
    },
    EmptyCartText : {
        margin : SPACING.space_18,
        textAlign : "center",
        fontSize : FONTSIZE.size_20,
        fontFamily : FONTFAMILY.poppins_semibold
    },
    ListItemContainer : {
        padding : SPACING.space_16
    },
    AddressListContainer : {
        borderWidth : 1,
        borderRadius : BORDERRADIUS.radius_10,
        borderColor : COLORS.secondaryLightGreyHex,
        padding : SPACING.space_10,
        paddingRight : SPACING.space_18,
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
        alignItems : "center"
    },
    BillDetailsContainer : {
        padding : SPACING.space_8
    },
    BillDetailsHeading : {
        fontSize :FONTSIZE.size_20,
        fontFamily : FONTFAMILY.poppins_bold,
        color : COLORS.primaryBlackHex
    },
    BillDetailsTotalPriceContainer : {
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    BillDetailsTotalPriceHeading : {
        fontSize :FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryLightGreyHex
    },
    BillDetailsTotalPrice : {
        fontSize :FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryLightGreyHex
    },
    HorizontalRule : {
        padding : 1,
        marginRight: SPACING.space_8,
        marginLeft : SPACING.space_8,
        backgroundColor : COLORS.secondaryLightGreyHex
    },
    NetPriceContainer : {
        marginRight: SPACING.space_8,
        marginLeft : SPACING.space_8,
        flexDirection : 'row',
        justifyContent :'space-between',
        marginTop : SPACING.space_10,
    },
    NetPriceHeading : {
        fontSize :FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryLightGreyHex
    },
    NetPrice: {
        fontSize :FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryLightGreyHex
    },
    CheckOutButtonContainer : {
        flex : 1,
        margin : SPACING.space_8,
        padding : SPACING.space_15,
        backgroundColor : COLORS.primaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_10,
        alignItems : "center",
        justifyContent : "center",
    },
    CheckOutButtonText : {
        color : COLORS.primaryWhiteHex,
        fontFamily : FONTFAMILY.poppins_medium,
        fontSize : FONTSIZE.size_16
    }
})