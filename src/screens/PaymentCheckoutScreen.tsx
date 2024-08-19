import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import CustomIcon from '../components/CustomIcon'
import { useDispatch, useSelector } from 'react-redux'
import phonepeSDK from "react-native-phonepe-pg"
import Base64 from "react-native-base64"
import sha256 from "sha256"
import { updateAfterOrder } from '../features/cartSlice'
import LottieView from 'lottie-react-native'
import moment from 'moment'
import {BASE_URL} from "@env"


const paymentMethodList = [
  "Pay Online",
  "Cash on Delivery"
]

const PaymentCheckoutScreen = ({navigation , route} : any) => {

  const dispatch = useDispatch()
  const [buyingGroupName , setBuyingGroupName] = useState(route.params.buyingGroupName)
  const [deliveryCost , setDeliveryCost] = useState(buyingGroupName===undefined? 50 : 0)
  // console.log(buyingGroupName)
    
  const [ selectedPaymentMethod , setSelectedPaymentMethod ] = useState(1)

  const [showDoneAnimation , setShowDoneAnimation ] = useState(false)

  //phone Pay Payment Integration
  const [environment , setEnvironment ] = useState("SANDBOX")
  const [merchandId , setMerchandId] = useState("PGTESTPAYUAT86")
  const [appId, setAppId] = useState('')
  const [enableLogging , setEnableLogging] = useState(true)
  const [deliveryDate , setDeliveryDate] = useState('')
  const [uploadDeliveryDate , setUploadDeliveryDate ] = useState('')

  const addToOrderHistoryUPI = async () => {
    await fetch(`${BASE_URL}/order/add-to-order-history` ,{
      method : "POST",
      headers : {
          Accept : "application/json",
          "Content-Type" : "application/json",
          Authorization : `Bearer ${userToken}`
      },
      body : JSON.stringify({
        userId : userId,
        orders : JSON.stringify(cartItemList),
        address : route.params.address,
        amount : Number(totalCartPrice)+deliveryCost,
        orderDate : new Date(),
        paymentStatus : true,
        paymentMode : "Online",
        buyingGroup : buyingGroupName===undefined? "none" : buyingGroupName,
        deliveryDate : uploadDeliveryDate,
        rewardCoins : Math.floor(route.params.totalCartPrice/10),
      })
    }).then((res) => res.json())
    .then((res) => {
      console.log(res)
    }).catch((error) => {
      console.log(error)
    })
  }

  const generateTransactionId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random()*1000000)
    const merchantPrefix = "T"
    return `${merchantPrefix}${timestamp}${random}`
  }

  const UIPPaymentButtonHandler = () => {
    console.log(1)
    phonepeSDK.init(environment, merchandId, appId, enableLogging).then((res) => {
      const requestBody = {
        merchantId : merchandId,
        merchantTransactionId : generateTransactionId(),
        merchantUserId : "",
        amount : (route.params.totalCartPrice + deliveryCost)*100,
        mobileNumber : "123456789",
        callbackUrl : "",
        paymentInstrument : {
          type : "PAY_PAGE"
        }
      }

      const salt_key = "96434309-7796-489d-8924-ab56988a6076"
      const salt_index = 1
      const payload = JSON.stringify(requestBody)
      const payload_main = Base64.encode(payload)
      const string = payload_main+"/pg/v1/pay"+salt_key
      const checksum = sha256(string)+"###"+salt_index

      phonepeSDK.startTransaction(
        payload_main,
        checksum,
        null,
        null
      ).then(async (res) => {
        if(res.status==="SUCCESS") {
          await addToOrderHistoryUPI()
          setShowDoneAnimation(true)
          setTimeout(() => {
              setShowDoneAnimation(false)
              dispatch(updateAfterOrder())
            navigation.navigate("OrderHistoryScreen")
          }, 2000); 
        }else if(res.status === "FAILURE") { 
          console.log("Payment Failed")
        }else {
          console.log(res)
        }
      }).catch(err => {
        console.log(err)
      })

    }).catch(err => {
      console.log(err)
    })
  }


  const userToken = useSelector((state : any) => state.user.token)
  const userId = useSelector((state : any) => state.user.id)
  const cartItemList = useSelector((state : any) => state.cart.CartList)
  const totalCartPrice = useSelector((state : any) => state.cart.CartPrice)


  const backButtonHandler = () => {
    navigation.pop()
  }

  const findDeliveryDate = async () => {
    if(buyingGroupName===undefined) {
      var date : any = new Date()
      date.setDate(date.getDate()+1)
      setUploadDeliveryDate(date)
      var finalDate = moment(date).format("DD MMMM, YYYY")
      // console.log(new Date(finalDate))
      setDeliveryDate(finalDate)
    }else {
      var nextMonday : any= new Date()
      var nextThursday : any = new Date(nextMonday)
      nextMonday.setDate(nextMonday.getDate() + (((1+7-nextMonday.getDay()) %7) || 7))
      nextThursday.setDate(nextThursday.getDate() + (((4+7-nextThursday.getDay()) %7) || 7))

      var nextDeliveryDate : any;
      if(nextMonday > nextThursday) {
        nextDeliveryDate = nextThursday
      }else {
        nextDeliveryDate = nextMonday
      }
      setUploadDeliveryDate(nextDeliveryDate)
      var finalDate = moment(nextDeliveryDate).format("DD MMMM, YYYY")

      setDeliveryDate(finalDate)
      // return d
    }
  }

  const d = new Date()

  const cashOnDeliveryButtonHandler = async () => {
    await fetch(`${BASE_URL}/order/add-to-order-history` ,{
      method : "POST",
      headers : {
          Accept : "application/json",
          "Content-Type" : "application/json",
          Authorization : `Bearer ${userToken}`
      },
      body : JSON.stringify({
        userId : userId,
        orders : JSON.stringify(cartItemList),
        address : route.params.address,
        amount : Number(totalCartPrice)+deliveryCost,
        orderDate : new Date(),
        buyingGroup : buyingGroupName===undefined? "none" : buyingGroupName,
        deliveryDate : uploadDeliveryDate,
        rewardCoins : Math.floor(route.params.totalCartPrice/10),
      })
    }).then((res) => res.json())
    .then((res) => {
      setShowDoneAnimation(true)
      setTimeout(() => {
          setShowDoneAnimation(false)
          dispatch(updateAfterOrder())
          navigation.navigate("OrderHistoryScreen")
      }, 2000);
      
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    findDeliveryDate()
  }, [])

  return (
    <GestureHandlerRootView>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      {showDoneAnimation && (
            <View style={[styles.DoneAnimation]}>
                <LottieView
                    style={{height : 150}}
                    source={require("../components/lottie/Done.json")}
                    autoPlay
                    loop
                />
            </View>
        )}

      <View style={styles.PaymentScreenHeader}>
          <View style={styles.PaymentScreenHeaderLeft}>
              <Pressable
              onPress={backButtonHandler}
              >
              <CustomIcon
                  name='arrow-left2'
                  size={FONTSIZE.size_24}
                  color={COLORS.primaryLightGreyHex}
              />
              </Pressable>
              <Text style={styles.PaymentScreenHeaderTitle}>Payment</Text>
          </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.PaymentMethodListHeading}>Total Order Price</Text>

        <View style={styles.ItemPriceContainer}>
            <View style={{flexDirection : "row" , justifyContent : "space-between" , alignItems : "center" , marginBottom: SPACING.space_10*0.4}}>
              <Text style={styles.ItemPriceHeading}>Item Price</Text>
              <Text style={styles.ItemPriceText}>Rs. {route.params.totalCartPrice}</Text>
            </View>
            {/* <View style={{flexDirection : "row" , justifyContent : "space-between" , alignItems : "center" ,marginBottom: SPACING.space_10*0.4}}>
              <Text style={styles.ItemPriceHeading}>Discount Applied</Text>
              <Text style={styles.ItemPriceText}>Rs. 20</Text>
            </View> */}
            <View style={{flexDirection : "row" , justifyContent : "space-between" , alignItems : "center", marginBottom: SPACING.space_10*0.4}}>
              <Text style={styles.ItemPriceHeading}>Delivery</Text>
              <Text style={styles.ItemPriceText}>Rs. {deliveryCost}</Text>
            </View>
            <View style={[styles.AddressHorizontailRule , {backgroundColor : COLORS.primaryLightGreyHex, marginBottom: SPACING.space_10*0.4}]}></View>
            <View style={{flexDirection : "row" , justifyContent : "space-between" , alignItems : "center" , marginTop : SPACING.space_10}}>
              <Text style={styles.ItemPriceHeading}>Total Price</Text>
              <Text style={styles.ItemPriceText}>Rs. {Number(route.params.totalCartPrice) + Number(deliveryCost)}</Text>
            </View>
            <View style={{flexDirection : "row" , justifyContent : "space-between" , alignItems : "center"}}>
              <Text style={styles.ItemPriceHeading}>You will get</Text>
              <Text style={styles.ItemPriceText}><Image style={{height: 20, width:35, }} source={require("../assets/reward_coin.png")} />x {Math.floor(route.params.totalCartPrice/10)}</Text>
            </View>
        </View>

        <Text style={styles.PaymentMethodListHeading}>Delivery Address</Text>

        <View style={styles.DeliveryAddressContainer}>
          <View style={{flexDirection : "row" , alignItems : "center"}}>
            <CustomIcon
              name='location21'
              size={17}
              color={COLORS.primaryBlackHex}
            />
              <Text style={[styles.DeliveryAddressText , {marginLeft : SPACING.space_10*0.3}]}>{route.params.address}</Text>
          </View>
        </View>

        <View style={[styles.DeliveryAddressContainer , {marginTop : -SPACING.space_10}]}>
          <View style={{flexDirection : "row"}}>
              <Text style={[styles.DeliveryAddressText , {marginLeft : SPACING.space_10*0.3}]}> <Text style={{fontFamily : FONTFAMILY.poppins_semibold}}>Delivered by - </Text>{deliveryDate}</Text>
          </View>
        </View>

        <Text style={styles.PaymentMethodListHeading}>Choose your Payment Method</Text>

        <View style={styles.PaymentMethodListContainer}>

        <Pressable 
              onPress={() => {
                setSelectedPaymentMethod(0)
              }}
              style={styles.AddressListItem} 
          >
              <View style={styles.PaymentMethodRadioContainer}>
                <View style={[styles.AddressListItemRadio , {borderColor : selectedPaymentMethod == 0 ? COLORS.primaryLightGreenHex : COLORS.secondaryLightGreyHex}]}>
                    <View style={[styles.AddressListItemRadioSelected , {display : selectedPaymentMethod == 0 ? "flex" : "none"}]}></View>
                </View>
                <Text style={styles.AddressListItemText}>{paymentMethodList[0]}</Text>
              </View>
              <Pressable
                onPress={UIPPaymentButtonHandler}
                style={[styles.PlaceOrderButtonContainer , {display : selectedPaymentMethod == 0 ? "flex" : "none"}]}
              >
                  <Text style={styles.PlaceOrderButtonText}>{`Pay  ₹ ${route.params.totalCartPrice + deliveryCost}`}</Text>
              </Pressable>
          </Pressable>

          <View style={styles.AddressHorizontailRule}></View>

          <Pressable 
              onPress={() => setSelectedPaymentMethod(1)}
              style={styles.AddressListItem} 
          >
              <View style={styles.PaymentMethodRadioContainer}>
                <View style={[styles.AddressListItemRadio , {borderColor : selectedPaymentMethod == 1 ? COLORS.primaryLightGreenHex : COLORS.secondaryLightGreyHex}]}>
                    <View style={[styles.AddressListItemRadioSelected , {display : selectedPaymentMethod == 1 ? "flex" : "none"}]}></View>
                </View>
                <Text style={styles.AddressListItemText}>{paymentMethodList[1]}</Text>
              </View>
              <Pressable
                onPress={() => cashOnDeliveryButtonHandler()}
                style={[styles.PlaceOrderButtonContainer , {display : selectedPaymentMethod == 1 ? "flex" : "none"}]}
              >
                  <Text style={styles.PlaceOrderButtonText}>Place Your Order</Text>
              </Pressable>
          </Pressable>
        </View>
      </ScrollView>

      
    </GestureHandlerRootView>
  )
}

export default PaymentCheckoutScreen

const styles = StyleSheet.create({
      DoneAnimation : {
        position : "absolute",
        top : 0,
        left : 0,
        bottom: 0,
        right : 0,
        zIndex : 1000,
        flex : 1,
        justifyContent : "center"
    },
    PaymentScreenHeader : {
      flexDirection : "row",
      padding : SPACING.space_18,
      alignItems: 'center',
      justifyContent : 'space-between',
      backgroundColor : COLORS.primaryLightGreenHex
    },
    PaymentScreenHeaderLeft : {
      flexDirection : "row",
      alignItems : "center"
    },
    PaymentScreenHeaderTitle : {
      marginLeft : SPACING.space_10,
      fontSize : FONTSIZE.size_18,
      fontFamily : FONTFAMILY.poppins_semibold,
      color : COLORS.primaryLightGreyHex
    },
    ItemPriceContainer : {
      backgroundColor : COLORS.primaryLightestGreyHex,
      padding : SPACING.space_12,
      borderRadius : BORDERRADIUS.radius_10,
      margin : SPACING.space_18
    },
    ItemPriceHeading : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryBlackHex,
    },
    ItemPriceText : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryBlackHex,
    }, 
    DeliveryAddressContainer : {
      backgroundColor : COLORS.primaryLightestGreyHex,
      padding : SPACING.space_12,
      margin : SPACING.space_18,
      borderRadius : BORDERRADIUS.radius_10,
    },
    DeliveryAddressHeading : {
        fontSize : FONTSIZE.size_16*1.05,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    },
    DeliveryAddressText : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryBlackHex,
    },
    PaymentMethodListHeading : {
      fontSize :FONTSIZE.size_20,
      fontFamily : FONTFAMILY.poppins_bold,
      color : COLORS.primaryBlackHex,
      marginLeft : SPACING.space_18,
      marginRight : SPACING.space_18,
      marginTop : SPACING.space_18,
    },
    PaymentMethodListContainer : {
      padding : SPACING.space_10,
      borderWidth : 0.5,
      borderRadius : BORDERRADIUS.radius_10,
      margin : SPACING.space_18,
    },
    AddressListItem : {
      paddingRight : SPACING.space_18
    },
    PaymentMethodRadioContainer : {
      flexDirection : "row",
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
    PlaceOrderButtonContainer : {
      backgroundColor : COLORS.primaryLightGreenHex,
      padding: SPACING.space_18,
      borderRadius : BORDERRADIUS.radius_10,
      marginBottom : SPACING.space_12,
    },
    PlaceOrderButtonText :  {
      color : COLORS.primaryWhiteHex,
      textAlign : "center",
      fontSize : FONTSIZE.size_16,
      fontFamily : FONTFAMILY.poppins_medium,
    }
})