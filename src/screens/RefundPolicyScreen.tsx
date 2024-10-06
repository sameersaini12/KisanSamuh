import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useTranslation } from 'react-i18next'

const RefundPolicyScreen = ({navigation} : any) => {

  const {t} = useTranslation()

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

        <Text style={styles.StartingHeaderTitle}>{t("Refund Policy")}</Text>

      </View>
    </GestureHandlerRootView>
  )
}

export default RefundPolicyScreen

const styles = StyleSheet.create({
  StartingHeaderContainer: {
    flexDirection: 'row',
    padding: SPACING.space_18,
    alignItems: "center",
    backgroundColor: COLORS.primaryLightGreenHex
  },
  StartingHeaderBackButton: {

  },
  StartingHeaderTitle: {
    marginLeft: SPACING.space_18,
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex
  },
  StartingHeaderSkipButtonText: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryWhiteHex
  },
})