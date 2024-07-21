import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../theme/theme'

const NotificationScreen = () => {
  return (
    <View style={styles.NotificationContainer}>
      <Text>There is no notification for you</Text>
    </View>
  )
}

export default NotificationScreen

const styles = StyleSheet.create({
  NotificationContainer : {
    backgroundColor : COLORS.primaryWhiteHex
  }
})