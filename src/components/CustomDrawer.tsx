import { ImageBackground, StyleSheet, Text, View , Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from './CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { updateEmail, updateEnterInAppStatus, updateIsAdmin, updateIsLoggedInStatus, updateName, updatePhone, updateToken, updateid } from '../features/userSlice'
import languages from '../data/languageList'
import Share from "react-native-share"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { updateAfterSignOut } from '../features/cartSlice'
import { updateTotalFarms } from '../features/farmSlice'
import { useTranslation } from 'react-i18next'




const CustomDrawer = ({navigation} : any) => {

  const {t} = useTranslation()

  const dispatch = useDispatch()

  const userLoginStatus = useSelector((state : any) => state.user.isLoggedIn)
  const userId = useSelector((state : any) => state.user.id)
  const selectedLanguageId = useSelector((state : any) => state.user.language)
  const phoneNumber = useSelector((state : any) => state.user.phone)
  const userName = useSelector((state : any) => state.user.name)
  const isAdmin = useSelector((state : any) => state.user.isAdmin)

  const tabBarHeight = useBottomTabBarHeight()


  const handleSignOut = async () => {
    const loginStatus : any = false
    dispatch(updateIsLoggedInStatus(loginStatus))
    const userId : any = ''
    dispatch(updateid(userId))
    const token : any = ''
    dispatch(updateToken(token))
    dispatch(updateEmail(userId))
    dispatch(updatePhone(userId))
    dispatch(updateIsAdmin(loginStatus))
    dispatch(updateName(userId))
    dispatch(updateAfterSignOut())
    const totalFarms : any  = 0
    dispatch(updateTotalFarms(totalFarms))
    await dispatch(updateEnterInAppStatus(loginStatus))
    navigation.navigate('GetStartScreen')
  }

  const shareAppLink = async (customOptions : any) => {
    try {
      await Share.open(customOptions)
    }catch (err) {
      console.log(err)
    }
  }

  return (
    <SafeAreaView style={{flex : 1}}>
      <DrawerContentScrollView
        contentContainerStyle={{ paddingTop : 0}}
        style={styles.CustomDrawerContainer}
      >      
        <View style={styles.DrawerProfileIconContainer}>
          <View style={styles.DrawerProfilePicContainer}>
            <Image style={styles.DrawerProfilePicImage} source={require("../assets/default_profile_pic.png")} />
          </View>
          {!userLoginStatus ? (
            <Pressable 
              onPress={async ()=> {
                const enterInAppStatus : any = false
                await dispatch(updateEnterInAppStatus(enterInAppStatus))
                navigation.push("PhoneLoginScreen")
              }}
              style={{alignItems : "center", justifyContent : "center" , marginLeft : SPACING.space_15}}>
              <Text style={{fontSize : FONTSIZE.size_16,fontFamily : FONTFAMILY.poppins_semibold , color : COLORS.primaryWhiteHex , textDecorationLine : "underline"}}>Please Login First</Text>
            </Pressable>
          ) : (
              <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("ProfileScreen")
                }}
              >
                  {userName.length==0 ? (
                    <Text style={[styles.DrawerProfileInfoText , {fontSize :FONTSIZE.size_20*0.84}]}>
                      {t('Enter Your Name')} {" "}
                      <CustomIcon
                        name='pencil'
                        size={16}
                        color={COLORS.primaryWhiteHex}
                        style={styles.DrawerEditPencilIcon}
                      />
                    </Text>
                  ): (
                    <Text style={[styles.DrawerProfileInfoText , {fontSize :FONTSIZE.size_20*0.85 , textTransform : "capitalize"}]}>{userName}</Text>
                  )}
                  
                
              </TouchableOpacity>
              <View>
                <Text  style={styles.DrawerProfileInfoText}>{phoneNumber}</Text>
              </View>
              <View>
                <Text  style={styles.DrawerProfileInfoText}>{t(languages[selectedLanguageId].name.toLowerCase())}</Text>
              </View>
            </View>
          )}
          
          </View>

          {userLoginStatus ? (
              <Pressable
                onPress={() => {
                  navigation.push("ProfileScreen")
                }}
                style={styles.DrawerViewProfileContainer}
              >
                <Text style={styles.DrawerViewProfileText}>{t('View Profile')}</Text>
              </Pressable>
          ) : (
            <Pressable
              onPress={async () => {
                const enterInAppStatus : any = false
                await dispatch(updateEnterInAppStatus(enterInAppStatus))
                navigation.push("PhoneLoginScreen")
              }}
              style={styles.DrawerViewProfileContainer}
            >
              <Text style={styles.DrawerViewProfileText}>{t('Login to view Profile')}</Text>
            </Pressable>
          )}
        

        <ScrollView
            showsVerticalScrollIndicator={false}
            style={[styles.DrawerScrollViewContainer , {paddingBottom : tabBarHeight}]}
        >

          {/* Add Product  */}
          {isAdmin && 
          (
            <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("CreateProductScreen")
                  }}
                  style={styles.DrawerSignOut}>
                    <CustomIcon
                      name='add-solid'
                      size={22}
                      color={COLORS.primaryLightGreenHex}
                    />
                    <Text style={styles.DrawerSignOutText}>{t('Add Product')}</Text>
                </TouchableOpacity>
                <View style={styles.HorizontalRule}></View>
            </View>
            
          )
          }
          
          {/* Add Category  */}

          {/* {isAdmin && 
          (
            <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("CreateProductCategory")
                  }}
                  style={styles.DrawerSignOut}>
                    <CustomIcon
                      name='add-solid'
                      size={22}
                      color={COLORS.primaryLightGreenHex}
                    />
                    <Text style={styles.DrawerSignOutText}>Add Categories</Text>
                </TouchableOpacity>
                <View style={styles.HorizontalRule}></View>
            </View>
          )
          } */}

          {isAdmin && 
          (
            <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("UpdateProductDetails")
                  }}
                  style={styles.DrawerSignOut}>
                    <CustomIcon
                      name='pencil'
                      size={22}
                      color={COLORS.primaryLightGreenHex}
                    />
                    <Text style={styles.DrawerSignOutText}>{t('Update Product Details')}</Text>
                </TouchableOpacity>
                <View style={styles.HorizontalRule}></View>
            </View>
          )
          }

          {/* Update Order Status  */}

          {isAdmin && 
          (
            <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("UpdateOrderStatus")
                  }}
                  style={styles.DrawerSignOut}>
                    <CustomIcon
                      name='pencil'
                      size={22}
                      color={COLORS.primaryLightGreenHex}
                    />
                    <Text style={styles.DrawerSignOutText}>{t('Update Order Status')}</Text>
                </TouchableOpacity>
                <View style={styles.HorizontalRule}></View>
            </View>
          )
          }

          {/* Update Redeem Order Status  */}

          {isAdmin && 
            (
              <View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("UpdateRedeemOrderStatus")
                    }}
                    style={styles.DrawerSignOut}>
                      <CustomIcon
                        name='pencil'
                        size={22}
                        color={COLORS.primaryLightGreenHex}
                      />
                      <Text style={styles.DrawerSignOutText}>{t('Update Reward Orders')}</Text>
                  </TouchableOpacity>
                  <View style={styles.HorizontalRule}></View>
              </View>
            )
          }

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("OrderHistoryScreen")
            }}
            style={styles.DrawerSignOut}>
              <CustomIcon
                name='store-front'
                size={22}
                color={COLORS.primaryLightGreenHex}
              />
              <Text style={styles.DrawerSignOutText}>{t('My Orders')}</Text>
          </TouchableOpacity>
          <View style={styles.HorizontalRule}></View>

            {/* Share app  */}

          <TouchableOpacity
            onPress={async () => {
              await shareAppLink({
                title : "Share App",
                url : "http://www.google.com",
                message : "Dowload this app."
              })
            }}
            style={styles.DrawerSignOut}>
              <CustomIcon
                name='whatsapp1'
                size={22}
                color={COLORS.primaryLightGreenHex}
              />
              <Text style={styles.DrawerSignOutText}>{t('Share')}</Text>
          </TouchableOpacity>
          <View style={styles.HorizontalRule}></View>

            {/* Terms  */}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("TermsScreen")
            }}
            style={styles.DrawerSignOut}>
              <CustomIcon
                name='file-text'
                size={22}
                color={COLORS.primaryLightGreenHex}
              />
              <Text style={styles.DrawerSignOutText}>{t('Terms and Conditions')}</Text>
          </TouchableOpacity>
          <View style={styles.HorizontalRule}></View>

            {/* Privacy Policy  */}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PrivacyPolicyScreen")
            }}
            style={styles.DrawerSignOut}>
              <CustomIcon
                name='file-text2'
                size={22}
                color={COLORS.primaryLightGreenHex}
              />
              <Text style={styles.DrawerSignOutText}>{t('Privacy Policy')}</Text>
          </TouchableOpacity>
          <View style={styles.HorizontalRule}></View>

            {/* Refund Policy */}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("RefundPolicyScreen")
            }}
            style={styles.DrawerSignOut}>
              <CustomIcon
                name='file-text'
                size={22}
                color={COLORS.primaryLightGreenHex}
              />
              <Text style={styles.DrawerSignOutText}>{t('Refund Policy')}</Text>
          </TouchableOpacity>
          <View style={styles.HorizontalRule}></View>

            {/* Share feedback  */}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ShareFeedbackScreen")
            }}
            style={styles.DrawerSignOut}>
              <CustomIcon
                name='bubbles'
                size={22}
                color={COLORS.primaryLightGreenHex}
              />
              <Text style={styles.DrawerSignOutText}>{t('Share your feedback')}</Text>
          </TouchableOpacity>
          <View style={styles.HorizontalRule}></View>

            {/* Sign Out  */}

            {userLoginStatus===true && 
              <TouchableOpacity
                onPress={handleSignOut}
                style={[styles.DrawerSignOut , {marginBottom : SPACING.space_18}]}>
                  <CustomIcon
                    name='exit'
                    size={22}
                    color={COLORS.primaryLightGreenHex}
                  />
                  <Text style={styles.DrawerSignOutText}>{t('Sign Out')}</Text>
              </TouchableOpacity>
            }
          
        </ScrollView>
        
      </DrawerContentScrollView>
    </SafeAreaView>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({
  CustomDrawerContainer : {
  },
  DrawerProfileIconContainer : {
    flexDirection : "row",
    backgroundColor : COLORS.primaryLightGreenHex,
    padding: SPACING.space_15,
    paddingBottom : SPACING.space_36,
    paddingTop : SPACING.space_18*1.5
  },
  DrawerProfilePicContainer : {
    alignItems : "center",
    justifyContent: 'center',
    borderWidth : 1.5,
    borderRadius : BORDERRADIUS.radius_25*3,
    borderColor : COLORS.primaryWhiteHex,
    backgroundColor : COLORS.secondaryLightGreenHex
  },
  DrawerProfilePicImage : {
    borderRadius : BORDERRADIUS.radius_25*3,
    height : SPACING.space_30*2.5,
    width : SPACING.space_30*2.5,
  },
  DrawerProfileInfoText : {
    fontSize : FONTSIZE.size_20*0.8,
    marginLeft : SPACING.space_12,
    color : COLORS.primaryWhiteHex,
    fontFamily :FONTFAMILY.poppins_regular
  },
  DrawerEditPencilIcon : {
    marginLeft : SPACING.space_10
  },
  DrawerViewProfileContainer : {
    backgroundColor : COLORS.primaryWhiteHex,
    margin : SPACING.space_20,
    padding : SPACING.space_10,
    borderRadius : BORDERRADIUS.radius_10,
    marginTop : -SPACING.space_20,
    elevation : 4
  },
  DrawerViewProfileText : {
    color : COLORS.primaryLightGreenHex,
    textAlign : "center",
    fontSize : FONTSIZE.size_14,
    fontFamily :FONTFAMILY.poppins_regular
  },
  DrawerScrollViewContainer : {
    paddingLeft : SPACING.space_18

  },
  DrawerSignOut : {
    marginTop : SPACING.space_10,
    flexDirection : "row",
    alignItems : "center",
  },
  DrawerSignOutText : {
    fontSize : FONTSIZE.size_16,
    fontFamily : FONTFAMILY.poppins_regular,
    color : COLORS.primaryBlackHex,
    marginLeft : SPACING.space_10
  },
  HorizontalRule : {
    padding : 0.5,
    backgroundColor : COLORS.secondaryLightGreyHex,
    marginRight : SPACING.space_18,
    marginTop : SPACING.space_10,
  }
})