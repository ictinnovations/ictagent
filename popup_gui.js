// Test Samples
// ===================================================================
/* 
// copy / paste following code in console for testing

// when user click on some phone number
dial_a_number(7777);

// put account list into transfer dropdown
accounts = [
  {first_name: 'Nasir', last_name: 'Iqbal', phone: '03336186096'},
  {first_name: 'Kashif', last_name: '', phone: '03157180220'},
  {first_name: '', last_name: 'Adeel', phone: '23232323'}
];
update_extension_list(accounts);

// to similate an incoming call
event_incomming('3333', 'Nasir Iqbal');

// Call answered by remote end
event_answer();

// call hanguped from remote end
event_hangup();

*/

// Variables
// ===================================================================
callerid_number = null;
callerid_name = null;
var targetActivity = null;


// Function for extran use
// ===================================================================
function dial_a_number(in_number) {
  console.log('dial a number called why ?');
  app.activity.screenData.idle.phoneField.value = in_number;
  changeActivity('callUncallButton', 'start');
}

function update_extension_list(aExtension) {
  var extension_box = app.activity.screenData.incall.transfer.querySelector('.t__m select');
  while (extension_box.options.length > 0) {                
    extension_box.remove(0);
  }

  var fragment = document.createDocumentFragment();
  aExtension.forEach(function(extension, index) {
      var opt = document.createElement('option');
      opt.innerHTML = extension.first_name + ' ' + extension.last_name + ' <' + extension.phone + '>';
      opt.value = extension.phone;
      fragment.appendChild(opt);
  });
  extension_box.appendChild(fragment);
}

// Call Events (i.e changes in WebRTC session status)
// ===================================================================
function event_incomming(in_number, in_name) {
  callerid_number = in_number;
  callerid_name = in_name;
  changeActivity('eventRingingInbound');
}

function event_answer() {
  // alert("Outbound call answered");
  changeActivity('eventCallAnswered');
}

function event_hangup() {
  if (currentActivity != 'idle') {
    console.log('event hangup called why ?');
    closeIncallTools('dtmf');
    closeIncallTools('transfer');
    changeActivity('callUncallButton', 'stop');
    app.phoneTools[1].parentElement.classList.add('hidden');
    app.phoneTools[1].parentElement.classList.remove('hidden');
  }
}

// Action requested from GUI i.e (button clicks)
// ===================================================================
function action_dial(phone_number) {
      var dial_no = phone_number + '@' + extension.host;
      console.log('action dial called why ?');
      simple.call(dial_no);
      // alert("dialing " + dial_no);
}

function action_answer() {
  simple.answer();
  // alert("incoming call accepted"); 
}

function action_transfer(phone_number) {
  simple.session.refer(phone_number);
  // alert("transfer call to " + phone_number);
}

function action_dtmf(digit) {
  console.log(digit);
  simple.session.dtmf(digit);
}

function action_hangup() {
   console.log('hangup called why ?');
  if (simple.state == C.STATUS_CONNECTING || simple.state == C.STATUS_CONNECTED) {
    console.log("in hangup");
    simple.hangup();  
  }
  else if (simple.state == C.STATUS_NEW) {
    console.log("STATUS NULL HANGUP")
    simple.reject();
  }
}

function action_load_contact(phone_number) {
    load_contact(phone_number);
}

function action_online() {
  // options.ua.register = true;
  // alert("agent online");
}

function action_offline() {
  // options.ua.register = false;
  // alert("agent offline");
}

function action_reject() {
  // alert('Reject Call');
  simple.reject();
}

function action_close() {
  window.close();
}


    // Properties Declaration
    var app = [];
    var clientStatus = null;
    var currentActivity = null;

    // Properties Definition
    app['$'] = document.getElementById('a');
    app['modal'] = app.$.querySelector('.a__m');
    app['title'] = app['modal'].children[0].children[1].firstElementChild;
    app['closeToggle'] = app['modal'].children[0].children[2].firstElementChild;
    app['statusToggle'] = app['modal'].children[0].children[0].firstElementChild;
    app['template'] = (function (elementArray) {
      var newElementArray = [];
      for (var i in elementArray) {
        if (elementArray[i] instanceof Element) {
          newElementArray[elementArray[i].dataset.templateName] = elementArray[i];
        }
      }

      return newElementArray;
    })(app['modal'].children[1].querySelectorAll('.template'));
    app['phoneTools'] = app['modal'].children[2].querySelectorAll('button');
    app['activity'] = {
      phoneData: {
        number: null,
        //ip: null,
        id: null
      },
      screenData: {
        idle: {
          title: 'Dialer',
          phoneField: app.template.idle.children[0].firstElementChild,
          numpad: app.template.idle.children[1],
        },
        incoming: {
          title: 'Incoming',
          idLabel: app.template.incoming.children[0].children[0].lastElementChild,
          numberLabel: app.template.incoming.children[0].children[1].firstElementChild,
          //ipLabel: app.template.incoming.children[0].children[1].lastElementChild.querySelector('.ip')
        },
        outgoing: {
          title: 'Outgoing',
          numberLabel: app.template.outgoing.children[0].children[1].firstElementChild,
          //ipLabel: app.template.outgoing.children[0].children[1].lastElementChild.querySelector('.ip')
        },
        incall: {
          title: 'In Call',
          idLabel: app.template.incall.children[0].children[0].lastElementChild,
          numberLabel: app.template.incall.children[0].children[1].firstElementChild,
          //ipLabel: app.template.incall.children[0].children[1].lastElementChild.querySelector('.ip'),
          tools: app.template.incall.children[0].children[2],
          transfer: app.template.incall.children[0].children[3].querySelector('.s-a__b').firstElementChild,
          dtmf: app.template.incall.children[0].children[3].querySelector('.s-a__b').lastElementChild,
        },
        offline: {
          title: 'Offline',
        }
      }
    };

    // Register all event handler
    app.closeToggle.addEventListener('click', closeModal, false);
    app.statusToggle.addEventListener('click', function () {
      if (clientStatus === 1 && currentActivity != 'idle') {
        // alert('Cannot set offline while call is in progress.');
        return;
      }

      changeClientStatusIndicator();
      changeActivity('clientStatusToggle');
    }, false);
    tippy(app.statusToggle, {
      placement: 'bottom-start',
      dynamicTitle: true,
      arrow: true,
      hideOnClick: false
    });
    [].forEach.call(app.phoneTools, function (element) {
      element.addEventListener('click', function () {
        console.log('callUncallButton ' + element.dataset.action);
        changeActivity('callUncallButton', element.dataset.action);
      }, false);
    });
    [].forEach.call(app.activity.screenData.idle.numpad.querySelectorAll('button'), function (element) {
      element.addEventListener('click', function (event) {
        numpadPress(event);
      }, false);
    });
    [].forEach.call(app.activity.screenData.incall.tools.querySelectorAll('button'), function (element) {
      element.addEventListener('click', function (event) {
        var button = closestParent(event.target, 'button');
        if (button) openIncallTools(button.dataset.action);
      }, false);
    });

    [].forEach.call(app.activity.screenData.incall.dtmf.querySelectorAll('.numpad button'), function (element) {
      element.addEventListener('click', function (event) {
        event.preventDefault();

        var button = event.target;
        if (event.target.tagName.toLowerCase() !== 'button') {
          for (var i=0; i<event.path.length; i+=1) {
            if (event.path[i].tagName.toLowerCase() === 'button') {
              button = event.path[i];
              break;
            }
          }
        }
        var char = button.value;
        action_dtmf(char);
      }, false);
    });
    app.activity.screenData.incall.transfer.querySelector('.t__m button').addEventListener('click', function () {
      extension_number = app.activity.screenData.incall.transfer.querySelector('.t__m select').value;
      console.log(extension_number);
      action_transfer(extension_number);
    }, false);

    app.activity.screenData.incall.numberLabel.addEventListener('click', function () {
      action_load_contact(app.activity.phoneData.number);
    }, false);
    
    app.activity.screenData.outgoing.numberLabel.addEventListener('click', function () {
      action_load_contact(app.activity.phoneData.number);
    }, false);
    
    app.activity.screenData.incoming.numberLabel.addEventListener('click', function () {
      action_load_contact(app.activity.phoneData.number);
    }, false);


    // Helpers
    function closestParent(element, targetTagName) {
      if (element.tagName.toLowerCase() !== targetTagName) {
        closestParent(element.parentElement, targetTagName);
      }
      else if (element.tagName.toLowerCase() === targetTagName) {
        return element;
      }
      else if (element.tagName.toLowerCase() === 'body') {
        return false;
      }
    }

    function openModal () {
      currentActivity = 'idle';

      app.$.className = '';
      app.title.innerText = app.activity.screenData[currentActivity].title;
      //app.modal.animate('fadeInDown', function () {
        changeClientStatusIndicator();
      //});
    }

    function closeModal () {
      if (currentActivity == null) return;
      if (currentActivity != 'idle' && currentActivity != 'offline') {
        // alert('Cannot close app while call is in progress.');
        return;
      }

      changeClientStatusIndicator();
      clientStatus = null;
      currentActivity = null;
      app.modal.animate('fadeOutUp', function () {
        resetActivity();
        app.$.className = 'hidden';
      });
      
      action_close(); // ict
    }

    function openIncallTools (toolName) {
      // app.template.incall.parentElement.style.cssText = "z-index: 99;";
      app.phoneTools[1].parentElement.classList.add('hidden');
      app.activity.screenData.incall.tools.nextElementSibling.classList.remove('hidden');

      app.activity.screenData.incall[toolName].animate('slideInUp').classList.remove('hidden');
      app.activity.screenData.incall[toolName].querySelector('.sub-activity-toggle').addEventListener('click', function() {
        closeIncallTools (toolName);
      }, {once: true})
    }

    function closeIncallTools (toolName) {
      app.activity.screenData.incall[toolName].animate('fadeOutDown', function () {
        app.activity.screenData.incall[toolName].classList.add('hidden');
        app.template.incall.parentElement.removeAttribute('style');
        app.activity.screenData.incall.tools.nextElementSibling.classList.add('hidden');
        app.phoneTools[1].parentElement.classList.remove('hidden');
      });
    }

    function changeClientStatusIndicator () {
      var indicator = app.statusToggle.firstElementChild;

      if (clientStatus == null) {
        indicator.className = 'online';
        app.statusToggle.title = "<span style='display:inline-block; font-size:14px; line-height:14px; vertical-align: middle; margin-right: 7px;'>Go offline</span><span style='width:14px; height:14px; border-radius:14px; background-color:#FF3455; display: inline-block; vertical-align: middle; margin: 6px 0;'></span>";
        clientStatus = 1;
        action_online();
      }
      else {
        if (clientStatus === 1) {
          indicator.className = 'offline';
          app.statusToggle.title = "<span style='display:inline-block; font-size:14px; line-height:14px; vertical-align: middle; margin-right: 7px;'>Go online</span><span style='width:14px; height:14px; border-radius:14px; background-color:#00E789; display: inline-block; vertical-align: middle; margin: 6px 0;'></span>";
          clientStatus = 0;
          action_offline();
        }
        else if (clientStatus === 0) {
          indicator.className = 'online';
          app.statusToggle.title = "<span style='display:inline-block; font-size:14px; line-height:14px; vertical-align: middle; margin-right: 7px;'>Go offline</span><span style='width:14px; height:14px; border-radius:14px; background-color:#FF3455; display: inline-block; vertical-align: middle; margin: 6px 0;'></span>";
          clientStatus = 1;
          action_online();
        }
      }
    }
    function changeActivity (methodCaller, actionName) {
      var oldActivity = currentActivity;
      targetActivity = null;

      if (methodCaller == 'callUncallButton') {
        if (typeof actionName === 'undefined' || (actionName != 'start' && actionName != 'stop')) return;

        var button = (actionName == 'start') ? app.phoneTools[0] : app.phoneTools[1];

        if (oldActivity == 'idle') {
          if (app.activity.screenData.idle.phoneField.value === "") {
            // alert('Phone field must not be empty.');
            return;
          }
          
         if (simple == undefined) {
           alert("Configure your phone");
           return;
         }

          targetActivity = 'outgoing';
          app.activity.phoneData.number = app.activity.screenData.idle.phoneField.value;
          //app.activity.phoneData.ip = '172.17.0.3';
          app.activity.phoneData.id = '-outbound call-';
          app.activity.screenData.outgoing.numberLabel.innerText = app.activity.phoneData.number;
          //app.activity.screenData.outgoing.ipLabel.innerText = app.activity.phoneData.ip;
        }
        else if (oldActivity == 'outgoing') {
          targetActivity = 'idle';
          app.activity.phoneData.number = null;
          //app.activity.phoneData.ip = null;
          app.activity.phoneData.id = null;
        }
        else if (oldActivity == 'incall') {
          targetActivity = 'idle';
          app.activity.phoneData.number = null;
          //app.activity.phoneData.ip = null;
          app.activity.phoneData.id = null;
        }
        else if (oldActivity == 'incoming') {
          targetActivity = (actionName == 'start') ? 'incall' : 'idle';

          if (targetActivity == 'idle') {
            app.activity.phoneData.number = null;
            //app.activity.phoneData.ip = null;
            app.activity.phoneData.id = null;
            // action_reject();
          }
          else if (targetActivity == 'incall') {
            app.activity.screenData[targetActivity].idLabel.innerText = app.activity.phoneData.id;
            app.activity.screenData[targetActivity].numberLabel.innerText = app.activity.phoneData.number;
            //app.activity.screenData[targetActivity].ipLabel.innerText = app.activity.phoneData.ip;
            action_answer();
          }
        }

        if (!button.classList.contains('hidden')) {
          console.log("hide button called");
          button.classList.add('hidden');


          if (oldActivity == 'incoming') {
            button.parentElement.classList.remove('half', 'clearfix');
          }
          else {
            if (actionName == 'start') {
              // button.parentElement.classList.remove('hidden');
              button.nextElementSibling.classList.remove('hidden');
            }
            else if (actionName == 'stop') {
              console.log("stop button called");
              // button.parentElement.classList.remove('hidden');
              button.previousElementSibling.classList.remove('hidden');
            }
          }
        }

        app.title.innerText = app.activity.screenData[targetActivity].title;
        app.template[oldActivity].classList.add('hidden');

        if (targetActivity == 'idle') {
          app.template[targetActivity].animate('bounceIn').classList.remove('hidden');
          console.log("Target" ,targetActivity);
          action_hangup();
        }
        else if (targetActivity == 'outgoing') {
          app.template[targetActivity].animate('bounceIn').classList.remove('hidden');
          console.log(targetActivity);
          action_dial(app.activity.phoneData.number); // ict
        }
        else if (targetActivity == 'incall') {
          app.template[targetActivity].classList.remove('hidden');
          app.activity.screenData[targetActivity].tools.animate('slideInUp').classList.remove('hidden');
        }

        currentActivity = targetActivity;
      }
      else if (methodCaller == 'eventCallAnswered') {
        targetActivity = 'incall';
        console.log(app.activity.phoneData.id);
        app.activity.screenData[targetActivity].idLabel.innerText = simple.session.remoteIdentity.friendlyName;
        app.activity.screenData[targetActivity].numberLabel.innerText = app.activity.phoneData.number;
        // app.activity.screenData[targetActivity].ipLabel.innerText = app.activity.phoneData.ip;
        app.title.innerText = app.activity.screenData[targetActivity].title;
        app.template[targetActivity].classList.remove('hidden');
        app.activity.screenData[targetActivity].tools.animate('slideInUp').classList.remove('hidden');
        if (oldActivity == 'outgoing') {
          app.template[oldActivity].classList.add('hidden');
        }

        currentActivity = targetActivity;
      }
      else if (methodCaller == 'eventRingingInbound') {
        if (app.$.classList.contains('hidden')) return;
        if (oldActivity !== 'idle') return;

        targetActivity = 'incoming';

        app.activity.phoneData.number = callerid_number;
        //app.activity.phoneData.ip = '172.17.0.14';
        app.activity.phoneData.id = callerid_name;
        app.activity.screenData[targetActivity].idLabel.innerText = app.activity.phoneData.id;
        app.activity.screenData[targetActivity].numberLabel.innerText = app.activity.phoneData.number;
        //app.activity.screenData[targetActivity].ipLabel.innerText = app.activity.phoneData.ip;

        app.title.innerText = app.activity.screenData[targetActivity].title;
        app.phoneTools[0].parentElement.classList.add('half', 'clearfix');
        app.phoneTools[1].classList.remove('hidden');
        app.template[targetActivity].animate('bounceIn').classList.remove('hidden');
        app.template[oldActivity].classList.add('hidden');

        currentActivity = targetActivity;
      }
      else if (methodCaller == 'clientStatusToggle') {
        if (clientStatus === 0) {
          targetActivity = 'offline';

          app.title.innerText = app.activity.screenData[targetActivity].title;
          app.template[oldActivity].classList.add('hidden');
          app.template[targetActivity].classList.remove('hidden');
          app.phoneTools[0].parentElement.classList.add('hidden');
        }
        else if (clientStatus === 1) {
          targetActivity = 'idle';

          app.title.innerText = app.activity.screenData[targetActivity].title;
          app.template[oldActivity].classList.add('hidden');
          app.template[targetActivity].classList.remove('hidden');
          app.phoneTools[0].parentElement.classList.remove('hidden');
        }

        currentActivity = targetActivity;
      }
    }

    function resetActivity () {
      for (var i in app.template) {
        if (i == 'idle') {
          if (app.template.idle.classList.contains('hidden')) {
            app.template.idle.classList.remove('hidden');
          }
        }
        else {
          if (!app.template[i].classList.contains('hidden')) {
            app.template[i].classList.add('hidden');
          }
          else continue;
        }
      }

      if (app.phoneTools[0].parentElement.classList.contains('hidden')) {
        app.phoneTools[0].parentElement.classList.remove('hidden');
      }
    }
    function numpadPress (e) {
      e.preventDefault();

      var button = e.target;
      if (e.target.tagName.toLowerCase() !== 'button') {
        for (var i=0; i<e.path.length; i+=1) {
          if (e.path[i].tagName.toLowerCase() === 'button') {
            button = e.path[i];
            break;
          }
        }
      }
      var char = button.value;
      app.activity.screenData.idle.phoneField.value += char;
    }

    // Custom prototype methods
    Element.prototype.animate = function (animationName, callback) {
      var animationEnd = (function (element) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd'
        };

        for (var type in animations) {
          if (element.style[type] !== 'undefined') {
            return animations[type];
          }
        }
      })(document.createElement('div'));

      this.classList.add('animated', animationName);
      this.addEventListener(animationEnd, function () {
        this.classList.remove('animated', animationName);
        if (typeof callback === 'function') callback();
      }, {once: true});

      return this;
    }
document.addEventListener('DOMContentLoaded', openModal);
