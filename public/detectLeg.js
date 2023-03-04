//import * as ITMES from "script.js";

let my_cam;
let posenet;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let pose,skeleton;
let actor_img;
let specs,smoke;


let target = document.getElementById('') 

let activityLeft = [0];
let activityRight = [0];

function setup() {

    var canvas = createCanvas(900, 500);
    my_cam = createCapture(VIDEO)
    
    my_cam.size(900, 500)
    my_cam.hide();
    posenet = ml5.poseNet(my_cam, modelLoaded);
    posenet.on('pose',receivedPoses);
}


function receivedPoses(poses){

    //work here to run functions
    

    if(poses.length > 0){
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }

    //calculate range of motion of arms
    const leftknee = pose.leftKnee;
    const rightknee = pose.rightKnee;

    //only one leg can be on the floor TT so I will just compare with the static one
    
    let min;
    let max = pose.leftHip.y;
    if(leftknee.y > rightknee.y){
        min = leftknee.y;
    } else{
        min = rightknee.y;
    }

    
    const range = min-max;


    //use min also as a pivot point for the acitivty
    //min = 0%
    //max = shoulder line

    //left arm activity
    //same logic, just reverse small and larger


    //left leg.y - min is the distance of the arm to the 
    if(leftknee.y<min){
        //if activity is found, update graph
        console.log('hit');
        // -min for vertical adjnustment
        const score = ((((range-(leftknee.y-min))/range)-1)*100);

    }

    //right arm activity
    if(rightknee.y>min){

        console.log('asdlfkjaslkdfj');
        const score = ((((range-(rightknee.y-min))/range)-1)*100);
    }
    
    console.log(poses[0]);
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