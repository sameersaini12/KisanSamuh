import { StatusBar, StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { useSelector } from 'react-redux'
import LottieView from 'lottie-react-native'
import moment from 'moment'
import {BASE_URL} from "@env"
import OrderHistoryLoadingSkeleton from '../components/OrderHistoryLoadingSkeleton'
import { useTranslation } from 'react-i18next'

const OrderHistoryScreen = ({navigation} : any) => {
    const {t} = useTranslation()
    const [ordersList , setOrdersList] = useState([])
    const [selectedOrderCategory , setSelectedOrderCategory] = useState(0)
    const [loading , setLoading ]  = useState(true)
    const [noProducts , setNoProducts] = useState(false)

    const orderHistoryList = useSelector((state : any) => state.cart.orderHistoryList)
    const userId = useSelector((state : any) => state.user.id)
    const userToken = useSelector((state : any) => state.user.token)
    const isLoggedIn = useSelector((state : any) => state.user.isLoggedIn)

    const backButtonHandler = () => {
        navigation.navigate("Tab")
    }

    const fetchAllOrders = async () => {
        await fetch(`${BASE_URL}/order/fetch-orders/${userId}` , {
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            },
        })
        .then((res) => res.json())
        .then((res) => {
            // console.log(res.data)
            setLoading(true)
            if(res.data.length > 0) {
              setOrdersList(res.data)
            }else {
              setNoProducts(true)
            }
            setLoading(false)
        }).catch((error) => {
            console.log(error)
        })
    }

    const fetchAllActiveOrders = async () => {
        await fetch(`${BASE_URL}/order/fetch-active-orders/${userId}` , {
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            },
        })
        .then((res) => res.json())
        .then((res) => {
          setLoading(true)
          // console.log(res.data)
          if(res.data.length > 0) {
            setOrdersList(res.data)
          }else {
            setNoProducts(true)
          }
          setLoading(false)
        }).catch((error) => {
            console.log(error)
        })
    }
    

    const activeOrdersButtonHandler = async () => {
        setSelectedOrderCategory(0)
        setLoading(true)
        if(isLoggedIn) {
          await fetchAllActiveOrders()
        }
        setLoading(false)
    }

    const pastOrdersButtonHandler = async () => {
        setSelectedOrderCategory(1)
        setLoading(true)
        if(isLoggedIn) {
          await fetchAllOrders()
        }
        setLoading(false)
    }

    useEffect(() => {
        if(isLoggedIn) {
          activeOrdersButtonHandler()
        }
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
            <Text style={styles.OrderHistoryScreenHeaderTitle}>{t('Orders')}</Text>
        </View>
    </View>

    <View style={styles.OrdersCategoryContainer}>
        <Pressable 
            onPress={activeOrdersButtonHandler}
            style={styles.ActiveOrdersContainer}
        >
            <Text style={styles.ActiveOrdersTitle}>
                {t('Active Orders')}
            </Text>
            <View style={[styles.OrderCategorySelectedLine , {display : selectedOrderCategory == 0 ? "flex" : "none"}]}>
            </View>
        </Pressable>
        <Pressable 
            onPress={pastOrdersButtonHandler}
            style={styles.PastOrdersContainer}
        >
            <Text style={styles.PastOrdersTitle}>
                {t('Past Orders')}
            </Text>
            <View style={[styles.OrderCategorySelectedLine , {display : selectedOrderCategory == 1 ? "flex" : "none"}]}>
            </View>
        </Pressable>
    </View>

    <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.OrderHistoryScrollView}
    >
        <View>
            <View>
              {noProducts &&
                  <View style={styles.EmptyCartContainer}>
                    <LottieView
                        style={styles.EmptyCartAnimation}
                        source={require("../components/lottie/EmptyCart.json")}
                        autoPlay
                        loop
                    />
                    <Text style={styles.EmptyCartText}>{t('There is no orders yet!')}</Text>
                </View>
              }
                {loading ? 
                    <OrderHistoryLoadingSkeleton />
                :
                (
                    <View>
                        {
                            ordersList.map((orderData :any , index : any) => {
                                return (
                                <View key={index} >
                                        {/* <Text style={styles.OrderDataDate}>Order Date : {orderData.orderDate}</Text> */}
                                        <View>
                                            {orderData.orders.map((orderItem : any , index : any) => {
                                                // console.log("Order Item " + orderItem)
                                                return (
                                                <View key={index} style={styles.OrderDataContainer}> 
                                                    <View style={styles.DeliveryStatusContainer}>
                                                        <View style={styles.DeliveryStatusIcon}>
                                                            <CustomIcon
                                                                name='truck'
                                                                color={COLORS.primaryWhiteHex}
                                                                size={21}
                                                            />
                                                        </View>
                                                        <View style={styles.DeliveryStatusDateContainer}>
                                                            <Text style={styles.DeliveryStatusText}>{t(orderData.status)}</Text>
                                                            <Text style={styles.DeliveryStatusDate}>{t('Ordered On')} - { moment(orderData.orderDate).format("DD MMM, YYYY")}</Text>
                                                            <Text style={styles.DeliveryStatusDate}>{t('Delivered By')} - { moment(orderData.deliveryDate).format("DD MMM, YYYY")}</Text>
                                                            <View style={[ {flexDirection : "row", alignItems : "center"}]}>
                                                              <Text style={styles.DeliveryStatusDate}>{t('Payment Status')} {"- "} </Text>
                                                              <View>
                                                                <View style={styles.PaymentStatusContainer}>
                                                                  <Text style={styles.PaymentStatusText}>{orderData.paymentMode}</Text>
                                                                </View>
                                                              </View>
                                                              <View style={{marginLeft : SPACING.space_10}}>
                                                                {orderData.paymentStatus ? (
                                                                  <View
                                                                  style={styles.PaymentStatusContainer}>
                                                                  <Text style={styles.PaymentStatusText}>{t('Paid')}</Text>
                                                                </View> 
                                                                ) : (
                                                                  <View
                                                                    style={styles.PaymentStatusContainer}>
                                                                    <Text style={styles.PaymentStatusText}>{t('Not Paid')}</Text>
                                                                  </View> 
                                                                )}
                                                              </View>
                                                            </View>
                                                            {orderData.buyingGroup!=="none" && (
                                                                <View style={[ {flexDirection : "row", alignItems : "center" , marginTop : SPACING.space_10}]}>
                                                                <Text style={styles.DeliveryStatusDate}>{t('Buying Group')} {"- "} </Text>
                                                                <View>
                                                                  <View style={styles.PaymentStatusContainer}>
                                                                    <Text style={styles.PaymentStatusText}>{orderData.buyingGroup}</Text>
                                                                  </View>
                                                                </View>
                                                              </View>
                                                            )}
                                                            <Text style={styles.DeliveryStatusDate}>{t('Coins Earned')} - {orderData.rewardCoins}</Text>
                                                        </View>
                                                    </View> 
                                                    <View style={[styles.HorizontalRule , ]}>
                                                    </View>                            
                                                    {JSON.parse(orderItem).map((orderItemData : any , key :any) => {
                                                        // console.log("OrderItem" + JSON.stringify(orderItemData))
                                                        // console.log(orderItemData.image)
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
                                                                            <Text style={styles.OrderHistorySingleItemInfoPrice}>{t('Item Price')} : {orderItemData.ItemPrice}</Text>
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
                                                        <Text style={styles.TotalBottomTitle}>{t('Total')}</Text>
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

    </GestureHandlerRootView>
  )
}

export default OrderHistoryScreen

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
        color : COLORS.primaryLightGreyHex,
      }, 
      OrdersCategoryContainer : {
        flexDirection : "row",
        alignItems : "center",
        justifyContent: 'space-around',
      },
      ActiveOrdersContainer : {

      },
      OrderCategorySelectedLine : {
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : 2,
        flex : 1,
      },
      ActiveOrdersTitle : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,

      },
      PastOrdersContainer : {

      },
      PastOrdersTitle: {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
      },
      OrderHistoryScrollView : {

      },
      EmptyCartContainer : {

      },
      EmptyCartAnimation : {
          height: 500,
      },
      EmptyCartText : {
          margin : SPACING.space_18,
          textAlign : "center",
          fontSize : FONTSIZE.size_20,
          fontFamily : FONTFAMILY.poppins_semibold,
          color : COLORS.primaryLightGreyHex,
      },
      OrderDataDate : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_18,
        color : COLORS.primaryLightGreyHex,
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
        textTransform : "capitalize"
      },
      DeliveryStatusDate : {
        fontSize : FONTSIZE.size_12*1.1,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryLightGreyHex,
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
        width : 80,
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