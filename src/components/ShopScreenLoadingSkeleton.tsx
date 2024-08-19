import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, SPACING } from '../theme/theme'

const ShopScreenLoadingSkeleton = () => {
  return (
    <View style={styles.ShopScreenLoadingContainer}>
        <Text></Text>
      <View style={[styles.ShopScreenLoadingCard , {marginLeft : -SPACING.space_18}]}></View>
      <View style={styles.ShopScreenLoadingCard}></View>
      <View style={styles.ShopScreenLoadingCard}></View>
      <View style={styles.ShopScreenLoadingCard}></View>

    </View>
  )
}

export default ShopScreenLoadingSkeleton

const styles = StyleSheet.create({
    ShopScreenLoadingContainer : {
        padding : SPACING.space_18,
        flexWrap : "wrap",
        justifyContent : "space-between",
        flexDirection : 'row',
    },
    ShopScreenLoadingCard : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        width : "47%",
        height : 270,
        borderRadius : BORDERRADIUS.radius_10,
        marginBottom : SPACING.space_18
    }
})