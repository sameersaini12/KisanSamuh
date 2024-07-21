import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, SPACING } from '../theme/theme'

const ProductImageBackground = () => {
  return (
    <View style={styles.ProductImageBackgroundContainer}>
      <ImageBackground
        source={require("../assets/Categories/nutrients_image.jpg")}
        style={styles.ProductImageBackgroundImage}
      />
    </View>
  )
}

export default ProductImageBackground

const styles = StyleSheet.create({
    ProductImageBackgroundContainer : {
        
    },
    ProductImageBackgroundImage : {
        width : '100%',
        aspectRatio : 20/20,
        justifyContent : 'space-between',
    }
})