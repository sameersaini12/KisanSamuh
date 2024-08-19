import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import MessageCard from '../components/MessageCard'
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import CustomIcon from '../components/CustomIcon'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { io } from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux'
import { updateEnterInAppStatus } from '../features/userSlice'
const socket = io('http://10.0.2.2:4000/' , {
  transports:['websocket']
})
import {BASE_URL} from "@env"
import GroupsLoadingSkeleton from '../components/GroupsLoadingSkeleton'

const MessageScreen = ({navigation} : any) => {
  const tabBarHeight = useBottomTabBarHeight()

  const [searchText , setSearchText] = useState('')
  const [farmList, setFarmList] = useState([])
  const [farmLocations , setFarmLocations ] = useState([])
  const [noGroups , setNoGroups ] = useState(false)
  const [loadingGroups , setLoadingGroups ] = useState(true)

  const userToken = useSelector((state : any) => state.user.token)
  const userId = useSelector((state : any) => state.user.id)
  const totalFarms = useSelector((state : any) => state.farm.totalFarms)
  const isLoggedIn = useSelector((state : any) => state.user.isLoggedIn)


  const dispatch = useDispatch()
  
  const resetSearchInputText = () => {
    setSearchText('');
  };

  const handleSearchEnterButton = (event : any) => {
    
  }

  const fetchUserFarms = async () => {
    await fetch(`${BASE_URL}/farm/get-farms/${userId}` , {
      headers : {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${userToken}`
      }
    }).then((res) => res.json())
    .then((res) => { 
      // setLoadingGroups(true)  
      // console.log(res.data)
      if(res.data.length > 0) {
        setFarmList(res.data)
        const locationList : any = []
        for(let i=0;i<res.data.length;i++) {
          if(locationList.indexOf(res.data[i].location) === -1) {
            locationList.push(res.data[i].location)
          }
        }
        locationList.sort()
        setFarmLocations(locationList)
        setLoadingGroups(false)
      }else {
        setNoGroups(true)
        setLoadingGroups(false)
      }
      setLoadingGroups(false)
    }).catch((err) => {
      console.log(err)
    })
  }
  
  useEffect(() => {
    if(isLoggedIn) {
      fetchUserFarms()
    }else {
      setNoGroups(true)
      setLoadingGroups(false)
    }
  }, [totalFarms])

  return (
    <GestureHandlerRootView>
      <View style={styles.MessageScreenUpperContainer}>
        <Text style={styles.GroupsTitleText}>Groups</Text>
        <Text style={styles.GroupTitleNextLine}>Order in Groups to Save Money!!</Text>
        {/* <View style={styles.SearchInputContainer}>
            <CustomIcon
              style={styles.SearchInputSearchIcon}
              name='search'
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryLightGreenHex
                  : COLORS.primaryLightGreyHex
              }
            />
            <TextInput
              placeholder='Search anything'
              value={searchText}
              onChangeText={text => 
                setSearchText(text)
              }
              onSubmitEditing={handleSearchEnterButton}
              placeholderTextColor={COLORS.primaryLightGreyHex}
              style={styles.SearchTextInputContainer}
            />
            {searchText.length > 0 ? (
              <Pressable
                onPress={() => {
                  resetSearchInputText()
                }}
              >
                <CustomIcon
                  style={styles.SearchInputClose}
                  name='cancel-circle'
                  size={FONTSIZE.size_16}
                  color={COLORS.primaryLightGreyHex}
                />
              </Pressable>
            ) : (
              <></>
            )}
          </View> */}
      </View>

      {noGroups && 
          <View style={styles.NoGroupsContainer}>
            <View style={styles.HorizontailLine}></View>
            <Text style={styles.NoGroupsText}>No groups yet! Add your farms to get group benefits</Text>
            <Pressable 
              onPress={async () => {
                if(isLoggedIn)
                  navigation.push("SelectCropScreen")
                else {
                  const enterInAppStatus : any = false
                  await dispatch(updateEnterInAppStatus(enterInAppStatus))
                  navigation.push("PhoneLoginScreen")
                }
              }}
              style={styles.AddYourFarmButtonContainer}
            >
              <Text style={styles.AddYourFarmButtonText}>{isLoggedIn ? "Add Your farms" : "Login to add your farms"}</Text>
            </Pressable>
          </View>
      }

      {loadingGroups ?  
        <GroupsLoadingSkeleton />
        : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{paddingBottom : tabBarHeight}]}
          >
            {farmLocations.length> 0 && farmLocations.map((item, key)=> {
              return (
                <MessageCard navigation={navigation} item={item} key={key} socket={socket}/>
              )
            })}
          </ScrollView>
        )
      }
    </GestureHandlerRootView>
  )
}

export default MessageScreen

const styles = StyleSheet.create({
  MessageScreenUpperContainer : {
    margin : SPACING.space_18
  },
  GroupsTitleText : {
    fontSize : FONTSIZE.size_30*1.2,
    fontFamily : FONTFAMILY.poppins_bold,
    color : COLORS.primaryBlackHex,
  },
  GroupTitleNextLine : {
    fontSize : FONTSIZE.size_28,
    fontFamily : FONTFAMILY.poppins_medium,
    color : COLORS.primaryLightGreyHex,
  },
  SearchInputContainer : {
    flexDirection: 'row',
    marginTop: SPACING.space_16,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.secondaryLightGreenHex,
    alignItems: 'center',
  },
  SearchInputSearchIcon : {
    marginHorizontal: SPACING.space_20,
  },
  SearchTextInputContainer : {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.secondaryBlackRGBA,
  },
  SearchInputClose : {
    marginHorizontal: SPACING.space_20,
  },
  NoGroupsContainer : {
    alignItems : "center",
    margin : SPACING.space_18,
  },
  NoGroupsText : {
    fontSize :FONTSIZE.size_20,
    fontFamily : FONTFAMILY.poppins_medium,
    textAlign : "center",
    color : COLORS.primaryLightGreyHex
  },
  HorizontailLine : {
    padding : 0.6,
    backgroundColor : COLORS.secondaryLightGreyHex,
    width : "100%",
    marginBottom : SPACING.space_10
  },
  AddYourFarmButtonContainer : {
    backgroundColor : COLORS.primaryLightGreenHex,
    borderRadius : BORDERRADIUS.radius_10,
    padding : SPACING.space_12,
    marginTop : SPACING.space_15,
  },
  AddYourFarmButtonText : {
    color : COLORS.primaryWhiteHex,
    fontSize : FONTSIZE.size_14,
    fontFamily :FONTFAMILY.poppins_medium,
  }
})