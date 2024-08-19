import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux';
import { persistor, store } from './src/store/store';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './src/navigators/StackNavigator';
import HomeScreen from './src/screens/HomeScreen';
const Drawer = createDrawerNavigator()
import SplashScreen from 'react-native-splash-screen';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {

  useEffect(() => {
    SplashScreen.hide()
  }, [])
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer >
          <StackNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({
  AppContainer : {

  }
})