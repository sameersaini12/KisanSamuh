import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { BASE_URL } from "@env"
import { useSelector } from 'react-redux'
import LottieView from 'lottie-react-native'
import OrderHistoryLoadingSkeleton from '../components/OrderHistoryLoadingSkeleton'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const ReddemHistoryScreen = ({ navigation, route }: any) => {

  const { t } = useTranslation()

  const [redeemOrdersList, setRedeemOrdersList] = useState([])
  const [noOrders, setNoOrders] = useState(false)
  const [loading, setLoading] = useState(true)
  const rewardList = route.params.rewardList
  const [rewardData, setRewardData] = useState({})

  const userId = useSelector((state: any) => state.user.id)
  const userToken = useSelector((state: any) => state.user.token)

  const backButtonHandler = () => {
    navigation.pop()
  }

  const asyncfetchRewardDetails = () => {
    var tempRewardDetails: any = {}
    for (let i = 0; i < rewardList.length; i++) {
      tempRewardDetails[rewardList[i]._id] = rewardList[i]
    }
    return tempRewardDetails
  }

  // const fetchRewardDetails = async () => {
  //   asyncfetchRewardDetails()
  // }

  const fetchRedeemHistory = async () => {
    await fetch(`${BASE_URL}/reward/get-user-redeem-orders/${userId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`
      },
    })
      .then((res) => res.json())
      .then(async (res) => {
        setLoading(true)
        // console.log(" data" +JSON.stringify(res.data))
        if (res.data.length > 0) {

          setRedeemOrdersList(res.data)
        } else {
          setNoOrders(true)
        }
        setLoading(false)
      }).catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchRedeemHistory()
    const tempRewardDetails = asyncfetchRewardDetails()
    setRewardData(tempRewardDetails)
  }, [])

  return (
    <GestureHandlerRootView>
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

        <Text style={styles.StartingHeaderTitle}>{t("Redeem History")}</Text>

      </View>
      {noOrders &&
        <View style={styles.EmptyCartContainer}>
          <LottieView
            style={styles.EmptyCartAnimation}
            source={require("../components/lottie/EmptyCart.json")}
            autoPlay
            loop
          />
          <Text style={styles.EmptyCartText}>{t("There is no orders yet!")}</Text>
        </View>
      }

      {loading ?
        <OrderHistoryLoadingSkeleton />
        :
        <FlatList
          data={redeemOrdersList}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => {
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
                    <Text style={styles.DeliveryStatusText}>{t(item.status)}</Text>
                    <Text style={styles.DeliveryStatusDate}>{t("Ordered On")} - {moment(item.orderDate).format("DD MMMM, YYYY")}</Text>
                    {item.deliveryDate !== undefined &&
                      <Text style={styles.DeliveryStatusDate}>{t("Delivered By")} - {moment(item.deliveryDate).format("DD MMMM, YYYY")}</Text>
                    }
                    <Text style={styles.DeliveryStatusDate}>{t("Coins Required")} - {item.rewardDetails[0].coins_required}</Text>
                  </View>
                </View>
                <View style={[styles.HorizontalRule]}></View>
                <View style={styles.OrderHistorySingleItemContainer}>

                  <View
                    style={styles.OrderHistoryImageContainer}
                  >
                    <Image
                      source={{ uri: item.rewardDetails[0].image_link }}
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

export default ReddemHistoryScreen

const styles = StyleSheet.create({
  StartingHeaderContainer: {
    flexDirection: 'row',
    padding: SPACING.space_18,
    alignItems: "center",
    backgroundColor: COLORS.primaryLightGreenHex
  },
  StartingHeaderBackButton: {

  },
  StartingHeaderTitle: {
    marginLeft: SPACING.space_18,
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex
  },
  StartingHeaderSkipButtonText: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryWhiteHex
  },
  NoRedeemHistoryText: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
  },
  EmptyCartContainer: {

  },
  EmptyCartAnimation: {
    height: 500,
  },
  EmptyCartText: {
    margin: SPACING.space_18,
    textAlign: "center",
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryLightGreyHex,
  },
  OrderDataContainer: {
    borderRadius: BORDERRADIUS.radius_10,
    margin: SPACING.space_18,
    backgroundColor: COLORS.primaryLightestGreyHex
  },
  DeliveryStatusContainer: {
    padding: SPACING.space_10,
    flexDirection: "row",

  },
  DeliveryStatusIcon: {
    backgroundColor: COLORS.primaryLightGreenHex,
    borderRadius: BORDERRADIUS.radius_25 * 2,
    justifyContent: 'center',
    alignItems: "center",
    padding: SPACING.space_10,
    height: 40,
    width: 40,
  },
  DeliveryStatusDateContainer: {
    marginLeft: SPACING.space_10,
  },
  DeliveryStatusText: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryBlackHex,
    textTransform: "capitalize"
  },
  DeliveryStatusDate: {
    fontSize: FONTSIZE.size_12 * 1.1,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryLightGreyHex,
  },
  HorizontalRule: {
    padding: 0.5,
    backgroundColor: COLORS.secondaryLightGreyHex
  },
  OrderHistorySingleItemContainer: {
    flexDirection: "row"
  },
  OrderHistorySingleItemInfoContainer: {
    flexDirection: "row",
    padding: SPACING.space_10,
    justifyContent: "space-between",
    flex: 1,
  },
  OrderHistorySingleItemInfoTitle: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryBlackHex,
  },
  OrderHistorySingleItemInfoPrice: {
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
  },
  OrderHistoryImageContainer: {
    backgroundColor: COLORS.primaryWhiteHex,
    width: 80,
    height: 80,
    margin: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10
  },
  OrderHistoryImage: {
    height: 80,
    width: 80,
    borderRadius: BORDERRADIUS.radius_10
  },
})