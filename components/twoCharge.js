import * as React from 'react';
import { Text, View, StyleSheet, Image, Slider, PanResponder, Animated, Button, Alert, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { createAppContainer } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Path, Circle } from 'react-native-svg';
import { getPoints, getfield2, getArrow2, getArrow3 } from './physics.js';
import Vector from './Vector.js';

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

class AppScreen extends React.Component {

  constructor(props) {

    super(props);

    // Vec2 variable for point 1 'p'
    // p2 = getfield(p)
    // store p and p2 in state maybe have to extract x and y from p and p2

    var { height, width } = Dimensions.get('window');

    var newWidth = width - 100;
    var newHeight = Math.round(height * 0.75);
    var actualWidth = width;
    // numP is the number of points in a line
    var numP = newWidth * 0.15;
    if (numP % 2 > 0){
	numP += 1;
    }

    // now create random values for the two charges
    //var ec = Math.floor((Math.random() * 21) - 10);
    //var ec2 = Math.floor((Math.random() * 21) - 10);
    //ec2 = -ec2;

// console.log("newWidth: " + newWidth);

    const Vect1 = new Vector(100, 300, 0);
    const Vect2 = new Vector(newWidth, 300, 0);
    //const Vect2 = new Vector(400, 300, 0);
    const Vect3 = new Vector(25, 290, 0);

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
      SvgDimensions: {width:actualWidth, height:newHeight},

      //X Coordinates of the two Arcs
      arch: 210,
      arch2: 210,
      arch3: 210,
      arch4: 210,

      //strings used to flip the arrrows
      str5: "M169.8 200 L149 180",
      str6: "M169.8 200 L149 220",

      // set the colors of the charges
      lColor: "grey",
      rColor: "grey",

      A1: this.svgStr(Vect1, Vect2, Vect3),
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

    this._panResponder = PanResponder.create({

      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,

      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,

      onPanResponderGrant: this._handlePanResponderGrant,

      onPanResponderMove: this._handlePanResponderMove,

      onPanResponderRelease: this._handlePanResponderEnd,

      onPanResponderTerminate: this._handlePanResponderEnd,

    });

    this._panResponder2 = PanResponder.create({

      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder2,

      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder2,

      onPanResponderGrant: this._handlePanResponderGrant2,

      onPanResponderMove: this._handlePanResponderMove2,

      onPanResponderRelease: this._handlePanResponderEnd2,

      onPanResponderTerminate: this._handlePanResponderEnd2,

    });



    //Proton manipulation

    this._previousLeftP = 0;

    this._previousTopP = 0;

    this._protonStyles = {

      style: {

        left: this._previousLeftP,

        top: this._previousTopP,

        backgroundColor: '#EF7A1A',

      }

    };



    //Electron manipulation

    this._previousLeftE = 0;

    this._previousTopE = 0;

    this._electronStyles = {

      style: {

        left: this._previousLeftE,

        top: this._previousTopE,

        backgroundColor: '#97A2E7',

      }

    }

  }





  //Resposnsible for tracking the movements of the proton

  _handlePanResponderMove = (e, gestureState) => {

    this._protonStyles.style.left = this._previousLeftP + gestureState.dx;

    this._protonStyles.style.top = this._previousTopP + gestureState.dy;



    this.setState({

      px: this._protonStyles.style.left,

      py: this._protonStyles.style.top,

    })



    //Updates the state with new coordinates

    this._updateState(1);

    this._updateNativeStyles();

  }



  //Resposnsible for tracking the movements of the electron

  _handlePanResponderMove2 = (e, gestureState) => {

    this._electronStyles.style.left = this._previousLeftE + gestureState.dx;

    this._electronStyles.style.top = this._previousTopE + gestureState.dy;



    this.setState({

      ex: this._electronStyles.style.left,

      ey: this._electronStyles.style.top,

    })



    //Updates the state with new coordinates   

    this._updateState(2);

    this._updateNativeStyles2();

  }



  //Unhighlights the current particle

  _handlePanResponderEnd = (e, gestureState) => {

    this._unHighlight();

    this._previousLeftP += gestureState.dx;

    this._previousTopP += gestureState.dy;

  }



  //Unhighlights the current particle

  _handlePanResponderEnd2 = (e, gestureState) => {

    this._unHighlight2();

    this._previousLeftE += gestureState.dx;

    this._previousTopE += gestureState.dy;

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

  svgStr(Vect1, Vect2, Vect3) {//new function

    var i;
    var j;
    var A2 = new Array();

    // var Vect1=new Vector(x1,y1,0);
    // var Vect2=new Vector(x2,y2,0);
    // var Vect3=new Vector(x3,y3,0);

    var holdVec = new Vector(0, 0, 0);

    var ec = 1;
    var ec2 = -1;

    if (typeof this.state === "undefined") {
      ec = 1;
      ec2 = 1;
    } else {
      ec = this.state.value;
      ec2 = this.state.value2;
    }

    //holdVec = this.getfield2(Vect1, Vect2, Vect3, ec, ec2);
    holdVec = getfield2(Vect1, Vect2, Vect3, ec, ec2);
    tempArray = new Array();

    for (i = 0; i < 6; i++) {
      //A2[i] = new Array();
      for (j = 0; j < 75; j++) {

// Call get field using old starting point to get a new starting point
        //holdVec = this.getfield2(Vect1, Vect2, holdVec, ec, ec2);
        holdVec = getfield2(Vect1, Vect2, holdVec, ec, ec2);

        //svgstring+= " L "+(holdVec.x)+" "+(holdVec.y);// append new starting point to string

        //A2[i][j] = [(holdVec.x), (holdVec.y)];
	tempArray[j] = [(holdVec.x), (holdVec.y)]; 
      }

     A2[i] = {line:tempArray, key: i, arrow:[0,0,0,0,0,0]};

      if (i < 3) {
        Vect3.y -= 5;
      } if (i == 2) {
        Vect3.y += 35;
      } else if (i >= 3 && i < 6) {
        Vect3.y += 5;
      }

      //holdVec = this.getfield2(Vect1, Vect2, Vect3, ec, ec2);
      holdVec = getfield2(Vect1, Vect2, Vect3, ec, ec2);
    }

    //svgstring="L "+A1.toString().replace(/,/g, ' ');

    //console.log(A2)
    /*
        this.setState({
          A1: A2,
        })
    */

    return A2;
  }

  svgStr2(e, e2) {//new function

    var i;
    var j;
    var A2 = new Array();
    var ec = e;
    var ec2 = e2;

    var Vect3 = new Vector(0, 0, 0);
    Vect1 = new Vector(this.state.x1, this.state.y1, 0);
    Vect2 = new Vector(this.state.x2, this.state.y2, 0);

    /* This the top of the SVG screen relative to the View.  We must
     * adjust the number because we're scaling the SVG relative to the View.
     *-200 is just a test number. We need to know where
     * the top of the SVG screen is relative to the View 
     */
     //screenTop = -200;
     screenTop = 100;
     screenBottom = 700;

    // this variable determines the direction of the line, right to left or
    // left to right or both (when charges are the same).
    // Just giving a default value here.
    var direction = "LtoR";
    // arrowPoint is the place in the line where we'll place the arrow
    var arrowPoint = 22;

    var svgHeight = 600;
    if (typeof this.state === "undefined" || this.state.SvgDimensions.height == 0) {
	svgHeight = 600;
    }
    else{
	svgHeight = this.state.SvgDimensions.height;
    }

    /* left charge is neg and right charge is pos
     * Here we set the variable "direction" that indicates
     * which direction the lines go.
     * We also set where to start calculating point charges
    */
    var newPts = new Array();
    if (ec  < 0 && ec2 > 0) {
      direction = "RtoL";
      newPts = getPoints(Vect2, 10);
      arrowPoint = 17;
    }
    // left charge is pos and right charge is neg
    else {
      if (ec > 0 && ec2 < 0){
        direction = "LtoR";
        newPts = getPoints(Vect1, 10);
        arrowPoint = 17;
      }
      else if (ec < 0 && ec2 < 0){
        /* screenTop is set above. We need to know where
	 * the top of the SVG screen is relative to the View 
	*/
     	direction = "down";
        newPts = getPoints(Vect1, 600);
	//direction = "up"
        //newPts = getPoints(Vect1, 10);
	//ec = -1 * ec;
	//ec2 = -1 * ec2;
        arrowPoint = 37;
      } else{ // both charges are positive
        direction = "up";
        newPts = getPoints(Vect1, 10);
        arrowPoint = 17;
      }
    }

    var holdVec = new Vector(0, 0, 0);

    // get the number of points in a line
    pts = this.state.numPoints;

    for (i = 0; i < newPts.length; i++) {


      Vect3 = new Vector(newPts[i][0], newPts[i][1], 0); 
      holdVec = getfield2(Vect1, Vect2, Vect3, ec, ec2);

      tempArray = new Array();
      tempArray[0] = [(holdVec.x), (holdVec.y)];

      arrowArray = new Array();
      Elinemidstart = new Vector(0,0,0);
      Elinemidend = new Vector(0,0,0);

      for (j = 1; j < pts*2; j++) {

        // Call get field using old starting point to get a new starting point
        holdVec = getfield2(Vect1, Vect2, holdVec, ec, ec2);

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
        }

      }


      if (arrowArray.length < 1){
	arrowArray = [0, 0, 0, 0, 0, 0];
      }

     // store this line in the A2 array
     A2[i] = {line:tempArray, key: i, arrow:arrowArray};

    }

   /**********************************************************************/
   /* If the charges are both positive or both negative
    * then we've already calculated the field lines from the left charge
    * and now we'll need to create the field lines from the right charge.
   */
   /**********************************************************************/
    
    if ((ec > 0 && ec2 > 0) || (ec < 0 && ec2 < 0)){ 
    //if ((ec > 0 && ec2 > 0) ){ 

      if (ec < 0 && ec2 < 0){
        // screenTop is set above. We need to know where
	// the top of the SVG screen is relative to the View 
	//
     	direction = "down";
        newPts = getPoints(Vect2, 600);
        arrowPoint = 37;
      } else{ // both charges are positive
        direction = "up";
        newPts = getPoints(Vect2, 10);
        arrowPoint = 17;
      }

    var offset = newPts.length
    for (i = 0; i < newPts.length; i++) {

      Vect3 = new Vector(newPts[i][0], newPts[i][1], 0); 
      holdVec = getfield2(Vect1, Vect2, Vect3, ec, ec2);

      tempArray = new Array();
      tempArray[0] = [(holdVec.x), (holdVec.y)];

      arrowArray = new Array();
      Elinemidstart = new Vector(0,0,0);
      Elinemidend = new Vector(0,0,0);

      for (j = 1; j < pts*2; j++) {

        // Call get field using old starting point to get a new starting point
        holdVec = getfield2(Vect1, Vect2, holdVec, ec, ec2);

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
        }

      }

      if (arrowArray.length < 1){
	arrowArray = [0, 0, 0, 0, 0, 0];
      }

     // store this line in the A2 array
     A2[offset + i] = {line:tempArray, key: offset + i, arrow:arrowArray};
  
     }
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

    if (first == 0 || second == 0){
	return "M 0 0";
    }

    if (first >= 0 && second < 0) {

      // draw the line
      str7 = "M " + this.state.x1 + "," + this.state.y1 + " L " + str7a;

      // draw the arrow
      str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];

    }

    else if (first < 0 && second > 0) {

      // draw the line
      str7 = "M " + this.state.x2 + "," + this.state.y2 + " L " + str7a;

      // draw the arrow
      str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];

    } else if (first < 0 && second < 0) {
	// in this case start from the first position in str7a and end at x1,y1
	var mid = this.state.A1.length / 2;

	/* We start at the end of the line in this situation, not at the charge.
	 * So we have to find the first point and draw the line from there to
	 * the rest of the points stored in str7. This is the only situation where
	 * we have to start at the end of the line.
	*/
	str7End = str7a.slice(1);
	lastX = str7End[str7End.length -1][0];
	if (num < mid){

          str7 = "M " + str7a[0][0] + "," + str7a[0][1] + " L " + str7End + " ";

	/* if one charge is close to 0 (e.g., -1) and the other a large neg (e.g., -5)
 	 * then lines that start close to the -1 charge may end up at the large neg 
	 * charge.  So we check to see where the last point ended up.  This is only a
	 * problem in this particular case; 
	*/
	  if (Math.abs(lastX - this.state.x1) < Math.abs(this.state.x2 - lastX)){
		str7 = str7 + this.state.x1 + " " + this.state.y1;
	  } else{
		str7 = str7 + this.state.x2 + " " + this.state.y2;
	  }

	  str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];

    	} else{ // num >= mid


	  lastX = str7End[str7End.length -1][0];

          str7 = "M " + str7a[0][0] + "," + str7a[0][1] + " L " + str7End + " ";

	/* if one charge is close to 0 (e.g., -1) and the other a large neg (e.g., -5)
 	 * then lines that start close to the -1 charge may end up at the large neg 
	 * charge.  So we check to see where the last point ended up.  This is only a
	 * problem in this particular case; 
	*/
	 if (Math.abs(lastX - this.state.x1) < Math.abs(this.state.x2 - lastX)){
		str7 = str7 + this.state.x1 + " " + this.state.y1;
	  } else{
		str7 = str7 + this.state.x2 + " " + this.state.y2;

	  }
	  str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];
       }
    }
    else {
      // the charges are both positive
      
//console.log("stateToString, first and second greater than 0");

//console.log("str7a = " + str7a);

	var mid = this.state.A1.length / 2;
	if (num < mid){
        str7 = "M " + this.state.x1 + "," + this.state.y1 + " L " + str7a;
	str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];
    	} else{
        str7 = "M " + this.state.x2 + "," + this.state.y2 + " L " + str7a;
	str7 = str7 + " M " + aLine[0] + " " + aLine[1] + " L " + aLine[2] + " " + aLine[3] + " " + aLine[4] + " " + aLine[5];
	}

//console.log("equal charge, string:");
//console.log(str7);
    }

    return str7

  }



  //Updates the state based on the sliders value

  // The "arch" value is used to change the arc of the Bezier curve used for the lines.

  // Can insert equations here to determine the actual change in curve

  _sliderChange(value, value2) {

    var newLColor;
    var newRColor;
    if (value < 0){
	newLColor = "red";
    }
    else if (value > 0){
  	newLColor = "blue";
    }
    else{
	newLColor = "grey";
    }

    if (value2 < 0){
	newRColor = "red";
    }
    else if (value2 > 0){
  	newRColor = "blue";
    }
    else{
	newRColor = "grey";
    }
	
    this.setState({
      lColor: newLColor,
      rColor: newRColor,
    })

    this.setState({

      value: value,
      value2: value2,

      lColor: newLColor,
      rColor: newRColor,

      //arch: 100 + (value * 30),
      //arch2: 100 + (value * 30),
      //arch3: 100 + (value * 30),
    })

    //console.log("new charge:");

    //console.log(this.state.value);

    this.forceUpdate();

    this.svgStr2(value, value2);

  }

   // Note that this function is called when the "onlayout" event
   // of the Svg component is called.  the height and width provided
   // are not the height/width of the surrounding view, rather the 
   // current height and width which vary depending on how much room is needed.

/*
   setSvgDimentions = event => {
    //if (this.state.SvgDimensions) return // layout was already called
    let {width, height} = event.nativeEvent.layout;
    this.setState({SvgDimensions: {width, height}});
    console.log("new Svg dimentions are " + width + " and " + height); 
  }
*/

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
{/*
        <View style={styles.secondrow}
		  onLayout = {event => this.setSvgDimentions(event) }
	 >
*/}


{/*  Use this to make the proton (left charge) movable
          <View style={styles.proton}

            ref={(proton) => {
              this.proton = proton;
            }}
            {...this._panResponder.panHandlers}
          />
*/}

          <Svg height={this.state.SvgDimensions.height} width={this.state.SvgDimensions.width} xmlns="http://www.w3.org/2000/svg" 
  	  >
{/*
		  onLayout = {event => this.setSvgDimentions(event) }
viewBox="-200 -200 1000 1000"
          <Svg height='600' width='600' xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 800 800" >
*/}

            {
              this.state.A1.map((obj,i) => {// Not Chainging A1 here
		
                return <Path key={obj.key} d={this._stateToString(i)} stroke="#FFFF00" strokWidth='100' fill="none" />

              })

            }

	<Circle cx={this.state.x1} cy={this.state.y1} r="15" fill={this.state.lColor} />

	<Circle cx={this.state.x2} cy={this.state.y2} r="15" fill={this.state.rColor} />

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

{/*
          <View style={styles.electron}

            ref={(electron) => {
              this.electron = electron;
            }}
            {...this._panResponder2.panHandlers}

          />
*/}

        </View>

        <View style={styles.thirdrow}>

          <View style={styles.firstcol}>

            <Text style={styles.sliderText}>-10</Text>
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
		// can use onValueChange but this causes constant updating of field lines

              onSlidingComplete={(value) => this._sliderChange(value, this.state.value2)}// cALL SVGtoStr here
            />

            <Slider

              style={styles.slider}
              step={1}
              minimumValue={-10}
              maximumValue={10}
              value={this.state.value2}

              //minimumTrackTintColor="#FFFFFF"
              //maximumTrackTintColor="#000000"

              onSlidingComplete={(value2) => this._sliderChange(this.state.value, value2)}
            />

          </View>

          <View style={styles.thirdcol}>

            <Text style={styles.sliderText}>10</Text>
            <Text style={styles.sliderText}>10</Text>

          </View>

        </View>



        <View style={styles.fourthrow}>

          <Text style={styles.selectText}>Charge Amount</Text>
          <Text style={styles.selectText}>Left: {this.state.value} Right: {this.state.value2}</Text>

        </View>

      </View>
    );

  }


  //Needed functions for pan handlers
  componentDidMount() {

    this._updateNativeStyles();

  }

  //Needed functions for pan handlers
  componentDidMount2() {

    this._updateNativeStyles2();

  }

  //Highlighting the particle gestured
  _highlight = () => {

    this._protonStyles.style.backgroundColor = '#EF7A1A';

    this._updateNativeStyles();

  }

  //Highlighting the particle gestured
  _highlight2 = () => {

    this._electronStyles.style.backgroundColor = '#97A2E7';

    this._updateNativeStyles2();

  }

  //Unhighlighting the particle gestured
  _unHighlight = () => {

    this._protonStyles.style.backgroundColor = '#EF7A1A';

    this._updateNativeStyles();

  }

  //Unhighlighting the particle gestured
  _unHighlight2 = () => {

    this._electronStyles.style.backgroundColor = '#97A2E7';

    this._updateNativeStyles2();

  }

  //Updating the protons style
  _updateNativeStyles() {

    this.proton && this.proton.setNativeProps(this._protonStyles);

  }

  //Updating the electrons style
  _updateNativeStyles2() {

    this.electron && this.electron.setNativeProps(this._electronStyles);

  }

  //Needed functions for pan handlers
  _handleStartShouldSetPanResponder() {

    return true;

  }

  //Needed functions for pan handlers
  _handleStartShouldSetPanResponder2() {

    return true;

  }

  //Needed functions for pan handlers
  _handleMoveShouldSetPanResponder() {

    return true;

  }

  //Needed functions for pan handlers
  _handleMoveShouldSetPanResponder2() {

    return true;

  }

  //Needed functions for pan handlers
  _handlePanResponderGrant = (e, gestureState) => {

    this._highlight();

  }

  //Needed functions for pan handlers
  _handlePanResponderGrant2 = (e, gestureState) => {

    this._highlight2();

  }
}



export default AppScreen;


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
    width: 200,
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
