import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BrandListItem from '../data/brandList'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const CARD_WIDTH = Dimensions.get('window').width * 0.27;

const imageFetcher : any = {
    bayer : require("../assets/Brands/bayer_logo.jpg"),
    others : require("../assets/Brands/dhanuka_logo.png"),
    jk : require("../assets/Brands/jk_logo.png"),
    ju : require("../assets/Brands/ju_logo.png"),
    syngenta : require("../assets/Brands/syngenta_logo.png"),
    tractor : require("../assets/Brands/tractor_logo.png"),
}

const BrandList = ({navigation } : any) => {
    const tabBarHeight = useBottomTabBarHeight()
  return (
    <View style={[styles.BrandContainer ,{ marginBottom : tabBarHeight}]}>
      {BrandListItem.map((brand : any , index : any) => {
        return (
            <Pressable 
                key={index} 
                style={styles.BrandContainerItem}
                onPress={() => {
                    navigation.navigate("Tab" , {
                        screen : "Shop",
                        params : {
                            searchTextFromPreviousScreen : brand.name
                        }
                    })
                }}
            >
                <View style={styles.BrandContainerBox}>
                    <Image style={styles.BrandContainerBoxImage} source={imageFetcher[brand.name]} />
                </View>
                <Text style={styles.BrandTitle}>{brand.name}</Text>
            </Pressable>
        )
      })}
    </View>
  )
}

export default BrandList

const styles = StyleSheet.create({
    BrandContainer : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        padding : SPACING.space_18,
        flexWrap : "wrap",
    },
    BrandContainerItem : {
        alignItems : 'center',
    },
    BrandContainerBox : {
        height : CARD_WIDTH,
        width : CARD_WIDTH,
        borderRadius : BORDERRADIUS.radius_15,
        borderWidth : 1,
        borderColor : COLORS.secondaryLightGreyHex,
        elevation : 2,
        alignItems : 'center',
        justifyContent : 'center',
        overflow: 'hidden',
        backgroundColor : COLORS.primaryWhiteHex
    },
    BrandContainerBoxImage : {
        height : CARD_WIDTH ,
        width : CARD_WIDTH ,
    },
    BrandTitle : {
        color : COLORS.secondaryDarkGreyHex,
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_light,
        width : CARD_WIDTH,
        textAlign : 'center',
        marginTop : SPACING.space_4,
        textTransform : "capitalize"
    }
})