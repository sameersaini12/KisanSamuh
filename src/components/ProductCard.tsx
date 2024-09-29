import { Dimensions, ImageBackground, ImageProps, StyleSheet, Text, TouchableOpacity, View , Image } from 'react-native'
import React from 'react'
import CustomIcon from './CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useTranslation } from 'react-i18next';

const CARD_WIDTH = Dimensions.get('window').width * 0.43;

interface ProductCardProps {
    id: string,
    imageLink: any,
    title: string,
    companyName: string,
    price: any,
    discount : string,
}

const ProductCard : React.FC<ProductCardProps> = ({
    id,
    imageLink,
    title,
    companyName,
    price,
    discount
}) => {
    const {t} = useTranslation()
  return (
    <View style={styles.ProductCardContainer}>
        {discount!=='' && 
        <View style={styles.DiscountTag}>
            <Text style={styles.DiscountTagText}>{discount}% {t("off")}</Text>
        </View>
        }
      <Image style={styles.CardImageBG} source={{ uri : imageLink}} />
      <View style={styles.ProductDetails}>
        <Text style={styles.CardTitle}>{title}</Text>
        <Text style={styles.CardSubtitle}>{companyName}</Text>
        <View style={styles.CardFooterRow}>
            <Text style={styles.CardPriceCurrency}>
            {discount!=='' ?
                <Text>
                    ₹{price}{" "}
                    <Text style={{fontSize : FONTSIZE.size_14,
                    fontFamily : FONTFAMILY.poppins_medium, 
                    textDecorationLine : "line-through",
                    color : COLORS.primaryLightGreyHex,
                    }}>₹{Number(price) +(price*Number(discount))/100}</Text>
                </Text>:
                <Text>₹{price}</Text>
            }
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
    DiscountTag : {
        position : "absolute",
        backgroundColor : COLORS.primaryOrangeHex,
        padding : SPACING.space_10*0.4,
        borderBottomRightRadius : BORDERRADIUS.radius_10*0.8,
    },
    DiscountTagText : {
        color : COLORS.primaryWhiteHex,
        fontSize : FONTSIZE.size_12,
        fontFamily : FONTFAMILY.poppins_medium
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
        color : COLORS.primaryLightGreyHex,
    },
    CardFooterRow : {

    },
    CardPriceCurrency: {
        color : COLORS.primaryLightGreenHex,
        fontFamily : FONTFAMILY.poppins_regular,
        fontSize : FONTSIZE.size_16*1.05
    },
    CardPrice: {
    }

})