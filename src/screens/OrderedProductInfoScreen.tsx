import { StatusBar, StyleSheet, Text, View , Image, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import CustomIcon from '../components/CustomIcon'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const screen_width = Dimensions.get("screen").width

const OrderedProductInfoScreen = ({navigation, route} : any) => {

    const {t} = useTranslation()

    const backButtonHandler = () => {
        navigation.pop()
    }

  return (
    <GestureHandlerRootView>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />

        <View style={[styles.OrderHistoryScreenHeader, {}]}>
            <View style={styles.OrderHistoryScreenHeaderLeft}>
                <Pressable
                onPress={backButtonHandler}
                >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryLightGreyHex}
                />
                </Pressable>
                <Text style={styles.OrderHistoryScreenHeaderTitle}>{t('Ordered Product Details')}</Text>
            </View>
        </View>

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ScrollView}
        >
            <View>
                <Image
                    style={styles.OrderedProductImage}
                    source={{uri : route.params.image}} 
                />
            </View>
            <View style={styles.OrderedProductDetails}>
                <View style={styles.OrderedProductStatusContainer}
                >
                    <View style={styles.DeliveryStatusIcon}>
                        <CustomIcon
                            name='truck'
                            color={COLORS.primaryLightGreenHex}
                            size={21}
                        />
                    </View>
                    <View style={styles.DeliveryStatusDateContainer}>
                        <Text style={styles.DeliveryStatusText}>{t(route.params.orderStatus)}</Text>
                        <Text style={styles.DeliveryStatusDate}>{t('Date')}: {moment(route.params.orderDate).format("DD MMM, YYYY")}</Text>
                    </View>
                </View>
                <View style={styles.DeliveryAddressContainer}>
                    <Text style={styles.ItemPriceHeading}>{t('Quantity')}</Text>
                    {(route.params.price).map((item : any, index : any) => {
                        return (
                            <View key={index} style={{flexDirection : "row" , justifyContent: 'space-between' , alignItems : "center"}}>
                                <View>
                                    <Text style={styles.DeliveryAddressText}>{item.size} - Rs. {item.price}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.DeliveryAddressText , {marginRight : SPACING.space_10}]}>x {item.quantity}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
                {route.params.buyingGroup!=="none" && (
                    <View style={styles.DeliveryAddressContainer}>
                        <Text style={styles.DeliveryAddressHeading}>{t('Buying Group')}</Text>
                        <Text style={styles.DeliveryAddressText}>{route.params.buyingGroup}</Text>
                    </View>
                )}
                
                <View style={styles.DeliveryAddressContainer}>
                    <Text style={styles.DeliveryAddressHeading}>{t('Delivery Address')}</Text>
                    <Text style={styles.DeliveryAddressText}>{route.params.address}</Text>
                </View>
                <View style={styles.ItemPriceContainer}>
                    <Text style={styles.ItemPriceHeading}>{t('Item Price')}</Text>
                    <Text style={styles.ItemPriceText}>Rs. {route.params.itemPrice}</Text>
                </View>
                {/* <View style={styles.ButtonContainer}>
                    <Text style={styles.ButtonText}>{t('Download Invoice')}</Text>
                </View> */}
                {/* <View style={styles.ButtonContainer}>
                    <Text style={styles.ButtonText}>Rate this product</Text>
                </View> */}
            </View>
        </ScrollView>
    </GestureHandlerRootView>
  )
}

export default OrderedProductInfoScreen

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
    OrderedProductImage : {
        height : screen_width,
        width : screen_width,
    },
    ScrollView : {
    },
    OrderedProductDetails : {
        padding : SPACING.space_18,
    },
    OrderedProductStatusContainer : {
        flexDirection : "row" , 
        backgroundColor : COLORS.primaryLightGreenHex , 
        borderRadius : BORDERRADIUS.radius_10 , 
        alignItems : "center" , 
        justifyContent: 'flex-start' ,  
        padding : SPACING.space_10 
    },
    DeliveryAddressContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        padding : SPACING.space_12,
        marginTop : SPACING.space_18,
        borderRadius : BORDERRADIUS.radius_10,
    },
    DeliveryAddressHeading : {
        fontSize : FONTSIZE.size_16*1.05,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    },
    DeliveryAddressText : {
        fontSize : FONTSIZE.size_14,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryBlackHex,
    },
    ItemPriceContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        padding : SPACING.space_12,
        borderRadius : BORDERRADIUS.radius_10,
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "center",
        marginTop : SPACING.space_18
    },
    ItemPriceHeading : {
        fontSize : FONTSIZE.size_16*1.05,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    },
    ItemPriceText : {
        fontSize : FONTSIZE.size_16*1.05,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    }, 
    ButtonContainer : {
        padding : SPACING.space_12,
        backgroundColor : COLORS.primaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_10,
        marginTop : SPACING.space_18,
    }, 
    ButtonText : {
        textAlign : "center",
        color : COLORS.primaryWhiteHex,
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
    },
    DeliveryStatusIcon : {
        backgroundColor : COLORS.primaryWhiteHex,
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
        color : COLORS.primaryWhiteHex,
        textTransform : "capitalize"
      },
      DeliveryStatusDate : {
        fontSize : FONTSIZE.size_12*1.1,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryWhiteHex
      },
})