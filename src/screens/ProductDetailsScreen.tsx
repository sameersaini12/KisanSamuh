import { Button, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import CustomIcon from '../components/CustomIcon'
import ProductImageBackground from '../components/ProductImageBackground'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, calculateCartPrice } from '../features/cartSlice.ts'


const ProductDetailsScreen  = ({navigation , route} : any) => {
  const [productTitle , setProductTitle] = useState('')
  const [productBrand , setProductBrand ] = useState('')
  const [productAboutDetails , setProductAboutDetails] = useState([])
  const [productTechnicalDetails , setProductTechnicalDetails] = useState<Array<any>>([{}])
  const [productFeatureDetails , setProductFeatureDetails ] = useState([])
  const [productHowToUse , setProductHowToUse] = useState<Array<any>>([{}])
  const [productAdditionalInformation , setProductAdditionalInformation ] = useState([])
  const [productCategory , setProductCategory ]= useState([])
  const [productSize , setProductSize] = useState([])
  const [productPrice , setProductPrice ] = useState([])
  const [productDiscount , setProductDiscount] = useState('')
  const [sizeSelect , setSizeSelect] = useState(0)

  const dispatch = useDispatch()
  const userLoginStatus = useSelector((state : any) => state.user.isLoggedIn)
  const totalItemInCartStore = useSelector((state : any) => state.cart.totalItemInCart)

  const backButtonHandler = () => {
    navigation.pop()
  }

  const addToCartButtonHandler = ({id , title , price} :any) => {
    ToastAndroid.show('Item Added to Cart', ToastAndroid.SHORT)
    const addToCartData : any = {
        id,
        title,
        price : [{ ...price , quantity : 1}]
    }
    dispatch(addToCart(addToCartData))
    dispatch(calculateCartPrice())
  }

  useEffect(() => {
    //total cart Item

    fetch(`http://10.0.2.2:4000/product/product-details/${route.params.id}`)
    .then((resp) => resp.json())
    .then((res) => {
      setProductTitle(res.data[0].title)
      setProductBrand(res.data[0].brand)
      setProductAboutDetails(res.data[0].about)
      setProductTechnicalDetails(res.data[0].technicalDetails)
      setProductFeatureDetails(res.data[0].features)
      setProductHowToUse(res.data[0].howToUse)
      setProductAdditionalInformation(res.data[0].additionalInformation)
      setProductCategory(res.data[0].categories)
      setProductSize(res.data[0].size)
      setProductPrice(res.data[0].price)
      setProductDiscount(res.data[0].discount)
    })
    .catch((error) => {
      console.log(error)
    })
  } , [])


  return (
    <View>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      <View style={styles.ProductDetailHeader}>
        <View style={styles.ProductDetailHeaderLeft}>
          <TouchableOpacity
            onPress={backButtonHandler}
          >
            <CustomIcon
              name='arrow-left2'
              size={FONTSIZE.size_24}
              color={COLORS.primaryLightGreyHex}
            />
          </TouchableOpacity>
          <Text style={styles.ProductDetailHeaderTitle}>Product Detail</Text>
        </View>

        <View style={styles.ProductDetailHeaderRight}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("CartScreen")
            }}
          >
            <CustomIcon
              name='cart'
              size={FONTSIZE.size_24}
              color={COLORS.primaryLightGreyHex}
              style={styles.ProductDetailHeaderRightCartIcon}
            />
          </TouchableOpacity>
          {totalItemInCartStore!=0 && (
              <View style={{backgroundColor : COLORS.primaryOrangeHex, 
                  borderRadius : BORDERRADIUS.radius_25, 
                  width : 20,
                  height : 20,
                  alignItems : "center",
                  justifyContent: 'center',
                  position : "absolute",
                  top: -10,
                  right : -10,
                  }}>
                  <Text style={{color : COLORS.primaryWhiteHex}}>{totalItemInCartStore}</Text>
              </View>
          )}
        </View>
      </View>

      <View style={styles.PaymentFooterButtonContainer}>
        <TouchableOpacity 
          style={styles.PaymentFooterButton}
          onPress={ 
            () => addToCartButtonHandler({
            id : route.params.id,
            title : productTitle,
            price : productPrice[sizeSelect]
          })
        }
        >
          <Text style={styles.PaymentFooterButtonTextCart}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={[styles.PaymentFooterButton , {marginLeft : SPACING.space_10 , backgroundColor : COLORS.primaryLightGreenHex}]}
         onPress={ userLoginStatus === false ? () => navigation.push("PhoneLoginScreen") :
          () => {
            addToCartButtonHandler({
              id : route.params.id,
              title : productTitle,
              price : productPrice[sizeSelect]
            })
            navigation.push("CartScreen")}
         }
         >
          <Text style={styles.PaymentFooterButtonTextBuy} >Buy Now</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}
      >
        <ProductImageBackground

        />

        <View style={styles.ProductDetailInfo}>
          <Text style={styles.ProductDetailTitle}>{productTitle}</Text>
          <Text style={styles.ProductDetailBrand}>{productBrand}</Text>
          <View style={styles.ProductPriceContainer}>
            <Text style={styles.ProductPriceHeading}>Price</Text>
            {/* <Text style={styles.ProductPrice}>₹{productPrice[0]['price']}</Text> */}
              {productPrice[0] === undefined ?
                <Text></Text> :
                (
                  <Text style={styles.ProductPrice}>₹{productPrice[sizeSelect]['price']}</Text>
                )
              }   
          </View>

          {productDiscount!=='' && (
            <View>
              <Text style={styles.ProductDiscount}>Save money by discount {productDiscount}%</Text>
              <View style={styles.ProductSizeContainer}>
                <Text style={styles.ProductSizeHeading}>Size </Text>
                {/* <Text style={styles.ProductSizeMeasurement}>{productPrice[0]['size']}</Text> */}
                {productPrice[0] === undefined ?
                    <Text></Text> :
                    (
                      <Text style={styles.ProductPrice}>{productPrice[sizeSelect]['size']}</Text>
                    )
                  }
              </View>
            </View>
          )}
          

          <View style={styles.ProductSizeChooseContainer}>
            {
              productPrice.map((item :any , index : any) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSizeSelect(index)}
                    style={[styles.ProductSizeChoose , { backgroundColor : (index===sizeSelect ? COLORS.secondaryLightGreenHex : COLORS.primaryWhiteHex)  }]}
                  >
                      <Text style={styles.ProductSizeChooseText}>{item.size}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>

            {productAboutDetails.length>0 && (
                <View style={styles.AboutProductContainer}>
                  <Text style={styles.AboutHeading}>About Product</Text>
                  {productAboutDetails.map((line : any, index : any) => {
                    return (
                        <Text key={index} style={styles.ProductAboutLine}>
                          {`\u25CF ${line}`}
                        </Text>
                      )
                    })}
                </View>
            )}
          
          {Object.keys(productTechnicalDetails[0]).length>0 && (
              <View style={styles.AboutProductContainer}>
                <Text style={styles.AboutHeading}>Technical Details</Text>
                {productTechnicalDetails[0] === undefined ?
                <Text>Loading</Text> :
                (
                  Object.keys(productTechnicalDetails[0]).map((key, index)=>(
                    <View key={index} style={styles.ProductTechnicalDetailsLine}>
                      <Text style={styles.ProductTechnicalDetailsValue}>
                        {`\u25CF`}{" "}
                        <Text style={styles.ProductTechnicalDetailsHeading}>{key} : </Text> 
                        {productTechnicalDetails[0][key]}
                      </Text>
                    </View>
                  ))
                )}
              </View>
          )}
          

            {productFeatureDetails.length>0 && (
                <View style={styles.AboutProductContainer}>
                  <Text style={styles.AboutHeading}>Features</Text>
                  {productFeatureDetails.map((line : any,index : any) => {
                    return (
                        <Text key={index} style={styles.ProductAboutLine}>
                          {`\u25CF ${line}`}
                        </Text>
                      )
                    })}
                </View>
            )}
          

            {Object.keys(productHowToUse[0]).length>0 && (
                <View style={styles.AboutProductContainer}>
                  <Text style={styles.AboutHeading}>Usage</Text>
                  {productHowToUse[0] === undefined ?
                  <Text>Loading</Text> :
                  (
                    Object.keys(productHowToUse[0]).map((key, index)=>(
                      <View key={index} style={styles.ProductTechnicalDetailsLine}>
                        <Text style={styles.ProductTechnicalDetailsValue}>
                          {`\u25CF`}{" "}
                          <Text style={styles.ProductTechnicalDetailsHeading}>{key} : </Text> 
                          {productHowToUse[0][key]}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
            )}
          

            {productAdditionalInformation.length>0 && (
                <View style={styles.AboutProductContainer}>
                  <Text style={styles.AboutHeading}>Additional Information</Text>
                  {productAdditionalInformation.map((line : any , index : any) => {
                    return (
                        <Text key={index} style={styles.ProductAboutLine}>
                          {`\u25CF ${line}`}
                        </Text>
                      )
                    })}
                </View>
            )}
         

          
        </View>
      </ScrollView>
      
    </View>
  )
}

export default ProductDetailsScreen

const styles = StyleSheet.create({
  ProductDetailHeader : {
    flexDirection : "row",
    padding : SPACING.space_18,
    alignItems: 'center',
    justifyContent : 'space-between',
    backgroundColor : COLORS.primaryLightGreenHex
  },
  ProductDetailHeaderLeft : {
    flexDirection : "row",
    alignItems : "center"
  },
  ProductDetailHeaderRight : {
    flexDirection : 'row'
  },
  ProductDetailHeaderTitle : {
    marginLeft : SPACING.space_10,
    fontSize : FONTSIZE.size_18,
    fontFamily : FONTFAMILY.poppins_semibold
  },
  ProductDetailHeaderRightCartIcon : {
    marginLeft : SPACING.space_15
  },
  PaymentFooterButtonContainer : {
    flexDirection : "row",
    alignItems : "center",
    padding : SPACING.space_18,
    position : 'absolute',
    bottom : SPACING.space_20 *3,
    zIndex : 1,
    backgroundColor : COLORS.primaryWhiteHex,
  },
  PaymentFooterButton : {
    backgroundColor: COLORS.primaryOrangeHex,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_20 * 3,
    borderRadius: BORDERRADIUS.radius_20,
  },
  PaymentFooterButtonTextCart : {
    color : COLORS.primaryWhiteHex,
    fontFamily : FONTFAMILY.poppins_medium,
    fontSize : FONTSIZE.size_16
  },
  PaymentFooterButtonTextBuy : {
    color : COLORS.primaryWhiteHex,
    fontFamily : FONTFAMILY.poppins_medium,
    fontSize : FONTSIZE.size_16,
  },
  ScrollViewFlex : {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  ProductDetailInfo : {
    padding : SPACING.space_18,
    marginBottom: SPACING.space_20 *7,
  },
  ProductDetailTitle : {
    fontSize : FONTSIZE.size_20,
    fontFamily :FONTFAMILY.poppins_bold,
    color : COLORS.primaryBlackHex
  },
  ProductDetailBrand : {
    fontSize : FONTSIZE.size_14,
    fontFamily : FONTFAMILY.poppins_medium,
    marginTop : -5,
    color : COLORS.secondaryLightGreyHex
  },
  ProductPriceContainer : {
    flexDirection : "row",
    alignItems : "center",
    color : COLORS.primaryBlackHex
  },
  ProductPriceHeading : {
    fontSize : FONTSIZE.size_16,
    fontFamily : FONTFAMILY.poppins_regular
  },
  ProductPrice : {
    fontSize : FONTSIZE.size_24,
    fontFamily : FONTFAMILY.poppins_extrabold,
    marginLeft : SPACING.space_10,
    color : COLORS.primaryBlackHex
  },
  ProductDiscount : {
    fontSize : FONTSIZE.size_16,
    color : COLORS.primaryLightGreenHex,
    marginTop : -8,
  },
  ProductSizeContainer : {
    flexDirection : "row",
    alignItems : "center"
  },
  ProductSizeHeading : {
    fontSize : FONTSIZE.size_16,
    fontFamily : FONTFAMILY.poppins_regular
  },
  ProductSizeQuantity : {
    fontSize : FONTSIZE.size_16,
    fontFamily : FONTFAMILY.poppins_medium,
    color : COLORS.primaryBlackHex
  },
  ProductSizeMeasurement : {
    fontSize : FONTSIZE.size_16,
    fontFamily : FONTFAMILY.poppins_medium,
    color : COLORS.primaryBlackHex
  },
  ProductSizeChooseContainer : {
    flexDirection : "row"
  },
  ProductSizeChoose : {
    borderRadius : BORDERRADIUS.radius_25,
    borderWidth : 2,
    borderColor : COLORS.primaryLightGreenHex,
    padding : SPACING.space_10,
    marginRight : SPACING.space_16,
    color : COLORS.primaryWhiteHex
  },
  ProductSizeChooseText : {
    color: COLORS.primaryBlackHex,
    fontFamily : FONTFAMILY.poppins_medium,

  },
  AboutProductContainer : {

  },
  AboutHeading : {
    fontSize : FONTSIZE.size_24,
    fontFamily :FONTFAMILY.poppins_extrabold,
    color : COLORS.primaryBlackHex,
  },
  ProductAboutLine : {
    fontSize : FONTSIZE.size_14*1.09,
    color : COLORS.secondaryDarkGreyHex,
    fontFamily :FONTFAMILY.poppins_regular
  },
  ProductTechnicalDetailsLine : {
    flexDirection : "row"
  },
  ProductTechnicalDetailsValue : {
    fontSize : FONTSIZE.size_14*1.09,
    fontFamily : FONTFAMILY.poppins_regular,
    color : COLORS.secondaryDarkGreyHex
  },
  ProductTechnicalDetailsHeading : {
    fontSize : FONTSIZE.size_16,
    fontFamily : FONTFAMILY.poppins_semibold,
    color : COLORS.primaryBlackHex,
  }
})