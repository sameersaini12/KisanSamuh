import { Dimensions, TouchableOpacity, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import ProductCard from '../components/ProductCard'
import LottieView from 'lottie-react-native'
import { useSelector } from 'react-redux'
import {BASE_URL} from "@env"
import ProductDetailsLoadingSkeleton from '../components/ProductDetailsLoadingSkeleton'
import ShopScreenLoadingSkeleton from '../components/ShopScreenLoadingSkeleton'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native'
import _ from "lodash";
import CategoryList from '../components/CategoryList'
import { useTranslation } from 'react-i18next'

const Screen_width  = Dimensions.get("screen").width
const Screen_height = Dimensions.get("screen").height

const ShopScreen = ({navigation  , searchTextFromPreviousScreen = ''} : any) => {
  const {t} = useTranslation()
  const [searchText , setSearchText] = useState(searchTextFromPreviousScreen)
  const [productList , setProductList] = useState<Array<any>>([])
  const [categories , setCategories] = useState(searchTextFromPreviousScreen)
  const [loading , setLoading] = useState(true)
  const [noProducts , setNoProducts] = useState(false)
  // const [productListPageNumber, setProductListPageNumber] = useState(1)
  // const [loadingProductsByPage , setLoadingProductsByPage] = useState(false)
  // const [loadedAllProducts , setLoadedAllProducts] = useState(false)

  const scrollRef = useRef<any>(null)
  const scrollPosition = useRef(0)
  // console.log("category" + categories)
  const saveScrollPosition = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({
        offset: scrollPosition.current,
        animated: false,
      });
    }
  };

  const handleScroll = (event : any) => {
    scrollPosition.current = event.nativeEvent.contentOffset.y;
  };

  const totalItemInCartStore = useSelector((state : any) => state.cart.totalItemInCart)

  const tabBarHeight = useBottomTabBarHeight()

  const resetSearchInputText = () => {
    setSearchText('');
    setCategories('');
    navigation.navigate("Tab" , {
      screen : "Shop",
      params : {
          searchTextFromPreviousScreen : ''
      }
    })
  };

  const handleSearchEnterButton = (event : any) => {
    // console.log(event)
    navigation.navigate("Tab" , {
      screen : "Shop",
      params : {
          searchTextFromPreviousScreen : searchText
      }
    })
  }

  const fetchAllProducts = useMemo(() =>  async () => {
    // console.log("fetch")
    // if(loadingProductsByPage ||  loadedAllProducts) {
    //   return 
    // }
    // setLoadingProductsByPage(true)
    setLoading(true)
    setNoProducts(false)
    await fetch(`${BASE_URL}/product/all-products`+`?categories=${JSON.stringify(categories)}` ,{
      method : "POST",
      headers : {
          Accept : "application/json",
          "Content-Type" : "application/json",
      },
      body : JSON.stringify({
      })
    })
    .then((resp) => resp.json())
    .then((res) => {
      
      // if(res.data.length > 0) {
      //   if(productListPageNumber===1)
      //     setProductList(res.data)
      //   else 
      //     setProductList(prevProductList => [...prevProductList , ...res.data])
      // }else if (productList.length>=0) {
      //   setLoadedAllProducts(true)
      // }else {
      //   setNoProducts(true)
      // }
      if(res.data.length>0) {
        setProductList(res.data)
      }else {
        setProductList([])
        // setNoProducts(true)
      }
      setLoading(false)
      // setLoadingProductsByPage(false)
    })
    .catch((error) => {
      console.log("Err" +error)
    })
    setLoading(false)
  }, [categories])

  // const loadMoreProductsHandler = useCallback(
  //   _.debounce(() => {
  //     if (!loadingProductsByPage && !loadedAllProducts) {
  //       setProductListPageNumber(productListPageNumber+1);
  //     }
  //   }, 500),
  //   [loadingProductsByPage, loadedAllProducts]
  // );
  

  useEffect(() => {
    setSearchText(searchTextFromPreviousScreen)
    setCategories(searchTextFromPreviousScreen)
  } , [searchTextFromPreviousScreen])

  useEffect(() => {
    fetchAllProducts()
  }, [categories])


  return (
  
    <GestureHandlerRootView style={styles.CartContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={[styles.ShopScreenUpperHeader , {marginBottom : -SPACING.space_18}]}>
        <View style={styles.SearchInputContainer}>
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
              placeholder={t('Search anything')}
              value={searchText}
              onChangeText={text => 
                setSearchText(text)
              }
              onSubmitEditing={handleSearchEnterButton}
              placeholderTextColor={COLORS.primaryLightGreyHex}
              style={styles.SearchTextInputContainer}
            />
            {searchText.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  resetSearchInputText()
                  setCategories('')
                }}
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
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.push("CartScreen")
            }}
          >
            <CustomIcon
              name='cart'
              size={27}
              color={COLORS.primaryLightGreyHex}
              style={styles.ShopScreenHeaderRightCartIcon}
            />
              {totalItemInCartStore!=0 && (
                  <View style={{backgroundColor : COLORS.primaryOrangeHex, 
                      borderRadius : BORDERRADIUS.radius_25, 
                      width : 20,
                      height : 20,
                      alignItems : "center",
                      justifyContent: 'center',
                      position : "absolute",
                      top: 8,
                      right : 8,
                      }}>
                      <Text style={{color : COLORS.primaryWhiteHex}}>{totalItemInCartStore}</Text>
                  </View>
              )}
          </TouchableOpacity>
        </View>

        <CategoryList navigation={navigation} numColumns={1} />

        {productList.length===0 && 
          <Text style={{color : COLORS.primaryLightGreyHex , marginLeft : SPACING.space_18}}>{t("No Products Available")}</Text>
        }

        { loading ? 
          <ShopScreenLoadingSkeleton /> 
          :
            <FlatList
              ref={scrollRef}
              // onScroll={handleScroll}
              // onContentSizeChange={saveScrollPosition}
              showsVerticalScrollIndicator={false}
              data={productList}
              keyExtractor={(item : any) => item._id.toString() + Math.random()*1000}
              numColumns={2}
              columnWrapperStyle={{justifyContent : "space-between"}}
              // onEndReached={loadMoreProductsHandler}
              removeClippedSubviews={true}
              // ListFooterComponent={<ActivityIndicator size="large" color="lightgreen" />}
              contentContainerStyle={[styles.ProductListContainer , {paddingBottom : tabBarHeight*2 + SPACING.space_18*11 , marginTop : -SPACING.space_18*2}]}
              renderItem={({item , index}) => {
                // console.log(index + " " + item._id)
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      navigation.navigate('ProductDetails', {
                        id : item['_id']
                      })
                    }}
                  >
                    <ProductCard
                      id= {item['_id']}
                      imageLink={item['image'][0]}
                      title= {item['title']}
                      companyName= {item['brand']}
                      price= {item['price'][0]['price']}
                      discount={item['discount']}
                    />
                  </TouchableOpacity>
                )
              }}
            />
        }

    </GestureHandlerRootView>
  )
}

export default ShopScreen

const styles = StyleSheet.create({
  CartContainer: {
    backgroundColor : COLORS.primaryWhiteHex,
  },
  ShopScreenUpperHeader : {
    flexDirection : "row",
    justifyContent : "space-between",
    alignItems : "center"
  },
  SearchInputContainer : {
    flexDirection: 'row',
    marginLeft: SPACING.space_18,
    marginTop: SPACING.space_18,
    marginRight: SPACING.space_18,
    marginBottom : SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.secondaryLightGreenHex,
    alignItems: 'center',
    flex : 1
  },
  ShopScreenHeaderRightCartIcon : {
    margin : SPACING.space_18,
    marginLeft : -SPACING.space_18*0.1
  },
  LoadingAnimationContainer : {
    alignItems : "center",
    justifyContent: 'center',
  },
  LoadingAnimation : {
    height : 100,
    width : 100,
    alignItems : "center",
    justifyContent : "center"
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
  ProductListContainerScrollView : {
  },
  ProductListContainer : {
    flexDirection : 'column',
    padding : SPACING.space_18,
  },
  LoadingRetryButton : {

  },
  LoadingRetryButtonText : {
    fontSize : FONTSIZE.size_14,
    fontFamily :FONTFAMILY.poppins_regular,
    color : COLORS.primaryLightGreenHex,
  }
})