import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomIcon from './CustomIcon'
import { COLORS, SPACING } from '../theme/theme'

const ProfilePic = () => {
  return (
    <View style={styles.ImageContainer}>
      {/* <CustomIcon style={styles.Image} name="empty" size={36} color={COLORS.secondaryGreyHex} /> */}
    </View>
  )
}

export default ProfilePic

const styles = StyleSheet.create({
    ImageContainer : {
        height : SPACING.space_36,
        width : SPACING.space_36,
        borderRadius : SPACING.space_12,
        borderWidth : 2,
        borderColor : COLORS.secondaryDarkGreyHex,
        alignItems : 'center',
        justifyContent : 'center',
        overflow: 'hidden',
    },
    Image : {
        height : SPACING.space_36,
        width : SPACING.space_36,
    }
})