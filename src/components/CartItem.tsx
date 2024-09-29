import { Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useDispatch } from 'react-redux'
import { calculateCartPrice, decrementCartItemQuantity, incrementCartItemQuantity } from '../features/cartSlice'
import CustomIcon from './CustomIcon'
import { useTranslation } from 'react-i18next'

const CartItem = ({id, title , price , itemPrice , navigation , image} : any) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const incrementCartItem = ( { size} : any) => {
    const payload : any= {
      id,
      size
    }
    dispatch(incrementCartItemQuantity(payload))
    dispatch(calculateCartPrice())
  }

  const decrementCartItem = ({size} : any) => {
    const payload : any = {
      id,
      size
    }
    dispatch(decrementCartItemQuantity(payload))
    dispatch(calculateCartPrice())
  }

  return (
    <View style={styles.CartItemContainer}>
      <View style={styles.CartItem}>
      <TouchableOpacity
          onPress={() => {
              navigation.push("ProductDetails" , {
                  id
              })
          }}
          style={styles.CartItemImageContainer}
      >
        <Image
            source={{uri : image}}
            style={styles.CartItemImage}
        />
      </TouchableOpacity>
        <View style={styles.CartItemInfo}>
            <Text style={styles.CartItemTitle}>{title}</Text>
            {price.map((item : any , index : any) => {
              return (
                <View style={styles.CartItemInfoSizeContainer} key={index}>
                  <Text style={styles.CartItemInfoSize}>{item.size}</Text>
                  <View style={styles.CartItemInfoQuantity}>
                      <TouchableOpacity 
                          onPress={() => 
                            decrementCartItem({size : item.size})
                          }
                          style={styles.CartItemInfoQuantityMinus}
                      >
                        <CustomIcon
                          name='minus-solid'
                          size={21}
                          color={COLORS.primaryLightGreenHex}
                        />
                      </TouchableOpacity>
                      <Text style={styles.CartItemInfoQuantityNumber}>{item.quantity}</Text>
                      <TouchableOpacity
                          onPress={() => 
                            incrementCartItem({size : item.size})
                          }
                          style={styles.CartItemInfoQuantityPlus}
                       >
                        <CustomIcon
                          name='add-solid'
                          size={21}
                          color={COLORS.primaryLightGreenHex}
                        />
                      </TouchableOpacity>
                  </View>
                </View>
              )
            })}
            <Text style={styles.CartItemTotalPriceHeading}>{t("Total Amount")} : 
              <Text style={styles.CartItemTotalPrice}> {t("Rs.")} {itemPrice}</Text>
            </Text>
        </View>
      </View>
    </View>
  )
}

export default CartItem

const styles = StyleSheet.create({
  CartItemContainer : {
    backgroundColor : COLORS.secondaryLightGreenHex,
    borderRadius : BORDERRADIUS.radius_20,
    padding : SPACING.space_10,
    marginBottom : SPACING.space_16,
    elevation : 3
  },
  CartItem: {
    flexDirection : 'row',

  },
  CartItemImageContainer : {
    backgroundColor : COLORS.secondaryWhiteHex,
    borderRadius : BORDERRADIUS.radius_15
  },
  CartItemImage : {
    height: 130,
    width: 130,
    borderRadius: BORDERRADIUS.radius_20,
  },
  CartItemInfo : {
    paddingLeft : SPACING.space_10
  },
  CartItemTitle : {
    fontSize : FONTSIZE.size_18,
    color : COLORS.primaryBlackHex,
    fontFamily : FONTFAMILY.poppins_medium
  },
  CartItemInfoSizeContainer : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : "center"
  },
  CartItemInfoSize : {
    fontSize : FONTSIZE.size_14,
    color : COLORS.primaryBlackHex,
    fontFamily : FONTFAMILY.poppins_regular
  },
  CartItemInfoQuantity : {
    flexDirection : 'row',
    alignItems : "center",
    marginBottom : SPACING.space_4
  },
  CartItemInfoQuantityMinus : {
    // backgroundColor : COLORS.primaryLightestGreyHex,
    padding : SPACING.space_2 *3,
    // borderTopLeftRadius : BORDERRADIUS.radius_8,
    // borderBottomLeftRadius : BORDERRADIUS.radius_8,
    // borderWidth : 0.8,
    // borderRightWidth : 0,
  },
  CartItemInfoQuantityNumber : {
    // backgroundColor : COLORS.primaryWhiteHex,
    padding : SPACING.space_2 *3,
    color : COLORS.primaryBlackHex,
    // borderWidth : 0.8,
    // borderRightWidth : 0,
    // borderLeftWidth : 0,
  },
  CartItemInfoQuantityPlus : {
    // backgroundColor : COLORS.primaryLightestGreyHex,
    padding : SPACING.space_2 *3,
    // borderTopRightRadius : BORDERRADIUS.radius_8,
    // borderBottomRightRadius : BORDERRADIUS.radius_8,
    // borderWidth : 0.8,
    // borderLeftWidth : 0,
  },
  CartItemTotalPriceHeading : {
    color : COLORS.primaryBlackHex,
    fontSize : FONTSIZE.size_14,
    fontFamily : FONTFAMILY.poppins_medium,
    marginTop : SPACING.space_10
  },
  CartItemTotalPrice : {
    fontSize : FONTSIZE.size_18,
    fontFamily : FONTFAMILY.poppins_bold,
  }
})