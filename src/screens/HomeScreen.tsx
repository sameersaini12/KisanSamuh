import { ScrollView, StatusBar, StyleSheet, Text, Image, TextInput, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import HeaderBar from '../components/HomeHeaderBar'
import CustomIcon from '../components/CustomIcon'
import CategoryList from '../components/CategoryList'
import BrandList from '../components/BrandList'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { RefreshControl } from 'react-native-gesture-handler'
import AddFarmCard from '../components/AddFarmCard'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import WhyAddFarmCard from '../components/WhyAddFarmCard'
import { useDispatch, useSelector } from 'react-redux'
import { updateTotalFarms } from '../features/farmSlice'

const screenWidth = Dimensions.get("screen").width-SPACING.space_18*2
const ImageCardWidth = Dimensions.get("screen").width-SPACING.space_18*2

const image_banners = [
  {
    image : require("../assets/Banners/banner_2.jpg")
  },
  {
    image : require("../assets/Banners/banner_1.jpg")
  },
]

const HomeScreen = ({navigation} : any) => {

  const [searchText , setSearchText] = useState('')
  const [refreshPage, setRefreshPage] = useState(false)
  const [currentBannerImageIndex , setCurrentBannerImageIndex] = useState(0)
  const [farmList , setFarmList] = useState([])

  const userId = useSelector((state : any) => state.user.id)
  const userToken = useSelector((state : any) => state.user.token)
  const totalFarms = useSelector((state : any) => state.farm.totalFarms)

  const dispatch = useDispatch()

  const onRefreshPage = useCallback(() => {
    setRefreshPage(true)
    setTimeout(()  => {
      setRefreshPage(false)
    } , 2000)
  } , [])

  const bottomSheetModalRef  = useRef<any | null>(null)
  const snapPoints = useMemo(() => ["42%"],[])

  const openBottomModel= () => {
      bottomSheetModalRef.current?.present()
  }

  const closeBottomModel = () => {
      bottomSheetModalRef.current?.close()
  }

  const tabBarHeight = useBottomTabBarHeight()

  const scrollImageHandler = (event :any) => {
      const scrollPosition = event.nativeEvent.contentOffset.x
      
      const currentImageIndex = scrollPosition / screenWidth
      setCurrentBannerImageIndex(Math.round(currentImageIndex))
  }

  const resetSearchInputText = () => {
    setSearchText('');
  };

  const fetchUserFarms = async () => {
    await fetch(`http://10.0.2.2:4000/farm/get-farms/${userId}` , {
      headers : {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${userToken}`
      }
    }).then((res) => res.json())
    .then((res) => {
      setFarmList(res.data)
      dispatch(updateTotalFarms(res.data.length))
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchUserFarms()
  }, [])

  return (
    <View style={styles.HomeScreenContainer}>
      <BottomSheetModalProvider>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}  
        >
          <View>
            <WhyAddFarmCard closeBottomSheet ={closeBottomModel}/>
          </View>
        </BottomSheetModal>

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ScrollViewFlex}
            refreshControl={
              <RefreshControl refreshing={refreshPage} onRefresh={onRefreshPage} />
            }
        >
          <HeaderBar navigation={navigation} />

          <Text style={styles.ScreenTitle}>
            Buy products{'\n'}at cheapest price
          </Text>

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
              placeholderTextColor={COLORS.primaryLightGreyHex}
              style={styles.SearchTextInputContainer}
            />
            {searchText.length > 0 ? (
              <TouchableOpacity
                onPress={() => resetSearchInputText()}
              >
                <CustomIcon
                  style={styles.SearchInputClose}
                  name='cancel-circle'
                  size={FONTSIZE.size_16}
                  color={COLORS.primaryLightGreyHex}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View> */}

          <View style={styles.AdvertisementContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              onScroll={scrollImageHandler}
            >
              {image_banners.map((image : any, index : any) => {
                      return (
                        <Image 
                          key={index}
                          style={styles.AdvertisementImage} 
                          source={image.image} 
                        />
                      )
                  }) }
            </ScrollView>
          </View>
          <View style={styles.ImagesScrollIndicatorContainer}>
              {image_banners.map((image : any, index : any) => {
                  return (
                      <View
                          style={[styles.ImagesScrollIndicator, {backgroundColor : (currentBannerImageIndex == (index)) ? COLORS.primaryLightGreenHex : COLORS.secondaryLightGreyHex}]}
                          key={index}>
                      </View>
                  )
              }) }
          </View>

          <Text style={styles.CategoryTitle}>Your Farms</Text>

          <AddFarmCard 
              navigation={navigation} 
              openBottomModel={openBottomModel} 
              closeBottomaModel={closeBottomModel}
              totalFarms={totalFarms}
            />

          <Text style={styles.CategoryTitle}>Categories</Text>

          <CategoryList navigation={navigation} />

          <Text style={styles.CategoryTitle}>Brands</Text>

          <BrandList  navigation={navigation}/>

        </ScrollView>
      </BottomSheetModalProvider>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  HomeScreenContainer : {
    flex : 1,
    backgroundColor : COLORS.primaryWhiteHex,
  },
  ScrollViewFlex : {
    flexGrow : 1,
  },
  ScreenTitle : {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreyHex,
    paddingLeft: SPACING.space_18,
  },
  SearchInputContainer : {
    flexDirection: 'row',
    margin: SPACING.space_18,
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
  AdvertisementContainer : {
    backgroundColor : COLORS.primaryLightestGreyHex,
    height : 150,
    width : ImageCardWidth,
    borderRadius : BORDERRADIUS.radius_10,
    margin : SPACING.space_18,
    overflow : "hidden",
    elevation : 3
  },
  AdvertisementImage: {
    height : 150,
    width : ImageCardWidth
  },
  ImagesScrollIndicatorContainer : {
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "center"
  },
  ImagesScrollIndicator : {
      width : SPACING.space_10*0.8,
      height : SPACING.space_10*0.8,
      borderRadius : BORDERRADIUS.radius_25,
      marginRight : SPACING.space_10*0.5
  },
  CategoryTitle : {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_18,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryBlackHex,
  }
})