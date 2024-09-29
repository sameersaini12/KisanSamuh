import { ScrollView, StatusBar, StyleSheet, Text, Image, TextInput, TouchableOpacity, View, Dimensions, Pressable } from 'react-native'
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
import { updateEnterInAppStatus } from '../features/userSlice'
import { BASE_URL } from "@env"
import { useTranslation } from 'react-i18next'

const screenWidth = Dimensions.get("screen").width - SPACING.space_18 * 2
const ImageCardWidth = Dimensions.get("screen").width - SPACING.space_18 * 2

const image_banners = [
  {
    image: require("../assets/Banners/banner_2.jpg")
  },
  {
    image: require("../assets/Banners/banner_1.jpg")
  },
]

const HomeScreen = ({ navigation }: any) => {

  const { t } = useTranslation()

  const [searchText, setSearchText] = useState('')
  const [refreshPage, setRefreshPage] = useState(false)
  const [currentBannerImageIndex, setCurrentBannerImageIndex] = useState(0)
  const [farmList, setFarmList] = useState([])
  const [loading, setLoading] = useState(true)

  const userId = useSelector((state: any) => state.user.id)
  const userToken = useSelector((state: any) => state.user.token)
  const totalFarms = useSelector((state: any) => state.farm.totalFarms)
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn)

  const dispatch = useDispatch()

  const bottomSheetModalRef = useRef<any | null>(null)
  const snapPoints = useMemo(() => ["42%"], [])

  const openBottomModel = () => {
    bottomSheetModalRef.current?.present()
  }

  const closeBottomModel = () => {
    bottomSheetModalRef.current?.close()
  }

  const tabBarHeight = useBottomTabBarHeight()

  const scrollImageHandler = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x

    const currentImageIndex = scrollPosition / screenWidth
    setCurrentBannerImageIndex(Math.round(currentImageIndex))
  }

  const resetSearchInputText = useCallback(() => {
    setSearchText('');
  }, []);

  const fetchUserFarms = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/farm/get-farms/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`
        }
      });
      const data = await res.json();
      if (data.data) {
        setFarmList(data.data);
        dispatch(updateTotalFarms(data.data.length));
      }
    } catch (error) {
      console.log(error);
    }
  }, [userId, userToken, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserFarms()
    }
  }, [isLoggedIn, fetchUserFarms])

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
            <WhyAddFarmCard closeBottomSheet={closeBottomModel} />
          </View>
        </BottomSheetModal>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ScrollViewFlex}
        // refreshControl={
        //   <RefreshControl refreshing={refreshPage} onRefresh={onRefreshPage} />
        // }
        >
          <HeaderBar navigation={navigation} />

          <Text style={styles.ScreenTitle}>
            {t('buy products')}{'\n'}{t('at cheapest price')}
          </Text>

          <View style={styles.AdvertisementContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              onScroll={scrollImageHandler}
            >
              {image_banners.map((image: any, index: any) => {
                return (
                  <Image
                    key={index}
                    style={styles.AdvertisementImage}
                    source={image.image}
                  />
                )
              })}
            </ScrollView>
          </View>
          <View style={styles.ImagesScrollIndicatorContainer}>
            {image_banners.map((image: any, index: any) => {
              return (
                <View
                  style={[styles.ImagesScrollIndicator, { backgroundColor: (currentBannerImageIndex == (index)) ? COLORS.primaryLightGreenHex : COLORS.secondaryLightGreyHex }]}
                  key={index}>
                </View>
              )
            })}
          </View>

          <Text style={styles.CategoryTitle}>{t('your farms')}</Text>

          {isLoggedIn ? (
            <AddFarmCard
              navigation={navigation}
              openBottomModel={openBottomModel}
              closeBottomaModel={closeBottomModel}
              totalFarms={totalFarms}
            />
          ) : (
            <View style={styles.AddFardmCardContainer}>
              <Pressable
                onPress={async () => {
                  const enterInAppStatus: any = false
                  await dispatch(updateEnterInAppStatus(enterInAppStatus))
                  navigation.push("PhoneLoginScreen")
                }}
                style={styles.AddFarmCardLeftContainer}
              >
                <CustomIcon
                  name='add-solid'
                  size={35}
                  color={COLORS.primaryLightGreenHex}
                />
                <Text style={styles.AddYourFarmText}>{t('login to add your farm')}</Text>
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
          )}


          <Text style={styles.CategoryTitle}>{t('categories')}</Text>

          <CategoryList navigation={navigation} />

          <Text style={styles.CategoryTitle}>{t('brands')}</Text>

          <BrandList navigation={navigation} />

        </ScrollView>
      </BottomSheetModalProvider>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  HomeScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreyHex,
    paddingLeft: SPACING.space_18,
  },
  SearchInputContainer: {
    flexDirection: 'row',
    margin: SPACING.space_18,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.secondaryLightGreenHex,
    alignItems: 'center',
  },
  SearchInputSearchIcon: {
    marginHorizontal: SPACING.space_20,
  },
  SearchTextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.secondaryBlackRGBA,
  },
  SearchInputClose: {
    marginHorizontal: SPACING.space_20,
  },
  AdvertisementContainer: {
    backgroundColor: COLORS.primaryLightestGreyHex,
    height: 150,
    width: ImageCardWidth,
    borderRadius: BORDERRADIUS.radius_10,
    margin: SPACING.space_18,
    overflow: "hidden",
    elevation: 3
  },
  AdvertisementImage: {
    height: 150,
    width: ImageCardWidth
  },
  ImagesScrollIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  ImagesScrollIndicator: {
    width: SPACING.space_10 * 0.8,
    height: SPACING.space_10 * 0.8,
    borderRadius: BORDERRADIUS.radius_25,
    marginRight: SPACING.space_10 * 0.5
  },
  CategoryTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_18,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryBlackHex,
  },
  AddFardmCardContainer: {
    backgroundColor: COLORS.secondaryLightGreenHex,
    padding: SPACING.space_12,
    margin: SPACING.space_18,
    borderRadius: BORDERRADIUS.radius_15,
    elevation: 2,
    borderColor: COLORS.primaryBlackHex,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  AddFarmCardLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  AddFarmCardRightContainer: {
    backgroundColor: COLORS.primaryLightGreenHex,
    width: 25,
    height: 25,
    borderRadius: BORDERRADIUS.radius_15,
    justifyContent: "center",
    alignItems: "center",
  },
  WhyAddFarmText: {
    color: COLORS.primaryWhiteHex
  },
  AddYourFarmText: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryBlackHex,
    marginLeft: SPACING.space_18,
  },
})