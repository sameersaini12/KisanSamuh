import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useTranslation } from 'react-i18next'

const WhyAddFarmCard = ({closeBottomSheet} : any) => {
  const {t} = useTranslation()
  return (
    <View style={styles.WhyAddFarmCardContainer}>
      <Text style={styles.WhyAddFarmText}>{`\u25CF`} {" "}{t('Helps to track the farm activity')}.</Text>
      <Text style={styles.WhyAddFarmText}>{`\u25CF`} {" "}{t('Helps to add in the group and get group buy discounts')}.</Text>
      <Text style={styles.WhyAddFarmText}>{`\u25CF`} {" "}{t('Helps you to get recommendation for best farm practises for your farms')}.</Text>
      <Pressable 
        onPress={()=> {
            closeBottomSheet()
        }}
        style={styles.WhyAddFarmCloseButtonContainer}
        >
        <Text style={styles.WhyAddFarmCloseButtonText}>Ok</Text>
      </Pressable>
    </View>
  )
}

export default WhyAddFarmCard

const styles = StyleSheet.create({
    WhyAddFarmCardContainer : {
        padding : SPACING.space_18
    },
    WhyAddFarmText : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryBlackHex
    },
    WhyAddFarmCloseButtonContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_10,
        padding: SPACING.space_12,
        marginTop : SPACING.space_12,
    },
    WhyAddFarmCloseButtonText : {
        textAlign : "center",
        color : COLORS.primaryWhiteHex,
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
    }
})