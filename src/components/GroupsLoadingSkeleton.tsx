import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, SPACING } from '../theme/theme'

const GroupsLoadingSkeleton = () => {
  return (
    <View style={styles.LoadingContainer}>
        <View style={styles.HorizontalRule}></View>
        <View style={styles.LoadingGroupContainer}>
            <View style={styles.LoadingDP}></View>
            <View style={styles.LoadingGroupInfo}>
                <View style={styles.LoadingGroupUpperContainer}>
                    <View style={styles.LoadingGroupName}></View>
                    <View style={styles.LoadingTime}></View>
                </View>
                <View style={styles.LoadingLastUpdate}></View>
            </View>
        </View>
        <View style={styles.HorizontalRule}></View>
        <View style={styles.LoadingGroupContainer}>
            <View style={styles.LoadingDP}></View>
            <View style={styles.LoadingGroupInfo}>
                <View style={styles.LoadingGroupUpperContainer}>
                    <View style={styles.LoadingGroupName}></View>
                    <View style={styles.LoadingTime}></View>
                </View>
                <View style={styles.LoadingLastUpdate}></View>
            </View>
        </View>
        <View style={styles.HorizontalRule}></View>
        <View style={styles.LoadingGroupContainer}>
            <View style={styles.LoadingDP}></View>
            <View style={styles.LoadingGroupInfo}>
                <View style={styles.LoadingGroupUpperContainer}>
                    <View style={styles.LoadingGroupName}></View>
                    <View style={styles.LoadingTime}></View>
                </View>
                <View style={styles.LoadingLastUpdate}></View>
            </View>
        </View>
        <View style={styles.HorizontalRule}></View>
        <View style={styles.LoadingGroupContainer}>
            <View style={styles.LoadingDP}></View>
            <View style={styles.LoadingGroupInfo}>
                <View style={styles.LoadingGroupUpperContainer}>
                    <View style={styles.LoadingGroupName}></View>
                    <View style={styles.LoadingTime}></View>
                </View>
                <View style={styles.LoadingLastUpdate}></View>
            </View>
        </View>
        <View style={styles.HorizontalRule}></View>
        <View style={styles.LoadingGroupContainer}>
            <View style={styles.LoadingDP}></View>
            <View style={styles.LoadingGroupInfo}>
                <View style={styles.LoadingGroupUpperContainer}>
                    <View style={styles.LoadingGroupName}></View>
                    <View style={styles.LoadingTime}></View>
                </View>
                <View style={styles.LoadingLastUpdate}></View>
            </View>
        </View>
    </View>
  )
}

export default GroupsLoadingSkeleton

const styles = StyleSheet.create({
    LoadingContainer : {

    },
    HorizontalRule : {
        padding : 0.6,
        backgroundColor : COLORS.primaryLightestGreyHex,
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_18,
        marginTop : SPACING.space_10,
        marginBottom : SPACING.space_10
    },
    LoadingGroupContainer : {
        flexDirection : "row",
        alignItems : "center"
    },
    LoadingDP : {
        width : 70,
        height : 70,
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_25*5,
        marginLeft : SPACING.space_18,
        marginRight : SPACING.space_16,
    },
    LoadingGroupInfo : {
        width : Dimensions.get("screen").width-(70+SPACING.space_18*2+SPACING.space_16),
    },
    LoadingGroupUpperContainer : {
        flexDirection : "row",
        justifyContent : "space-between"
    },
    LoadingGroupName : {
        height : 20,
        backgroundColor : COLORS.primaryLightestGreyHex,
        width : 150,
        borderRadius : BORDERRADIUS.radius_10
    },
    LoadingTime : {
        height : 20,
        backgroundColor : COLORS.primaryLightestGreyHex,
        width : 50,
        borderRadius : BORDERRADIUS.radius_10
    },
    LoadingLastUpdate : {
        height : 20,
        backgroundColor : COLORS.primaryLightestGreyHex,
        width : 100,
        borderRadius : BORDERRADIUS.radius_10,
        marginTop : SPACING.space_10
    }
})