

for(var i=0;i<document.querySelectorAll(".drum").length;i++){
document.querySelectorAll(".drum")[i].addEventListener("click",function buttonClicked(){

var buttonInnerHTML=this.innerHTML;

  makesound(buttonInnerHTML);
  buttonAnimation(buttonInnerHTML);

});
}

document.addEventListener("keydown",function(event){
  makesound(event.key);
  buttonAnimation(event.key);
});

// make sound function;

function makesound(key){

  switch(key){
  case "w":
    var audio1 = new Audio("sounds/tom-1.mp3");
    audio1.play();
    break;

  case "a":
        var kick = new Audio("sounds/tom-2.mp3");
        kick.play();
        break;

  case "s":
        var snare = new Audio("sounds/tom-3.mp3");
        snare.play();
        break;

      case "d":
          var tom1 = new Audio("sounds/tom-4.mp3");
          tom1.play();
          break;

      case "j":
            var tom2 = new Audio("sounds/snare.mp3");
            tom2.play();
            break;

      case "k":
              var tom3 = new Audio("sounds/crash.mp3");
              tom3.play();
              break;

      case "l":
                var tom4 = new Audio("sounds/kick-bass.mp3");
                tom4.play();
                break;

  default: console.log(buttonInnerHTML);
  }
}

// button animation function

function buttonAnimation(currentkey){
  var activekey=document.querySelector("."+currentkey);
  activekey.classList.add("pressed");
  setTimeout(function(){
    activekey.classList.remove("pressed");
  },100);
}


// audio recoder code


const display = document.querySelector('.display');
const controllerWrapper = document.querySelector('.controllers');

const State = ['Initial', 'Record', 'Download']
let stateIndex = 0
let mediaRecorder, chunks = [], audioURL = ''

// mediaRecorder setup for audio
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    console.log('mediaDevices supported..')

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
            chunks = []
            audioURL = window.URL.createObjectURL(blob)
            document.querySelector('audio').src = audioURL

        }
    }).catch(error => {
        console.log('Following error has occured : ',error)
    })
}else{
    stateIndex = ''
    application(stateIndex)
}

const clearDisplay = () => {
    display.textContent = ''
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}

const record = () => {
    stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
}

const stopRecording = () => {
    stateIndex = 2
    mediaRecorder.stop()
    application(stateIndex)
}

const downloadAudio = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = audioURL
    downloadLink.setAttribute('download', 'audio')
    downloadLink.click()
}

const addButton = (id, funString, text) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.setAttribute('onclick', funString)
    btn.textContent = text
    controllerWrapper.append(btn)
}

const addMessage = (text) => {
    const msg = document.createElement('p')
    msg.textContent = text
    display.append(msg)
}

const addAudio = () => {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = audioURL
    display.append(audio)
}

const application = (index) => {
    switch (State[index]) {
        case 'Initial':
            clearDisplay()
            clearControls()

            addButton('record', 'record()', 'Start Recording')
            break;

        case 'Record':
            clearDisplay()
            clearControls()

            addMessage('Recording...')
            addButton('stop', 'stopRecording()', 'Stop Recording')
            break

        case 'Download':
            clearControls()
            clearDisplay()

            addAudio()
            addButton('record', 'record()', 'Record Again')
            break

        default:
            clearControls()
            clearDisplay()

            addMessage('Your browser does not support mediaDevices')
            break;
    }

}

application(stateIndex)
