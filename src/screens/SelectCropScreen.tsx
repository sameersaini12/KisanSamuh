import { Pressable, StyleSheet, Text, View, Image, Dimensions, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import cropList from '../data/cropList'

const cropImageFetcher : any = {
    paddy : require("../assets/crops/paddy.jpg"),
    wheat : require("../assets/crops/wheat.jpg"),
    sugarcane : require("../assets/crops/sugarcane.jpg")
}

const CropImageWidth = Dimensions.get("screen").width*0.27

const SelectCropScreen = ({navigation} : any) => {

    const [selectedCrop , setSelectedCrop]= useState('')
    const [selecteCropIndex, setSelectedCropIndex] = useState(null)

    const backButtonHandler = () => {
        navigation.pop()
    }

  return (
    <GestureHandlerRootView>
        <View style={styles.StartingHeaderContainer}>
            <Pressable 
                onPress={backButtonHandler}
                style={styles.StartingHeaderBackButton}
            >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryWhiteHex}
                />
            </Pressable>
            <Text style={styles.SelectCropScreenHeaderTitle}>Select Crop</Text>
        </View>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.CropListScrollView}
        >
            <Text style={styles.PopularCropTitle}>Popular crop in your area</Text>
            <View style={styles.CropListContainer}>
                {cropList.map((crop :any , index : any) => {
                    return (
                        <Pressable 
                            key={index}
                            onPress={() =>{
                                setSelectedCrop(crop.name)
                                setSelectedCropIndex(index)
                            }}
                            style={styles.CropListItemContainer}
                        >
                            <Image style={[styles.CropListItemImage , {borderWidth : selecteCropIndex==index ? 3 : 0 , borderColor : COLORS.primaryLightGreenHex}]} source={cropImageFetcher[crop.image]} />
                            <Text style={styles.CropListItemTitle}>{crop.name}</Text>
                        </Pressable>
                    )
                })}
            </View>
        </ScrollView>
        <Pressable 
            onPress={() => {
                if(selectedCrop==='') {
                    ToastAndroid.show("Slect your crop" , ToastAndroid.SHORT)
                }else{
                    navigation.push("AddFarmDetailsScreen" , {
                        cropName : selectedCrop
                    })
                }
            }}
            style={styles.SaveCropButtonContainer}
        >
            <Text style={styles.SaveCropTitle}>Save and Continue</Text>
        </Pressable>
    </GestureHandlerRootView>
  )
}

export default SelectCropScreen

const styles = StyleSheet.create({
    StartingHeaderContainer : {
        flexDirection : 'row',
        padding : SPACING.space_18,
        alignItems : "center",
        backgroundColor : COLORS.primaryLightGreenHex
    },
    StartingHeaderBackButton : {

    },
    SelectCropScreenHeaderTitle : {
        marginLeft : SPACING.space_10*2,
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_semibold,

        color : COLORS.primaryWhiteHex,
    },
    CropListScrollView : {
        padding : SPACING.space_18
    },
    PopularCropTitle : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
    },
    SaveCropButtonContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        padding : SPACING.space_15,
        position : "absolute",
        bottom : 0,
        left : 0,
        right : 0,
    },
    SaveCropTitle : {
        color : COLORS.primaryWhiteHex,
        textAlign : "center",
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
    },
    CropListContainer : {
        flexDirection : "row",
        flexWrap : "wrap",
        justifyContent : "space-between",
        marginTop : SPACING.space_18,
    },
    CropListItemContainer : {
        
    },
    CropListItemImage : {
        width : CropImageWidth,
        height : CropImageWidth,
        borderRadius : BORDERRADIUS.radius_10,
    },
    CropListItemTitle : {
        textAlign : "center",
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryBlackHex,
        marginTop : SPACING.space_10,
        marginBottom : SPACING.space_10
    }
})