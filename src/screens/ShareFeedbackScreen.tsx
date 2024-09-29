import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { useDispatch, useSelector } from 'react-redux'
import LottieView from 'lottie-react-native'
import { updateEnterInAppStatus } from '../features/userSlice'
import {BASE_URL} from "@env"
import { useTranslation } from 'react-i18next'

const ShareFeedbackScreen = ({navigation}  : any) => {
  const {t} = useTranslation()

  const [title , setTitle ] = useState('')
  const [description , setDescription ] = useState('')

  const [addTitleError , setAddTitleError] = useState(false)
  const [addDescriptionError , setAddDescriptionError] = useState(false)

  const [showDoneAnimation , setShowDoneAnimation] = useState(false)

  const userToken = useSelector((state : any) => state.user.token)
  const userId = useSelector((state:any) => state.user.id)
  const isLoggedIn = useSelector((state : any) => state.user.isLoggedIn)

  const dispatch = useDispatch()


  const backButtonHandler = () => {
      navigation.pop()
  }

  const shareFeedbackButtonHandler = async () => {
    if(title==='' || description==='') {
      if(title==='') {
        setAddTitleError(true)
      }
      if(description==='') {
        setAddDescriptionError(true)
      }
    }else {
      await fetch(`${BASE_URL}/feedback/add-feedback`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${userToken}`
        },
        body : JSON.stringify({
            title : title,
            description : description,
            userId : userId
        })
      }).then((res) => res.json())
      .then((res) => {
          // console.log(res)
          setShowDoneAnimation(true)
          setTimeout(() => {
              setShowDoneAnimation(false)
              setTitle('')
              setDescription('')
              navigation.navigate("Tab")
          }, 3000);
          
      })
      .catch((err) => {
          console.log(err)
      })
    }
  }

  useEffect(()=> {
    if(title!='') {
      setAddTitleError(false)
    }
    if(description!='') {
      setAddDescriptionError(false)
    }
  }, [title , description])

  return (
    <GestureHandlerRootView>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

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

      <View style={[styles.ShareFeedbackScreenHeader, {marginBottom : SPACING.space_18}]}>
          <View style={styles.ShareFeedbackScreenHeaderLeft}>
              <Pressable
              onPress={backButtonHandler}
              >
              <CustomIcon
                  name='arrow-left2'
                  size={FONTSIZE.size_24}
                  color={COLORS.primaryLightGreyHex}
              />
              </Pressable>
              <Text style={styles.ShareFeedbackScreenHeaderTitle}>{t('Share your feedback')}</Text>
          </View>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ProductInputScrollView}
      >
        <Pressable 
            style={[styles.ProductInputContainer , { borderColor : addTitleError ? "red" : "", borderWidth : addTitleError ? 1 : 0}]}
        >
            <TextInput
                multiline
                inputMode='text'
                style={styles.ProductInput}
                value={title}
                onChangeText={setTitle}
                placeholder={t('Title*')}
            >
            
            </TextInput>
        </Pressable>

        <Pressable 
            style={[styles.ProductInputContainer , {marginTop : SPACING.space_18, borderColor : addDescriptionError ? "red" : "", borderWidth : addDescriptionError ? 1 : 0}]}
        >
            <TextInput
                multiline
                numberOfLines={10}
                inputMode='text'
                style={[styles.ProductInput, {textAlignVertical : "top"}]}
                value={description}
                onChangeText={setDescription}
                placeholder={t('Description*')}
            >
            
            </TextInput>
        </Pressable>

        {isLoggedIn ? (
          <Pressable
              onPress={() => {
                  shareFeedbackButtonHandler()
              }}
              style={[styles.ShareFeedbackButtonContainer , { marginBottom : SPACING.space_18}]}>
              <Text style={styles.ShareFeedbackButtonText}>{t('Submit')}</Text>
          </Pressable>
        ) : (
          <Pressable
              onPress={async () => {
                  const updateEnterInApp : any = false
                  await dispatch(updateEnterInAppStatus(updateEnterInApp))
                  navigation.navigate("PhoneLoginScreen")

              }}
              style={[styles.ShareFeedbackButtonContainer , { marginBottom : SPACING.space_18}]}>
              <Text style={styles.ShareFeedbackButtonText}>Login to share feedback</Text>
          </Pressable>
        )}
      </ScrollView>

    </GestureHandlerRootView>
  )
}

export default ShareFeedbackScreen

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
  ShareFeedbackScreenHeader : {
    flexDirection : "row",
    padding : SPACING.space_18,
    alignItems: 'center',
    justifyContent : 'space-between',
    backgroundColor : COLORS.primaryLightGreenHex
  },
  ShareFeedbackScreenHeaderLeft : {
      flexDirection : "row",
      alignItems : "center"
  },
  ShareFeedbackScreenHeaderTitle : {
      marginLeft : SPACING.space_10,
      fontSize : FONTSIZE.size_18,
      fontFamily : FONTFAMILY.poppins_semibold
  },
  ProductInputScrollView: {
    padding: SPACING.space_18,
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
  ShareFeedbackButtonContainer : {
    backgroundColor : COLORS.primaryLightGreenHex,
    borderRadius : BORDERRADIUS.radius_10,
    padding : SPACING.space_18,
    marginTop : SPACING.space_18,
  },
  ShareFeedbackButtonText : {
      color : COLORS.primaryWhiteHex,
      textAlign : "center",
      fontSize : FONTSIZE.size_16,
      fontFamily : FONTFAMILY.poppins_medium,
  }
})