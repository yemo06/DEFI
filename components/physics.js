import   Vector  from './Vector.js';  

/* getfield1 
 * calculates the magnetic field vector on a point from a single charge
 * Q1pos:  force vector from charge Q1
 * P:  vector representing the point charge
 * Q1:  the magnitude of the charge
 * returns:  a vector representing the force on point P from charge Q1
*/
export function getfield1(Q1pos, P, Q1) {
    k = Math.pow(10, 7);
    d = 10;
    r1 = P.subtract(Q1pos);
    E1 = r1.multiply(k).multiply(Q1).divide(Math.pow(r1.mag(), 3));
    
    Enet = E1;
    Enetseg = Enet.divide(Enet.mag());
    Enetseg = Enetseg.multiply(d);
    Enetseg = Enetseg.add(P);
 
    return Enetseg
}

/* getfield3 
 * this is the same as getfield1 except that we don't scale the result vector.
 * this function is used in the OneField function that requires real vector lengths.

 * calculates the magnetic field vector on a point from a single charge
 * Q1pos:  force vector from charge Q1
 * P:  vector representing the point charge
 * Q1:  the magnitude of the charge
 * returns:  a vector representing the force on point P from charge Q1
*/
export function getfield3(Q1pos, P, Q1) {
    k = Math.pow(10, 7);
    d = 10;
    r1 = P.subtract(Q1pos);
    E1 = r1.multiply(k).multiply(Q1).divide(Math.pow(r1.mag(), 3));
    
    Enet = E1;
    Enet = Enet.divide(20);

    //Enetseg = Enet.divide(Enet.mag());
    //Enetseg = Enetseg.multiply(d);
    Enetseg = Enet.add(P);
// console.log(Enet.mag());
 
    return Enetseg
}

/* getfield2 
 * calculates the magnetic field vector on a point from two charges
 * Q1pos:  force vector from charge Q1
 * Q2pos:  force vector from charge Q2
 * P:  vector representing the point charge
 * Q1:  the magnitude of the first charge
 * Q2:  the magnitude of the second charge
 * returns:  a vector representing the force on point P from charges Q1 and Q2
*/
export function getfield2(Q1pos, Q2pos, P, Q1, Q2) {
	
    k = Math.pow(10, 7); 
    // k here is not the physical constant k.elQ1tric
    d = 10;
    r1 = P.subtract(Q1pos);
    r2 = P.subtract(Q2pos);
    
    E1 = r1.multiply(k).multiply(Q1).divide(Math.pow(r1.mag(), 3));
    E2 = r2.multiply(k).multiply(Q2).divide(Math.pow(r2.mag(), 3));

    Enet = E1.add(E2);
 
    Enetseg = Enet.divide(Enet.mag())
    Enetseg = Enetseg.multiply(d)
    Enetseg = Enetseg.add(P);
 
    return Enetseg
  }


/*  getArrow
 *  direction:  one of "LtoR", "RtoL", "up", or "down" based on the direction of the line
 *  quadrant:  one of "TopRight" or "BottomRight".  Other quadrants not yet implemented.
 *  lineArray:  an array of array of points.  It looks like [[345.54, 205.32][349.83, 206.45]]
 *              Each element is an array of two points, the x and y coordinates of the next point.
 *
 *  returns:  an array of 6 points.  The points are x1, y1, x2, y2, x3, y3 with each pair
 *            representing a point in the arrow.
 *            A line will ultimately be drawn from the first point to the second to the third
 *            to create the arrow.
 *            The position of the arrow on the line is arrayMid which is initialied to the
 *            middle point of the line, but changed to point 5 for "up" and "down" lines.
 *            These choices are arbitrary and just picked to make the arrow show up on the line.
 */
export function getArrow2(direction, quadrant, lineArray){

      // create the arrow on the line
      // arrow position changes depending on which line we're building
      arrowMid = Math.round(lineArray.length / 2);
      var ax1 = 0;
      var ay1 = 0;
      var ax2 = 0;
      var ay2 = 0;
      // arrow goes from left charge towards right charge
      if (direction == "LtoR"){
	ax1 = lineArray[arrowMid][0] - 8;
	ax2 = lineArray[arrowMid][0] - 8;
	if (quadrant == "TopRight"){
	  ay1 = lineArray[arrowMid][1] - 10;
	  ay2 = lineArray[arrowMid][1] + 10;
    	}
	else{
	  ay1 = lineArray[arrowMid][1] - 10;
	  ay2 = lineArray[arrowMid][1] + 10;
	}
      }
      // arrow goes from right charge towards left charge
      else if (direction == "RtoL"){
	ax1 = lineArray[arrowMid][0] + 8;
	ax2 = lineArray[arrowMid][0] + 8;
	if (quadrant == "TopRight"){
	  ay1 = lineArray[arrowMid][1] - 10;
	  ay2 = lineArray[arrowMid][1] + 10;
    	}
	else{
	  ay1 = lineArray[arrowMid][1] - 10;
	  ay2 = lineArray[arrowMid][1] + 10;
	}
      } else{
      /* lines flow from each charge.  Arrows go different directions depending 
       * on the charge.  Note that there are now 4 quadrants and arrows must be
       * positioned correctly for each.
      */

	//var quart = this.state.A1.length / 4;
	// if charges are equal, put the arrow head close to the charge
	arrowMid = 5;
	if (direction == "down"){
	   ax1 = lineArray[arrowMid][0] + 6;
	   ax2 = lineArray[arrowMid][0] - 6;
	   if (quadrant == "TopRight"){
	     ay1 = lineArray[arrowMid][1] - 6;
	     ay2 = lineArray[arrowMid][1] - 6;
           } else{ 
	     ay1 = lineArray[arrowMid][1] + 6;
	     ay2 = lineArray[arrowMid][1] + 6;
           } 
	}else{
	   ax1 = lineArray[arrowMid][0] + 6;
	   ax2 = lineArray[arrowMid][0] - 6;
	   if (quadrant == "TopRight"){
	     ay1 = lineArray[arrowMid][1] + 6;
	     ay2 = lineArray[arrowMid][1] + 6;
           } else{ 
	     ay1 = lineArray[arrowMid][1] - 6;
	     ay2 = lineArray[arrowMid][1] - 6;
           } 
	}
      }

      // arrowArray is an array consisting of 6 points.  A line will ultimately be
      // be drawn from the first point to the second point to the third point to create the arrow.
      arrowArray = [ax1, ay1, lineArray[arrowMid][0], lineArray[arrowMid][1], ax2, ay2];

      return arrowArray;
}

/* getPoints
 * returns points evenly distributed around a charge
 * vect1:  the charge
 * d: distance from the charge.  This will be small for 
 *    positive charges since the lines start at the charge
 *    It will be large for negative charges since the field lines
 *    flow into the charge.
 * returns: an array of arrays.  Each inner array is a point through
 *          which a line flows.
*/
export function getPoints(vect1, h){

  pointArray = new Array();
  // We start at 10.01 because arctan(PI/2) is weird, so we
  // want to avoid calulating at exactly PI/2
  angle = 10.01;
  currentAngle = angle;
  limit = 360/angle;

  x0 = vect1.x;
  y0 = vect1.y;
  tmpArray = new Array();
  tmpArray.push([x0,y0]);

  for(i = 0; i < limit; i++){
    // find the x,y coordinates of the next point
    currentRadians = currentAngle * Math.PI / 180;
    newX = h * Math.cos(currentRadians) + x0;
    newY = h * -1 * Math.sin(currentRadians) + y0;
    // change the new vector to be relative to
    // our coordinate system by adding vect1 to it
    tmpVector = new Vector(newX, newY, 0);
    //tmpVector = vect1.add(tmpVector);
    // store this point
    tmpArray =[tmpVector.x, tmpVector.y];
    // add the point to the array of points
    pointArray.push(tmpArray);

    // change the angle to get the next point
    currentAngle = currentAngle + angle;
  }
  return pointArray;
}

/* getGrid
 * param: wd: width of the grid
 * param: ht: height of the gird
 * param: gap: space between each point (vertical and horizontal)
 * returns: an array of arrays.  Each inner array is a point through
 *          which a line flows.
*/
export function getGrid(wd, ht, gap){
 
  var gridArray = new Array();
  var tmpArray = new Array();
 
  var newY = 75;
  var newX = 75;
  var limit1 = wd/50;
  var limit2 = ht/50;
  for(i = 0; i < limit2 ; i++){
    newX = 13;
    for(j = 0; j < limit1; j++){
 
      // create the next point point
      tmpArray = [newX, newY];
      // add the point to the array of points
      gridArray.push(tmpArray);
 
      // increment to the next x coordinate point
      newX = newX + gap;
     }  // end inner loop
     newY = newY + gap;
  } // end outer loop
 
//console.log("gridArray:");
//console.log(gridArray);
 
  return gridArray;
}

export function getArrow3(ec, Vect1, Elinemidstart, Elinemidend) {
	arrowMid = new Vector(0,0,0);
	// let’s make Elinemidend the midpoint of the arrow.
	arrowMid.x = Elinemidend.x;
	arrowMid.y = Elinemidend.y;
	// let’s find the angle of rotation (theta) that the Elinemid segment makes with the positive x axis.
	Elinemid = Elinemidend.subtract(Elinemidstart);

// PROBLEM:  ELINEMID.X CAN BE 0 when the line is at 90 degrees, i.e., Elinemidend.x - Elinemidstart.x = 0!
// SOLUTION: JavaScript arctan seems to be able to handle infinity!

	theta = Math.atan(Elinemid.y/Elinemid.x);
	/* The JavaScript atan function only returns a value between -PIE/2 and PIE/2
	 * which won't be correct when the vector points the wrong way.
	 * We can add 180 to theta to get the correct value when this happens
	*/
	if ((Elinemidstart.x >= Elinemidend.x )  ){  // in 2nd or 3rd quadrant
		theta = Math.PI + theta;
	}

	// define the depth (squattiness) and width (wingspan) of the arrow
	adepth = 8;
	awidth = 10;
	/* now let’s find the points that correspond to the top (ax1,ay1) and bottom (ax2,ay2) 
	 * segments of the arrow. These equations come from a rotation matrix operating on the 
	 * original arrow head points (pointing to the right). This SHOULD work for all angles theta.
	*/
	ax1 = arrowMid.x - adepth*Math.cos(theta) - awidth*Math.sin(theta);
	ay1 = arrowMid.y - adepth*Math.sin(theta) + awidth*Math.cos(theta);
	ax2 = arrowMid.x - adepth*Math.cos(theta) + awidth*Math.sin(theta);
	ay2 = arrowMid.y - adepth*Math.sin(theta) - awidth*Math.cos(theta);

	/* Create an arrow array consisting of three points (each with x and y coordinates). 
	 * A line will ultimately be drawn from the first point to the second to the third 
	 * point to create the arrow, as was done in getArrow2:
	*/

	arrowArray = [ax1, ay1, arrowMid.x, arrowMid.y, ax2, ay2];

	return arrowArray;
}


/****************************************************************************************
 * getArrow4
 *  this is for the OneField.js file.  The only difference with getArrow3 is the size of the
 *  arrow, i.e., the variable d is smaller.
 *
****************************************************************************************/

export function getArrow4(ec, Vect1, Elinemidstart, Elinemidend) {
	arrowMid = new Vector(0,0,0);
	// let’s make Elinemidend the midpoint of the arrow.
	arrowMid.x = Elinemidend.x;
	arrowMid.y = Elinemidend.y;
	// let’s find the angle of rotation (theta) that the Elinemid segment makes with the positive x axis.
	Elinemid = Elinemidend.subtract(Elinemidstart);

// PROBLEM:  ELINEMID.X CAN BE 0 when the line is at 90 degrees, i.e., Elinemidend.x - Elinemidstart.x = 0!
// SOLUTION: JavaScript arctan seems to be able to handle infinity!

	theta = Math.atan(Elinemid.y/Elinemid.x);
	/* The JavaScript atan function only returns a value between -PIE/2 and PIE/2
	 * which won't be correct when the vector points the wrong way.
	 * We can add 180 to theta to get the correct value when this happens
	*/
	if ((Elinemidstart.x >= Elinemidend.x )  ){  // in 2nd or 3rd quadrant
		theta = Math.PI + theta;
	}

	// define the depth (squattiness) and width (wingspan) of the arrow
	adepth = 6;
	awidth = 8;
	/* now let’s find the points that correspond to the top (ax1,ay1) and bottom (ax2,ay2) 
	 * segments of the arrow. These equations come from a rotation matrix operating on the 
	 * original arrow head points (pointing to the right). This SHOULD work for all angles theta.
	*/
	ax1 = arrowMid.x - adepth*Math.cos(theta) - awidth*Math.sin(theta);
	ay1 = arrowMid.y - adepth*Math.sin(theta) + awidth*Math.cos(theta);
	ax2 = arrowMid.x - adepth*Math.cos(theta) + awidth*Math.sin(theta);
	ay2 = arrowMid.y - adepth*Math.sin(theta) - awidth*Math.cos(theta);

	/* Create an arrow array consisting of three points (each with x and y coordinates). 
	 * A line will ultimately be drawn from the first point to the second to the third 
	 * point to create the arrow, as was done in getArrow2:
	*/

	arrowArray = [ax1, ay1, arrowMid.x, arrowMid.y, ax2, ay2];

	return arrowArray;
}
