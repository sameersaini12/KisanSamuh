import { StyleSheet, Text, View, Image, Dimensions, Modal, Pressable, ToastAndroid } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useSelector } from 'react-redux'
import {BASE_URL} from "@env"
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import ChangeAddressModal from '../components/ChangeAddressModal'
import RedeemAddress from '../components/RedeemAddress'
import OrderHistoryLoadingSkeleton from '../components/OrderHistoryLoadingSkeleton'

const RewardScreen = ({navigation} : any) => {

    const [openRewardProductModal , setOpenRewardProductModal] = useState(false)
    const [openRewardIndex, setOpenRewardIndex] = useState<any>({})
    const [rewardList, setRewardList] = useState<any>([])
    const [loadingGiftList , setLoadingGiftList] = useState(true)

    const backButtonHandler = () => {
        navigation.pop()
    }

    const userId = useSelector((state : any) => state.user.id)
    const userToken = useSelector((state : any) => state.user.token)
    const [coins , setCoins ] = useState(0)

    const bottomSheetModalRef  = useRef<any | null>(null)
    const snapPoints = useMemo(() => ["50%", "80%"],[])

    const openBottomModel= () => {
        bottomSheetModalRef.current?.present()
    }

    const closeBottomModel = () => {
        bottomSheetModalRef.current?.close()
    }

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

    const fetchRewardsList = async () => {
        await fetch(`${BASE_URL}/reward/get-rewards`,
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
            setLoadingGiftList(true)
            if(res.data.length>0) {
                setRewardList(res.data)
            }
            setLoadingGiftList(false)
        })
        .catch((error) => {
            console.log("Err" +error)
        })
    }

    useEffect(()=> {
        fetchRewardsList()
        fetchUserDetails()
    }, [])

  return (
    <GestureHandlerRootView>
        <BottomSheetModalProvider>

        <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
            >
                <View>
                    <RedeemAddress navigation={navigation} closeBottomModel={closeBottomModel} rewardId={openRewardIndex._id} coins={openRewardIndex.coins_required} fetchUserDetails={fetchUserDetails}/>
                </View>
        </BottomSheetModal>
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
                    navigation.push("RedeemHistoryScreen" , {
                        rewardList : rewardList
                    })
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

        {loadingGiftList ?
            <OrderHistoryLoadingSkeleton />    
        :
        
        <View style={{padding : SPACING.space_18}}>
            <View style={styles.BenifitListContainer}>
                <View style={styles.GiftTitleButtonContainer}>
                    <Text style={styles.GiftTitle}>Gifts</Text>
                </View>
                {rewardList && rewardList.map((item : any, index: any) => {
                    return (
                        <View key={index}>
                        <TouchableOpacity 
                            onPress={() => {
                                setOpenRewardIndex(item)
                                setOpenRewardProductModal(true)
                            }}
                            style={[styles.BenifitItemContainer , {marginTop : SPACING.space_20}]}>
                            <Image resizeMode="cover" style={styles.GiftImage} source={{uri : item.image_link}} />
                            <View>
                            <Text style={styles.GiftCoins}>{item.coins_required} Coins</Text>
                            <Text style={styles.GiftInfo}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.HorizontalRule}></View>
                        </View>
                    )
                })}
            </View>
        </View>
        }
        </ScrollView>

        
        <Modal
            animationType="slide"
            transparent={true}
            visible={openRewardProductModal}
            onRequestClose={() => {
                setOpenRewardProductModal(!openRewardProductModal)
            }}
        >
            <View style={styles.ProductInfoModalContainer}>
                <View style={styles.ProductInfoModalDataContainer}>
                <Image resizeMode='contain' style={styles.ProductInfoImage} source={{uri : openRewardIndex.image_link}} />
                <View style={styles.ProductInfoDescriptionContainer}>
                    <Text style={styles.ProductInfoDescriptionTitle}>Name : </Text>
                    <Text style={styles.ProductInfoDescriptionData}>{openRewardIndex.name} </Text>
                </View>
                <View style={styles.ProductInfoDescriptionContainer}>
                    <Text style={styles.ProductInfoDescriptionTitle}>Coins : </Text>
                    <Text style={styles.ProductInfoDescriptionData}>{openRewardIndex.coins_required} Coins </Text>
                </View>
                <View style={styles.ProductInfoModalButtonContainer}>
                    <Pressable
                        onPress={() => {
                            setOpenRewardProductModal(false)
                        }}
                        style={styles.AddToCartButtonContainer}
                    >
                        <Text style={styles.AddToCartText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            if(openRewardIndex.coins_required < coins) {
                                setOpenRewardProductModal(false)
                                openBottomModel()
                            }else{
                                ToastAndroid.show(`Needs ${openRewardIndex.coins_required - coins} Coins` , ToastAndroid.SHORT)
                            }
                        }}
                        style={[styles.CloseButtonContainer , {opacity : openRewardIndex.coins_required < coins ? 1 : 0.8}]}
                    >
                        <Text style={styles.CloseButtonText}>{openRewardIndex.coins_required < coins ? "Redeem Now" : `Needs ${openRewardIndex.coins_required - coins} Coins`}</Text>
                    </Pressable>
                </View>
                </View>
            </View>
        </Modal>
        </BottomSheetModalProvider>
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
    },
    ProductInfoModalContainer : {
        justifyContent : "center",
        alignItems : "center",
        elevation : 450,
        flex : 1,
        backgroundColor : 'rgba(0,0,0,0.5)'
    },
    ProductInfoModalDataContainer : {
        backgroundColor : "white",
        padding : SPACING.space_18*1.5,
        borderRadius : 12,
        alignItems : "center",
        justifyContent: 'center',
        marginHorizontal : SPACING.space_18,
    },
    ProductInfoModalButtonContainer : {
        flexDirection : "row",
        alignItems : "center",
        marginTop : SPACING.space_18
    },
    AddToCartButtonContainer : {
        backgroundColor : COLORS.primaryOrangeHex,
        padding : SPACING.space_16,
        borderRadius : 12,
        alignItems : "center",
        justifyContent: 'center',
    },
    AddToCartText : {
        color : "white",
        fontWeight : "500",
        fontSize : 18,
        textAlign : "center"
    },
    CloseButtonContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : SPACING.space_16,
        borderRadius : 12,
        marginLeft : SPACING.space_18,
        alignItems : "center",
        justifyContent: 'center',
    },
    CloseButtonText : {
        fontWeight : "500",
        fontSize : 18,
        textAlign : "center",
        color : COLORS.primaryWhiteHex,
    },
    ProductInfoDescriptionContainer : {
        flexDirection : "row",
        width : Dimensions.get("screen").width-(SPACING.space_18*4.5),
        marginTop : SPACING.space_18,
    },
    ProductInfoDescriptionTitle : {
        fontSize : 17,
        color : COLORS.primaryBlackHex,
        fontFamily :FONTFAMILY.poppins_medium,
        fontWeight : "500",
        width : 97
    },
    ProductInfoDescriptionData : {
        fontSize : 17,
        color : COLORS.primaryBlackHex,
        fontFamily :FONTFAMILY.poppins_regular,
        fontWeight : "500",
        width : Dimensions.get("screen").width - (SPACING.space_18*4.5+97)
    },
    ProductInfoImage : {
        height: 140,
        width : 150,
        overflow : "visible",
    }
})