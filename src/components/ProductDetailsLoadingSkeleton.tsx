import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, SPACING } from '../theme/theme'

const ProductDetailsLoadingSkeleton = () => {
  return (
    <View style={styles.ProductDetailsLoadingContainer}>
        <View style={styles.ProudctLoadingImage}></View>
        <View style={styles.ProductLoadingTitle}></View>
        <View style={styles.ProductLoadingBrand}></View>
        <View style={styles.ProductLoadingPrice}></View>
        <View style={styles.ProductLoadingDiscount}></View>
        <View style={styles.ProdcutLoadingSizeItemContainer}>
            <View style={styles.ProductLoadingSizeItem}></View>
            <View style={styles.ProductLoadingSizeItem}></View>
            <View style={styles.ProductLoadingSizeItem}></View>
        </View>
        <View style={styles.AboutLoadingLine}></View>
        <View style={styles.AboutLoadingLine}></View>
        <View style={styles.AboutLoadingLine}></View>
    </View>
  )
}

export default ProductDetailsLoadingSkeleton

const styles = StyleSheet.create({
    ProductDetailsLoadingContainer : {
        padding : SPACING.space_18
    },
    ProudctLoadingImage : {
        width : "100%",
        height : 370,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
    },
    ProductLoadingTitle : {
        height : 30,
        width : 200,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        marginTop: SPACING.space_16
    },
    ProductLoadingBrand : {
        height : 30,
        width : 100,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        marginTop: SPACING.space_10
    },
    ProductLoadingPrice : {
        height : 30,
        width : 150,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        marginTop: SPACING.space_16
    },
    ProductLoadingDiscount: {
        height : 30,
        width : 200,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        marginTop: SPACING.space_16
    },
    ProdcutLoadingSizeItemContainer : {
        flexDirection : "row",
        alignItems : "center"
    },
    ProductLoadingSizeItem : {
        height : 30,
        width : 70,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_15,
        marginTop: SPACING.space_16,
        marginRight : SPACING.space_10
    },
    AboutLoadingLine : {
        height : 30,
        width : "100%",
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        marginTop: SPACING.space_16
    }
})