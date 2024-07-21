import { StatusBar, StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { useSelector } from 'react-redux'
import LottieView from 'lottie-react-native'
import OrderItem from '../components/OrderItem'
import OrderItemProduct from '../components/OrderItemProduct'

const OrderHistoryScreen = ({navigation} : any) => {
    const [ordersList , setOrdersList] = useState([])
    const [selectedOrderCategory , setSelectedOrderCategory] = useState(0)

    const orderHistoryList = useSelector((state : any) => state.cart.orderHistoryList)
    const userId = useSelector((state : any) => state.user.id)
    const userToken = useSelector((state : any) => state.user.token)

    const backButtonHandler = () => {
        navigation.navigate("Tab")
    }

    const fetchAllOrders = async () => {
        await fetch(`http://10.0.2.2:4000/order/fetch-orders/${userId}` , {
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            },
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res.data)
            setOrdersList(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const fetchAllActiveOrders = async () => {
        await fetch(`http://10.0.2.2:4000/order/fetch-active-orders/${userId}` , {
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            },
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res.data)
            setOrdersList(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }
    

    const activeOrdersButtonHandler = async () => {
        setSelectedOrderCategory(0)
        fetchAllActiveOrders()
    }

    const pastOrdersButtonHandler = async () => {
        setSelectedOrderCategory(1)
        fetchAllOrders()
    }

    useEffect(() => {
        activeOrdersButtonHandler()
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
            <Text style={styles.OrderHistoryScreenHeaderTitle}>Orders</Text>
        </View>
    </View>

    <View style={styles.OrdersCategoryContainer}>
        <Pressable 
            onPress={activeOrdersButtonHandler}
            style={styles.ActiveOrdersContainer}
        >
            <Text style={styles.ActiveOrdersTitle}>
                Active Orders
            </Text>
            <View style={[styles.OrderCategorySelectedLine , {display : selectedOrderCategory == 0 ? "flex" : "none"}]}>
            </View>
        </Pressable>
        <Pressable 
            onPress={pastOrdersButtonHandler}
            style={styles.PastOrdersContainer}
        >
            <Text style={styles.PastOrdersTitle}>
                Past Orders
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
                                            {orderData.orders.map((orderItem : any , index : any) => {
                                                console.log("Order Item " + orderItem)
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
                                                            <Text style={styles.DeliveryStatusText}>{orderData.status}</Text>
                                                            <Text style={styles.DeliveryStatusDate}>On {orderData.orderDate}</Text>
                                                            <View style={[ {flexDirection : "row", alignItems : "center"}]}>
                                                              <Text>Payment Status {"- "} </Text>
                                                              <View>
                                                                <View style={styles.PaymentStatusContainer}>
                                                                  <Text style={styles.PaymentStatusText}>{orderData.paymentMode}</Text>
                                                                </View>
                                                              </View>
                                                              <View style={{marginLeft : SPACING.space_10}}>
                                                                {orderData.paymentStatus ? (
                                                                  <View
                                                                  style={styles.PaymentStatusContainer}>
                                                                  <Text style={styles.PaymentStatusText}>Paid</Text>
                                                                </View> 
                                                                ) : (
                                                                  <View
                                                                    style={styles.PaymentStatusContainer}>
                                                                    <Text style={styles.PaymentStatusText}>Not Paid</Text>
                                                                  </View> 
                                                                )}
                                                              </View>
                                                            </View>
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
                                                                        orderStatus : orderData.status
                                                                    })
                                                                }}
                                                            >
                                                                <View style={styles.OrderHistorySingleItemContainer}>
                                                                    <View
                                                                        style={styles.OrderHistoryImageContainer}
                                                                    >
                                                                        <Image 
                                                                            source={require("../assets/Categories/nutrient.png")} 
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
                                                                            <Text style={{fontSize : FONTSIZE.size_30, textAlign : "center"}}> {`>`}</Text>
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
        fontFamily : FONTFAMILY.poppins_semibold
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
        flex : 1
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
          fontFamily : FONTFAMILY.poppins_semibold
      },
      OrderDataDate : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_18,
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