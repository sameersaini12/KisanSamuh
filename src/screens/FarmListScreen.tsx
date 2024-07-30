import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import CustomIcon from '../components/CustomIcon'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import WhyAddFarmCard from '../components/WhyAddFarmCard'
import moment from 'moment'
import { useSelector } from 'react-redux'

const cropImageFetcher : any = {
  paddy : require("../assets/crops/paddy.jpg"),
  wheat : require("../assets/crops/wheat.jpg"),
  sugarcane : require("../assets/crops/sugarcane.jpg")
}

const FarmListScreen = ({navigation , route} : any) => {

  const [farmList, setFarmList] = useState([])

  const userToken = useSelector((state : any) => state.user.token)
  const userId = useSelector((state : any) => state.user.id)

  const backButtonHandler = () => {
      navigation.pop()
  }

  const bottomSheetModalRef  = useRef<any | null>(null)
  const snapPoints = useMemo(() => ["32%"],[])

  const openBottomModel= () => {
      bottomSheetModalRef.current?.present()
  }

  const closeBottomModel = () => {
      bottomSheetModalRef.current?.close()
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
    }).catch((err) => {
      console.log(err)
    })
  }
  
  useEffect(() => {
    fetchUserFarms()
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
            <WhyAddFarmCard closeBottomSheet ={closeBottomModel}/>
          </View>
        </BottomSheetModal>
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
            <Text style={styles.SelectCropScreenHeaderTitle}>Your farms</Text>
        </View>

        <View style={styles.AddFardmCardContainer}>
            <Pressable 
                onPress={() => {
                    navigation.navigate("SelectCropScreen")
                }}
                style={styles.AddFarmCardLeftContainer}
            >
                <CustomIcon
                    name='add-solid'
                    size={35}
                    color={COLORS.primaryLightGreenHex}
                />
                <Text style={styles.AddYourFarmText}>Add your farm</Text>
            </Pressable>
            <Pressable 
                onPress={() => {
                    openBottomModel()
                }}
                style={styles.AddFarmCardRightContainer}
            >
                <Text style={styles.WhyAddFarmText}>?</Text>
            </Pressable>
        </View>

        <Text style={styles.YourFarmsTitle}>Your farms</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {farmList.map((farm : any , index : any) => {
            return (
              <View style={styles.FarmContainer} key={index}>
                <View style={styles.CropTypeContainer}>
                    <Image style={styles.CropTypeImage} source={cropImageFetcher[farm.cropName.toLowerCase()]} />
                    <View style={styles.CropNameContainer}>
                        <Text style={styles.CropNameText}>{farm.cropName}</Text>
                        <CustomIcon
                            name='arrow-right2'
                            size={25}
                            color={COLORS.primaryBlackHex}
                        />
                    </View>
                </View>

                <View style={styles.HorizontalRule}></View>

                <View style={{marginTop : SPACING.space_15}}>
                  <View style={styles.FarmDetailsContainer}>
                    <CustomIcon
                        name='location21'
                        size={20}
                        color={COLORS.primaryLightGreenHex}
                    />
                    <Text style={styles.FarmDetailsText}> <Text style={{color : COLORS.primaryLightGreyHex}}>Location:</Text>  {farm.location}, {farm.city}</Text>
                  </View>
                  <View style={[styles.FarmDetailsContainer , {marginTop : SPACING.space_10*0.5}]}>
                    <CustomIcon
                        name='leaf'
                        size={20}
                        color={COLORS.primaryLightGreenHex}
                    />
                    <Text style={styles.FarmDetailsText}> <Text style={{color : COLORS.primaryLightGreyHex}}>Farm Area:</Text>  {farm.farmSize} Acres</Text>
                  </View>
                  <View style={[styles.FarmDetailsContainer , {marginTop : SPACING.space_10*0.5}]}>
                    <CustomIcon
                        name='calendar'
                        size={20}
                        color={COLORS.primaryLightGreenHex}
                    />
                    <Text style={styles.FarmDetailsText}> <Text style={{color : COLORS.primaryLightGreyHex}}>Sowing Date:</Text>  {moment(farm.sowingDate).format(`DD MMMM, YYYY`)} </Text>
                  </View>
                </View>
                
              </View>
            )
          })}
        </ScrollView>
        </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default FarmListScreen

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
  AddFardmCardContainer : {
    backgroundColor : COLORS.secondaryLightGreenHex,
    padding : SPACING.space_12,
    margin : SPACING.space_18,
    borderRadius : BORDERRADIUS.radius_15,
    elevation : 2,
    borderColor : COLORS.primaryBlackHex,
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "space-between"
  },
  AddFarmCardLeftContainer : {
      flexDirection : "row",
      alignItems : "center",
  },
  AddFarmCardRightContainer : {
      backgroundColor : COLORS.primaryLightGreenHex,
      width : 25,
      height : 25,
      borderRadius : BORDERRADIUS.radius_15,
      justifyContent : "center",
      alignItems : "center",
  },
  VisitFarmCardRightContainer : {
      backgroundColor : COLORS.primaryLightGreenHex,
      width : 40,
      height : 40,
      borderRadius : BORDERRADIUS.radius_15*10,
      justifyContent : "center",
      alignItems : "center",
  },
  WhyAddFarmText : {
      color : COLORS.primaryWhiteHex
  },
  AddYourFarmText : {
      fontSize : FONTSIZE.size_18,
      fontFamily : FONTFAMILY.poppins_medium,
      color : COLORS.primaryBlackHex,
      marginLeft : SPACING.space_18,
  },
  YourFarmsTitle : {
    fontSize : FONTSIZE.size_20,
    fontFamily :FONTFAMILY.poppins_bold,
    marginLeft : SPACING.space_18,
    color : COLORS.primaryBlackHex,
  },
  FarmContainer: {
    margin : SPACING.space_18,
    borderRadius : BORDERRADIUS.radius_10,
    backgroundColor : COLORS.secondaryLightGreenHex,
    padding : SPACING.space_12,
  },
  CropTypeImage : {
    width : 70,
    height : 70,
    borderRadius : BORDERRADIUS.radius_10
  },
  CropTypeContainer : {
    flexDirection : "row",
    alignItems : "center",
  },
  CropNameContainer : {
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "space-between",
    marginLeft : SPACING.space_16,
    width : "70%"
  },
  CropNameText : {
    fontSize : FONTSIZE.size_18,
    fontFamily : FONTFAMILY.poppins_semibold,
    color : COLORS.primaryBlackHex,

  }, 
  HorizontalRule : {
    padding : 1,
    backgroundColor : COLORS.secondaryLightGreyHex,
    marginTop : SPACING.space_15,
  }, 
  FarmDetailsContainer : {
    flexDirection : "row",
    alignItems : "center",
  },
  FarmDetailsText : {
    fontSize : FONTSIZE.size_16*0.98,
    fontFamily : FONTFAMILY.poppins_medium,
    color : COLORS.primaryBlackHex,
  }
})