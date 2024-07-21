import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'

const OrderItemProduct = ({title , price , itemPrice} :any) => {
  return (
    <View style={styles.CartItemContainer}>
      <View style={styles.CartItem}>
        <Image
            source={require("../assets/Categories/nutrients_image.jpg")}
            style={styles.CartItemImage}
        />
        <View style={styles.CartItemInfo}>
            <Text style={styles.CartItemTitle}>{title}</Text>
            {price.map((item : any , index : any) => {
              return (
                <View style={styles.CartItemInfoSizeContainer} key={index}>
                  <Text style={styles.CartItemInfoSize}>{item.size}</Text>
                  <View style={styles.CartItemInfoQuantity}>
                      <TouchableOpacity 
                          style={styles.CartItemInfoQuantityMinus}
                      >
                        <Text>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.CartItemInfoQuantityNumber}>{item.quantity}</Text>
                      <TouchableOpacity
                          style={styles.CartItemInfoQuantityPlus}
                       >
                        <Text>+</Text>
                      </TouchableOpacity>
                  </View>
                </View>
              )
            })}
            <Text style={styles.CartItemTotalPriceHeading}>Total Price : 
              <Text style={styles.CartItemTotalPrice}> Rs {itemPrice}</Text>
            </Text>
        </View>
      </View>
    </View>
  )
}

export default OrderItemProduct

const styles = StyleSheet.create({
    CartItemContainer : {
        backgroundColor : COLORS.secondaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_20,
        padding : SPACING.space_10,
        marginBottom : SPACING.space_16
      },
      CartItem: {
        flexDirection : 'row',
    
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
        backgroundColor : COLORS.primaryLightestGreyHex,
        padding : SPACING.space_2 *3,
        borderTopLeftRadius : BORDERRADIUS.radius_8,
        borderBottomLeftRadius : BORDERRADIUS.radius_8,
        borderWidth : 0.8,
        borderRightWidth : 0,
      },
      CartItemInfoQuantityNumber : {
        backgroundColor : COLORS.primaryWhiteHex,
        padding : SPACING.space_2 *3,
        borderWidth : 0.8,
        borderRightWidth : 0,
        borderLeftWidth : 0,
      },
      CartItemInfoQuantityPlus : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        padding : SPACING.space_2 *3,
        borderTopRightRadius : BORDERRADIUS.radius_8,
        borderBottomRightRadius : BORDERRADIUS.radius_8,
        borderWidth : 0.8,
        borderLeftWidth : 0,
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