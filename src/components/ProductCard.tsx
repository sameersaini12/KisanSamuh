import { Dimensions, ImageBackground, ImageProps, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomIcon from './CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'

const CARD_WIDTH = Dimensions.get('window').width * 0.43;

interface ProductCardProps {
    id: string,
    imageLink: ImageProps,
    title: string,
    companyName: string,
    price: any,
}

const ProductCard : React.FC<ProductCardProps> = ({
    id,
    imageLink,
    title,
    companyName,
    price,
}) => {
  return (
    <View style={styles.ProductCardContainer}>
      <ImageBackground
        source={imageLink}
        style={styles.CardImageBG}
        resizeMode="cover">
      </ImageBackground>
      <View style={styles.ProductDetails}>
        <Text style={styles.CardTitle}>{title}</Text>
        <Text style={styles.CardSubtitle}>{companyName}</Text>
        <View style={styles.CardFooterRow}>
            <Text style={styles.CardPriceCurrency}>
            Rs <Text style={styles.CardPrice}>{price}</Text>
            </Text>
            <TouchableOpacity
            onPress={() => {
                
            }}>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ProductCard

const styles = StyleSheet.create({
    ProductCardContainer : {
        width: CARD_WIDTH,
        borderRadius: BORDERRADIUS.radius_20,
        borderWidth: 0.7,
        borderColor: COLORS.secondaryLightGreyHex ,
        marginTop : SPACING.space_18,
        overflow: 'hidden',
        elevation : 1,
        shadowColor: 'transparent',
    }, 
    CardImageBG : {
        width: CARD_WIDTH,
        height: CARD_WIDTH,
        borderRadius: BORDERRADIUS.radius_20,
        overflow: 'hidden',
    },
    ProductDetails : {
        padding : SPACING.space_10
    },
    CardTitle : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    },
    CardSubtitle : {
        fontSize : FONTSIZE.size_14,
        fontFamily : FONTFAMILY.poppins_regular,
    },
    CardFooterRow : {

    },
    CardPriceCurrency: {
        color : COLORS.primaryLightGreenHex,
        fontFamily : FONTFAMILY.poppins_regular,
    },
    CardPrice: {
    }

})