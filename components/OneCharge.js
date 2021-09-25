import * as React from 'react';
import { Text, View, StyleSheet, Image, Slider, PanResponder, Animated, Button, Alert, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Constants } from 'expo';
import Svg, { Path, Circle } from 'react-native-svg';
import Vector from './Vector.js';
import {getPoints, getArrow3, getfield1} from './physics.js';

export default class SingleCharge extends React.Component {// This Jawn drawin'


  constructor(props) {

    super(props);

    // Vec2 variable for point 1 'p'
    // p2 = getfield1(p)
    // store p and p2 in state maybe have to extract x and y from p and p2

    var { height, width } = Dimensions.get('screen');

    var newWidth = width - 100;
    var newHeight = height * 0.75;
    var actualWidth = width;
    // numP is the number of points in a line
    var numP = newWidth * 0.15;
    if (numP % 2 > 0) {
      numP += 1;
    }

    // now create random values for the two charges
    //var ec = Math.floor((Math.random() * 21) - 10);
    //var ec2 = Math.floor((Math.random() * 21) - 10);
    //ec2 = -ec2;


    chargeMid = Math.round(width/2);
    //console.log("width: " + width + " height: " + height + " chargeMid: " + chargeMid);

    const Vect1 = new Vector(chargeMid, 300, 0);
    //const Vect2 = new Vector(newWidth, 300, 0);
    const Vect2 = new Vector(280, 300, 0);
    const Vect3 = new Vector(chargeMid, 290, 0);

    //var A1 = [];

    this.state = {

      // values of the charges on right and left
      value: 0,
      value2: 0,

      //X Coordinates of both charges and line
      x1: Vect1.x,
      x2: Vect2.x,
      x3: Vect3.x,

      //Y Coordinates of both scharges and line
      y1: Vect1.y,
      y2: Vect2.y,
      y3: Vect3.y,

      //X and Y coordinates of the left charge
      px: 0,
      py: 0,

      //X and Y coordinates of the right charge
      ex: 1,
      ey: 0,

      // Number of points in a line
      numPoints: numP,

      // set the device width and height
      devicewidth: actualWidth,
      deviceheight: newHeight,

      // set the dimensions of the Svg View
      // Initially assume device width and height
      // We'll set the actual dimensions when the
      // View is loaded; see the function setSvgDimentions
      SvgDimensions: { width: actualWidth, height: newHeight },

      // set the colors of the charges
      lColor: "grey",
      rColor: "grey",

      A1: this.svgStr(Vect1,Vect3),
    }

    //Pan Handler Set Up for gesture tracking of both the proton and the electron

    this._panResponder = {};
    this._panResponder2 = {};

    //Proton pan handler
    this._previousLeftP = 0;
    this._previousTopP = 0;

    this._protonStyles = {};
    this.proton = null;

    //Electron pan handler
    this._previousLeftE = 0;
    this._previousTopE = 0;

    this._electronStyles = {};
    this.electron = null;
  }

  //Initial functions setting up the pan handlers
  UNSAFE_componentWillMount() {
  }

  //Updates the state of the coordiantes for the line to be drawn
  _updateState(num) {
    if (num == 1) {
      this.setState({
        x1: this.state.px - 10,
        y1: this.state.py + 300,
      })
    }

    if (num == 2) {
      this.setState({
        x2: this.state.ex + 350,
        y2: this.state.ey + 300,
      })
    }
  }

  /* svgStr is only called once, to provide the initial field.
   * We know that ec will be positive and ec2 negative (or vice versa), so the
   * field calculation is simplified, i.e., we do not need to calculate
   * the field from BOTH charges (as we would if they had the same sign).
  */

  svgStr(Vect1,Vect3) {
    var i;
    var j;
    var A2 = new Array();

    var holdVec = new Vector(0, 0, 0);

    var ec = 1;

    if (typeof this.state === "undefined") {
      ec = 1;
    } else {
      ec = this.state.value;
    }

    // use the 'this' if the function is defined within this component
    // if you defined the function in another file (as we did) don't use 'this'
    //holdVec = this.getfield1(Vect1, Vect3, ec);
    holdVec = getfield1(Vect1, Vect3, ec);
    tempArray = new Array();

    for (i = 0; i < 6; i++) {
      for (j = 0; j < 75; j++) {

// Call get field using old starting point to get a new starting point
        holdVec = getfield1(Vect1, holdVec, ec);

        tempArray[j] = [(holdVec.x), (holdVec.y)];
      }

      A2[i] = { line: tempArray, key: i, arrow: [0, 0, 0, 0, 0, 0] };

      if (i < 3) {
        Vect3.y -= 5;
      } if (i == 2) {
        Vect3.y += 35;
      } else if (i >= 3 && i < 6) {
        Vect3.y += 5;
      }

      holdVec = getfield1(Vect1,Vect3, ec);
    }

    return A2;
  }

  svgStr2(ec) {
    var i;
    var j;
    var A2 = new Array();

    var Vect3 = new Vector(0, 0, 0);
    var Vect1 = new Vector(this.state.x1, this.state.y1, 0);

    /* This the top of the SVG screen relative to the View.  We must
     * adjust the number because we're scaling the SVG relative to the View.
     *-200 is just a test number. We need to know where
     * the top of the SVG screen is relative to the View 
     */
    screenTop = 100;
    screenBottom = 700;

    // this variable determines the direction of the line, right to left or
    // left to right or both (when charges are the same).
    // Just giving a default value here.
    var direction = "down";

    var svgHeight = 600;
    var arrowPoint = 22;
    if (typeof this.state === "undefined" || this.state.SvgDimensions.height == 0) {
      svgHeight = 600;
    }
    else {
      svgHeight = this.state.SvgDimensions.height;
    }

    /* Here we set the variable "direction" that indicates
     * which direction the lines go.
     * We also set where to start calculating point charges
    */
   if (ec < 0) {
         /* screenTop is set above. We need to know where
    	* the top of the SVG screen is relative to the View 
   	*/
         direction = "down";
	 arrowPoint = 37;
   } else {
         direction = "up";
	 arrowPoint = 15;
   }

    /* we have to know the direction of the lines
     * for positive charges lines go out from the charge
     * so we start close to the charge, e.g., 10
     * for negative charges lines go into the charge
     * so we start far from the charge, e.g., 600
    */ 
   
    if (direction == "up"){
       newPts = getPoints(Vect1, 10);
    }
    else{
       newPts = getPoints(Vect1, 600);
    }

    // get the number of points in a line
    pts = this.state.numPoints;

    for (i = 0; i < newPts.length; i++) {

      Vect3 = new Vector(newPts[i][0], newPts[i][1], 0);
      holdVec = getfield1(Vect1, Vect3, ec);

      tempArray = new Array();
      tempArray[0] = [(holdVec.x), (holdVec.y)];

      arrowArray = new Array();
      Elinemidstart = new Vector(0,0,0);
      Elinemidend = new Vector(0,0,0);

      for (j = 1; j < pts; j++) {
        // Call get field using old starting point to get a new 
	// starting point
        holdVec = getfield1(Vect1,holdVec, ec);

        tempArray[j] = [(holdVec.x), (holdVec.y)];

	// CLC 191010, to create the arrows
	// first, we focus on the segment in the middle of the line. 
	// We need to get the start (Elinemidstart) and end point (Elinemidend) of this segment.
	if (j == arrowPoint) {
		Elinemidstart= holdVec;
	}
	if (j == arrowPoint + 1) {
		Elinemidend = holdVec;
		arrowArray = getArrow3(ec, Vect1, Elinemidstart, Elinemidend);		
//console.log("arrow points from getArrow3:");
//console.log*(arrowArray);
	}
      }

      // store this line in the A1 array
      A2[i] = { line: tempArray, key: i, arrow: arrowArray };
    }

    this.setState({
      A1: A2
    })
  }



  //Creates thhe state into a string that can be used for line creation

  _stateToString(num) {

    // line is the property that contains an array of points in A1[num]
    var str7a = this.state.A1[num].line;  //.toString().replace(/,/g, ' ')
    var aLine = this.state.A1[num].arrow;

    first = this.state.value;
    second = this.state.value2;

    var str7 = "";

    if (first == 0) {
      return "M 0 0";
    }

    if (first < 0 ) {
      // in this case start from the first position in str7a and end at x1,y1
      var mid = this.state.A1.length / 2;

      /* We start at the end of the line in this situation, not at the charge.
       * So we have to find the first point and draw the line from there to
       * the rest of the points stored in str7. This is the only situation where
       * we have to start at the end of the line.
      */
      str7End = str7a.slice(1);
      lastX = str7End[str7End.length - 1][0];
      if (num < mid) {

        str7 = "M " + str7a[0][0] + "," + str7a[0][1] + " L " + str7End + " ";
        str7 = str7 + this.state.x1 + " " + this.state.y1;

	/* This adds the arrow */
        str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];

      } else { // num >= mid

        str7 = "M " + str7a[0][0] + "," + str7a[0][1] + " L " + str7End + " ";
        str7 = str7 + this.state.x1 + " " + this.state.y1;

	/* This adds the arrow */
        str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];
      }
    }
    else {   // the charge is positive

      var mid = this.state.A1.length / 2;
      if (num < mid) {
        str7 = "M " + this.state.x1 + "," + this.state.y1 + " L " + str7a;
	/* This adds the arrow */
        str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];
      } else {
        str7 = "M " + this.state.x1 + "," + this.state.y1 + " L " + str7a;
	/* This adds the arrow */
        str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];
      }
    }
    return str7
  }



  //Updates the state based on the sliders value

  _sliderChange(value) {

    var newLColor;
    var newRColor;
    if (value < 0) {
      newLColor = "red";
    }
    else if (value > 0) {
      newLColor = "blue";
    }
    else {
      newLColor = "grey";
    }


    this.setState({
      lColor: newLColor,
    })

    this.setState({
      value: value,
      lColor: newLColor,
    })

    this.forceUpdate();

    this.svgStr2(value);

  }

  // Note that this function is called when the "onlayout" event
  // of the Svg component is called.  the height and width provided
  // are not the height/width of the surrounding view, rather the 
  // current height and width which vary depending on how much room is needed.

  // Organization of the screen
  //Container
  //First Row
  //Middle Column
  //Second Row
  //The Proton
  //The two field lines between the particles
  //The Electron
  //Third Row
  //First Column
  //Second Column
  //Dynamic Slider used to update the arcs
  //Third Column
  //Fourth Row

  render() {

    return (

      <View style={styles.container}>

        <View style={styles.firstrow}>

          <View style={styles.secondcol}>

            <Text style={styles.bigText}>Dynamic Electric Field Interactive</Text>

          </View>

        </View>

        <View style={styles.secondrow}>
          {/* onLayout = {event => this.setSvgDimentions(event) } */}



{/*
          <Svg height={this.state.SvgDimensions.height} width={this.state.SvgDimensions.width} xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 1000 1000">
            <Svg height='600' width='600' xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 800 800" >
            <Svg height='600' width='600' xmlns="http://www.w3.org/2000/svg">
            </Svg>
*/}
          <Svg height={this.state.SvgDimensions.height} width={this.state.SvgDimensions.width} xmlns="http://www.w3.org/2000/svg">

              {
                this.state.A1.map((obj, i) => {// Not Chainging A1 here

                  return <Path key={obj.key} d={this._stateToString(i)} stroke="#FFFF00" strokWidth='100' fill="none" />

                })

              }

              <Circle cx={this.state.x1} cy={this.state.y1} r="15" fill={this.state.lColor} />

          </Svg>

          {/* <View style={styles.buttonTing}>
  
            <Button
              onPress={() => {
  
                this.setState({
  
                  str6: "M169.8 200 L200 180",
                  str7: "M169.8 200 L200 220"
  
                })
                { this._stateToString(6, 7) }
              }}
  
              title="Flip"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
  
            />
  
            </View> */}



        </View>

        <View style={styles.thirdrow}>

          <View style={styles.firstcol}>

            <Text style={styles.sliderText}>-10</Text>

          </View>

          <View style={styles.secondcol}>

            <Slider
              style={styles.slider}
              step={1}
              minimumValue={-10}
              maximumValue={10}
              value={this.state.value}
              //value2={this.state.value2}

              onValueChange={(value) => this._sliderChange(value)}// cALL SVGtoStr here
            />

          </View>

          <View style={styles.thirdcol}>

            <Text style={styles.sliderText}>10</Text>

          </View>

        </View>



        <View style={styles.fourthrow}>

          <Text style={styles.selectText}>Charge Amount</Text>
          <Text style={styles.selectText}>{this.state.value} </Text>

        </View>

      </View>
    );

  }


};
  
//Multiple styles used throughout
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111110',
    flex: 1,
  },

  containerSplash: {
    backgroundColor: '#111110',
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
    width: 150,
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
