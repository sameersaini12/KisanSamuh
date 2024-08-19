import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { COLORS } from '../theme/theme'
import ProductDetailsScreen from '../screens/ProductDetailsScreen'
import CartScreen from '../screens/CartScreen'
import TabNavigator from './TabNavigator'
import GetStartScreen from '../screens/GetStartScreen'
import ChooseLanguageScreen from '../screens/ChooseLanguageScreen'
import PhoneLoginScreen from '../screens/PhoneLoginScreen'
import PhoneOTPScreen from '../screens/PhoneOTPScreen'
import PaymentCheckoutScreen from '../screens/PaymentCheckoutScreen'
import OrderHistoryScreen from '../screens/OrderHistoryScreen'
import ProfileScreen from '../screens/ProfileScreen'
import CreateProductScreen from '../screens/CreateProductScreen'
import CreateProductCategory from '../screens/CreateProductCategory'
import OrderedProductInfoScreen from '../screens/OrderedProductInfoScreen'
import UpdateOrderStatusScreen from '../screens/UpdateOrderStatusScreen'
import RefundPolicyScreen from '../screens/RefundPolicyScreen'
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen'
import TermsScreen from '../screens/TermsScreen'
import ShareFeedbackScreen from '../screens/ShareFeedbackScreen'
import KrishiGyanScreen from '../screens/KrishiGyanScreen'
import SelectCropScreen from '../screens/SelectCropScreen'
import AddFarmDetailsScreen from '../screens/AddFarmDetailsScreen'
import FarmListScreen from '../screens/FarmListScreen'
import ChatScreen from '../screens/ChatScreen'
import GroupInfoScreen from '../screens/GroupInfoScreen'
import SelectGroupScreen from '../screens/SelectGroupScreen'
import { useSelector } from 'react-redux'
import RewardScreen from '../screens/RewardScreen'
import RewardHistoryScreen from '../screens/RewardHistoryScreen'
import ReddemHistoryScreen from '../screens/ReddemHistoryScreen'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {

  const enterInApp = useSelector((state : any) => state.user.enterInApp)
  // console.log(enterInApp)

  return (
    <Stack.Navigator
          screenOptions={{ 
            headerShown : false,
            contentStyle : {
              backgroundColor : COLORS.primaryWhiteHex
            } 
          }}
          
        >
          {enterInApp===false && 
            <Stack.Screen
              name="GetStartScreen"
              component={GetStartScreen}
              options={{animation : "slide_from_bottom"}}
            />
          }
          
          {enterInApp===false && 
            <Stack.Screen
              name="LanguageScreen"
              component={ChooseLanguageScreen}
              options={{animation : "slide_from_bottom"}}
            />
          }
          {enterInApp===false && 
            <Stack.Screen
              name="PhoneLoginScreen"
              component={PhoneLoginScreen}
              options={{animation : "slide_from_bottom"}}
            />
          }
          {enterInApp===false && 
            <Stack.Screen
              name="PhoneOTPScreen"
              component={PhoneOTPScreen}
              options={{animation : "slide_from_bottom"}}
            />
          }
          <Stack.Screen
            name='Tab'
            component={TabNavigator}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='ProductDetails'
            component={ProductDetailsScreen}
            options={{animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name="CartScreen"
            component={CartScreen}
            options={{animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='PaymentCheckoutScreen'
            component={PaymentCheckoutScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='OrderHistoryScreen'
            component={OrderHistoryScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='ProfileScreen'
            component={ProfileScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='CreateProductScreen'
            component={CreateProductScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='CreateProductCategory'
            component={CreateProductCategory}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='OrderedProductInfoScreen'
            component={OrderedProductInfoScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='UpdateOrderStatus'
            component={UpdateOrderStatusScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='RefundPolicyScreen'
            component={RefundPolicyScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='PrivacyPolicyScreen'
            component={PrivacyPolicyScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='TermsScreen'
            component={TermsScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='ShareFeedbackScreen'
            component={ShareFeedbackScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='KrishiGyanScreen'
            component={KrishiGyanScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='SelectCropScreen'
            component={SelectCropScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='AddFarmDetailsScreen'
            component={AddFarmDetailsScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='FarmListScreen'
            component={FarmListScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='ChatScreen'
            component={ChatScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='GroupInfoScreen'
            component={GroupInfoScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='SelectGroupScreen'
            component={SelectGroupScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='RewardScreen'
            component={RewardScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='RewardHistoryScreen'
            component={RewardHistoryScreen}
            options={{ animation : "slide_from_bottom"}}
          />
          <Stack.Screen
            name='RedeemHistoryScreen'
            component={ReddemHistoryScreen}
            options={{ animation : "slide_from_bottom"}}
          />

        </Stack.Navigator>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})