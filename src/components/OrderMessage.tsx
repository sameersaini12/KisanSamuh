import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useSelector } from 'react-redux'
import moment from 'moment'

const OrderMessage = ({navigation , orderList , deliveryDate, totalGroupOrderAmount, deliveryStatus , userDetails} : any) => {

    const loginUserId = useSelector((state : any) => state.user.id)
    // console.log(JSON.stringify(orderList))
  return (
    <View style={styles.OrderMessageContainer}>
        <Text style={styles.DeliveryDateHeading}> <Text style={{fontSize : FONTSIZE.size_16 , color : COLORS.primaryBlackHex}}>Delivered {deliveryStatus==='Delivered' ? "On" : "By"} - </Text>{moment(deliveryDate).format("DD MMMM, YYYY")}</Text>
        <Text style={styles.DeliveryDateHeading}> <Text style={{fontSize : FONTSIZE.size_16 , color : COLORS.primaryBlackHex}}>Total Amount - </Text>Rs. {totalGroupOrderAmount}</Text>
        <Text style={styles.DeliveryDateHeading}> <Text style={{fontSize : FONTSIZE.size_16 , color : COLORS.primaryBlackHex}}>Status - </Text>{deliveryStatus}</Text>
      {orderList.length >0 && orderList.map((order:any , index : any) => {
        return (
            <View style={{marginTop : SPACING.space_10}} key={index}>
                <View style={{padding : 0.4, backgroundColor: COLORS.primaryLightGreyHex , marginBottom : SPACING.space_10}}></View>
                <Text style={styles.UserHeadingText}>{index+1}. {userDetails[order.userId]!== undefined && userDetails[order.userId].name} ({ userDetails[order.userId]!== undefined && userDetails[order.userId].phone}) {loginUserId===order.userId ? "(You)" : ""}</Text>
                {order.orders.map((orderItem :any, orderItemIndex : any)=> {
                    
                    return (
                        <View key={orderItemIndex} style={{marginLeft : "5%"}}>
                            {JSON.parse(orderItem).map((orderItemData : any, orderItemDataIndex :any) => {
                                // console.log(orderItemData.title)
                                return (
                                    <View key={orderItemDataIndex}>
                                        <Text style={styles.ProudctTitleText}>{orderItemDataIndex+1}. {orderItemData.title}</Text>
                                        {orderItemData.price.map((orderItemDataPrice : any , orderItemDataPriceIndex: any)=> {
                                            return (
                                                <View style={{marginLeft : "6%"}} key={orderItemDataPriceIndex}>
                                                    <Text style={styles.ProductQuantityText}>{orderItemDataPrice.size} (x{orderItemDataPrice.quantity})</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                )
                            })}
                        </View>
                    )
                    
                })}
            </View>
        )
      })}
    </View>
  )
}

export default OrderMessage

const styles = StyleSheet.create({
    OrderMessageContainer: {
        backgroundColor : COLORS.secondaryLightGreenHex,
        width : "77%",
        marginLeft : "20%",
        padding : SPACING.space_12,
        marginTop : SPACING.space_15,
        borderRadius : BORDERRADIUS.radius_10
    }, 
    DeliveryDateHeading : {
        fontSize : FONTSIZE.size_14*1.1,
        color : COLORS.primaryLightGreyHex,
        fontFamily : FONTFAMILY.poppins_semibold,
        
    },
    UserHeadingText : {
        fontSize : FONTSIZE.size_16,
        fontFamily :FONTFAMILY.poppins_semibold,
        color : COLORS.secondaryDarkGreyHex,
        textTransform : "capitalize",
    },
    ProudctTitleText : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_bold,
        color : COLORS.primaryBlackHex,
    },
    ProductQuantityText : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    }
})