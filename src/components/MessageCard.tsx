import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import CustomIcon from './CustomIcon'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from '@gorhom/bottom-sheet'

const MessageCard = ({item, socket , navigation} : any) => {

    const {t} = useTranslation()
    const groupChatClickHandler = () => {
        navigation.push("ChatScreen", {
            groupName : item
        })
    }
  return (
    <GestureHandlerRootView >
        <View style={styles.HorizontalRule}></View>
        <TouchableOpacity 
            onPress={() => {
                groupChatClickHandler()
            }}
            style={styles.MessageCartContainer}
        >
            <View style={styles.MessageCardDP}>
                <CustomIcon
                    name='users'
                    size={40}
                />
            </View>
            <View style={styles.MessageCardDetails}>
                <View style={styles.MessageCardNameContainer}>
                    <Text style={styles.MessageCardGroupNameText}>{item}</Text>
                    <Text style={styles.MessageCardLastTimeText}></Text>
                </View>
                <View style={styles.MessageCardLastDetailsContainer}>
                    <Text style={styles.MessageCardLastDetailsText}>{t("View Group Order Details")}</Text>
                </View>
            </View>
        </TouchableOpacity>
      
    </GestureHandlerRootView>
  )
}

export default MessageCard

const styles = StyleSheet.create({
    MessageCartContainer : {
        flexDirection : "row",
        alignItems : "center"
    },
    MessageCardDP : {
        width : 70,
        height : 70,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_25*5,
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_16,
        alignItems : "center",
        justifyContent : "center",

    },
    MessageCardDetails : {
        width : Dimensions.get("screen").width-(70+SPACING.space_18*2+SPACING.space_16),
    },
    MessageCardNameContainer: {
        flexDirection : "row",
        justifyContent : "space-between"
    },
    MessageCardGroupNameText : {
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    },
    MessageCardLastTimeText : {
        fontSize : FONTSIZE.size_14,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.secondaryLightGreyHex,
    },
    MessageCardLastDetailsContainer : {

    },
    MessageCardLastDetailsText : {
        fontSize : FONTSIZE.size_14,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.secondaryLightGreyHex,
    },
    HorizontalRule : {
        padding : 0.6,
        backgroundColor : COLORS.primaryLightestGreyHex,
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_18,
        marginTop : SPACING.space_10,
        marginBottom : SPACING.space_10
    }
})