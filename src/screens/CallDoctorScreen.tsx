import { StyleSheet, Text, View, Linking, Pressable, Image, Dimensions } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import LottieView from 'lottie-react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import CustomIcon from '../components/CustomIcon'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import WhyAddFarmCard from '../components/WhyAddFarmCard'
import { useTranslation } from 'react-i18next'


const CallDoctorScreen = () => {
    const { t} = useTranslation()
    const [currentTime , setCurrentTime] = useState(new Date().getHours())

    const handleCallButton = () => {
        Linking.openURL(`tel:8685980100`)
    }
    const tabBarHeight = useBottomTabBarHeight()

    const bottomSheetModalRef  = useRef<any | null>(null)
    const snapPoints = useMemo(() => ["42%"],[])

    const openBottomModel= () => {
      bottomSheetModalRef.current?.present()
    }

    const closeBottomModel = () => {
        bottomSheetModalRef.current?.close()
    }

    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date().getHours())
        } , 1000*60*60)
    } , [currentTime])
  return (
    <View >
        <BottomSheetModalProvider>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}  
        >
          <View>
            <WhyAddFarmCard closeBottomSheet ={closeBottomModel}/>
          </View>
        </BottomSheetModal>
        {(currentTime>9 && currentTime<24) ?
        (
            <View style={{height : "100%"}}>
                <View style={{overflow: 'hidden',}}>
                    <Image
                        source={require("../assets/Banners/farmer_call.jpg")}
                        style={styles.CallFarmerImage}
                    />
                </View>
                <View style={styles.CallingDetailContainer}>
                    <Text style={styles.CallingDetailHeading}>{t('Ask Agri Doctor About')}</Text>
                    <Text style={styles.CallingDetailLine}>{`\u25CF`}{" "}{t('Any type of Disease in farms')}</Text>
                    <Text style={styles.CallingDetailLine}>{`\u25CF`}{" "}{t('Pricing of Products')}</Text>
                    <Text style={styles.CallingDetailLine}>{`\u25CF`}{" "}{t('Best indegredients for your farm')}</Text>
                    <Text style={styles.CallingDetailLine}>{`\u25CF`}{" "}{t('How to increase productivity in your farm')}</Text>
                    <Text style={styles.CallingDetailLine}>{`\u25CF`}{" "}{t('Any kind of help or support')}</Text>
                </View>
                <Pressable
                    onPress={handleCallButton}
                    style={[styles.CallButtonContainer , {marginBottom : tabBarHeight + SPACING.space_10*2}]}
                >
                    <CustomIcon 
                        name='phone'
                        size={25}
                        color={COLORS.primaryWhiteHex}
                    />
                </Pressable>
            </View>
        ):
        (
            <View>
                <LottieView
                    source={require("../components/lottie/Closed.json")}
                    style={styles.ClosedAnimation}
                    autoPlay
                    loop
                />
                <Text style={styles.CloseText}>Call Doctor from 9 AM to 6 PM</Text>
            </View>
        )
        }
        </BottomSheetModalProvider>
    </View>
  )
}

export default CallDoctorScreen

const styles = StyleSheet.create({
    CallFarmerImage : {
        height : 300,
        width : Dimensions.get("screen").width,
    },
    CallingDetailContainer : {
        padding : SPACING.space_18
    },
    CallingDetailHeading : {
        fontSize :FONTSIZE.size_16*1.19,
        fontFamily : FONTFAMILY.poppins_semibold,
        color : COLORS.primaryBlackHex,
        textAlign : "center"
    }, 
    CallingDetailLine : {
        fontSize : FONTSIZE.size_16,
        fontFamily : FONTFAMILY.poppins_medium,
        color : COLORS.primaryLightGreyHex
    },
    CallButtonContainer : {
        flexDirection : "row",
        alignItems : "center",
        justifyContent: 'center',
        backgroundColor : COLORS.primaryLightGreenHex,
        borderRadius : BORDERRADIUS.radius_10*10,
        padding : SPACING.space_10,
        width : 80,
        height : 80,
        position : "absolute",
        bottom : 0,
        left : Dimensions.get("screen").width*0.4,
    },
    CallContainerButtonText : {
        color : COLORS.primaryWhiteHex,
        fontSize : SPACING.space_18,
        fontFamily : FONTFAMILY.poppins_regular,
        marginLeft : SPACING.space_10
    },
    OpenAnimation : {
        height : 300
    },
    ClosedAnimation : {
        height: 500,
    },
    CloseText : {
        fontSize : FONTSIZE.size_20,
        fontFamily : FONTFAMILY.poppins_semibold,
        color :  COLORS.primaryBlackHex,
        textAlign : "center"
    }
})