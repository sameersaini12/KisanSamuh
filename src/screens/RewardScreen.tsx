import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useSelector } from 'react-redux'
import {BASE_URL} from "@env"

const RewardScreen = ({navigation} : any) => {

    const backButtonHandler = () => {
        navigation.pop()
    }

    const userId = useSelector((state : any) => state.user.id)
    const userToken = useSelector((state : any) => state.user.token)
    const [coins , setCoins ] = useState(0)

    const fetchUserDetails = async () => {
        await fetch(`${BASE_URL}/users/get-user-details/${userId}`,
            {method : "GET",
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            }}
        )
        .then((res) => res.json())
        .then((res) => {
            // console.log(res)
            setCoins(res.data[0].coins)
        })
        .catch((error) => {
            console.log("Err" +error)
          })
    }

    useEffect(()=> {
        fetchUserDetails()
    }, [])

  return (
    <GestureHandlerRootView>
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
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
            <Text style={styles.StartingHeaderTitle}>Rewards</Text>

        </View>

        <View style={styles.RewardCoinsContainer}>
            <Image style={styles.RewardCoinImage} source={require("../assets/reward_coin.png")} />
            <View style={styles.RewardCoinNumberContainer}>
                <Text style={styles.RewardCoinNumber}>{coins}</Text>
                <Text style={styles.RewardCoinPointTitle}>Points</Text>
            </View>
        </View>

        <View style={styles.RewardOptionsContainer}>
            
            <TouchableOpacity
                onPress={() =>{
                    navigation.push("RewardHistoryScreen")
                }}
                style={styles.RewardHistoryContainer}
            >
                <Text style={styles.RewardHistoryText}>Coin Reward History</Text>
                <CustomIcon
                    name='circle-right'
                    size={22}
                    color={COLORS.primaryLightGreyHex}
                />
            </TouchableOpacity>
            <View style={styles.HorizontalRule}></View>
            <TouchableOpacity
                onPress={() =>{
                    navigation.push("RedeemHistoryScreen")
                }}
                style={styles.RewardHistoryContainer}
            >
                <Text style={styles.RewardHistoryText}>Redeem History</Text>
                <CustomIcon
                    name='circle-right'
                    size={22}
                    color={COLORS.primaryLightGreyHex}
                />
            </TouchableOpacity>
            <View style={styles.HorizontalRule}></View>
        </View>
        

        <View style={{padding : SPACING.space_18}}>
            <View style={styles.BenifitListContainer}>
                <View style={styles.GiftTitleButtonContainer}>
                    <Text style={styles.GiftTitle}>Gifts</Text>
                </View>
                <View style={[styles.BenifitItemContainer , {marginTop : SPACING.space_20}]}>
                    <Image resizeMode="cover" style={styles.GiftImage} source={{uri : "https://m.media-amazon.com/images/I/71gWfs0OVmL._SL1500_.jpg"}} />
                    <View>
                    <Text style={styles.GiftCoins}>1000 Coins</Text>
                    <Text style={styles.GiftInfo}>Turbo 2-In-1 Agriculture Sprayer Pump</Text>
                    </View>
                </View>
                <View style={styles.HorizontalRule}></View>
                <View style={styles.BenifitItemContainer}>
                    <Image style={styles.GiftImage} source={{uri : "https://m.media-amazon.com/images/I/51xrUSSdc8L._AC_UF1000,1000_QL80_.jpg"}} />
                    <View>
                    <Text style={styles.GiftCoins}>500 Coins</Text>
                    <Text style={styles.GiftInfo}>GLOBEAM 6900 Kisan Torch Charging Emergency Light</Text>
                    </View>
                </View>
                <View style={styles.HorizontalRule}></View>
                <View style={styles.BenifitItemContainer}>
                    <Image style={styles.GiftImage} source={{uri : "https://m.media-amazon.com/images/I/61LNo9ygGpL.jpg"}} />
                    <View>
                    <Text style={styles.GiftCoins}>100 Coins</Text>
                    <Text style={styles.GiftInfo}>Super HK Stainless Steel Traditional Indian Tiffin Carrier</Text>
                    </View>
                </View>
                <View style={styles.HorizontalRule}></View>
                <View style={styles.BenifitItemContainer}>
                    <Image style={styles.GiftImage} source={{uri : "https://m.media-amazon.com/images/I/41-wgUBSfRL._AC_UY1100_.jpg"}} />
                    <View>
                    <Text style={styles.GiftCoins}>50 Coins</Text>
                    <Text style={styles.GiftInfo}>Bag Grocery Cotton with Pockets Heavy Duty</Text>
                    </View>
                </View>
            </View>
        </View>
        </ScrollView>
    </GestureHandlerRootView>
  )
}

export default RewardScreen

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
    RewardCoinsContainer: {
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : SPACING.space_18,
        borderBottomLeftRadius : BORDERRADIUS.radius_20*1.5,
        borderBottomRightRadius : BORDERRADIUS.radius_20*1.5,
        flexDirection : "row",
        justifyContent : "space-between"
    },
    RewardCoinImage :{
        width : 60,
        height: 40
    },
    RewardCoinNumberContainer : {
        alignItems : "center",
        marginRight : SPACING.space_18
    },
    RewardCoinNumber : {
        color : COLORS.primaryWhiteHex,
        fontSize : FONTSIZE.size_20,
        fontFamily : FONTFAMILY.poppins_bold,
    },
    RewardCoinPointTitle : {
        color : COLORS.primaryWhiteHex,
        fontSize : FONTSIZE.size_20,
        fontFamily : FONTFAMILY.poppins_medium,
    },
    RewardOptionsContainer : {
        padding : SPACING.space_24
    },
    RewardHistoryContainer : {
        flexDirection : "row",
        justifyContent : "space-between"
    },
    RewardHistoryText : {
        fontSize : FONTSIZE.size_16,
        fontFamily: FONTFAMILY.poppins_regular,
        color : COLORS.primaryLightGreyHex
    }, 
    HorizontalRule : {
        padding : 0.6,
        backgroundColor : COLORS.secondaryLightGreyHex,
        marginTop : SPACING.space_10,
        marginBottom : SPACING.space_10,
    },
    BenifitListContainer : {
        borderWidth : 0.7,
        borderColor : COLORS.primaryLightGreyHex,
        borderRadius : BORDERRADIUS.radius_20,
        padding : SPACING.space_18
    },
    GiftTitleButtonContainer : {
        backgroundColor : COLORS.primaryOrangeHex,
        padding : SPACING.space_12,
        borderRadius : BORDERRADIUS.radius_15,
        position : "absolute",
        left : 0,
        right : 0,
        top : -30,
        width : "50%",
        marginLeft : "30%"
    },
    GiftTitle : {
        color : COLORS.primaryWhiteHex,
        textAlign : "center",
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium
    },
    GiftImage : {
        width : 80,
        height : 80,
        marginRight : SPACING.space_10
    },
    BenifitItemContainer : {
        flexDirection : "row",
    },
    GiftCoins : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryBlackHex,
        
    },
    GiftInfo : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryLightGreyHex,
        width : Dimensions.get("screen").width- (SPACING.space_18*4+80+SPACING.space_10)
    }
})