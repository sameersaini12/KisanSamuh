import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomIcon from './CustomIcon'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'

const StartingHeader = ({navigation} : any) => {

    const backButtonHandler = () => {
        navigation.pop()
    }

  return (
    <View style={styles.StartingHeaderContainer}>
        <TouchableOpacity 
            onPress={backButtonHandler}
            style={styles.StartingHeaderBackButton}
        >
            <CustomIcon
                name='arrow-left2'
                size={FONTSIZE.size_24}
                color={COLORS.primaryBlackHex}
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.StartingHeaderSkipButton}>
            <Text style={styles.StartingHeaderSkipButtonText}>Skip</Text>
        </TouchableOpacity>

    </View>
  )
}

export default StartingHeader

const styles = StyleSheet.create({
    StartingHeaderContainer : {
        flexDirection : 'row',
        padding : SPACING.space_18,
        alignItems : "center",
        justifyContent : 'space-between',
    },
    StartingHeaderBackButton : {

    },
    StartingHeaderSkipButton : {

    },
    StartingHeaderSkipButtonText : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular
    }
})