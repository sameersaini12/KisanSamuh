import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'

const GroupInfoScreen = ({navigation, route} : any) => {

    const userToken = useSelector((state : any) => state.user.token)
    const userId = useSelector((state : any) => state.user.id)

    const [farmList, setFarmList] = useState([])
    const [farmUserIds, setFarmUserIds] = useState([])
    const [farmUsers , setFarmUsers] = useState<Array<any>>([])

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
                if(farmUsers.indexOf(res.data[0])===-1)
                    await setFarmUsers(prevList => [...prevList, res.data[0]])
          }).catch((err) => {
            console.log(err)
          })
    }

    const fetchUsersByFarmLocation = async () => {
        await fetch(`http://10.0.2.2:4000/farm/get-users-of-farm/${route.params.groupName}` , {
          headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${userToken}`
          }
        }).then((res) => res.json())
        .then(async (res) => {
          setFarmList(res.data)
          setFarmUsers([])
          const usersList : any = []
          for(let i=0;i<res.data.length;i++) {
            if(usersList.indexOf(res.data[i].userId) === -1) {
                usersList.push(res.data[i].userId)
                console.log(res.data[i].userId)
                await fetchUserDetails(res.data[i].userId)
            }
          }
          setFarmUserIds(usersList)
        }).catch((err) => {
          console.log(err)
        })
      }

    useEffect(() => {
        fetchUsersByFarmLocation()
    }, [])

    useEffect(()=> {
        
    }, [farmUserIds])

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
            <Text style={styles.SelectCropScreenHeaderTitle}>Group Info</Text>
        </View>

        <View style={styles.GroupInfoContainer}>
            <View style={styles.GroupDPContainer}>  
            </View>

            <Text style={styles.GroupNameText}>{route.params.groupName}</Text>
            <Text style={styles.GroupMembersText}>Group . {farmUsers.length} members</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.GroupMembersContainer}>
            {farmUsers.map((item : any, index: any) => {
                // console.log("item "+item)
                return (
                    <View key={index}>
                        <View style={styles.GroupMemberContainer}>
                            <View style={styles.GroupMemberDP}>
                            </View>
                            <View style={styles.GroupMemberInfoContainer}>
                                <Text style={styles.GroupMemberNameText}>{item.name}</Text>
                                <Text style={styles.GroupMemberNumberText}>{item.phone}</Text>
                            </View>
                        </View>
                        <View style={styles.HorizontalRule}>

                        </View>
                    </View>
                )
            })}
        </ScrollView>
    </GestureHandlerRootView>
  )
}

export default GroupInfoScreen

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
        marginLeft : SPACING.space_10*2,
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryWhiteHex,
    },
    GroupInfoContainer : {
        alignItems : "center",
    },
    GroupDPContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        width : 120,
        height : 120,
        borderRadius : BORDERRADIUS.radius_25*5,
        marginTop : SPACING.space_18
    },
    GroupNameText : {
        fontSize : FONTSIZE.size_24,
        fontFamily : FONTFAMILY.poppins_bold,
        color : COLORS.primaryBlackHex,
    },
    GroupMembersText : {
        fontSize : FONTSIZE.size_16,
        fontFamily: FONTFAMILY.poppins_medium,
    },
    GroupMembersContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        margin : SPACING.space_18,
        paddingBottom : SPACING.space_18,
        height : 100
    },
    GroupMemberContainer : {
        flexDirection : "row",
        alignItems : "center",
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_18,
        marginTop : SPACING.space_18,
    },
    GroupMemberDP : {
        backgroundColor : COLORS.secondaryLightGreyHex,
        width : 50,
        height : 50,
        borderRadius : BORDERRADIUS.radius_25*5,
    },
    GroupMemberInfoContainer : {
        marginLeft : SPACING.space_12
    },
    GroupMemberNameText : {
        fontSize : FONTSIZE.size_16,
        color : COLORS.primaryBlackHex,
        fontFamily :FONTFAMILY.poppins_medium,
    },
    GroupMemberNumberText : {
        fontSize : FONTSIZE.size_14,
        fontFamily :FONTFAMILY.poppins_medium,
        marginTop : -SPACING.space_10*0.4
    },
    HorizontalRule : {
        padding : 1,
        backgroundColor : COLORS.secondaryLightGreyHex,
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_18,
        marginTop : SPACING.space_10,
    }
})