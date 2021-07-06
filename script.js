// Author:Jordan Muturi

// Global UI Variables
let canvasDiv;
let canvas;
let textDiv;
let textP;
let textP2;
let buttonDiv;
let upButton;
let downButton;
let leftButton;
let rightButton;


// Global ML variables
let featureExtractor;
let imgFeatures;
let knnClassifier;
let video;
let isModelReady;
let ups;
let downs;
let lefts;
let rights;


function setup() {
  canvasDiv = createDiv();
  canvas = createCanvas(640, 480);
  canvas.parent(canvasDiv);
  textDiv = createDiv();
  textP = createP("Model is loading, please wait...");
  textP.parent(textDiv);
  textP2 = createP("[Training data here.]");
  textP2.parent(textDiv);
  buildButtons();
  ups = 0;
  downs = 0;
  lefts = 0;
  rights = 0;
  video = createCapture(VIDEO, videoReady);
}

function draw() {
  if(isModelReady) {
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0);
    imgFeatures = featureExtractor.infer(canvas);
    if(knnClassifier.getNumLabels() > 0) {
      knnClassifier.classify(imgFeatures, gotResults);
    }
  }
}

function buildButtons() {
  buttonDiv = createDiv();
  //up button
  upButton = createButton("Up");
  upButton.parent(buttonDiv);
  upButton.mousePressed(function() {
    ups++;
    textP2.html("Ups: " + ups + " - Downs " + downs + " - Lefts: " + lefts +  " - Rights: " + rights);
    knnClassifier.addExample(imgFeatures, "Up");
  });
  //down button
  downButton = createButton("Down");
  downButton.parent(buttonDiv);
  downButton.mousePressed(function() {
    downs++;
    textP2.html("Ups: " + ups + " - Downs " + downs + " - Lefts: " + lefts +  " - Rights: " + rights);
    knnClassifier.addExample(imgFeatures, "Down");
  });
  //left button
  leftButton = createButton("Left");
  leftButton.parent(buttonDiv);
  leftButton.mousePressed(function() {
    lefts++;
    textP2.html("Ups: " + ups + " - Downs " + downs + " - Lefts: " + lefts +  " - Rights: " + rights);
    knnClassifier.addExample(imgFeatures, "Left");
  });
  //right button
  rightButton = createButton("Right");
  rightButton.parent(buttonDiv);
  rightButton.mousePressed(function() {
    rights++;
    textP2.html("Ups: " + ups + " - Downs " + downs + " - Lefts: " + lefts +  " - Rights: " + rights);
    knnClassifier.addExample(imgFeatures, "Right");
  });
  buttonDiv.style("display", "none");
}

function videoReady() {
  video.style("display", "none");
  featureExtractor = ml5.featureExtractor("MobileNet", featureExtractorLoaded);
}

function featureExtractorLoaded() {
  isModelReady = true;
  knnClassifier = ml5.KNNClassifier();
  textP.html("Begin adding examples!");
  buttonDiv.style("display", "block");
}

function gotResults(error, results) {
  if(error) {
    console.error(error);
  } else {
    textP.html("Label: " + results.label);
  }
}
