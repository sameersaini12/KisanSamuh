import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, SPACING } from '../theme/theme'

const FarmListLoadingSkeleton = () => {
  return (
    <View style={styles.FarmListLoadingContainer}>
      <View style={styles.FarmListLoading}></View>
      <View style={styles.FarmListLoading}></View>
    </View>
  )
}

export default FarmListLoadingSkeleton

const styles = StyleSheet.create({
    FarmListLoadingContainer : {
        padding: SPACING.space_18
    },
    FarmListLoading : {
        width : "100%",
        height : 250,
        backgroundColor : COLORS.secondaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_10,
        marginBottom : SPACING.space_18
    }
})