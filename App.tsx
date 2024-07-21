import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './src/navigators/StackNavigator';
import HomeScreen from './src/screens/HomeScreen';
const Drawer = createDrawerNavigator()

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer >
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({
  AppContainer : {

  }
})