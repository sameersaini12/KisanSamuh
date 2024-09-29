import { Image, StatusBar, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {BASE_URL} from "@env"
import { useSelector } from 'react-redux'
import { FlatList, GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import OrderHistoryLoadingSkeleton from '../components/OrderHistoryLoadingSkeleton'
import LottieView from 'lottie-react-native'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const UpdateRedeemOrderStatus = ({navigation} : any) => {

    const {t} = useTranslation()

    const [loading , setLoading ] = useState(true)
    const [ordersList , setOrdersList] = useState([])
    const [updateStatusCardIndex , setUpdateStatusCardIndex] = useState(0)
    const [deliveryStatusLoading , setDeliveryStatusLoading ] = useState(false)

    const userToken = useSelector((state : any) => state.user.token)

    const backButtonHandler = () => {
        navigation.pop()
    }

    const updateStatusHandler = async (orderStatus : any, orderId : any) => {
        setDeliveryStatusLoading(true)
        let nextOrderStatus;
        if(orderStatus.toLowerCase() ==='ordered') {
          nextOrderStatus = 'delivered'
        }else {
          ToastAndroid.show(t("Order is already deliverd"), ToastAndroid.SHORT)
          setDeliveryStatusLoading(false)
          return ;
        }
    
        await fetch(`${BASE_URL}/reward/update-redeem-reward/${orderId}` , {
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
          console.log(res)
          await fetchAllOrders()
          setDeliveryStatusLoading(false)
        }).catch((error) => {
          console.log(error)
        })
        setDeliveryStatusLoading(false)
    
    }

    const fetchAllOrders = async () => {
        await fetch(`${BASE_URL}/reward/get-admin-redeem-orders` , {
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
                <Text style={styles.OrderHistoryScreenHeaderTitle}>{t('Update Reward Orders')}</Text>
            </View>
        </View>

        {loading ? 
            <OrderHistoryLoadingSkeleton /> :
            <FlatList
                data={ordersList}
                keyExtractor={(item : any) => item._id}
                renderItem={({item , index}) => {
                    return (
                        <View style={styles.OrderDataContainer}>
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
                                    <Text style={styles.DeliveryStatusText}>{t(item.status)}
                                        
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setUpdateStatusCardIndex(index)
                                            updateStatusHandler(item.status, item._id)
                                        }}
                                        style={{marginLeft : SPACING.space_10 , flexDirection : "row", alignItems : "center"}}
                                    >
                                        {deliveryStatusLoading && index===updateStatusCardIndex && 
                                        <LottieView
                                            source={require("../components/lottie/Loading.json")}
                                            autoPlay
                                            loop
                                            style={{height : 35 , width : 30}}
                                        />
                                        }
                                        <Text style={[styles.DeliveryStatusDate , {color : COLORS.primaryLightGreenHex}]}>{t('Update Status')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.DeliveryStatusDate}>{t('Date')} - { moment(item.orderDate).format("DD MMMM, YYYY")}</Text>
                            </View>
                            </View>
                            <View style={[styles.HorizontalRule]}></View>
                            <View style={styles.OrderHistorySingleItemContainer}>

                            <View
                                style={styles.OrderHistoryImageContainer}
                            >
                                <Image 
                                    source={{uri : item.rewardDetails[0].image_link}} 
                                    style={styles.OrderHistoryImage}
                                />
                            </View>
                            <View style={styles.OrderHistorySingleItemInfoContainer}>
                                <View>
                                    <Text style={styles.OrderHistorySingleItemInfoTitle}>{item.rewardDetails[0].name}</Text>
                                </View>
                            </View>
                        </View>
                        </View>
                    )
                }}
            />
            }
    </GestureHandlerRootView>
  )
}

export default UpdateRedeemOrderStatus

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
      width : 80,
      borderRadius : BORDERRADIUS.radius_10
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