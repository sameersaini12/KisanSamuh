import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'

const ServerMessage = ({navigation , groupName} : any) => {
  return (
    <View style={styles.ServerMessageContainer}>
      <Text style={styles.WelcomeMessageText}>Welcome to {groupName} farmers group. This group gives you the bargaining power to get the farm inputs at the lowest rates.You can shop any product from agri store of app.</Text>
    </View>
  )
}

export default ServerMessage

const styles = StyleSheet.create({
    ServerMessageContainer: {
        backgroundColor : COLORS.secondaryLightGreenHex,
        width : "77%",
        marginLeft : "3%",
        padding : SPACING.space_12,
        marginTop : SPACING.space_15,
        borderRadius : BORDERRADIUS.radius_10
    }, 
    WelcomeMessageText : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    }
})