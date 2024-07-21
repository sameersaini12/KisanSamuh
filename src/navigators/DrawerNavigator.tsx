import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import TabNavigator from './TabNavigator'
import HomeScreen from '../screens/HomeScreen'
import CustomDrawer from '../components/CustomDrawer'

const Drawer = createDrawerNavigator()

const DrawerNavigator = ({navigation} : any) => {
  return (
    <Drawer.Navigator 
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerStyle : {
          width : Dimensions.get("screen").width/1.25
        }
      }}
    >
      <Drawer.Screen
        name='HomePage'
        component={HomeScreen}
        options={{ headerShown : false }}
      />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator

const styles = StyleSheet.create({})