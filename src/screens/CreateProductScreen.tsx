import { Dimensions, Pressable,Image, StyleSheet, Text, View, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import * as ImagePicker from "react-native-image-picker"
import { ColorProperties } from 'react-native-reanimated/lib/typescript/reanimated2/Colors'
import { useSelector } from 'react-redux'
import LottieView from 'lottie-react-native'
import {BASE_URL} from "@env"
import { useTranslation } from 'react-i18next'

const ImageCardWidth = Dimensions.get("screen").width-SPACING.space_18*2
const screenWidth = Dimensions.get("screen").width-SPACING.space_18*2

const CreateProductScreen = ({ navigation} : any) => {
    const {t} = useTranslation()

    const [productName , setProductName ] = useState('')
    const [brandName , setBrandName ] = useState('')
    const [currentAboutProudct , setCurrentAboutProduct] = useState('')
    const [aboutProduct , setAboutProduct] = useState<Array<string>>([])
    const [currentTechnicalDetailHeading , setCurrentTechnicalDetailHeading] = useState('')
    const [currentTechnicalDetailData , setCurrentTechnicalDetailData] = useState('')
    const [productTechnicalDetails, setProudctTechnicalDetails ] = useState<any>([{}])
    const [currentProductFeatures, setCurrentProductFeatures ] = useState('')
    const [productFeatures , setProductFeatures ]= useState<Array<string>>([])
    const [currentHowToUseHeading , setCurrentHowToUseHeading ] = useState('')
    const [currentHowToUseData , setCurrentHowToUseData] = useState('')
    const [productHowToUse , setProductHowToUse ] = useState<any>([{}])
    const [currentProductAdditionalFeature , setCurrentProductAdditionalFeature] = useState('')
    const [productAdditionalFeatures , setProductAdditionalFeatures] = useState<Array<string>>([])
    const [currentCategory , setCurrentCategory] = useState('')
    const [categories, setCategories ]= useState<Array<string>>([])
    const [currentProductSize, setCurrentProductSize] = useState('')
    const [currentProductPrice , setCurrentProductPrice] = useState('')
    const [productPrice, setProductPrice ] = useState<any>([])
    const [discount , setDiscount ] = useState('')
    const [reward, setReward] = useState('')
    const [currentImageIndex , setCurrentImageIndex] = useState(0)
    const [selectedImages , setSelectedImages] = useState<Array<any>>([])
    const [imagesBlob , setImagaeBlob] = useState<Array<any>>([])

    const [imageError , setImageError ] = useState(false)
    const [productNameError , setProductNameError] = useState(false)
    const [brandNameError, setBrandNameError] = useState(false)
    const [priceError , setPriceError] = useState(false)
    const [technicalHeadingError , setTechnicalHeadingError] = useState(false)
    const [howToUseError , setHowToUseError ] = useState(false)
    const [sizePriceError , setSizePriceError] = useState(false)
    const [addAboutProductError , setAddAboutProductError] = useState(false)
    const [addProductFeatureError , setAddProductFeatureError] = useState(false)
    const [addAdditionalInformationError , setAddAdditionalInformationError] = useState(false)
    const [addCategoryError , setAddCategoryError] = useState(false)

    const [uploadLoadingAnimation , setUploadLoadingAnimation] = useState(false)
    const [showDoneAnimation , setShowDoneAnimation ] = useState(false)

    const userToken = useSelector((state : any) => state.user.token)



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
                await setSelectedImages(prevSelectedImages => [...prevSelectedImages , res.assets[0].base64])
                const response = await fetch(res.assets[0].uri);
                const blobUrl = await response.blob();
                await setImagaeBlob(prevImagesBlob => [...prevImagesBlob , blobUrl])
            }
        })
    } , [])

    const getPreSignedUrlToUploadImageOnAws = async (imageName: any , imageNumber : any) => {
        return await fetch(`${BASE_URL}/product/get-url-for-category-image`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${userToken}`
            },
            body : JSON.stringify({
                fileName : `${imageName.toLowerCase()}`,
                contentType : imagesBlob[imageNumber-1]._data.type,
                folderPath : `product_images/${productName}/`
            })
        }).then((res) => res.json())
        .then(async (res) => {
            return res.data
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const uploadImageOnPresignedURL = async (url : any , image  : any ) => {
        console.log(url)
        console.log(image._data.type)
        let imageUploaded : boolean = true
        await fetch(url , {
            method : "PUT",
            headers : {
                "Content-Type" : image._data.type
            },
            body : image
        }).then(async (res) => {
            console.log("Image uploaded")
            imageUploaded = true
        })
        .catch((err) => {
            console.log("Error"+err)
            imageUploaded = false
        })
        return imageUploaded
    }

    const scrollImageHandler = (event :any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x
        
        const currentImageIndex = scrollPosition / screenWidth
        setCurrentImageIndex(Math.round(currentImageIndex))
    }

    const addProductButtonHandler = async () => {
        if(selectedImages.length===0) {
            setImageError(true)
            ToastAndroid.show(t('Image field is necessary') , ToastAndroid.SHORT)
        }else if(productName==='') {
            setProductNameError(true)
            ToastAndroid.show(t('Product name field is necessary') , ToastAndroid.SHORT)
        }else if(brandName==='') {
            setBrandNameError(true)
            ToastAndroid.show(t('Brand name field is necessary') , ToastAndroid.SHORT)
        }else if(productPrice.length===0) {
            setPriceError(true)
            ToastAndroid.show(t('Price field is necessary') , ToastAndroid.SHORT)
        }
        else{
            setUploadLoadingAnimation(true)
            var isImagesUploaded : boolean = true
            for(let i=1;i<=imagesBlob.length;i++) {
                const url = await getPreSignedUrlToUploadImageOnAws(`image_${i}` , i )
                // console.log(imagesBlob[i-1])
                let imageUploaded  = await uploadImageOnPresignedURL(url , imagesBlob[i-1])
                // console.log(imageUploaded)
                isImagesUploaded = isImagesUploaded && imageUploaded
                // console.log(isImagesUploaded)
            }

            if(!isImagesUploaded) {
                ToastAndroid.show(t("Error while uploading image"),ToastAndroid.SHORT)
                setUploadLoadingAnimation(false)
            }else {
                await fetch(`${BASE_URL}/product/create-product`, {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                        Authorization : `Bearer ${userToken}`
                    },
                    body : JSON.stringify({
                        title : productName,
                        brand : brandName,
                        about : aboutProduct,
                        technicalDetails : productTechnicalDetails,
                        features : productFeatures,
                        howToUse : productHowToUse,
                        additionalInformation : productAdditionalFeatures,
                        categories : categories,
                        price : productPrice,
                        discount : discount,
                        numberOfImages : imagesBlob.length,
                        reward : Number(reward)
                    })
                }).then((res) => res.json())
                .then((res) => {
                    console.log(res)
                    setShowDoneAnimation(true)
                    setTimeout(() => {
                        setShowDoneAnimation(false)
                    }, 2000);
                    setUploadLoadingAnimation(false)
                    // setProductName('')
                    // setBrandName('')
                    // setCurrentAboutProduct('')
                    // setAboutProduct([])
                    // setCurrentTechnicalDetailHeading('')
                    // setCurrentTechnicalDetailData('')
                    // setProudctTechnicalDetails([{}])
                    // setCurrentProductFeatures('')
                    // setProductFeatures([])
                    // setCurrentHowToUseData('')
                    // setCurrentHowToUseHeading('')
                    // setProductHowToUse([{}])
                    // setCurrentProductAdditionalFeature('')
                    // setProductAdditionalFeatures([])
                    // setCurrentCategory('')
                    // setCategories([])
                    // setCurrentProductSize('')
                    // setCurrentProductPrice('')
                    // setProductPrice([])
                    // setDiscount('')
                    // setReward('')
                    // setSelectedImages([])
                    // setImagaeBlob([])
                    // setCurrentImageIndex(0)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        }
    }

    useEffect(() => {
        if(selectedImages.length>0) {
            setImageError(false)
        }
        if(brandName!=='') {
            setBrandNameError(false)
        }
        if(productName!=='') {
            setProductNameError(false)
        }
        if(productPrice.length>0) {
            setPriceError(false)
        }
        if(currentTechnicalDetailData!=='' && currentTechnicalDetailHeading!=='') {
            setTechnicalHeadingError(false)
        }
        if(currentHowToUseData!=='' && currentHowToUseHeading!=='') {
            setHowToUseError(false)
        }
        if(currentProductPrice!=='' && currentProductSize!=='') {
            setSizePriceError(false)
        }
        if(currentAboutProudct!=='') {
            setAddAboutProductError(false)
        }
        if(currentProductFeatures!=='') {
            setAddProductFeatureError(false)
        }
        if(currentProductAdditionalFeature!=='') {
            setAddAdditionalInformationError(false)
        }
        if(currentCategory!=='') {
            setAddCategoryError(false)
        }
    }, [
        selectedImages, 
        brandName, 
        productName , 
        productPrice , 
        currentTechnicalDetailData , 
        currentTechnicalDetailHeading , 
        currentHowToUseData , 
        currentHowToUseHeading , 
        currentProductPrice , 
        currentProductSize,
        currentAboutProudct,
        currentProductFeatures, 
        currentProductAdditionalFeature,
        currentCategory,
    ])


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
            {/* <Pressable 
                onPress={() => {
                    saveProfileInfoHandler()
                }}
                style={styles.StartingHeaderSkipButton}
            >
                <Text style={styles.StartingHeaderSkipButtonText}>Done</Text>
            </Pressable> */}
            <Text style={styles.CartScreenHeaderTitle}>{t('Create New Product')}</Text>

        </View>



        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.ProductInputScrollView}
        >
            
            {/* Product Images */}

            
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                onScroll={scrollImageHandler}
            >
                <TouchableOpacity
                    style={{marginBottom : SPACING.space_18}}
                    onPress={() => {
                        ImageGallaryPickerHandler()
                    }}
                >
                    <View 
                        style={[styles.ImagePickerOuterContainer ]}
                    >
                        <Text style={styles.ImagePickerText}>{t('Choose Product Photo')}</Text>             
                    </View>
                </TouchableOpacity>

                {selectedImages.map((image : any, index : any) => {
                    return (
                        <View key={index}>
                            <Image
                                source={{
                                    uri : `data:image/*;base64,${image}`,
                                    width : ImageCardWidth,
                                    height : ImageCardWidth
                                }}
                            />
                            <Pressable 
                                onPress={() => {
                                    const updatedList = [...selectedImages.slice(0, index), ...selectedImages.slice(index+1)]
                                    setSelectedImages(updatedList)
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
                    )
                }) }
            </ScrollView>

            {/* Scroll Indicator  */}
            
            <View style={styles.ImagesScrollIndicatorContainer}>
                <View
                    style={[styles.ImagesScrollIndicator, {backgroundColor : currentImageIndex == 0 ? COLORS.primaryLightGreenHex : COLORS.secondaryLightGreyHex, display : selectedImages.length>0 ? "flex" : "none"}]}
                >
                </View>
                {selectedImages.map((image : any, index : any) => {
                    return (
                        <View
                            style={[styles.ImagesScrollIndicator, {backgroundColor : (currentImageIndex == (index+1)) ? COLORS.primaryLightGreenHex : COLORS.secondaryLightGreyHex}]}
                            key={index}>
                        </View>
                    )
                }) }
            </View>

            <Text style={[styles.ErrorMessageText , {display : imageError ? "flex" : "none"}]}>* {t('Image field is necessary')}</Text>
            

            {/* Product Name  */}

            <View>
                <Text style={styles.ProductInputHeading}>{t('Product Name')}*</Text>

                <Pressable 
                    style={styles.ProductInputContainer}
                >
                    <TextInput
                        multiline
                        inputMode='text'
                        style={styles.ProductInput}
                        value={productName}
                        onChangeText={setProductName}
                        placeholder={t('Product Name')}
                    >
                    
                    </TextInput>
                </Pressable>   
            </View>
            <Text style={[styles.ErrorMessageText , {display : productNameError ? "flex" : "none" , marginTop : 0}]}>* {t('Product name field is necessary')}</Text>

            {/* Brand Name  */}

            <View>
                <Text style={styles.ProductInputHeading}>{t('Brand Name')}*</Text>

                <Pressable 
                    style={styles.ProductInputContainer}
                >
                    <TextInput
                        multiline
                        inputMode='text'
                        style={styles.ProductInput}
                        value={brandName}
                        onChangeText={setBrandName}
                        placeholder={t('Brand Name')}
                    >
                    
                    </TextInput>
                </Pressable>
            </View>
            <Text style={[styles.ErrorMessageText , {display : brandNameError ? "flex" : "none" , marginTop : 0}]}>* {t('Brand name field is necessary')}</Text>

            {/* About Product  */}

            <View>
                <Text style={styles.ProductInputHeading}>{t('About Product')}</Text>

                {aboutProduct.length > 0 && (
                    <View style={styles.AboutProductLines}>
                        {aboutProduct.map((line :any , index : any) => {
                            console.log(index)
                            return (
                                <View style={styles.AboutAddedLineContainer} key={index}>
                                    <Text style={styles.AboutAddedLineText}>{`\u25CF ${line}`} {" "}
                                        <View style={{flexDirection : "row" , alignItems : "center" , justifyContent: 'center',}}>
                                            <TouchableOpacity
                                                style={{marginLeft : SPACING.space_10*0.5}}
                                                onPress={() => {
                                                    setCurrentAboutProduct(line)
                                                    const updatedList = [...aboutProduct.slice(0, index), ...aboutProduct.slice(index+1)]
                                                    setAboutProduct(updatedList)
                                                }}
                                            >
                                                <CustomIcon
                                                    name='pencil'
                                                    color={COLORS.primaryLightGreenHex}
                                                    size={17}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{marginLeft : SPACING.space_10*1.5}}
                                                onPress={() => {
                                                    const updatedList = [...aboutProduct.slice(0, index), ...aboutProduct.slice(index+1)]
                                                    setAboutProduct(updatedList)
                                                }}  
                                            >
                                                <Text style={styles.AboutAddedLineDelete}>
                                                    <CustomIcon
                                                        name='bin'
                                                        size={18}
                                                    />
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                    </Text>
                                    
                                </View>
                            )
                        })}
                    </View>
                )}
                

                    <View style={styles.AboutProductLineContainer}>
                        <Pressable 
                            style={[styles.ProductInputContainer , {}]}
                        >
                            <TextInput
                                multiline
                                inputMode='text'
                                style={[styles.ProductInput , {paddingRight : SPACING.space_18*3.1,}]}
                                value={currentAboutProudct}
                                onChangeText={setCurrentAboutProduct}
                                placeholder={t('Add line') + ` ${aboutProduct.length+1}`}
                            >
                            
                            </TextInput>
                        </Pressable>
                        <Pressable
                            style={styles.AddLineInInputContainer}
                            onPress={() => {
                                if(currentAboutProudct==='') {
                                    setAddAboutProductError(true)
                                    ToastAndroid.show('Empty field not added', ToastAndroid.SHORT)
                                }else {
                                    setAboutProduct([...aboutProduct , currentAboutProudct])
                                    setCurrentAboutProduct('')
                                }
                                
                            }}
                        >
                            <Text 
                                style={styles.AddLineInInputText}
                            >
                                <CustomIcon
                                    name='add-solid'
                                    size={35}
                                />
                            </Text>
                        </Pressable>

                        
                    </View>
                    <Text style={[styles.ErrorMessageText , {display : addAboutProductError ? "flex" : "none" , marginTop : 0}]}>* Empty field</Text>
            </View>


            {/* Technical Details */}

            <View>
                <Text style={styles.ProductInputHeading}>{t("Technical Details")}</Text>

                {productTechnicalDetails[0] === undefined ?
                <View>hii</View> :
                (
                Object.keys(productTechnicalDetails[0]).map((key, index)=>(
                    <View key={index} style={styles.AboutAddedLineContainer}>
                        <Text style={styles.AboutAddedLineText}>
                            {`\u25CF`} {""}
                            <Text style={[styles.AboutAddedLineText , {fontFamily : FONTFAMILY.poppins_semibold}]}>{key} : </Text> 
                                <Text>
                                    {productTechnicalDetails[0][key]}
                                </Text>

                                <View style={{flexDirection : "row" , alignItems : "center" , justifyContent: 'center', marginLeft : SPACING.space_10}}>
                                <TouchableOpacity
                                    style={{marginLeft : SPACING.space_10*0.5}}
                                    onPress={async () => {
                                        setCurrentTechnicalDetailHeading(key)
                                        setCurrentTechnicalDetailData(productTechnicalDetails[0][key])
                                        let updatedDetailsList = productTechnicalDetails
                                        await delete updatedDetailsList[0][key]
                                        setProudctTechnicalDetails(updatedDetailsList)
                                    }}
                                >
                                    <CustomIcon
                                        name='pencil'
                                        color={COLORS.primaryLightGreenHex}
                                        size={17}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{marginLeft : SPACING.space_10*1.5}}
                                    onPress={async () => {
                                        let updatedDetailsList = productTechnicalDetails
                                        await delete updatedDetailsList[0][key]
                                        setProudctTechnicalDetails([...updatedDetailsList])
                                    }}  
                                >
                                    <Text style={styles.AboutAddedLineDelete}>
                                        <CustomIcon
                                            name='bin'
                                            size={18}
                                        />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Text>
                        
                    </View>
                ))
                )}

                <Pressable 
                    style={[styles.ProductInputContainer , {marginTop : SPACING.space_15}]}
                >
                    <TextInput
                        multiline
                        inputMode='text'
                        style={styles.ProductInput}
                        value={currentTechnicalDetailHeading}
                        onChangeText={setCurrentTechnicalDetailHeading}
                        placeholder={t('Heading')+` ${Object.keys(productTechnicalDetails[0]).length+1}`}
                    >
                    </TextInput>
                </Pressable>

                <Pressable 
                    style={[styles.ProductInputContainer , {marginTop : SPACING.space_18}]}
                >
                    <TextInput
                        multiline
                        inputMode='text'
                        style={[styles.ProductInput]}
                        value={currentTechnicalDetailData}
                        onChangeText={setCurrentTechnicalDetailData}
                        placeholder='Details'
                    >
                    </TextInput>
                </Pressable>

                <Text style={[styles.ErrorMessageText , {display : technicalHeadingError ? "flex" : "none" , marginTop : 0}]}>* Both fields are required</Text>

                
                <Pressable
                    onPress={() => {
                        if(currentTechnicalDetailData==='' || currentTechnicalDetailHeading==='') {
                            setTechnicalHeadingError(true)
                            ToastAndroid.show(t('Both fields are require') , ToastAndroid.SHORT)
                        }else{
                            let previousDetails : any = productTechnicalDetails
                            previousDetails[0][currentTechnicalDetailHeading]= currentTechnicalDetailData
                            setProudctTechnicalDetails(previousDetails)
                            console.log(previousDetails[0][currentTechnicalDetailHeading])
                            setCurrentTechnicalDetailHeading('')
                            setCurrentTechnicalDetailData('')
                        }
                        
                    }}
                    style={styles.TechnicalDetailsButtonContainer}
                >
                    <Text style={styles.TechnicalDetailsButtonText}>Add Details</Text>
                </Pressable>
                
            </View>

            {/* Product Features */}

            <View>
                <Text style={styles.ProductInputHeading}>Product Features</Text>

                {productFeatures.length > 0 && (
                    <View style={styles.AboutProductLines}>
                        {productFeatures.map((line :any , index : any) => {
                            return (
                                <View style={styles.AboutAddedLineContainer} key={index}>
                                    <Text style={styles.AboutAddedLineText}>{`\u25CF ${line}`} {" "}
                                        <View style={{flexDirection : "row" , alignItems : "center" , justifyContent: 'center',}}>
                                            <TouchableOpacity
                                                style={{marginLeft : SPACING.space_10*0.5}}
                                                onPress={() => {
                                                    setCurrentProductFeatures(line)
                                                    const updatedList = [...productFeatures.slice(0, index), ...productFeatures.slice(index+1)]
                                                    setProductFeatures(updatedList)
                                                }}
                                            >
                                                <CustomIcon
                                                    name='pencil'
                                                    color={COLORS.primaryLightGreenHex}
                                                    size={17}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{marginLeft : SPACING.space_10*1.5}}
                                                onPress={() => {
                                                    const updatedList = [...productFeatures.slice(0, index), ...productFeatures.slice(index+1)]
                                                    setProductFeatures(updatedList)
                                                }}  
                                            >
                                                <Text style={styles.AboutAddedLineDelete}>
                                                    <CustomIcon
                                                        name='bin'
                                                        size={18}
                                                    />
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                    </Text>
                                    
                                </View>
                            )
                        })}
                    </View>
                )}
                

                    <View style={styles.AboutProductLineContainer}>
                        <Pressable 
                            style={[styles.ProductInputContainer , ]}
                        >
                            <TextInput
                                multiline
                                style={[styles.ProductInput , {paddingRight : SPACING.space_18*3.1,}]}
                                value={currentProductFeatures}
                                onChangeText={setCurrentProductFeatures}
                                placeholder={`Add Feature ${productFeatures.length+1}`}
                            >
                            
                            </TextInput>
                        </Pressable>
                        <Pressable
                            style={styles.AddLineInInputContainer}
                            onPress={() => {
                                if(currentProductFeatures===''){
                                    setAddProductFeatureError(true)
                                    ToastAndroid.show('Empty field not added', ToastAndroid.SHORT)
                                }else {
                                    setProductFeatures([...productFeatures , currentProductFeatures])
                                    setCurrentProductFeatures('')
                                }
                            }}
                        >
                            <Text 
                                style={styles.AddLineInInputText}
                            >
                                <CustomIcon
                                    name='add-solid'
                                    size={35}
                                />
                            </Text>
                        </Pressable>
                    </View>
                    <Text style={[styles.ErrorMessageText , {display : addProductFeatureError ? "flex" : "none" , marginTop : 0}]}>* Empty field</Text>
            </View>

            {/* How to Use  */}

            <View>
                <Text style={styles.ProductInputHeading}>How to Use</Text>

                {productHowToUse[0] === undefined ?
                <View>hii</View> :
                (
                Object.keys(productHowToUse[0]).map((key, index)=>(
                    <View key={index} style={styles.AboutAddedLineContainer}>
                        <Text style={styles.AboutAddedLineText}>
                            {`\u25CF`} {""}
                            <Text style={[styles.AboutAddedLineText , {fontFamily : FONTFAMILY.poppins_semibold}]}>{key} : </Text> 
                                <Text>
                                    {productHowToUse[0][key]}
                                </Text>

                                <View style={{flexDirection : "row" , alignItems : "center" , justifyContent: 'center', marginLeft : SPACING.space_10}}>
                                <TouchableOpacity
                                    style={{marginLeft : SPACING.space_10*0.5}}
                                    onPress={async () => {
                                        setCurrentHowToUseHeading(key)
                                        setCurrentHowToUseData(productHowToUse[0][key])
                                        let updatedDetailsList = productHowToUse
                                        await delete updatedDetailsList[0][key]
                                        setProductHowToUse(updatedDetailsList)
                                    }}
                                >
                                    <CustomIcon
                                        name='pencil'
                                        color={COLORS.primaryLightGreenHex}
                                        size={17}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{marginLeft : SPACING.space_10*1.5}}
                                    onPress={async () => {
                                        let updatedDetailsList = productHowToUse
                                        await delete updatedDetailsList[0][key]
                                        setProductHowToUse([...updatedDetailsList])
                                    }}  
                                >
                                    <Text style={styles.AboutAddedLineDelete}>
                                        <CustomIcon
                                            name='bin'
                                            size={18}
                                        />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Text>
                        
                    </View>
                ))
                )}

                <Pressable 
                    style={[styles.ProductInputContainer , {marginTop : SPACING.space_15}]}
                >
                    <TextInput
                        multiline
                        inputMode='text'
                        style={styles.ProductInput}
                        value={currentHowToUseHeading}
                        onChangeText={setCurrentHowToUseHeading}
                        placeholder={`Heading ${Object.keys(productHowToUse[0]).length+1}`}
                    >
                    </TextInput>
                </Pressable>

                <Pressable 
                    style={[styles.ProductInputContainer , {marginTop : SPACING.space_18}]}
                >
                    <TextInput
                        multiline
                        inputMode='text'
                        style={[styles.ProductInput]}
                        value={currentHowToUseData}
                        onChangeText={setCurrentHowToUseData}
                        placeholder='Details'
                    >
                    </TextInput>
                </Pressable>

                <Text style={[styles.ErrorMessageText , {display : howToUseError ? "flex" : "none" , marginTop : 0}]}>* Both fields are required</Text>
                
                <Pressable
                    onPress={() => {
                        if(currentHowToUseData==='' || currentHowToUseHeading==='') {
                            setHowToUseError(true)
                            ToastAndroid.show('Both fields are required',ToastAndroid.SHORT)
                        }else{
                            let previousDetails : any = productHowToUse
                            previousDetails[0][currentHowToUseData]= currentHowToUseData
                            setProductHowToUse(previousDetails)
                            setCurrentHowToUseHeading('')
                            setCurrentHowToUseData('')
                        }
                        
                    }}
                    style={styles.TechnicalDetailsButtonContainer}
                >
                    <Text style={styles.TechnicalDetailsButtonText}>Add Details</Text>
                </Pressable>
                
            </View>

            {/* Additional Information  */}

            <View>
                <Text style={styles.ProductInputHeading}>Additional Information</Text>

                {productAdditionalFeatures.length > 0 && (
                    <View style={styles.AboutProductLines}>
                        {productAdditionalFeatures.map((line :any , index : any) => {
                            return (
                                <View style={styles.AboutAddedLineContainer} key={index}>
                                    <Text style={styles.AboutAddedLineText}>{`\u25CF ${line}`} {" "}
                                        <View style={{flexDirection : "row" , alignItems : "center" , justifyContent: 'center',}}>
                                            <TouchableOpacity
                                                style={{marginLeft : SPACING.space_10*0.5}}
                                                onPress={() => {
                                                    setCurrentProductAdditionalFeature(line)
                                                    const updatedList = [...productAdditionalFeatures.slice(0, index), ...productAdditionalFeatures.slice(index+1)]
                                                    setProductAdditionalFeatures(updatedList)
                                                }}
                                            >
                                                <CustomIcon
                                                    name='pencil'
                                                    color={COLORS.primaryLightGreenHex}
                                                    size={17}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{marginLeft : SPACING.space_10*1.5}}
                                                onPress={() => {
                                                    const updatedList = [...productAdditionalFeatures.slice(0, index), ...productAdditionalFeatures.slice(index+1)]
                                                    setProductAdditionalFeatures(updatedList)
                                                }}  
                                            >
                                                <Text style={styles.AboutAddedLineDelete}>
                                                    <CustomIcon
                                                        name='bin'
                                                        size={18}
                                                    />
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                    </Text>
                                    
                                </View>
                            )
                        })}
                    </View>
                )}
                

                    <View style={styles.AboutProductLineContainer}>
                        <Pressable 
                            style={[styles.ProductInputContainer]}
                        >
                            <TextInput
                                multiline
                                inputMode='text'
                                style={[styles.ProductInput , {paddingRight : SPACING.space_18*3.1,}]}
                                value={currentProductAdditionalFeature}
                                onChangeText={setCurrentProductAdditionalFeature}
                                placeholder={`Add Feature ${currentProductAdditionalFeature.length+1}`}
                            >
                            
                            </TextInput>
                        </Pressable>
                        <Pressable
                            style={styles.AddLineInInputContainer}
                            onPress={() => {
                                if(currentProductAdditionalFeature==='') {
                                    setAddAdditionalInformationError(true)
                                    ToastAndroid.show('Empty field not added', ToastAndroid.SHORT)
                                }else {
                                    setProductAdditionalFeatures([...productAdditionalFeatures , currentProductAdditionalFeature])
                                    setCurrentProductAdditionalFeature('')
                                }
                            }}
                        >
                            <Text 
                                style={styles.AddLineInInputText}
                            >
                                <CustomIcon
                                    name='add-solid'
                                    size={35}
                                />
                            </Text>
                        </Pressable>
                    </View>
                    <Text style={[styles.ErrorMessageText , {display : addAdditionalInformationError ? "flex" : "none" , marginTop : 0}]}>* Empty field</Text>
            </View>

            {/* Categories  */}

            <View>
                <Text style={styles.ProductInputHeading}>Add Category</Text>

                {categories.length > 0 && (
                    <View style={styles.AboutProductLines}>
                        {categories.map((line :any , index : any) => {
                            return (
                                <View style={styles.AboutAddedLineContainer} key={index}>
                                    <Text style={styles.AboutAddedLineText}>{`\u25CF ${line}`} {" "}
                                        <View style={{flexDirection : "row" , alignItems : "center" , justifyContent: 'center',}}>
                                            <TouchableOpacity
                                                style={{marginLeft : SPACING.space_10*0.5}}
                                                onPress={() => {
                                                    setCurrentCategory(line)
                                                    const updatedList = [...categories.slice(0, index), ...categories.slice(index+1)]
                                                    setCategories(updatedList)
                                                }}
                                            >
                                                <CustomIcon
                                                    name='pencil'
                                                    color={COLORS.primaryLightGreenHex}
                                                    size={17}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{marginLeft : SPACING.space_10*1.5}}
                                                onPress={() => {
                                                    const updatedList = [...categories.slice(0, index), ...categories.slice(index+1)]
                                                    setCategories(updatedList)
                                                }}  
                                            >
                                                <Text style={styles.AboutAddedLineDelete}>
                                                    <CustomIcon
                                                        name='bin'
                                                        size={18}
                                                    />
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                    </Text>
                                    
                                </View>
                            )
                        })}
                    </View>
                )}
                

                    <View style={styles.AboutProductLineContainer}>
                        <Pressable 
                            style={[styles.ProductInputContainer ]}
                        >
                            <TextInput
                                multiline
                                inputMode='text'
                                style={[styles.ProductInput , {paddingRight : SPACING.space_18*3.1}]}
                                value={currentCategory}
                                onChangeText={setCurrentCategory}
                                placeholder={`Add Feature ${currentProductAdditionalFeature.length+1}`}
                            >
                            
                            </TextInput>
                        </Pressable>
                        <Pressable
                            style={styles.AddLineInInputContainer}
                            onPress={() => {
                                if(currentCategory==='') {
                                    setAddCategoryError(true)
                                    ToastAndroid.show('Empty field not added', ToastAndroid.SHORT)
                                }else {
                                    setCategories([...categories , currentCategory])
                                    setCurrentCategory('')
                                }
                            }}
                        >
                            <Text 
                                style={styles.AddLineInInputText}
                            >
                                <CustomIcon
                                    name='add-solid'
                                    size={35}
                                />
                            </Text>
                        </Pressable>
                    </View>
                    <Text style={[styles.ErrorMessageText , {display : addCategoryError ? "flex" : "none" , marginTop : 0}]}>* Empty field</Text>
            </View>
            
            {/* price  */}

            <View>
                <Text style={styles.ProductInputHeading}>Price Details*</Text>

                {productPrice.lenght<=0 ?
                <View></View> :
                (
                productPrice.map((item : any, Parentindex: any) => {
                    return (
                        <View style={{flexDirection : "row"}} key={Parentindex}>
                            <Text style={{marginTop : SPACING.space_10}}>{`\u25CF`} {""}</Text>
                            <View style={{alignItems : "flex-start"}}>
                                {Object.keys(item).map((key, index)=>(
                                    <View key={index} style={[styles.AboutAddedLineContainer , {flexDirection : "column"}]}>
                                        
                                        <Text style={[styles.AboutAddedLineText , {flexDirection : "column" }]}>
                                            
                                                <Text style={[styles.AboutAddedLineText , {fontFamily : FONTFAMILY.poppins_semibold}]}>
                                                    {key} : 
                                                </Text> 
                                                <Text>
                                                    {item[key]}
                                                </Text>
                
                                                <View style={{flexDirection : "row" , alignItems : "center" , justifyContent: 'center', marginLeft : SPACING.space_10}}>
                                                <TouchableOpacity
                                                    style={{marginLeft : SPACING.space_10*0.5}}
                                                    onPress={async () => {
                                                        setCurrentProductSize(key)
                                                        setCurrentProductPrice(item[key])
                                                        let updatedDetailsList = [...productPrice.slice(0, Parentindex), ...productPrice.slice(Parentindex+1)]
                                                        setProductPrice(updatedDetailsList)
                                                    }}
                                                >
                                                    <CustomIcon
                                                        name='pencil'
                                                        color={COLORS.primaryLightGreenHex}
                                                        size={17}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{marginLeft : SPACING.space_10*1.5}}
                                                    onPress={async () => {
                                                        let updatedDetailsList = [...productPrice.slice(0, Parentindex), ...productPrice.slice(Parentindex+1)]
                                                        setProductPrice(updatedDetailsList)
                                                    }}  
                                                >
                                                    <Text style={styles.AboutAddedLineDelete}>
                                                        <CustomIcon
                                                            name='bin'
                                                            size={18}
                                                        />
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Text>
                                        
                                    </View>
                                ))}
                            </View>
                        </View>
                    )
                })
                
                )}

                <Pressable 
                    style={[styles.ProductInputContainer , {marginTop : SPACING.space_15}]}
                >
                    <TextInput
                        multiline
                        inputMode='text'
                        style={styles.ProductInput}
                        value={currentProductSize}
                        onChangeText={setCurrentProductSize}
                        placeholder={`Size`}
                    >
                    </TextInput>
                </Pressable>

                <Pressable 
                    style={[styles.ProductInputContainer , {marginTop : SPACING.space_18}]}
                >
                    <TextInput
                        multiline
                        inputMode='numeric'
                        keyboardType="numeric"
                        style={[styles.ProductInput]}
                        value={currentProductPrice}
                        onChangeText={setCurrentProductPrice}
                        placeholder='Price'
                    >
                    </TextInput>
                </Pressable>

                <Text style={[styles.ErrorMessageText , {display : priceError ? "flex" : "none" , marginTop : 0}]}>* Price Detail is necessary</Text>
                <Text style={[styles.ErrorMessageText , {display : sizePriceError ? "flex" : "none" , marginTop : 0}]}>* Both fields are required</Text>
                
                <Pressable
                    onPress={() => {
                        if(currentProductSize==='' || currentProductPrice==='') {
                            setSizePriceError(true)
                            ToastAndroid.show('Both Fields are required' , ToastAndroid.SHORT)
                        }else {
                            let previousDetails : any = productPrice
                            setProductPrice([...previousDetails , {
                                size : currentProductSize,
                                price : currentProductPrice
                            }])
                            console.log(JSON.stringify(productPrice))
                            setCurrentProductSize('')
                            setCurrentProductPrice('')
                        }
                        
                    }}
                    style={styles.TechnicalDetailsButtonContainer}
                >
                    <Text style={styles.TechnicalDetailsButtonText}>Add Size Details</Text>
                </Pressable>
                
            </View>

            

            {/* discount  */}

            <View>
                <Text style={styles.ProductInputHeading}>Discount</Text>

                <Pressable 
                    style={styles.ProductInputContainer}
                >
                    <TextInput
                        multiline
                        inputMode='numeric'
                        style={styles.ProductInput}
                        value={discount}
                        onChangeText={setDiscount}
                        placeholder='Discount in Percentage'
                    >
                    
                    </TextInput>
                </Pressable>
            </View>

            {/* Reward  */}

            <View>
                <Text style={styles.ProductInputHeading}>Reward Coins</Text>

                <Pressable 
                    style={styles.ProductInputContainer}
                >
                    <TextInput
                        multiline
                        inputMode='numeric'
                        style={styles.ProductInput}
                        value={reward}
                        onChangeText={setReward}
                        placeholder='Reward Coins'
                    >
                    
                    </TextInput>
                </Pressable>
            </View>

            {/* Button  */}

            <TouchableOpacity 
                onPress={() => {
                    addProductButtonHandler()
                }}
                style={[styles.TechnicalDetailsButtonContainer , { marginBottom : SPACING.space_18*2}]}
            >
                <Text style={styles.TechnicalDetailsButtonText}>Add Product</Text>
            </TouchableOpacity>



            
        </ScrollView>

    </GestureHandlerRootView>
  )
}

export default CreateProductScreen

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
    CartScreenHeaderTitle : {
        marginLeft : SPACING.space_10*2,
        fontSize : FONTSIZE.size_18,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryWhiteHex,
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
    ProductImageDeleteIconContainer : {
        position : 'absolute',
        top : 10,
        right : 10,
        borderWidth : 2,
        borderRadius : BORDERRADIUS.radius_10*3,
        padding : SPACING.space_10*0.8,
        borderColor : COLORS.primaryLightGreenHex,
    },
    ImagesScrollIndicatorContainer : {
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "center"
    },
    ImagesScrollIndicator : {
        width : SPACING.space_10*0.8,
        height : SPACING.space_10*0.8,
        borderRadius : BORDERRADIUS.radius_25,
        marginRight : SPACING.space_10*0.5
    },
    ErrorMessageText : {
        fontSize : FONTSIZE.size_14,
        color : "#ff3333",
        marginTop : -SPACING.space_12,
    },
    ProductInputScrollView: {
        padding: SPACING.space_18,
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
    AboutProductLineContainer : {
        flexDirection : "row",
    },
    AddLineInInputContainer : {
        alignItems : "center",
        justifyContent : "center",
        borderRadius : BORDERRADIUS.radius_10*2,
        height : SPACING.space_30*2.1,
        width : SPACING.space_30*2.1,
        position : "absolute",
        right : 0,
        bottom : 0,
    },
    AddLineInInputText : {
        color : COLORS.primaryLightGreenHex,
        fontSize : FONTSIZE.size_28,
        fontFamily : FONTFAMILY.poppins_medium,
    },
    AboutProductLines : {
        padding : SPACING.space_10,
        paddingTop : 0,
    },
    AboutAddedLineContainer : {
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "center",
        marginTop : SPACING.space_8
    },
    AboutAddedLineText: {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_regular,
        color : COLORS.primaryBlackHex,
        textTransform : "capitalize",
        textAlign : "justify",
    },
    AboutAddedLineDelete : {
        color : COLORS.primaryLightGreenHex,
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