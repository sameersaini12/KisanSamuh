import { StatusBar, StyleSheet, Text, View, Image, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import CustomIcon from '../components/CustomIcon'
import { useSelector } from 'react-redux'
import LottieView from 'lottie-react-native'
import moment from 'moment'
import {BASE_URL} from "@env"
import OrderHistoryLoadingSkeleton from '../components/OrderHistoryLoadingSkeleton'

const UpdateOrderStatusScreen = ({navigation } : any) => {

  const [ordersList , setOrdersList] = useState([])
  const [loading , setLoading] = useState(true)
  const [deliveryStatusLoading , setDeliveryStatusLoading ] = useState(false)
  const [paymentChangeLodaing , setPaymentChangeLoading ] = useState(false)
  const [updateCardIndex, setUpdateCardIndex] = useState(0)
  const [paidUpdateCardIndex, setPaidUpdateCardIndex] = useState(0)

  const userToken = useSelector((state : any) => state.user.token)

  const backButtonHandler = () => {
      navigation.pop()
  }

  const fetchAllOrders = async () => {
    await fetch(`${BASE_URL}/order/fetch-all-orders` , {
      headers : {
        Accept : "application/json",
        "Content-Type" : "application/json",
        Authorization : `Bearer ${userToken}`
      },
    })
    .then((res) => res.json())
    .then((res) => {
        setLoading(true)
        if(res.data.length > 0) {
          setOrdersList(res.data)
        }
        setLoading(false)
    }).catch((error) => {
        console.log(error)
    })
  }

  const updatePaymentStatusHandler = async (orderId : any , paymentStatus : any) => {
    setPaymentChangeLoading(true)
    await fetch(`${BASE_URL}/order/update-order/${orderId}` , {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${userToken}`
      },
      body : JSON.stringify({
        paymentStatus : paymentStatus
      })
    })
    .then((res : any) => res.json())
    .then(async (res : any) => {
      await fetchAllOrders()
      setPaymentChangeLoading(false)
    }).catch((error) => {
      console.log(error)
    })
    setPaymentChangeLoading(false)
  }

  const updateRewardCoins = async (userId : any, coins : any) => {
    await fetch(`${BASE_URL}/users/update-user-coins/${userId}` , {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${userToken}`
      },
      body : JSON.stringify({
        coins : coins
      })
    })
    .then((res : any) => res.json())
    .then((res : any) => {
      console.log(res)
    }).catch((error) => {
      console.log(error)
    })
  }

  const updateStatusHandler = async (orderStatus : any, orderId : any , userId : any, coins : any) => {
    setDeliveryStatusLoading(true)
    let nextOrderStatus;
    if(orderStatus.toLowerCase() ==='ordered') {
      nextOrderStatus = 'packed'
    }else if(orderStatus.toLowerCase() ==='packed') {
      nextOrderStatus = 'shipped'
    }else if(orderStatus.toLowerCase() ==='shipped') {
      nextOrderStatus = 'delivered'
      updateRewardCoins(userId, coins)
    }else {
      ToastAndroid.show("Order is already deliverd", ToastAndroid.SHORT)
    }

    await fetch(`${BASE_URL}/order/update-order/${orderId}` , {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${userToken}`
      },
      body : JSON.stringify({
        status : nextOrderStatus
      })
    })
    .then((res : any) => res.json())
    .then(async (res : any) => {
      // console.log(res)
      await fetchAllOrders()
      setDeliveryStatusLoading(false)
    }).catch((error) => {
      console.log(error)
    })
    setDeliveryStatusLoading(false)

  }

  useEffect(() => {
    fetchAllOrders()
  } , [])
  return (
    <GestureHandlerRootView>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />

        <View style={[styles.OrderHistoryScreenHeader, {marginBottom : SPACING.space_18}]}>
            <View style={styles.OrderHistoryScreenHeaderLeft}>
                <TouchableOpacity
                onPress={backButtonHandler}
                >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryLightGreyHex}
                />
                </TouchableOpacity>
                <Text style={styles.OrderHistoryScreenHeaderTitle}>Update Order Status</Text>
            </View>
        </View>

        {loading ? 
            <OrderHistoryLoadingSkeleton /> :
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.OrderHistoryScrollView}
    >
        <View>
            <View>
                {ordersList.length === 0 ? 
                    <View style={styles.EmptyCartContainer}>
                        <LottieView
                            style={styles.EmptyCartAnimation}
                            source={require("../components/lottie/EmptyCart.json")}
                            autoPlay
                            loop
                        />
                        <Text style={styles.EmptyCartText}>There is no orders yet !</Text>
                    </View>
                :
                (
                    <View>
                        {
                            ordersList.map((orderData :any , index : any) => {
                                return (
                                <View
                                    key={index}
                                >
                                        {/* <Text style={styles.OrderDataDate}>Order Date : {orderData.orderDate}</Text> */}
                                        <View>
                                            {orderData.orders.map((orderItem : any , orderItemindex : any) => {
                                                return (
                                                

                                                <View style={styles.OrderDataContainer} key={orderItemindex}> 
                                                    <View style={styles.DeliveryStatusContainer}>
                                                        <View style={styles.DeliveryStatusIcon}>
                                                            <CustomIcon
                                                                name='truck'
                                                                color={COLORS.primaryWhiteHex}
                                                                size={21}
                                                            />
                                                        </View>
                                                        <View style={styles.DeliveryStatusDateContainer}>
                                                            <View style={{flexDirection : "row" , alignItems : "center" }}>
                                                                <Text style={styles.DeliveryStatusText}>{orderData.status}
                                                                  
                                                                </Text>
                                                                <TouchableOpacity
                                                                  onPress={() => {
                                                                    setUpdateCardIndex(index)
                                                                    updateStatusHandler(orderData.status, orderData._id , orderData.userId, orderData.rewardCoins)
                                                                  }}
                                                                  style={{marginLeft : SPACING.space_10 , flexDirection : "row", alignItems : "center"}}
                                                                >
                                                                  {deliveryStatusLoading && index===updateCardIndex && 
                                                                    <LottieView
                                                                      source={require("../components/lottie/Loading.json")}
                                                                      autoPlay
                                                                      loop
                                                                      style={{height : 35 , width : 30}}
                                                                    />
                                                                  }
                                                                  <Text style={[styles.DeliveryStatusDate , {color : COLORS.primaryLightGreenHex}]}>Update Status</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            
                                                            <Text style={styles.DeliveryStatusDate}>Ordered On - {moment(orderData.orderDate).format("DD MMMM, YYYY")}</Text>
                                                            <Text style={styles.DeliveryStatusDate}>Delivered By - {moment(orderData.deliveryDate).format("DD MMMM, YYYY")}</Text>
                                                            <Text style={styles.DeliveryStatusDate}>Ordered By {"- "}
                                                              <Text style={{textDecorationLine : "underline" , color : COLORS.primaryBlackHex}}>
                                                                {orderData.userId}
                                                              </Text>
                                                            </Text>
                                                            <View style={[ {flexDirection : "row", alignItems : "center"}]}>
                                                              <Text style={styles.DeliveryStatusDate}>Payment {"- "} </Text>
                                                              <View>
                                                                <View style={styles.PaymentStatusContainer}>
                                                                  <Text style={styles.PaymentStatusText}>{orderData.paymentMode}</Text>
                                                                </View>
                                                              </View>
                                                              <View style={{marginLeft : SPACING.space_10 , flexDirection : "row" , alignItems : "center"}}>
                                                                {orderData.paymentStatus ? (
                                                                  <TouchableOpacity
                                                                  onPress={() => {
                                                                    setPaidUpdateCardIndex(index)
                                                                    updatePaymentStatusHandler(orderData._id , !orderData.paymentStatus)
                                                                  }} 
                                                                  style={styles.PaymentStatusContainer}>
                                                                  <Text style={styles.PaymentStatusText}>Paid {" "}
                                                                    <CustomIcon
                                                                      name='pencil'
                                                                    />
                                                                  </Text>
                                                                </TouchableOpacity> 
                                                                ) : (
                                                                  <TouchableOpacity
                                                                    onPress={() => {
                                                                      setPaidUpdateCardIndex(index)
                                                                      updatePaymentStatusHandler(orderData._id , !orderData.paymentStatus)
                                                                    }} 
                                                                    style={styles.PaymentStatusContainer}>
                                                                    <Text style={styles.PaymentStatusText}>Not Paid {" "}
                                                                      <CustomIcon
                                                                        name='pencil'
                                                                      />
                                                                    </Text>
                                                                  </TouchableOpacity> 
                                                                )}
                                                                  {paymentChangeLodaing && index===paidUpdateCardIndex && 
                                                                    <LottieView
                                                                      source={require("../components/lottie/Loading.json")}
                                                                      autoPlay
                                                                      loop
                                                                      style={{height : 35 , width : 30}}
                                                                    />
                                                                  }
                                                              </View>
                                                            </View>
                                                            {orderData.buyingGroup!=="none" && (
                                                                <View style={[ {flexDirection : "row", alignItems : "center" , marginTop : SPACING.space_10}]}>
                                                                <Text style={styles.DeliveryStatusDate}>Buying Group {"- "} </Text>
                                                                <View>
                                                                  <View style={styles.PaymentStatusContainer}>
                                                                    <Text style={styles.PaymentStatusText}>{orderData.buyingGroup}</Text>
                                                                  </View>
                                                                </View>
                                                              </View>
                                                            )}
                                                            <Text style={styles.DeliveryStatusDate}>Coins Earned - {orderData.rewardCoins}</Text>
                                                        </View>
                                                    </View> 
                                                    <View style={[styles.HorizontalRule , ]}>
                                                    </View>                            
                                                    {JSON.parse(orderItem).map((orderItemData : any , key :any) => {
                                                        // console.log("OrderItem" + JSON.stringify(orderItemData))
                                                        return (
                                                            <TouchableOpacity
                                                              key={key}
                                                                onPress={() => {
                                                                    navigation.push("OrderedProductInfoScreen", {
                                                                        address : orderData.address,
                                                                        itemPrice : orderItemData.ItemPrice,
                                                                        price : orderItemData.price,
                                                                        orderDate : orderData.orderDate,
                                                                        orderStatus : orderData.status,
                                                                        buyingGroup : orderData.buyingGroup,
                                                                        image : orderItemData.image
                                                                    })
                                                                }}
                                                            >
                                                                <View style={styles.OrderHistorySingleItemContainer}>
                                                                    <View
                                                                        style={styles.OrderHistoryImageContainer}
                                                                    >
                                                                        <Image 
                                                                            source={{uri : orderItemData.image}} 
                                                                            style={styles.OrderHistoryImage}
                                                                        />
                                                                    </View>
                                                                    <View style={styles.OrderHistorySingleItemInfoContainer}>
                                                                        <View>
                                                                            <Text style={styles.OrderHistorySingleItemInfoTitle}>{orderItemData.title}</Text>
                                                                            <Text style={styles.OrderHistorySingleItemInfoPrice}>Item Price : {orderItemData.ItemPrice}</Text>
                                                                        </View>
                                                                        <View style={{flexDirection : "row",alignItems : "center" , marginRight : SPACING.space_18}}>
                                                                            {/* <CustomIcon
                                                                                name='pencil'
                                                                                size={22}
                                                                            /> */}
                                                                            <Text style={{fontSize : FONTSIZE.size_30, textAlign : "center"}}> 
                                                                              <CustomIcon
                                                                                  name='circle-right'
                                                                                  size={22}
                                                                                  color={COLORS.primaryLightGreyHex}
                                                                              />
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.HorizontalRule}>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                    <View style={styles.TotalBottomContainer}>
                                                        <Text style={styles.TotalBottomTitle}>Total</Text>
                                                        <Text style={styles.TotalBottomRuppes}>Rs. {orderData.amount}</Text>
                                                    </View>
                                                </View>
                                            
                                            )})}
                                        </View>
                                </View>
                                )
                            })
                        }
                    </View>
                )}
            </View>
        </View>
    </ScrollView>
    }
    </GestureHandlerRootView>
  )
}

export default UpdateOrderStatusScreen

const styles = StyleSheet.create({
  OrderHistoryScreenHeader : {
    flexDirection : "row",
    padding : SPACING.space_18,
    alignItems: 'center',
    justifyContent : 'space-between',
    backgroundColor : COLORS.primaryLightGreenHex
},
OrderHistoryScreenHeaderLeft : {
    flexDirection : "row",
    alignItems : "center"
},
OrderHistoryScreenHeaderTitle : {
    marginLeft : SPACING.space_10,
    fontSize : FONTSIZE.size_18,
    fontFamily : FONTFAMILY.poppins_semibold,
    color : COLORS.primaryLightGreyHex
},
OrderHistoryScrollView : {

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
    fontFamily : FONTFAMILY.poppins_semibold,
    color : COLORS.primaryLightGreyHex
},
OrderDataDate : {
  fontSize : FONTSIZE.size_16,
  fontFamily : FONTFAMILY.poppins_medium,
  marginLeft : SPACING.space_18,
  marginRight : SPACING.space_18,
  color : COLORS.primaryLightGreyHex
},
DeliveryStatusContainer : {
  padding : SPACING.space_10,
  flexDirection : "row",

},
DeliveryStatusIcon : {
  backgroundColor : COLORS.primaryLightGreenHex,
  borderRadius : BORDERRADIUS.radius_25*2,
  justifyContent: 'center',
  alignItems : "center",
  padding : SPACING.space_10,
  height : 40,
  width : 40,
},
DeliveryStatusDateContainer : {
  marginLeft : SPACING.space_10,
},
DeliveryStatusText : {
  fontSize : FONTSIZE.size_18,
  fontFamily : FONTFAMILY.poppins_semibold,
  color : COLORS.primaryBlackHex,
  textTransform : "capitalize",
},
DeliveryStatusDate : {
  fontSize : FONTSIZE.size_12*1.1,
  fontFamily : FONTFAMILY.poppins_regular,
  color : COLORS.primaryLightGreyHex
},
PaymentStatusContainer : {
  backgroundColor : COLORS.primaryLightGreenHex,
  borderRadius : BORDERRADIUS.radius_10*2,
  padding : SPACING.space_10*0.8,
},
PaymentStatusText : {
  color : COLORS.primaryWhiteHex,
  fontFamily : FONTFAMILY.poppins_regular,
  fontSize : FONTSIZE.size_14*0.9,
},
OrderHistoryImageContainer : {
  backgroundColor : COLORS.primaryWhiteHex,
  width : 80,
  height : 80,
  margin : SPACING.space_10,
  borderRadius : BORDERRADIUS.radius_10
},
OrderHistoryImage : {
  height : 80,
  width : 80
},
HorizontalRule : {
  padding : 0.5,
  backgroundColor : COLORS.secondaryLightGreyHex
},
TotalBottomContainer : {
  flexDirection : "row",
  justifyContent : "space-between",
  alignItems : "center",
  padding : SPACING.space_18
},
TotalBottomTitle : {
  fontSize : FONTSIZE.size_16,
  fontFamily : FONTFAMILY.poppins_medium,
  color : COLORS.primaryBlackHex,
},
TotalBottomRuppes : {
  fontSize : FONTSIZE.size_16,
  fontFamily : FONTFAMILY.poppins_medium,
  color : COLORS.primaryBlackHex,
},
OrderDataContainer : {
  borderRadius : BORDERRADIUS.radius_10,
  margin : SPACING.space_18,
  backgroundColor : COLORS.primaryLightestGreyHex
},
OrderHistorySingleItemContainer : {
  flexDirection : "row"
},
OrderHistorySingleItemInfoContainer : {
  flexDirection : "row",
  padding : SPACING.space_10,
  justifyContent : "space-between",
  flex : 1,
},
OrderHistorySingleItemInfoTitle : {
  fontSize : FONTSIZE.size_16,
  fontFamily : FONTFAMILY.poppins_medium,
  color : COLORS.primaryBlackHex,
},
OrderHistorySingleItemInfoPrice : {
  fontSize : FONTSIZE.size_14,
  fontFamily : FONTFAMILY.poppins_regular,
  color : COLORS.primaryBlackHex,
}
})