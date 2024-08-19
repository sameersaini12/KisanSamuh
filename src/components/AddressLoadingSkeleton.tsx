import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, SPACING } from '../theme/theme'

const AddressLoadingSkeleton = () => {
  return (
    <View style={styles.AddressLoadingContainer}>
      <View style={styles.AddressLoadingLine}></View>
      <View style={styles.HorizontalLine}></View>
      <View style={styles.AddressLoadingLine}></View>
      <View style={styles.HorizontalLine}></View>
    </View>
  )
}

export default AddressLoadingSkeleton

const styles = StyleSheet.create({
    AddressLoadingContainer : {

    },
    AddressLoadingLine : {
        width : "100%",
        height : 30,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        
    },
    HorizontalLine: {
        padding : 0.5,
        backgroundColor : COLORS.secondaryLightGreyHex,
        marginBottom : SPACING.space_10,
        marginTop : SPACING.space_10
    }
})