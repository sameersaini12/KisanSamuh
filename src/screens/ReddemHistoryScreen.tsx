import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'

const ReddemHistoryScreen = ({navigation } : any) => {

  const backButtonHandler = () => {
    navigation.pop()
  }
  return (
    <GestureHandlerRootView>
      <View style={styles.StartingHeaderContainer}>
            <TouchableOpacity
                onPress={backButtonHandler}
                style={styles.StartingHeaderBackButton}
            >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <Text style={styles.StartingHeaderTitle}>Redeem History</Text>

        </View>
      <Text style={[styles.NoRedeemHistoryText, {margin : SPACING.space_18}]}>You have not redeemed any rewards yet.</Text>
    </GestureHandlerRootView>
  )
}

export default ReddemHistoryScreen

const styles = StyleSheet.create({
  StartingHeaderContainer : {
    flexDirection : 'row',
    padding : SPACING.space_18,
    alignItems : "center",
    backgroundColor : COLORS.primaryLightGreenHex
  },
  StartingHeaderBackButton : {

  },
  StartingHeaderTitle : {
      marginLeft : SPACING.space_18,
      fontSize : FONTSIZE.size_20,
      fontFamily : FONTFAMILY.poppins_semibold,
      color : COLORS.primaryWhiteHex
  },
  StartingHeaderSkipButtonText : {
      fontSize : FONTSIZE.size_18,
      fontFamily : FONTFAMILY.poppins_medium,
      color : COLORS.primaryWhiteHex
  },
  NoRedeemHistoryText : {
    fontSize : FONTSIZE.size_18,
    fontFamily : FONTFAMILY.poppins_regular,
    color : COLORS.primaryBlackHex,
  }
})