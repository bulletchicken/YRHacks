//import * as ITMES from "script.js";

let my_cam;
let posenet;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let pose,skeleton;
let actor_img;
let specs,smoke;

let leftROM = []
let rightROM = []

let leftPeak = 0;
let rightPeak = 0;
let i = 0;
let score;

function setCookies() {
    document.cookies = "left="+ leftPeak;
    document.cookies = "right="+ rightPeak;
}

function leftScore() {
    if(leftROM[i]>leftPeak){
        leftPeak = leftROM[i];
        document.getElementById('high').innerHTML = leftPeak;
    }
    i++;
    console.log(leftPeak);
    return leftROM[i];
    
}

function rightScore() {
    if(rightROM[i]>rightPeak){
        rightPeak = rightROM[i];
        document.getElementById('high').innerHTML = rightPeak;
    }
    i++;
    return rightROM[i];
   
}


Plotly.plot('chart', [{
    y: [rightScore()],
    type: 'line',

}, {
    y: [leftScore()],
    type: 'line',
}]);

setInterval(function(){
    console.log(score);
    Plotly.extendTraces('chart', { 
        y:[[rightScore()]]
    }, [0]);
    Plotly.extendTraces('chart', {
        y:[[leftScore()]]
    }, [1])
},200);


let target = document.getElementById('') 

let activityLeft = [0];
let activityRight = [0];

function setup() {
    var canvas = createCanvas(900, 500);
    my_cam = createCapture(VIDEO)
    
    my_cam.size(900, 500)
    my_cam.hide();
    posenet = ml5.poseNet(my_cam,{ detectionInterval: 200 }, modelLoaded);
    posenet.on('pose',receivedPoses);

    
    //document.body.innerHTML += '<div id="chart"></div>'; // the += means we add this to the inner HTML of body
    //document.getElementById('someBox').innerHTML = '<canvas id="someId"></canvas>'; // replaces the inner HTML of #someBox to a canvas

}



function receivedPoses(poses){

    
    //work here to run functions
    

    if(poses.length > 0){
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }

    //calculate range of motion of arms

    const leftarm = pose.leftWrist
    const rightarm = pose.rightWrist

    const min = ((pose.rightHip.y - pose.rightShoulder.y)/3)*2 + pose.rightShoulder.y;

    const max = pose.rightShoulder.y;
    const range = min-max;


    //use min also as a pivot point for the acitivty
    //min = 0%
    //max = shoulder line

    //left arm activity
    //same logic, just reverse small and larger


    //left arm.y - min is the distance of the arm to the 
    if(leftarm.y<min){
        //if activity is found, update graph

        
        // -min for vertical adjnustment
        score = (int)((((range-(leftarm.y-min))/range)-1)*100);
        leftROM.push(score);
    }

    //right arm activity
    //idk why it is greater but it is...
    if(rightarm.y<min){
        score = (int)((((range-(rightarm.y-min))/range)-1)*100);
        rightROM.push(score);
    }
    
}

function modelLoaded() {
    console.log('Model has loaded');
}

function draw() {
    
    image(my_cam, 0, 0, 900, 500);
    fill(255,255,255);

    if(pose){
        for(let i=0; i<pose.keypoints.length; i++){
            ellipse(pose.keypoints[i].position.x, pose.keypoints[i].position.y,20);
        }
        stroke(255,255,255);
        strokeWeight(3);
        for(let j=0; j<skeleton.length; j++){
            line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y)
        }
    }

}