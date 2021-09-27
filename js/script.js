let keyboard =document.querySelector('.piano-keyboard');
let controls = document.querySelectorAll('.piano-controls-option');
let tempoSelect=document.querySelector('.piano-tempo');
let songSelect=document.querySelector('.piano-song-list');


  let pianoNotes=['C','D','E','F','G','A','B'];
  let keyboardMap =['1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N'];
  let keys=[]; 

  let playbtn=document.querySelector('.piano-play-btn'); 
  let happyBirthday=`G4,G4,A4,,G4,,C4,,B4,,,,G4,G4,A4,,G4,,D5,,C5,,,,,G4,G4,G5,,E5,,C5,,B4,,A4,,,,,F5,F5,E5,,C5,,D5,,C5`;
  let jingleBell=`B3,,B3,,B3,,,,,,B3,,B3,,B3,,,,B3,,D4,,G3,,A3,,B3,,,,C4,,C4,,C4,,,,C4,C4,,B3,,B3,,,,B3,B3,B3,,A3,,B3,,A3,,,,D4`;

  let playSong =(noteString,tempo,cb)=>{
    let notes = noteString.split(',');
    let currNote=0;
    let mousedown=new Event('mousedown');
    let btn;
    let mouseup =new Event('mouseup');
    let interval=setInterval(()=>{
     if(currNote<notes.length){
      if (notes[currNote].trim()!==''){
        if(btn){
          btn.dispatchEvent(mouseup);
        }
         
         
          btn=document.querySelector(`[data-letter-note="${notes[currNote]}"]`)
          btn.dispatchEvent(mousedown);
        }
          currNote++;
      }
      else {
        btn.dispatchEvent(mouseup);
        clearInterval(interval);
        cb();   
      }
    },300/tempo);
  }
  playbtn.addEventListener('mousedown',()=>{
    let tempo= +tempoSelect.value;
    let songNum=+songSelect.value;
    playbtn.disabled=true;
    let enablePlayBtn=()=>playbtn.disabled=false;
    switch(songNum){

     case 1 : playSong(jingleBell,tempo,enablePlayBtn );break;
     case 2 : playSong(happyBirthday,tempo,enablePlayBtn );break;
    }
  })

  let init =()=>{
    for(let i=1;i<=5;i++){
      for(let j=0;j<7;j++){
        let key=createKey('white',pianoNotes[j],i);
        key.dataset.keyboard=keyboardMap[j+(i-1)*7];
        // key.dataset.keyboard=keyboardMap[j]
        keyboard.appendChild(key);
        if(j!==2&&j!==6){
          key=createKey('black',pianoNotes[j],i);
          key.dataset.keyboard='⇧+'+keyboardMap[j+(i-1)*7];
          let emptySpace=document.createElement('div');
          emptySpace.className='empty-space';
          emptySpace.appendChild(key);
          keyboard.appendChild(emptySpace);
       
          
        }
      }
    }
  }

  let createKey=(type,note,octave)=>{
    let key=document.createElement('button');
    key.className=`piano-key piano-key-${type}`;
    key.dataset.letterNote=type==='white'?note+octave:note+'#'+octave;
    key.dataset.letterNoteFileName=type==='white'?note+octave:note+'s'+octave;
    key.textContent=key.dataset.letterNote;
    keys.push(key);

    key.addEventListener('mousedown',()=>{
      playSound(key);
      key.classList.add('piano-key--playing');

    })
    key.addEventListener('mouseleave',()=>{
     
      key.classList.remove('piano-key--playing');

    })
    key.addEventListener('mouseup',()=>{
     
      key.classList.remove('piano-key--playing');

    })
    return key;
  }

  document.addEventListener('keydown',(event)=>{
     if(event.repeat){
       return;
     }
     pressKey('mousedown',event);
  })
  document.addEventListener('keyup',(event)=>{
   pressKey('mouseup',event);
  })

  let pressKey=(MouseEvent,e)=>{
    let lastLetter=e.code.substring(e.code.length-1); 
    let isShiftPressed =e.shiftKey;
    let selector;
    if(isShiftPressed){
      selector=`[data-keyboard="⇧+${lastLetter}" ]`;
    }
    else{
      selector=`[data-keyboard="${lastLetter}" ]`;
    }
    let key=document.querySelector(selector);
    if(key!==null){
      let event= new Event (MouseEvent);
      key.dispatchEvent(event);
    }
  }

  let playSound=(key)=>{
    let audio=document.createElement('audio');
    audio.src='sounds/'+key.dataset.letterNoteFileName+'.mp3';
    audio.play().then(()=>{
      audio.remove();
    }).catch((error)=>{
      console.log(error);
    }) 
  }

  controls.forEach((input)=>{
    input.addEventListener('input',()=>{
      let value=input.value;
      let type;
      switch(value){
        case 'LetterNotes':type='letterNote';break;
        case 'keyboard':type='keyboard';break;
        case 'none':type='';
      }
      keys.forEach((key)=>{
        key.textContent =key.dataset[type];
      })
    })
  })

    init();