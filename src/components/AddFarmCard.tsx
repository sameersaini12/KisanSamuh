import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomIcon from './CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useSelector } from 'react-redux'

const AddFarmCard = ({navigation , openBottomModel , closeBottomModel, totalFarms} : any) => {
    const isLoggedIn = useSelector((state : any) => state.user.isLoggedIn)
  return (
    <View>
        {totalFarms > 0 ? (
            <Pressable 
                onPress={() => {
                    navigation.push("FarmListScreen")
                }}
                style={styles.AddFardmCardContainer}
            >
                <Text style={styles.VisitYourFarmText}>Visit Your Farms</Text>
                <Pressable
                    style={styles.VisitFarmCardRightContainer}
                >
                    <CustomIcon
                        name='arrow-right2'
                        size={25}
                        color={COLORS.primaryWhiteHex}
                    />
                </Pressable>
            </Pressable>
        ) : (
            <View style={styles.AddFardmCardContainer}>
                <Pressable 
                    onPress={() => {
                        navigation.navigate("SelectCropScreen")
                    }}
                    style={styles.AddFarmCardLeftContainer}
                >
                    <CustomIcon
                        name='add-solid'
                        size={35}
                        color={COLORS.primaryLightGreenHex}
                    />
                    <Text style={styles.AddYourFarmText}>Add your farm</Text>
                </Pressable>
                <Pressable 
                    onPress={() => {
                        openBottomModel()
                    }}
                    style={styles.AddFarmCardRightContainer}
                >
                    <Text style={styles.WhyAddFarmText}>?</Text>
                </Pressable>
            </View>
        )}
        
    </View>
  )
}

export default AddFarmCard

const styles = StyleSheet.create({
    AddFardmCardContainer : {
        backgroundColor : COLORS.secondaryLightGreenHex,
        padding : SPACING.space_12,
        margin : SPACING.space_18,
        borderRadius : BORDERRADIUS.radius_15,
        elevation : 2,
        borderColor : COLORS.primaryBlackHex,
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between"
    },
    AddFarmCardLeftContainer : {
        flexDirection : "row",
        alignItems : "center",
    },
    AddFarmCardRightContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        width : 25,
        height : 25,
        borderRadius : BORDERRADIUS.radius_15,
        justifyContent : "center",
        alignItems : "center",
    },
    VisitFarmCardRightContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        width : 40,
        height : 40,
        borderRadius : BORDERRADIUS.radius_15*10,
        justifyContent : "center",
        alignItems : "center",
    },
    WhyAddFarmText : {
        color : COLORS.primaryWhiteHex
    },
    AddYourFarmText : {
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
        marginLeft : SPACING.space_18,
    },
    VisitYourFarmText : {
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
        marginLeft : SPACING.space_10,
    }
})