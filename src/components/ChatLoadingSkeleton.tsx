import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, SPACING } from '../theme/theme'

const ChatLoadingSkeleton = ({isLoading} :any) => {
  return (
    <View style={styles.LoadingContainer}>
        <View style={styles.ClientLoadingContainer}></View>
        <View style={styles.ServerLoadingContainer}></View>
        <View style={styles.ClientLoadingContainer}></View>
        <View style={styles.ServerLoadingContainer}></View>
    </View>
  )
}

export default ChatLoadingSkeleton

const styles = StyleSheet.create({
    LoadingContainer : {
        width: "100%",
    },
    ClientLoadingContainer : {
        width : "77%",
        height : "21%",
        marginLeft : "20%",
        backgroundColor : COLORS.secondaryLightGreenHex,
        marginTop : SPACING.space_15,
        borderRadius : BORDERRADIUS.radius_10,
        elevation : 2,
    },
    ServerLoadingContainer : {
        width : "77%",
        marginLeft : "3%",
        height : "21%",
        marginTop : SPACING.space_15,
        borderRadius : BORDERRADIUS.radius_10,
        backgroundColor : COLORS.secondaryLightGreenHex,
        elevation : 2,
    },

})