import { Dimensions, Image, ImageBackground, TouchableOpacity, StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import CategoryListItem from '../data/categoryList'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

const CARD_WIDTH = Dimensions.get('window').width * 0.2;

const imageFetcher : any = {
    herbicide : require("../assets/Categories/herbicide.png"),
    growth : require("../assets/Categories/growth.png"),
    nutrients : require("../assets/Categories/nutrient.png"),
    seeds : require("../assets/Categories/seeds.png"),
    pesticide : require("../assets/Categories/pesticide.png"),
    insecticide : require("../assets/Categories/insecticide.png"),
    fungicide : require("../assets/Categories/fungicide.png"),
    others : require("../assets/Categories/equipments.png"),
    inputs : require("../assets/Categories/equipments.png"),
    organic : require("../assets/Categories/organic.png")
}

const CategoryList = ({navigation, numColumns = 2} : any) => {
    const {t} = useTranslation()
  return (
    <View style={styles.CategoryContainer}>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}
        >
            <FlatList
                contentContainerStyle={{alignSelf : "flex-start"}}
                numColumns={Math.ceil(CategoryListItem.length/numColumns)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                directionalLockEnabled={true}
                alwaysBounceVertical={false}
                data={CategoryListItem}
                renderItem={({item, index}) => {
                    return (
                        <Pressable 
                            key={index} 
                            style={styles.CategoryContainerItem}
                            onPress={() => {
                                navigation.navigate("Tab" , {
                                    screen : "Shop",
                                    params : {
                                        searchTextFromPreviousScreen : item.name
                                    }
                                })
                            }}
                        >
                            <View style={{marginTop : SPACING.space_10}}>
                                <View style={styles.CategoryContainerBox}>
                                </View>
                                <ImageBackground style={styles.CategoryContainerBoxImage} source={imageFetcher[item.name]} />
                            </View>
                            <Text style={styles.CategoryTitle}>{t(item.name.toLowerCase())}</Text>
                        </Pressable>
                    )
                }}
            />
        </ScrollView>
    </View>
  )
}

export default CategoryList

const styles = StyleSheet.create({
    CategoryContainer : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        padding : SPACING.space_18,
        flexWrap : "wrap",
    },
    CategoryContainerItem : {
        alignItems : 'center',
        marginTop : SPACING.space_15,
        marginRight : SPACING.space_18,
    },
    CategoryContainerBox : {
        height : CARD_WIDTH,
        width : CARD_WIDTH,
        borderRadius : BORDERRADIUS.radius_15*10,
        borderWidth : 2,
        borderColor : COLORS.secondaryLightGreenHex,
        elevation : 1,
        overflow: 'hidden',
        backgroundColor : COLORS.secondaryLightGreenHex,
        position : "relative",
    },
    CategoryContainerBoxImage : {
        height : CARD_WIDTH*1.2 ,
        width : CARD_WIDTH,
        borderBottomLeftRadius : BORDERRADIUS.radius_15*10,
        borderBottomRightRadius : BORDERRADIUS.radius_15*10,
        position : "absolute",
        overflow  : "hidden",
        bottom : 0,
        right : 0,
    },
    CategoryTitle : {
        color : COLORS.secondaryDarkGreyHex,
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_light,
        textAlign : 'center',
        marginTop : SPACING.space_4,
        textTransform : "capitalize"
    }
})

