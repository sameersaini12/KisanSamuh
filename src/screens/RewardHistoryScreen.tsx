import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {BASE_URL} from "@env"
import { useSelector } from 'react-redux'
import { FlatList, GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const RewardHistoryScreen = ({navigation} : any) => {

  const {t} = useTranslation()

  const [ordersList, setOrdersList] = useState([])
  const [noRewards , setNoRewards] = useState(false)

  const userId = useSelector((state : any) => state.user.id)
  const userToken = useSelector((state : any) => state.user.token)

  const backButtonHandler = () => {
    navigation.pop()
  }

  const fetchRewardHistory = async () => {
    await fetch(`${BASE_URL}/order/get-reward-history/${userId}`,
        {method : "GET",
        headers : {
            Accept : "application/json",
            "Content-Type" : "application/json",
            Authorization : `Bearer ${userToken}`
        }}
    )
    .then((res) => res.json())
    .then((res) => {
        // console.log(res.data)
        if(res.data.length>0) {
          setOrdersList(res.data)
        }else {
          setNoRewards(true)
        }
    })
    .catch((error) => {
        console.log("Err" +error)
      })
}

useEffect(()=> {
    fetchRewardHistory()
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
            <Text style={styles.StartingHeaderTitle}>{t("Coin Reward History")}</Text>

        </View>

        {noRewards && 
          <Text style={[styles.RewardCoinsText, {margin : SPACING.space_18}]}>{t("There is not any rewards yet")}</Text>
        }

        <FlatList
          data={ordersList}
          keyExtractor={(item : any) => item._id}
          renderItem={({item , index}) => {
            // console.log(item)
            return (
              <View style={styles.RewardHistoryCardContainer}>
                {/* <Text style={styles.RewardCoinsText}>Date : {moment(item.updatedAt).format("DD/MM/YYYY")}</Text> */}
                <View style={{flexDirection : "row" , alignItems : "center" , justifyContent: 'space-between',}}>
                <Text style={styles.OrderIdText}>{t("Date")}: {moment(item.deliveryDate).format("DD/MM/YYYY")}</Text>
                  <Text style={styles.RewardCoinsText}>
                  <Image style={{height : 25, width : 30}} source={require("../assets/reward_coin.png")} />
                    x {item.rewardCoins}</Text>
                </View>
              </View>
            )
          }}
        />
    </GestureHandlerRootView>
  )
}

export default RewardHistoryScreen

const styles = StyleSheet.create({
  StartingHeaderContainer : {
    flexDirection : 'row',
    padding : SPACING.space_18,
    alignItems : "center",
    backgroundColor : COLORS.primaryLightGreenHex
  },
  StartingHeaderBackButton : {

  },
  StartingHeaderTitle : {
      marginLeft : SPACING.space_18,
      fontSize : FONTSIZE.size_20,
      fontFamily : FONTFAMILY.poppins_semibold,
      color : COLORS.primaryWhiteHex
  },
  StartingHeaderSkipButtonText : {
      fontSize : FONTSIZE.size_18,
      fontFamily : FONTFAMILY.poppins_medium,
      color : COLORS.primaryWhiteHex
  }, 
  RewardHistoryCardContainer :{
    margin : SPACING.space_18,
    marginBottom : 0,
    padding : SPACING.space_18,
    borderWidth : 0.7,
    borderColor : COLORS.primaryLightGreyHex,
    borderRadius : BORDERRADIUS.radius_15,
  },
  OrderIdText : {
    fontSize : FONTSIZE.size_16,
    fontFamily : FONTFAMILY.poppins_regular,
    color : COLORS.primaryBlackHex,
  },
  RewardCoinsText : {
    fontSize : FONTSIZE.size_16,
    fontFamily : FONTFAMILY.poppins_regular,
    color : COLORS.primaryBlackHex,
  }
})