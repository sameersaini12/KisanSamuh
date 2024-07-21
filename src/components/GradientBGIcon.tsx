import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import CustomIcon from './CustomIcon'
import { COLORS, SPACING } from '../theme/theme'
import { useNavigation } from '@react-navigation/native'



const GradientBGIcon = ({navigation} : any) => {
  return (
    <View style={styles.Container}>
      <TouchableOpacity
        onPress={() => {navigation.openDrawer()}}
      >
        <CustomIcon
          name='menu'
          color={COLORS.primaryBlackHex}
          size={28}
        />
      </TouchableOpacity>
    </View>
  )
}

export default GradientBGIcon

const styles = StyleSheet.create({
    Container : {
        alignItems : 'center',
        justifyContent : 'center',
    },
})