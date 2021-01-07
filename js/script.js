var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
const searchForm = document.querySelector("#search-form");
const searchFormInput = searchForm.querySelector("input");
const diagnostic = document.querySelector('.output');
const button = document.querySelector('button');
const icon = button.firstElementChild;

//grammar doesn't work
var t = ['What is the time now?'];
var grammar = '#JSGF V1.0; grammar  t; public <t> = ' + t.join(' | ') + ';'

var synth = window.speechSynthesis;
//for speaking

//new constructor
var recognition = new SpeechRecognition();
//speech grammar list contains our grammar
var speechRecognitionList = new SpeechGrammarList();
//adding grammar to our list --> it accepts the string we want to add(grammar + importance of the grammar 1 --> 0-1 incl.)
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//continuous recognition --> do we want it to keep listening?
recognition.continuous = true;
//language
recognition.lang = 'en-US';
//interim results or final results --> can be tweaked later
recognition.interimResults = false;
//how many alternative results should be displayed? if the system didn't quite catch what we said we can set it
//to show us other possibilites --> this could come in handy
recognition.maxAlternatives = 1;


//for search
button.addEventListener('click', click);
function click(){
    if(icon.classList.contains('fa-microphone')){
        icon.classList.remove('fa-microphone');
        icon.classList.add('fa-microphone-slash')
        recognition.start();
        speak();
    }
    else{
        icon.classList.remove('fa-microphone-slash');
        icon.classList.add('fa-microphone');
        recognition.stop(); 
    }

}


  if(SpeechRecognition) {
    console.log("Your Browser supports speech Recognition");
  }

  recognition.addEventListener('end', endRecognition);
  function endRecognition(){
      icon.classList.remove('fa-microphone-slash');
      icon.classList.add('fa-microphone');
  }



  recognition.onresult = function(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    console.log(transcript)
    
    if(transcript.toLowerCase().trim()==="stop"){
        endRecognition();
        recognition.stop();
    }
        else if(transcript.toLowerCase().trim()==="what's the time"){
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes();
        function speakResult(){
          var utterThis = new SpeechSynthesisUtterance("Right now, it is" + time);
          synth.speak(utterThis);
          searchFormInput.value = "";
          recognition.stop();
        }
        speakResult();
        console.log(transcript)
        }
        else if(transcript.toLowerCase().trim()==="reset"){
            searchFormInput.value = "";
        }
        else if(!searchFormInput.value) {
            searchFormInput.value = transcript;
        }
    else{
        if(transcript.toLowerCase().trim()==="search"){
            recognition.stop();
            searchForm.submit();
            searchFormInput.value = "";
        }

        else{
            recognition.stop();
            searchFormInput.value = "";
            console.log(transcript)
    }
    }
    diagnostic.textContent = 'Result received: ' + transcript + '.';
  }

  //welcome message
  //this says initial message when clicked --> it has to be inside utterThis  
  function speak(){
    var utterThis = new SpeechSynthesisUtterance("welcome");
      synth.speak(utterThis)
  }
