import { Dimensions, Pressable, StyleSheet, Text, ToastAndroid, View , Image, Touchable } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomIcon from '../components/CustomIcon'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import LottieView from 'lottie-react-native'
import { Dropdown } from 'react-native-element-dropdown'
import cityList from '../data/cityList'
import villageList from '../data/villageList'
import moment from 'moment'
import DatePicker from 'react-native-date-picker'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { updateTotalFarms } from '../features/farmSlice.ts'

const ModalWidth = Dimensions.get('window').width*0.5 - SPACING.space_18*1.5;

const cropImageFetcher : any = {
  paddy : require("../assets/crops/paddy.jpg"),
  wheat : require("../assets/crops/wheat.jpg"),
  sugarcane : require("../assets/crops/sugarcane.jpg")
}

const AddFarmDetailsScreen = ({ navigation , route} : any) => {

    const [location , setLocation] = useState('')
    const [addLocationError , setAddLocationError ] = useState(false)
    const [farmSize , setFarmSize] = useState('')
    const [addFarmSizeError, setAddFarmSizeError] = useState(false)
    const [city , setCity]  = useState('')
    const [addCityError , setAddCityError] = useState(false)
    const [showDoneAnimation , setShowDoneAnimation ] = useState(false)
    const [villageListt , setVillageList ] = useState([])
    const [sowingDate, setSowingDate] = useState('')
    const [addSowingDateError , setAddSowingDateError] = useState(false)

    const [isDatePickerVisible , setDatePicketVisible] = useState(false)

    const userToken = useSelector((state : any) => state.user.token)
    const userId = useSelector((state : any) => state.user.id)
    const totalFarms = useSelector((state : any) => state.farm.totalFarms)

    const dispatch = useDispatch()

    const showDatePicker = () => setDatePicketVisible(true)
    const hideDatePicker = () => setDatePicketVisible(false)
    

    const backButtonHandler = () => {
      navigation.pop()
    }

    const addFarmButtonHandler = async () => {
      await fetch(`http://10.0.2.2:4000/farm/add-farm` , {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${userToken}`
        },
        body : JSON.stringify({
          userId : userId,
          location : location.value,
          farmSize : farmSize,
          cropName : route.params.cropName,
          city : city.value,
          sowingDate : sowingDate,
        })
      }).then((res) => res.json())
      .then((res) => {
        setShowDoneAnimation(true)
        setTimeout(() => {
            setShowDoneAnimation(false)
            navigation.navigate("Tab")
            dispatch(updateTotalFarms(totalFarms+1))
        }, 2000);
        setLocation('')
        setFarmSize('')
        setCity('')
        setSowingDate('')
      }).catch((err)=> {
        console.log(err)
      })
    }

    useEffect(()=> {
      if(farmSize!=='') {
        setAddFarmSizeError(false)
      }
      if(city!=='') {
        setAddCityError(false)
      }
      if(location!=='') {
        setAddLocationError(false)
      }
      if(sowingDate!=='') {
        setAddSowingDateError(false)
      }
    } , [farmSize, sowingDate , location , city])

    useEffect(() => {
      if(city==='') {
        setVillageList([])
      }else{
        const selectedCity : any = city
        setVillageList(villageList[selectedCity.label.toLowerCase()])
      }
    } , [city])


  return (
    <GestureHandlerRootView>

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
        <View style={styles.StartingHeaderContainer}>
            <Pressable 
                onPress={backButtonHandler}
                style={styles.StartingHeaderBackButton}
            >
                <CustomIcon
                    name='arrow-left2'
                    size={FONTSIZE.size_24}
                    color={COLORS.primaryWhiteHex}
                />
            </Pressable>
            <Text style={styles.SelectCropScreenHeaderTitle}>Add Farm Details</Text>
        </View>

        <View>
          <Image style={styles.AddFarmBackgroundImage} source={cropImageFetcher[route.params.cropName.toLowerCase()]} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={[{padding : SPACING.space_18}]}>
          <TouchableOpacity
            onPress={() => {
              showDatePicker()
            }}
          >
              <TextInput
                    style={[styles.AddFarmDetailInput , {borderColor : addSowingDateError ? "red" : COLORS.secondaryLightGreyHex}]}
                    value={sowingDate ? moment(sowingDate).format(`DD MMMM, YYYY`) : ""}
                    placeholder='Date of Sowing*'
                    editable={false}
                />
              <DatePicker
                modal
                open={isDatePickerVisible}
                date={sowingDate ? new Date(sowingDate) : new Date()}
                onConfirm={(date : any) => {
                  setDatePicketVisible(false)
                  setSowingDate(date)
                }}
                onCancel={hideDatePicker}
                mode='date'
            />
          </TouchableOpacity>
            
          <View style={[styles.AddFarmDetailModalInputContainer ]}>
              <Dropdown
                  style={[styles.AddFarmDetailInput , {width : ModalWidth ,borderColor : addCityError ? "red" : COLORS.secondaryLightGreyHex}]}
                  data={cityList}
                  search
                  labelField="label"
                  valueField="value"
                  placeholder='City'
                  searchPlaceholder='Search'
                  value={city}
                  onChange={setCity}
                  maxHeight={250}
              />
              <Dropdown
                  style={[styles.AddFarmDetailInput , {width : ModalWidth ,borderColor : addLocationError ? "red" : COLORS.secondaryLightGreyHex}]}
                  data={villageListt}
                  search
                  labelField="label"
                  valueField="value"
                  placeholder='Village'
                  searchPlaceholder='Search'
                  value={location}
                  onChange={setLocation}
                  maxHeight={250}
              />
          </View>
          <View style={[styles.AddFarmDetailModalInputContainer ]}>
              <TextInput 
                  keyboardType='numeric'
                  style={[styles.AddFarmDetailInput , {width : ModalWidth , borderColor : addFarmSizeError ? "red" : COLORS.secondaryLightGreyHex}]}
                  value={farmSize}
                  onChangeText={setFarmSize}
                  placeholder='Area*'
              />
              <TextInput
                  style={[styles.AddFarmDetailInput , {width : ModalWidth}]}
                  value={'Acre'}
              />
          </View>
        </ScrollView>
        <Pressable 
            onPress={() => {
                if(location==='' || farmSize==='' || sowingDate==='' || city==='') {
                    if(location==='') {
                      setAddLocationError(true)
                    }
                    if(farmSize==='') {
                      setAddFarmSizeError(true)
                    }
                    if(sowingDate==='') {
                      setAddSowingDateError(true)
                    }
                    if(city==='') {
                      setAddCityError(true)
                    }
                }else{
                    addFarmButtonHandler()
                }
            }}
            style={styles.SaveCropButtonContainer}
        >
            <Text style={styles.SaveCropTitle}>Save and Continue</Text>
        </Pressable>
    </GestureHandlerRootView>
  )
}

export default AddFarmDetailsScreen

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
  SelectCropScreenHeaderTitle : {
    marginLeft : SPACING.space_10*2,
    fontSize : FONTSIZE.size_18,
    fontFamily : FONTFAMILY.poppins_semibold,
    color : COLORS.primaryWhiteHex,
  },
  AddFarmDetailModalInputContainer : {
    flexDirection : "row",
    justifyContent : "space-between",
    flexWrap : "wrap"
  },
  AddFarmDetailInput: {
    borderWidth : 1,
    borderColor : COLORS.secondaryLightGreyHex,
    borderRadius : BORDERRADIUS.radius_10,
    paddingLeft : SPACING.space_15,
    padding : SPACING.space_15,
    fontFamily : FONTFAMILY.poppins_regular,
    marginBottom : SPACING.space_16,
    color : COLORS.primaryBlackHex,
  },
  SaveCropButtonContainer : {
    backgroundColor : COLORS.primaryLightGreenHex,
    padding : SPACING.space_15,
    position : "absolute",
    bottom : 0,
    left : 0,
    right : 0,
  },
  SaveCropTitle : {
      color : COLORS.primaryWhiteHex,
      textAlign : "center",
      fontSize : FONTSIZE.size_16,
      fontFamily : FONTFAMILY.poppins_medium,
  },
  AddFarmBackgroundImage : {
    width : "100%",
    height : 200,
  }
})