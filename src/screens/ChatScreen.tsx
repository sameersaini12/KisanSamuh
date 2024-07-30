import { Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import OrderMessage from '../components/OrderMessage'
import ServerMessage from '../components/ServerMessage'

const ChatScreen = ({navigation, route} : any) => {

    const [groupName, setGroupName ] = useState(route.params.groupName)
    const [currentGroupOrdersList, setCurrentGroupOrdersList] = useState([])
    const [previousGroupOrdersList, setPreviousGroupOrdersList] = useState([])
    const [userDetails , setUserDetails] = useState<any>({})


    const userToken = useSelector((state : any) => state.user.token)

    const scrollViewRef = useRef<any>()

    const backButtonHandler = () => {
        navigation.pop()
    }

    const fetchUserDetails = async (searchId : any) => {
        // console.log(searchId)
        await fetch(`http://10.0.2.2:4000/users/get-user-details/${searchId}` , {
            headers : {
              "Content-Type" : "application/json",
              Authorization : `Bearer ${userToken}`
            }
          }).then((res) => res.json())
          .then(async (res) => {
            let prevUserDetails = userDetails
            prevUserDetails[res.data[0]._id] = res.data[0].name
            setUserDetails(prevUserDetails)
            // console.log(userDetails)
          }).catch((err) => {
            console.log(err)
          })
    }

    const fetchPreviousGroupOrders = async () => {
        await fetch(`http://10.0.2.2:4000/order/get-previous-group-order/${groupName}`, {
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
            if(res.data.length>0){
                for(let i=0;i<res.data.length;i++) {
                    for(let j=0;j<res.data[i].orders.length;j++) {
                        await fetchUserDetails(res.data[i].orders[j].userId)
                    }
                }
                setPreviousGroupOrdersList(res.data)
            }
            else{
                ToastAndroid.show("No More Previous Orders" , ToastAndroid.SHORT)
            }
            // console.log(currentGroupOrdersList)
        })
        .catch((err) => {

            console.log(err)
        })
    }

    const loadPreviousOrdersButtonHandler = () => {
        fetchPreviousGroupOrders()
    }

    const fetchGroupOrders = async () => {
        await fetch(`http://10.0.2.2:4000/order/get-current-group-order/${groupName}`, {
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
            for(let i=0;i<res.data.length;i++) {
                for(let j=0;j<res.data[i].orders.length;j++) {
                    await fetchUserDetails(res.data[i].orders[j].userId)
                }
            }
            setCurrentGroupOrdersList(res.data)
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
        <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ScrollViewStyle}
            
        >
            <Pressable
                onPress={loadPreviousOrdersButtonHandler}
                style={styles.LoadPreviousOrdersButtonContainer}
            >
                <Text style={styles.LoadPreviousOrdersButtonText}>Load Previous orders</Text>
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
            (
                <ServerMessage 
                    groupName={groupName}
                    navigation={navigation}
                />
            )}
            
        </ScrollView>
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
        marginLeft : "27%",
        marginRight : "27%",
        borderRadius : BORDERRADIUS.radius_25
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
    }

})