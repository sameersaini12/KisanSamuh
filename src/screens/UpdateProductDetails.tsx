import { Pressable, StatusBar, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
import { GestureHandlerRootView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import {BASE_URL} from "@env"

const UpdateProductDetails = ({navigation} : any) => {

    const [productId, setProductId] = useState('')

    const backButtonHandler = () => {
        navigation.pop()
    }

    const fetchProductDetails = async (id: any) => {
        fetch(`${BASE_URL}/product/product-details/${id}`)
        .then((resp) => resp.json())
        .then((res) => {
            if(res.data) {
                if(res.data.lenght>0) {
                    console.log(res.data)
                }else {
                    ToastAndroid.show("Product does not exist" , ToastAndroid.SHORT)
                }
            }else {
                ToastAndroid.show("Product does not exist" , ToastAndroid.SHORT)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }
  return (
    <GestureHandlerRootView>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />

        <View style={[styles.OrderHistoryScreenHeader, {marginBottom : SPACING.space_18}]}>
            <View style={styles.OrderHistoryScreenHeaderLeft}>
                <TouchableOpacity
                onPress={backButtonHandler}
                >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryLightGreyHex}
                />
                </TouchableOpacity>
                <Text style={styles.OrderHistoryScreenHeaderTitle}>Update Product Details</Text>
            </View>
        </View>

        <View style={{marginHorizontal : SPACING.space_18,}}>
            <Pressable
                style={styles.InputContainerButton}
            >
                <TextInput
                    inputMode='text'
                    placeholder='Enter Product Id'
                    style={styles.InputContainer}
                    value={productId}
                    onChangeText={setProductId}
                />
            </Pressable>
            <Pressable
                onPress={() => {
                    fetchProductDetails(productId)
                }}
                style={styles.UpdateProductButtonContainer}
            >
                <Text style={styles.UpdateProductButtonText}>Update Product</Text>
            </Pressable>
        </View>
    </GestureHandlerRootView>
  )
}

export default UpdateProductDetails

const styles = StyleSheet.create({
    OrderHistoryScreenHeader : {
        flexDirection : "row",
        padding : SPACING.space_18,
        alignItems: 'center',
        justifyContent : 'space-between',
        backgroundColor : COLORS.primaryLightGreenHex
    },
    OrderHistoryScreenHeaderLeft : {
        flexDirection : "row",
        alignItems : "center"
    },
    OrderHistoryScreenHeaderTitle : {
        marginLeft : SPACING.space_10,
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryLightGreyHex
    },
    InputContainerButton : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
    },
    InputContainer : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        padding :SPACING.space_18,
        color : COLORS.primaryBlackHex,   
    },
    UpdateProductButtonContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_10,
        padding : SPACING.space_12,
        marginTop : SPACING.space_18,
    },
    UpdateProductButtonText : {
        textAlign : "center",
        fontSize : FONTSIZE.size_16,
        fontFamily :FONTFAMILY.poppins_medium,
        color : COLORS.primaryWhiteHex,
    }
})