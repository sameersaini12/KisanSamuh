import { Dimensions, Pressable, StyleSheet, Text, View  , Image} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import * as ImagePicker from "react-native-image-picker"
import { useSelector } from 'react-redux'
import { ToastAndroid } from 'react-native'
import LottieView from 'lottie-react-native'
import {BASE_URL} from "@env"

const ImageCardWidth = Dimensions.get("screen").width-SPACING.space_18*2

const CreateProductCategory = ({navigation} : any) => {
    const [categoryTitle , setCategoryTitle] = useState('')
    const [selectedImage , setSelectedImage ] = useState<any>(null)
    const [selectedImageURI , setSelectedImageURI] = useState('')

    const [addTitleError , setAddTitleError] = useState(false)
    const [addImageError, setAddImageError] = useState(false)

    const [uploadLoadingAnimation , setUploadLoadingAnimation] = useState(false)
    const [showDoneAnimation , setShowDoneAnimation ] = useState(false)

    const userToken = useSelector((state: any) => state.user.token)

    const backButtonHandler = () => {
        navigation.pop()
    }

    const ImageGallaryPickerHandler = useCallback(async ()=> {
        const options : any = {
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: true 
        }

        await ImagePicker.launchImageLibrary(options , async (res :any) => {
            if(res.didCancel) {
                console.log('User cancelled')
            }else if(res.errorCode) {
                console.log("Image Error: "+ res.errorMessage)
            }else {
                const response = await fetch(res.assets[0].uri)
                const blobUrl = await response.blob()
                await setSelectedImage(blobUrl)
                await setSelectedImageURI(res.assets[0].base64)
                console.log(JSON.stringify(blobUrl))
            }
        })
    } , [])

    const getPreSignedUrlToUploadImageOnAws = async () => {
        // console.log(selectedImage._data.type)
        return await fetch(`${BASE_URL}/product/get-url-for-category-image`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            },
            body : JSON.stringify({
                fileName : `${categoryTitle.toLowerCase()}`,
                contentType : selectedImage._data.type,
                folderPath : "categories/images/"
            })
        }).then((res) => res.json())
        .then(async (res) => {
            return res.data
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const uploadImageOnPresignedURL = async (url : any) => {
        // console.log(selectedImage._data.type)
        await fetch(url , {
            method : "PUT",
            headers : {
                "Content-Type" : selectedImage._data.type
            },
            body : selectedImage
        }).then((res) => {
            console.log("Image Upload Successfully")
        })
        .catch((err) => {
            console.log(" " +err)
        })
    }

    const addCategoryButtonHandler = async () => {
        if(selectedImageURI.length===0) {
            setAddImageError(true)
            ToastAndroid.show('Image is required' , ToastAndroid.SHORT)
        }else if(categoryTitle==='') {
            setAddTitleError(true)
            ToastAndroid.show('Category title is required' , ToastAndroid.SHORT)
        }
        else {
            const url = await getPreSignedUrlToUploadImageOnAws()
            await uploadImageOnPresignedURL(url)
            setUploadLoadingAnimation(true)

            await fetch(`${BASE_URL}/product/add-category`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${userToken}`
                },
                body : JSON.stringify({
                    title : categoryTitle.toLowerCase()
                })
            }).then((res) => res.json())
            .then((res) => {
                // console.log(res)
                setShowDoneAnimation(true)
                setTimeout(() => {
                    setShowDoneAnimation(false)
                }, 3000);
                setCategoryTitle('')
                setSelectedImage('')
                setSelectedImageURI('')
                setUploadLoadingAnimation(false)
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    useEffect(() => {
        if(selectedImageURI.length>0) {
            setAddImageError(false)
        }
        if(categoryTitle!=='') {
            setAddTitleError(false)
        }
    }, [selectedImageURI, categoryTitle])

  return (
    <GestureHandlerRootView>

        {uploadLoadingAnimation && (
            <View style={[styles.DoneAnimation]}>
                <LottieView
                    style={{height : 150}}
                    source={require("../components/lottie/Loading.json")}
                    autoPlay
                    loop
                />
            </View>
        )}

        {showDoneAnimation && (
            <View style={[styles.DoneAnimation]}>
                <LottieView
                    style={{height : 150}}
                    source={require("../components/lottie/Done.json")}
                    autoPlay
                    loop
                />
            </View>
        )}
        

        {/* Header  */}

        <View style={styles.StartingHeaderContainer}>
            <TouchableOpacity 
                onPress={backButtonHandler}
                style={styles.StartingHeaderBackButton}
            >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <Text style={styles.CartScreenHeaderTitle}>Create New Product Category</Text>

        </View>

        {/* Category Title  */}

        <ScrollView
            contentContainerStyle={styles.ProductInputScrollView}
            showsVerticalScrollIndicator={false}
        >
            {/* Category Image  */}

            <TouchableOpacity
                style={{marginBottom : SPACING.space_18}}
                onPress={() => {
                    ImageGallaryPickerHandler()
                }}
            >
                <View>
                    {selectedImageURI!=='' && (
                        <View>
                            <Image
                                source={{
                                    uri : `data:image/*;base64,${selectedImageURI}`,
                                    width : ImageCardWidth,
                                    height : ImageCardWidth
                                }}
                            />
                            <Pressable 
                                onPress={() => {
                                    setSelectedImageURI('')
                                }}
                                style={styles.ProductImageDeleteIconContainer}
                            >
                                <CustomIcon
                                    name='bin'
                                    size={22}
                                    color={COLORS.primaryLightGreenHex}
                                />
                            </Pressable>
                        </View>
                        
                    )}
                </View>
                <View 
                    style={[styles.ImagePickerOuterContainer , {display : selectedImageURI==='' ? 'flex' : 'none'}]}
                >
                    <Text style={styles.ImagePickerText}>Choose Cover Photo</Text>             
                </View>
            </TouchableOpacity>

            <Text style={[styles.ErrorMessageText , {display : addImageError ? "flex" : "none"}]}>* Image is required</Text>

            {/* Category Title Input  */}

            <Pressable 
                style={styles.ProductInputContainer}
            >
                <TextInput
                    multiline
                    inputMode='text'
                    style={styles.ProductInput}
                    value={categoryTitle}
                    onChangeText={setCategoryTitle}
                    placeholder='Category Title'
                >
                
                </TextInput>
            </Pressable>

            <Text style={[styles.ErrorMessageText , {display : addTitleError ? "flex" : "none" , marginTop : 0}]}>* Category Title is required</Text>

            {/* Add Category Button  */}

            <Pressable
                onPress={() => {
                    addCategoryButtonHandler()
                }}
                style={[styles.TechnicalDetailsButtonContainer , { marginBottom : SPACING.space_18}]}>
                <Text style={styles.TechnicalDetailsButtonText}>Add Category</Text>
            </Pressable>


        </ScrollView>

    </GestureHandlerRootView>
  )
}

export default CreateProductCategory

const styles = StyleSheet.create({
    DoneAnimation : {
        position : "absolute",
        top : 0,
        left : 0,
        bottom: 0,
        right : 0,
        zIndex : 1000,
        flex : 1,
        justifyContent : "center"
    },
    StartingHeaderContainer : {
        flexDirection : 'row',
        padding : SPACING.space_18,
        alignItems : "center",
        backgroundColor : COLORS.primaryLightGreenHex
    },
    StartingHeaderBackButton : {

    },
    StartingHeaderSkipButton : {

    },
    StartingHeaderSkipButtonText : {
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryWhiteHex
    }, 
    ImagePickerOuterContainer : {
        width : ImageCardWidth,
        height : ImageCardWidth,
        borderWidth : 1.5,
        borderStyle : "dashed",
        borderColor : COLORS.primaryBlackHex,
        alignItems : "center",
        justifyContent : "center"
    },
    ImagePickerText : {
        fontSize : FONTSIZE.size_16,
    },
    ErrorMessageText : {
        fontSize : FONTSIZE.size_14,
        color : "#ff3333",
        marginTop : -SPACING.space_12,
        marginBottom : SPACING.space_12
    },
    CartScreenHeaderTitle : {
        marginLeft : SPACING.space_10*2,
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryWhiteHex,
    },
    ProductInputScrollView: {
        padding: SPACING.space_18,
    },
    ProductImageDeleteIconContainer : {
        position : 'absolute',
        top : 10,
        right : 10,
        borderWidth : 2,
        borderRadius : BORDERRADIUS.radius_10*3,
        padding : SPACING.space_10*0.8,
        borderColor : COLORS.primaryLightGreenHex,
    },
    ProductInputHeading : {
        fontSize : FONTSIZE.size_16*1.1,
        marginTop : SPACING.space_18,
        marginLeft : 0,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryBlackHex,
    },
    ProductInput : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        padding :SPACING.space_18,
        color : COLORS.primaryBlackHex,
    },
    ProductInputContainer : {
        backgroundColor : COLORS.primaryLightestGreyHex,
        borderRadius : BORDERRADIUS.radius_10,
        flex : 1,
    },
    TechnicalDetailsButtonContainer : {
        backgroundColor : COLORS.primaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_10,
        padding : SPACING.space_18,
        marginTop : SPACING.space_18,
    },
    TechnicalDetailsButtonText : {
        color : COLORS.primaryWhiteHex,
        textAlign : "center",
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
    }
})