import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, SPACING } from '../theme/theme'

const OrderHistoryLoadingSkeleton = () => {
  return (
    <View style={styles.OrderLoadingContainer}>
      <View style={styles.OrderLoading}></View>
      <View style={styles.OrderLoading}></View>
      <View style={styles.OrderLoading}></View>
      <View style={styles.OrderLoading}></View>
      <View style={styles.OrderLoading}></View>
      <View style={styles.OrderLoading}></View>
      <View style={styles.OrderLoading}></View>
    </View>
  )
}

export default OrderHistoryLoadingSkeleton

const styles = StyleSheet.create({
    OrderLoadingContainer : {
        padding : SPACING.space_18,
    },
    OrderLoading : {
        width : "100%",
        height : 100,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        marginBottom : SPACING.space_18,
    }
})