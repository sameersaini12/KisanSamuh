import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useSelector } from 'react-redux'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'

const SelectGroupScreen = ({navigation, route} : any) => {

    const [farmList, setFarmList] = useState([])
    const [farmLocations , setFarmLocations ] = useState([])
    const [cityLocations , setCityLocations]= useState([])
    const [selectedGroup , setSelectedGroup] = useState(-1)
    const [selectedGroupName , setSelectedGroupName] = useState('')
    const [totalCartPrice , setTotalCartPrice] = useState(route.params.totalCartPrice)

    const userToken = useSelector((state : any) => state.user.token)
    const userId = useSelector((state : any) => state.user.id)
    const totalFarms = useSelector((state: any) => state.farm.totalFarms)

    const backButtonHandler = () => {
        navigation.pop()
    }


    const fetchUserFarms = async () => {
        await fetch(`http://10.0.2.2:4000/farm/get-farms/${userId}` , {
          headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${userToken}`
          }
        }).then((res) => res.json())
        .then((res) => {
          setFarmList(res.data)
          const locationList : any = []
          const cityList : any = []
          for(let i=0;i<res.data.length;i++) {
            if(locationList.indexOf(res.data[i].location) === -1) {
              locationList.push(res.data[i].location)
              cityList.push(res.data[i].city)
            }
          }
          setFarmLocations(locationList)
          setCityLocations(cityList)
        }).catch((err) => {
          console.log(err)
        })
      }
      
      useEffect(() => {
        fetchUserFarms()
      }, [totalFarms])
  return (
    <GestureHandlerRootView>
        <View style={styles.CartScreenHeader}>
            <View style={styles.CartScreenHeaderLeft}>
                <Pressable
                onPress={backButtonHandler}
                >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryLightGreyHex}
                />
                </Pressable>
                <Text style={styles.CartScreenHeaderTitle}>Select Group</Text>
            </View>
        </View>

        {farmLocations.length===0 ? (
        <View style={styles.NoGroupsContainer}>
            <Text style={styles.NoGroupsText}>No groups yet! Add your farms to get group benefits</Text>
            <Pressable 
              onPress={() => {
                navigation.push("SelectCropScreen")
              }}
              style={styles.AddYourFarmButtonContainer}
            >
              <Text style={styles.AddYourFarmButtonText}>Add Your farms</Text>
            </Pressable>
        </View>
      ) : (
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            {farmLocations.map((item, key)=> {
              return (
                <View style={[styles.GroupCardContainer, {}]} key={key}>
                    
                    <Pressable 
                        onPress={() => {
                            setSelectedGroup(key)
                            setSelectedGroupName(item)
                        }}
                        style={styles.MessageCartContainer}
                    >
                        <View style={styles.MessageCardDP}>
                        </View>
                        <View style={styles.MessageCardRightContainer}>
                            <View style={styles.MessageCardDetails}>
                                <View style={styles.MessageCardNameContainer}>
                                    <Text style={styles.MessageCardGroupNameText}>{item}</Text>
                                </View>
                                <View style={styles.MessageCardLastDetailsContainer}>
                                    <Text style={styles.MessageCardLastDetailsText}>Last Order Details</Text>
                                </View>
                            </View>
                            <View style={[styles.SelectedGroupCircleContainer , {backgroundColor : selectedGroup===key ? COLORS.primaryWhiteHex : COLORS.primaryWhiteHex , borderWidth : selectedGroup===key ? 0 : 1}]}>
                                <CustomIcon
                                    name='add-solid'
                                    size={24}
                                    color={COLORS.primaryLightGreenHex}
                                    style={{display : selectedGroup===key ? "flex" : "none"}}
                                />
                            </View>
                        </View>
                       
                    </Pressable>
                    <View style={styles.HorizontalRule}></View>
                </View>
              )
            })}
          </ScrollView>
          
        </View>
      )}

        <Pressable
            onPress={() => {
                navigation.push("PaymentCheckoutScreen", {
                    address : `${selectedGroupName}, ${cityLocations[selectedGroup]}`,
                    totalCartPrice : totalCartPrice,
                    buyingGroupName : selectedGroupName
                })
            }}
            style={[styles.ProceedButtonContainer , {display : selectedGroup!==-1 ? "flex" : "none"}]}>
            <Text style={styles.ProceedButtonText}>Proceed to CheckOut</Text>
        </Pressable>

    </GestureHandlerRootView>
  )
}

export default SelectGroupScreen

const styles = StyleSheet.create({
    CartScreenHeader : {
        flexDirection : "row",
        padding : SPACING.space_18,
        alignItems: 'center',
        justifyContent : 'space-between',
        backgroundColor : COLORS.primaryLightGreenHex
    },
    CartScreenHeaderLeft : {
        flexDirection : "row",
        alignItems : "center"
    },
    CartScreenHeaderTitle : {
        marginLeft : SPACING.space_10,
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_semibold
    },
    NoGroupsContainer : {
        alignItems : "center",
        margin : SPACING.space_18,
    },
    NoGroupsText : {
        fontSize :FONTSIZE.size_20,
        fontFamily : FONTFAMILY.poppins_medium,
        textAlign : "center"
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
    },
    GroupCardContainer : {
        paddingTop : SPACING.space_18,
    },
    MessageCartContainer : {
        flexDirection : "row",
        alignItems : "center"
    },
    MessageCardDP : {
        width : 70,
        height : 70,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_25*5,
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_16
    },
    MessageCardDetails : {
        
    },
    MessageCardNameContainer: {
        flexDirection : "row",
        justifyContent : "space-between"
    },
    MessageCardGroupNameText : {
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    },
    MessageCardLastTimeText : {
        fontSize : FONTSIZE.size_14,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.secondaryLightGreyHex,
    },
    MessageCardLastDetailsContainer : {

    },
    MessageCardLastDetailsText : {
        fontSize : FONTSIZE.size_14,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.secondaryLightGreyHex,
    },
    HorizontalRule : {
        padding : 0.6,
        backgroundColor : COLORS.primaryLightestGreyHex,
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_18,
        marginTop : SPACING.space_10,
        marginBottom : SPACING.space_10
    },
    MessageCardRightContainer : {
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between",
        width : Dimensions.get("screen").width-(70+SPACING.space_18*2+SPACING.space_16),
    },
    SelectedGroupCircleContainer : {
        width : 25,
        height : 25,
        borderWidth : 1,
        borderRadius : BORDERRADIUS.radius_25,
        alignItems : "center",
        justifyContent : "center"
    },
    ProceedButtonContainer : {
        position : "absolute",
        bottom : 0,
        left : 0,
        right : 0,
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : SPACING.space_12,
    },
    ProceedButtonText : {
        fontSize :FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryWhiteHex,
        textAlign : "center",
    }
})