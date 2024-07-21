import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import { BlurView } from '@react-native-community/blur'
import { COLORS, FONTSIZE, SPACING } from '../theme/theme.ts'
import CustomIcon from '../components/CustomIcon'
import ShopScreen from '../screens/ShopScreen.tsx'
import NotificationScreen from '../screens/NotificationScreen.tsx'
import DrawerNavigator from './DrawerNavigator.tsx'
import CallDoctorScreen from '../screens/CallDoctorScreen.tsx'

const Tab = createBottomTabNavigator()


const TabNavigator = ({navigation , route} : any) => {


    // useEffect(()=> {
    //     console.log("route " + (route.params===undefined) ? '' : route.params.searchTextFromPreviousScreen)
    // } , [(route.params===undefined) ? '' : route.params.searchTextFromPreviousScreen])
  return (
    <Tab.Navigator
        // initialRouteName='Shop'
        screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard : true,
            tabBarStyle : styles.tabBarStyle,
            tabBarLabelStyle : styles.tabBarLabelStyle,
            // tabBarBackground : () => {
            //     return (
            //         <BlurView
            //             overlayColor=''
            //             blurAmount={15}
            //             style={styles.blurViewStyle}
            //         />
            //     )
            // }
        }}
        sceneContainerStyle={{backgroundColor: COLORS.primaryWhiteHex}}
    >
        <Tab.Screen
            name='Home'
            component={DrawerNavigator}
            options={{
                tabBarIcon : ({focused , color, size}) => {
                    return (
                        <CustomIcon
                            name="home"
                            size={25}
                            color={focused ? COLORS.primaryLightGreenHex : COLORS.primaryLightGreyHex}
                         />
                    )
                },
                tabBarLabel : ({focused , color}) => {
                    return (
                        <Text style={{color : focused ? COLORS.primaryLightGreenHex : COLORS.primaryLightGreyHex, fontSize : FONTSIZE.size_12, marginBottom : SPACING.space_10,}}>
                            Home
                        </Text>
                    )
                }
            }}
         />
         <Tab.Screen
            name= 'Shop'
            children={
                () => <ShopScreen navigation={navigation} searchTextFromPreviousScreen={ (route.params===undefined) ? '' : route.params.params.searchTextFromPreviousScreen} />
            }
            listeners={({navigation} :any) => ({
                tabPress : (e) => {
                    e.preventDefault()
                    navigation.navigate("Tab" , {
                        screen : "Shop",
                        params : {
                            searchTextFromPreviousScreen : ''
                        }
                      })
                }
            })}
            options={{
                tabBarIcon : ({focused , color , size}) => {
                    return (
                        <CustomIcon 
                            name='store-front'
                            size={25}
                            color={focused ? COLORS.primaryLightGreenHex : COLORS.primaryLightGreyHex}
                        />
                    )
                },
                tabBarLabel : ({focused , color}) => {
                    return (
                        <Text style={{color : focused ? COLORS.primaryLightGreenHex : COLORS.primaryLightGreyHex, fontSize : FONTSIZE.size_12, marginBottom : SPACING.space_10,}}>
                            Shop
                        </Text>
                    )
                }
            }}
         />
         <Tab.Screen
            name= 'CallDoctorScreen'
            component={CallDoctorScreen}
            options={{
                tabBarIcon : ({focused , color , size}) => {
                    return (
                        <CustomIcon 
                            name='phone'
                            size={25}
                            color={focused ? COLORS.primaryLightGreenHex : COLORS.primaryLightGreyHex}
                        />
                    )
                },
                tabBarLabel : ({focused , color}) => {
                    return (
                        <Text style={{color : focused ? COLORS.primaryLightGreenHex : COLORS.primaryLightGreyHex, fontSize : FONTSIZE.size_12, marginBottom : SPACING.space_10,}}>
                            Call Doctor
                        </Text>
                    )
                }
            }}
         />
         <Tab.Screen
            name= 'Message'
            component={NotificationScreen}
            options={{
                tabBarIcon : ({focused , color , size}) => {
                    return (
                        <CustomIcon 
                            name='message'
                            size={25}
                            color={focused ? COLORS.primaryLightGreenHex : COLORS.primaryLightGreyHex}
                        />
                    )
                },
                tabBarLabel : ({focused , color}) => {
                    return (
                        <Text style={{color : focused ? COLORS.primaryLightGreenHex : COLORS.primaryLightGreyHex, fontSize : FONTSIZE.size_12, marginBottom : SPACING.space_10,}}>
                            Message
                        </Text>
                    )
                }
            }}
         />
    </Tab.Navigator>
  )
}

export default TabNavigator

const styles = StyleSheet.create({
    tabBarStyle : {
        height : 75,
        position : 'absolute',
        backgroundColor : COLORS.primaryWhiteHex,
        borderTopWidth : 0.2,
        elevation : 20,
        borderTopColor : COLORS.secondaryLightGreyHex,
    },
    tabBarLabelStyle : {
        color : COLORS.primaryLightGreyHex,
        fontSize : FONTSIZE.size_12, 
        marginBottom : SPACING.space_10,
    },
    blurViewStyle : {
        position : 'absolute',
        top : 0,
        bottom : 0,
        right : 0,
        left : 0,
    }
})