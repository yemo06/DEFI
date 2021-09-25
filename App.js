import * as React from 'react';
import { Text, View, StyleSheet, Image, Slider, PanResponder, Animated, Button, Alert, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Path, Circle } from 'react-native-svg';
//import { Vec2 } from './Vec2.js';
//import Vector from './Vector.js'
import AppScreen from './components/twoCharge';
import SingleCharge from './components/OneCharge';
import SingleChargeGrid from './components/OneField';


/*  PEV
*   references:
 *     SVG: https://github.com/react-native-community/react-native-svg
*
*  The path of field lines is created via SVG graphics.  In particular,
*  the "path" SVG grphic is used.  A path can be created in various ways
*  (see also the reference page):
*
*  The following commands are available for path data:
* 
*  M = moveto
*  L = lineto
*  H = horizontal lineto
*  V = vertical lineto
*  C = curveto
*  S = smooth curveto
*  Q = quadratic Bézier curve
*  T = smooth quadratic Bézier curveto
*  A = elliptical Arc
*  Z = closepath
*/


//Image splash screen
class SplashScreen extends React.Component {

  render() {

    return (
      <View style={styles.containerSplash}>

        <Image style={{ height: 500, width: 400, marginBottom: 100 }} source={require('./assets/img/splash2.png')} />

      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator(
  //Two Screens, Home and the PEV
  {
    Home: SplashScreen,
    One: SingleCharge,
    Two: AppScreen,
    Grid: SingleChargeGrid,
  },

  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;

        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Two') {
          iconName = 'ios-keypad';
        } else if (routeName === 'One') {
          iconName = 'ios-add-circle';
        } else if (routeName === 'Grid') {
          iconName = 'ios-add-circle';
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      },
    }),

    tabBarOptions: {
      activeTintColor: '#97A2E7',
      inactiveTintColor: '#EF7A1A',
      style: {
        backgroundColor: '#223140',
      },
    },
  }
);


export default createAppContainer(TabNavigator);



//Multiple styles used throughout
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111110',
    flex: 1,
  },

  containerSplash: {
    backgroundColor: '#003b71',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bigText: {
    marginTop: 60,
    fontSize: 25,
    color: '#fff',
    fontFamily: 'System',
  },

  sliderText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'System',
    textAlign: 'center',
    padding: 20,
  },

  selectText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'System',
    textAlign: 'center',
  },

  firstrow: {
    flex: .5,
  },

  secondrow: {

    flex: 2.2,

    flexDirection: 'row',

    alignItems: "center",


  },

  thirdrow: {
    flex: .3,
    flexDirection: 'row',
    alignItems: "center",
  },

  fourthrow: {
    flex: .5,
    alignItems: "center",
  },

  firstcol: {
    flex: 1,
    alignItems: 'flex-start',
  },

  secondcol: {
    flex: 1,
    alignItems: 'center',
  },

  thirdcol: {
    flex: 1,
    alignItems: 'flex-end',
  },

  slider: {
    width: 250,
    justifyContent: 'center',
  },

  electron: {
    width: 35,
    height: 35,
    borderRadius: 100 / 2,
    backgroundColor: '#97A2E7',
  },

  proton: {
    width: 35,
    height: 35,
    borderRadius: 100 / 2,
    backgroundColor: '#EF7A1A',
  },

  buttonTing: {
    position: 'absolute',
    top: 20,
    left: 40
  },

});
