import { Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import OrderMessage from '../components/OrderMessage'
import ServerMessage from '../components/ServerMessage'
import {BASE_URL} from "@env"
import ChatLoadingSkeleton from '../components/ChatLoadingSkeleton'
import LottieView from 'lottie-react-native'

const ChatScreen = ({navigation, route} : any) => {

    const [groupName, setGroupName ] = useState(route.params.groupName)
    const [currentGroupOrdersList, setCurrentGroupOrdersList] = useState([])
    const [previousGroupOrdersList, setPreviousGroupOrdersList] = useState([])
    const [userDetails , setUserDetails] = useState<any>({})
    const [showServerMessage , setShowServerMessage ] = useState(false)
    const [loadingContent , setLoadingContent] = useState(true)
    const [loadPreviousLoading , setLoadPreviousLoading ] = useState(false)
    const [previousOrderNumber , setPreviousOrderNumer] = useState(0)
    const [totalOrdersToFetchNumber, setTotalOrdersToFetchNumber] = useState(2)


    const userToken = useSelector((state : any) => state.user.token)

    const scrollViewRef = useRef<any>()

    const backButtonHandler = () => {
        navigation.pop()
    }

    const fetchUserDetails = async (searchId : any) => {
        // console.log(searchId)
        await fetch(`${BASE_URL}/users/get-user-details/${searchId}` , {
            headers : {
              "Content-Type" : "application/json",
              Authorization : `Bearer ${userToken}`
            }
          }).then((res) => res.json())
          .then(async (res) => {
            let prevUserDetails = userDetails
            prevUserDetails[res.data[0]._id] = {
                name : res.data[0].name,
                phone : res.data[0].phone
            }
            setUserDetails(prevUserDetails)
            // console.log(userDetails)
          }).catch((err) => {
            console.log(err)
          })
    }

    const fetchPreviousGroupOrders = async () => {
        await fetch(`${BASE_URL}/order/get-previous-group-order/${groupName}/${previousOrderNumber}/${totalOrdersToFetchNumber}`, {
            method : "GET",
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            },
        })
        .then((res) => res.json())
        .then(async (res) => {
            // console.log(res.data)
            setLoadPreviousLoading(true)
            let previosuOrderList : any = previousGroupOrdersList
            if(res.data.length>0){
                for(let i=0;i<res.data.length;i++) {
                    previosuOrderList.unshift(res.data[i])
                    for(let j=0;j<res.data[i].orders.length;j++) {
                        await fetchUserDetails(res.data[i].orders[j].userId)
                    }
                }
                setPreviousGroupOrdersList(previosuOrderList)
            }
            else{
                ToastAndroid.show("No More Previous Orders" , ToastAndroid.SHORT)
            }
            setLoadPreviousLoading(false)
            // console.log(currentGroupOrdersList)
        })
        .catch((err) => {

            console.log(err)
        })
    }

    const loadPreviousOrdersButtonHandler = () => {
        setPreviousOrderNumer(previousOrderNumber+1)
        fetchPreviousGroupOrders()
    }

    const fetchGroupOrders = async () => {
        await fetch(`${BASE_URL}/order/get-current-group-order/${groupName}`, {
            method : "GET",
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            },
        })
        .then((res) => res.json())
        .then(async (res) => {
            
            // console.log(res.data.length)
            setLoadingContent(true)
            if(res.data.length>0) {
                for(let i=0;i<res.data.length;i++) {
                    for(let j=0;j<res.data[i].orders.length;j++) {
                        await fetchUserDetails(res.data[i].orders[j].userId)
                    }
                }
                await setCurrentGroupOrdersList(res.data)
            }else {
                setShowServerMessage(true)
            }  
            setLoadingContent(false)
            // console.log(currentGroupOrdersList)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    useEffect(()=> {
        fetchGroupOrders()
    }, [])

  return (
    <GestureHandlerRootView>
        <View style={styles.StartingHeaderContainer}>
            <Pressable 
                onPress={backButtonHandler}
                style={styles.StartingHeaderBackButton}
            >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryWhiteHex}
                />
            </Pressable>
            <View style={styles.GroupDPContainer}>
                <CustomIcon
                    name='users'
                    size={27}
                />
            </View>
            <Pressable
                onPress={()=> {
                    navigation.push("GroupInfoScreen",  {
                        groupName: groupName
                    })
                }}
            >
                <Text style={styles.SelectCropScreenHeaderTitle}>{route.params.groupName}</Text>
                <Text style={styles.GroupMembers}>See all group members</Text>
            </Pressable>
        </View>
        {loadingContent ? (
            <ChatLoadingSkeleton  />
        ) : (
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ScrollViewStyle}
                
            >
                <Pressable
                    onPress={loadPreviousOrdersButtonHandler}
                    style={styles.LoadPreviousOrdersButtonContainer}
                >
                    {loadPreviousLoading && 
                        <LottieView
                            source={require("../components/lottie/Loading.json")}
                            style={{height : 27, width : 27}}
                            autoPlay
                            loop
                        />
                    }
                    <Text style={styles.LoadPreviousOrdersButtonText}>
                        Load Previous orders
                    </Text>
                </Pressable>
                {previousGroupOrdersList.length>0 && previousGroupOrdersList.map((item :any , index : any)=> {
                    // console.log(item)
                    return (
                        <View key={index} >
                            <OrderMessage 
                                navigation={navigation} 
                                orderList={item.orders} 
                                deliveryDate={item._id}
                                totalGroupOrderAmount={item.totalGroupOrderAmount}
                                deliveryStatus="Delivered"
                                userDetails={userDetails}
                            />
                        </View>
                    )
                })}
                {
                    previousGroupOrdersList.length>0 && (
                        <View style={styles.CurrentOrderHRLineContainer}>
                            <View style={styles.HorizontalRuleHalf}>
                            </View>
                            <Text style={styles.CurrentOrdersLineText}>Current Orders</Text>
                            <View style={styles.HorizontalRuleHalf}>
                            </View>
                        </View>
                    )
                }
                
                {currentGroupOrdersList.length>0 ? currentGroupOrdersList.map((item :any , index : any)=> {
                    // console.log(item)
                    return (
                        <OrderMessage 
                            key={index} 
                            navigation={navigation} 
                            orderList={item.orders} 
                            deliveryDate={item._id}
                            totalGroupOrderAmount={item.totalGroupOrderAmount}
                            deliveryStatus="Not delivered"
                            userDetails={userDetails}
                        />
                    )
                }) :
                    showServerMessage && 
                    <ServerMessage 
                        groupName={groupName}
                        navigation={navigation}
                    />
                }                
            </ScrollView>
        )}
        
    </GestureHandlerRootView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    StartingHeaderContainer : {
        flexDirection : 'row',
        padding : SPACING.space_18,
        alignItems : "center",
        backgroundColor : COLORS.primaryLightGreenHex
    },
    StartingHeaderBackButton : {

    },
    SelectCropScreenHeaderTitle : {
        marginLeft : SPACING.space_10,
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryWhiteHex,
    },
    GroupDPContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        width : 45,
        height : 45,
        borderRadius : BORDERRADIUS.radius_25*5,
        marginLeft : SPACING.space_12,
        alignItems : "center",
        justifyContent: 'center',
    },
    GroupMembers : {
        marginTop : -SPACING.space_10*0.5,
        marginLeft : SPACING.space_10,
        fontSize : FONTSIZE.size_12*1.09,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryWhiteHex,
    },
    LoadPreviousOrdersButtonContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        padding : SPACING.space_10*0.5,
        margin : SPACING.space_10,
        marginLeft : "26%",
        marginRight : "26%",
        borderRadius : BORDERRADIUS.radius_25,
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "center"
    },
    LoadPreviousOrdersButtonText : {
        textAlign : "center",
        color : COLORS.primaryBlackHex,
        fontSize : FONTSIZE.size_14,
        fontFamily :FONTFAMILY.poppins_medium,
    },
    ScrollViewStyle : {
        paddingBottom : SPACING.space_18
    },
    CurrentOrderHRLineContainer : {
        flexDirection : "row",
        alignItems : "center",
        marginTop : SPACING.space_18
    },
    HorizontalRuleHalf : {
        padding : 0.6,
        backgroundColor : COLORS.secondaryLightGreyHex,
        width : "25%",
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_18
    },
    CurrentOrdersLineText : {
        fontSize :FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        textAlign : "center",
        color : COLORS.primaryBlackHex
    }

})