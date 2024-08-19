import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import GradientBGIcon from './GradientBGIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import ProfilePic from './ProfilePic'
import CustomIcon from './CustomIcon'
import { useDispatch, useSelector } from 'react-redux'
import { updateEnterInAppStatus } from '../features/userSlice'


const HeaderBar = ({navigation} : any) => {
    const totalItemInCartStore = useSelector((state : any) => state.cart.totalItemInCart)
    const loginStatus = useSelector((state : any) => state.user.isLoggedIn)

    const dispatch = useDispatch()
  return (
    <View style={styles.HeaderContainer}>
        <View style={styles.HeaderLeftContainer}>
            <GradientBGIcon navigation={navigation} />
            <Text style={styles.HeaderBrandFirstName}>Kisan</Text>
            <Text style={styles.HeaderBrandSecondName}>Samuh</Text>
        </View>
        
        <View style={styles.HeaderRightContainer}>
            <TouchableOpacity
                onPress={async () => {
                    if(loginStatus)
                    navigation.push("RewardScreen")
                    else {
                        const enterInAppStatus : any = false
                        await dispatch(updateEnterInAppStatus(enterInAppStatus))
                        navigation.push("PhoneLoginScreen")
                    }
                }}
            >
                <Image style={styles.RewardsCoinImage} source={require("../assets/reward_coin.png")} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigation.push("CartScreen")
                }}
            >
                <CustomIcon
                    name='cart'
                    size={25}
                    color={COLORS.primaryLightGreyHex}
                    style={styles.HeaderRightCartIcon}
                />
                {totalItemInCartStore!=0 && (
                    <View style={{backgroundColor : COLORS.primaryOrangeHex, 
                        borderRadius : BORDERRADIUS.radius_25, 
                        width : 20,
                        height : 20,
                        alignItems : "center",
                        justifyContent: 'center',
                        position : "absolute",
                        top: -10,
                        right : -10,
                        }}>
                        <Text style={{color : COLORS.primaryWhiteHex}}>{totalItemInCartStore}</Text>
                    </View>
                )}
                
            </TouchableOpacity>
            
        </View>
    </View>
  )
}

export default HeaderBar

const styles = StyleSheet.create({
    HeaderContainer : {
        padding : SPACING.space_18,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent: 'space-between',
    },
    HeaderLeftContainer : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
    },
    HeaderBrandFirstName : {
        fontFamily : FONTFAMILY.poppins_extrabold,
        fontSize : FONTSIZE.size_18,
        marginLeft : SPACING.space_10,
        color : COLORS.primaryLightGreenHex,
    },
    HeaderBrandSecondName : {
        fontFamily : FONTFAMILY.poppins_extrabold,
        fontSize : FONTSIZE.size_18,
        marginLeft : SPACING.space_4,
        color : COLORS.primaryLightGreyHex,
    },
    HeaderRightContainer : {
        flexDirection : 'row',
        alignItems : 'center',
    },
    RewardsCoinImage : {
        height : 30,
        width : 45
    },
    HeaderRightHeartIcon : {

    },
    HeaderRightCartIcon : {
        marginLeft : SPACING.space_15,
    },
    HeaderTitle : {
        fontFamily : FONTFAMILY.poppins_semibold,
        fontSize : FONTSIZE.size_20,
        color : COLORS.primaryWhiteHex
    }
})