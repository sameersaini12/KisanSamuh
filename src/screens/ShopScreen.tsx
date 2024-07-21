import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import ProductCard from '../components/ProductCard'
import LottieView from 'lottie-react-native'
import { useSelector } from 'react-redux'

const Screen_width  = Dimensions.get("screen").width
const Screen_height = Dimensions.get("screen").height

const ShopScreen = ({navigation  , searchTextFromPreviousScreen = ''} : any) => {
  
  const [searchText , setSearchText] = useState(searchTextFromPreviousScreen)
  const [productList , setProductList] = useState<Array<any> | undefined>(undefined)
  const [retryButton , setRetryButton] = useState(false)
  const [categories , setCategories] = useState(searchTextFromPreviousScreen)

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
    navigation.navigate("Tab" , {
      screen : "Shop",
      params : {
          searchTextFromPreviousScreen : searchText
      }
    })
  }

  const fetchAllProducts = async () => {
    await fetch("http://10.0.2.2:4000/product/all-products"+`?categories=${JSON.stringify(categories)}`)
    .then((resp) => resp.json())
    .then((res) => {
      setProductList(res.data)
    })
    .catch((error) => {
      console.log("Err" +error)
    })
  }

  useEffect(() => {
    setSearchText(searchTextFromPreviousScreen)
    setCategories(searchTextFromPreviousScreen)
    fetchAllProducts()
  } , [retryButton , categories , searchTextFromPreviousScreen])

  return (
  
    <View style={styles.CartContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.ShopScreenUpperHeader}>
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

        { productList === undefined ? 
              <View style={styles.LoadingAnimationContainer}>
                  <LottieView
                    style={styles.LoadingAnimation}
                    source={require("../components/lottie/Loading.json")}
                    autoPlay
                    loop
                  />
                  <TouchableOpacity
                      onPress={() => setRetryButton(!retryButton)}
                      style={styles.LoadingRetryButton}
                  >
                    <Text style={styles.LoadingRetryButtonText}>Retry</Text>
                  </TouchableOpacity>
              </View>
              
          :
        <ScrollView style={[styles.ProductListContainerScrollView , {marginBottom : tabBarHeight + SPACING.space_18}]}>
          <View style={[styles.ProductListContainer, {marginBottom : tabBarHeight}]}>
            { productList.length === 0 ?
                <Text>No Products available</Text>
             :
            productList.map((product,index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    navigation.push('ProductDetails', {
                      id : product['_id']
                    })
                  }}
                >
                  <ProductCard
                    id= {product['_id']}
                    imageLink={require("../assets/Categories/nutrients_image.jpg")}
                    title= {product['title']}
                    companyName= {product['brand']}
                    price= {product['price'][0]['price']}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
        }

    </View>
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
    margin: SPACING.space_18,
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
    flexDirection : 'row',
    justifyContent : 'space-between',
    flexWrap : "wrap",
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