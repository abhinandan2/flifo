'use strict';

var albumBucketName = 'widgetupload';
var bucketRegion = 'ap-south-1';
var IdentityPoolId = 'ap-south-1:0b6f0938-bf6f-4b29-be40-f8afa514e8ca';
var uploadRequest = null;
AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  }),
});

function addPhoto() {
  let albumName = 'widgetuploads';
  AWS.config.credentials.refresh(function(){
    console.log("refreshed")
      var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: albumBucketName}
    });

    var files = document.getElementById('idelivr-filepicker').files;
    if (!files.length) {
      return alert('Please choose a file to upload first.');
    }else{
      console.log("file chosen");
    }
    var file = files[0];
    document.getElementById("idelivr-filepicker").value = "";
    // var fileName = file.name;
    var fileName = getRandomInt()+'.'+file.name.split('.').pop();
    var albumPhotosKey = encodeURIComponent(albumName) + '/';
    var photoKey = albumPhotosKey + fileName;
    var uploadURL = "https://s3.ap-south-1.amazonaws.com/"+albumBucketName+"/"+photoKey;
    // idelivr.saveFileMessage(file.name,"https://s3.ap-south-1.amazonaws.com/"+albumBucketName+"/"+photoKey)
    idelivr.saveFileMessage(uploadURL,"")
    // var photoKey = fileName;
    console.log("uploading triggered");
    uploadRequest = s3.upload({
      Key: photoKey,
      Body: file,
      ACL: 'public-read'
    }, function(err, data) {
      if (err) {
        console.log(err,data);
        if(idelivr.uploadTimeout){
          clearTimeout(idelivr.uploadTimeout);
          idelivr.uploadTimeout = null;
          var fileKey = $("[data-url='"+uploadURL+"']").attr("data-key");
          var updates = {};
          updates['content_extra'] = 2;
          chatbase.update('active_conversation', fileKey, updates);
        }
        return console.log('There was an error uploading your photo: ', err.message);
      }else{
        console.log('Successfully uploaded photo.',photoKey); 
        if(idelivr.uploadTimeout){
          clearTimeout(idelivr.uploadTimeout);
          idelivr.uploadTimeout = null;
          console.log("Upload Successfull");
          var fileKey = $("[data-url='"+uploadURL+"']").attr("data-key");
          var updates = {};
          updates['content_extra'] = 1;
          chatbase.update('active_conversation', fileKey, updates);
        }
      }
    });
  });
}

function getRandomInt() {
  var min = Math.ceil(10000000000000000000);
  var max = Math.floor(99999999999999999999);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function FriendlyChat() {
  this.operatorName = "";
  this.operatorProfile = "";
  this.activeOperator = "";
  this.uploadTimeoutDuration = 20000;
  this.welcomeTypingQuick = {"content":"","customer":"6e07716b-17d6-48e4-aae4-b8dd728acb84","id":"410fb0b0-ee51-45cf-aa2e-31d6fe2c7f15","operator":"idelivr_ai_bot","sender":"idelivr_ai_bot","system_meta":{"customer":"6e07716b-17d6-48e4-aae4-b8dd728acb84","timestamp":1537257119225,"path":"active_conversation","last":true},"timestamp":1537257119225,"type":"typing"};
  this.welcomeMessageOne = "Welcome to Yatra - India's most trusted e-commerce travel brand.";
  this.welcomeQuick = {"content":"{\"recipient\":{\"id\":\"7a45025a-f2e8-4449-8354-3819146aae95\"},\"message\":{\"text\":\"Hi, I'm Yuva! Your personal virtual assistant.\",\"quick_replies\":[{\"content_type\":\"text\",\"title\":\"Start Chat\",\"payload\":\"start_chat\"}]}}","conversation_id":"ZZZ","customer":"7a45025a-f2e8-4449-8354-3819146aae95","from_operator":1,"id":"5b1325bc-26c9-4389-98a5-5f49c6cbbf7f","is_processed":"redis","is_reached":1,"operator":"idelivr_ai_bot","origin":"widget","read":1502803457716,"sender":"idelivr_ai_bot","sent":1502803457356,"sessionID":"9e7e4fb3-c150-4099-8a70-848b7496cdab","system_meta":{"customer":"7a45025a-f2e9-4449-8354-3819146aae95","timestamp":1502803457356},"timestamp":1502803457356,"type":"template","freeText":true}
  // this.welcomeUpload = {"content":"{\"recipient\":{\"id\":\"7a45025a-f2e8-4449-8354-3819146aae96\"},\"message\":{\"text\":\"Please upload your PAN\",\"quick_replies\":[{\"content_type\":\"upload\",\"title\":\"Upload PAN\",\"payload\":\"upload_pan\"}]}}","conversation_id":"ZZZ","customer":"7a45025a-f2e8-4449-8354-3819146aae96","from_operator":1,"id":"5b1325bc-26c9-4389-98a5-5f49c6cbbf7g","is_processed":"redis","is_reached":1,"operator":"idelivr_ai_bot","origin":"widget","read":1502803457717,"sender":"idelivr_ai_bot","sent":1502803457357,"sessionID":"9e7e4fb3-c150-4099-8a70-848b7496cdac","system_meta":{"customer":"7a45025a-f2e9-4449-8354-3819146aae96","timestamp":1502803457357},"timestamp":1502803457357,"type":"template","freeText":true}
  this.messageList = document.getElementById('idelivr_messages');
  this.footerPanel = document.getElementById('idelivr_footers');
  this.messageForm = document.getElementById('idelivr_message-form');
  this.startForm = document.getElementById('idelivr_startForm');
  this.messageInput = document.getElementById('idelivr_message');
  this.submitButton = document.getElementById('idelivr_submit');
  this.startChatButton = document.getElementById('idelivr_startchat');
  this.welcomeScreen = document.getElementById('idelivr_welcome');
  this.minimChatWindow = document.getElementById('idelivr_minim_chat_window');
  this.defaultURL = 'https://s3.ap-south-1.amazonaws.com/chatwidget/yatra/user.png';

  this.chatWindow = document.getElementById('idelivr_chat_window_1');

   this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
   this.submitButton.addEventListener('click', this.saveMessage.bind(this));
   var buttonTogglingHandler = this.toggleButton.bind(this);
   this.messageInput.addEventListener('keyup', buttonTogglingHandler);
   this.messageInput.addEventListener('change', buttonTogglingHandler);
   this.pushValue = "";
   this.screenValue = "";
   this.emailUser = "";
   this.mobilUser = "";
   this.emailVerified = "";
   this.mobileVerified = "";
   this.displayed = [];
   this.chatType = "";
   this.disabledButtons = true;
   this.horizontalFlag = false;
   this.lastCal = false;
   this.lastCarousal = false;
   this.uploadTimeout = null;
   this.flowbox_type = "";
   self = this;

   var some = new URLSearchParams(window.location.search)
   let bot = some.get('bot')
   let ref = some.get('ref')
   let callback_mode = some.get('callback_mode')
    if(getCookie("bot")!=bot){
      setCookie("bot",bot,1);
      delete_cookie('token');
    }
    if(getCookie("ref")!=ref){
      setCookie("ref",ref,1);
      delete_cookie('token');
    }
   this.chatType = some.get('bot')
   this.callback_mode = some.get('callback_mode')

   $('#idelivr_message').on('keyup', function(e) {
     self.toggleButton();
     if (e.which == 13 && ! e.shiftKey) {
       self.saveMessage(e);
     }
   });
   $('#idelivr_message').bind('input propertychange', function() {
     self.toggleButton();
   });

   $(window).resize(function() {
      self.resizer();
    }).trigger('resize');
   this.initChatbase();
}

FriendlyChat.prototype.resizer = function() {
  this.windowHeight = $(window).height();
  this.windowWidth = $(window).width();
  // self.toggleButton();
     // if(this.windowWidth<481){
  this.widgetHeader = $('.idelivr-panel-heading').outerHeight(true);
  this.widgetFooter = $('.idelivr-panel-footer').outerHeight(true);
  this.quicker = 0;
  this.calendar = 0;
  // console.log(document.getElementById('calendar_replier').style.display);
  if(document.getElementById('calendar_replier').style.display!='none'){
     this.calendar = $('#calendar_replier').height();
  }
  if(document.getElementById('quick_replier').style.display!='none'){
    this.quicker = $('#quick_replier').outerHeight(true);
  }
  // this.calendar = $('#calendar_replier').height();
  // console.log(document.getElementById('calendar_replier').style.display);
  $('#idelivr_messages').outerHeight(this.windowHeight - this.widgetHeader - this.widgetFooter - this.quicker - this.calendar);
  if(this.windowWidth>400){
    $('.idelivr-panel').outerWidth(400);
    $('#calendarMaster').outerWidth(400);
    $('#calendarMaster').outerHeight(400);
  }else{
    $('.idelivr-panel').outerWidth(this.windowWidth);
    $('#calendarMaster').outerWidth(this.windowWidth);
    $('#calendarMaster').outerHeight(this.windowWidth);
  }

  if(this.lastQuick || this.lastCal || this.lastCarousal  || this.flowbox_type == "quick_reply" || this.flowbox_type == "" || this.flowbox_type != "default"){
    $('#idelivr_message').prop( "disabled", true );
    $('#idelivr_submit').prop( "disabled", true );
    $('#idelivr_message').attr( "placeholder", "" );
  }else{
    $('#idelivr_message').prop( "disabled", false );
    $('#idelivr_submit').prop( "disabled", false );
    $('#idelivr_message').attr( "placeholder", "Type your message here..." );
  }
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
FriendlyChat.prototype.initChatbase = function() {
  window.chatbase = new Chatbase('https://yatrabot.phonon.in/', null, null);
  // window.chatbase = new Chatbase('http://localhost:9090/', null, null);
  chatbase.connected(function(connected){
    if(connected){
      $('#idelivr_message').prop( "disabled", false );
      $('#idelivr_submit').prop( "disabled", false );
      idelivr.displayed = []
      if(self.lastQuick){
        $('#quick_replier').show();
      }else{
        $('#quick_replier').hide();
      }

      if(self.lastCal){
        $('#calendar_replier').show();
      }else{
        $('#calendar_replier').hide();
      }
    }else{
      // idelivr.disconnectNotif('No Internet');
      $('#idelivr_message').prop( "disabled", true );
      $('#idelivr_submit').prop( "disabled", true );
      if(this.sendingTimout){
        clearTimeout(this.sendingTimout);
        this.sendingTimout = null;
      }
      $('#quick_replier').hide();
    }
  });  

  chatbase.onAuthStateChanged(this.onAuthStateChanged);

  this.chatWindow.removeAttribute('hidden');
  $('#idelivr-filepicker').change(function(){
    // self.saveFileMessage(this);
    addPhoto();
  });
};

// Loads chat messages history and listens for upcoming ones.
FriendlyChat.prototype.loadMessages = function(user) {
  // Reference to the /messages/ database path.
  // this.messagesRef = this.database.ref('active_conversation');
  // this.operatorRef = this.database.ref('operator_console');
  // Make sure we remove all previous listeners.
  // this.messagesRef.off();

  // Loads the last 12 messages and listen for new ones.

  var setMessage = function(data) {
    var val = data;
    if(data.content.split(":")[0] == "Your Flight Summary ")
    {
            val.type="flifo"
    }
    if(val.type=="flifo"){
        this.displayFlifo(user, data.id, val);
    }
    else if(val.type=="template"){
      // console.log(val.content);
      this.displayQuick(user, data.id, val);
    }else if(val.type=="calendar"){
      this.displayCal(user, data.id, val);
    }else if(val.type=="video"){
      this.displayVideo(user, data.id, val);
    }else if(val.type=="carousal"){
      this.displayCarousal(user, data.id, val);
    }else if(val.type=="file"){
      // if(val.from_operator==1){
        this.displayMessage(user, data.id, val);
      // }else{
        // this.displayFile(user, data.id, val);
      // }
    }else{
      this.displayMessage(user, data.id, val);
    }
  }.bind(this);
  var detMessage = function(data) {
    var val = data;
    this.deleteMessage(data.id, val);
  }.bind(this);
  // this.messagesRef.orderByChild("customer").equalTo(this.customer).limitToLast(12).on('child_added', setMessage);
  // this.messagesRef.orderByChild("customer").equalTo(this.customer).limitToLast(12).on('child_changed', setMessage);
  // this.messagesRef.orderByChild("customer").equalTo(this.customer).limitToLast(12).on('child_removed', detMessage);
  chatbase.childAddedListener('active_conversation',null,setMessage);
  chatbase.childUpdatedListener('active_conversation',null,setMessage);
  chatbase.childRemovedListener('active_conversation',null,detMessage);
};

// Saves a new message on the Firebase DB.
FriendlyChat.prototype.saveMessage = function(e) {
  e.preventDefault();

    $('#idelivr_message').prop( "disabled", true );
    $('#idelivr_submit').prop( "disabled", true );
    $('.replier_row').hide();
    $('.image_row').attr("style", "height: 300px");
    idelivr.toggleButton();

    this.sendingTimout = setTimeout(function(){
      chatbase.flush();
      $('#idelivr_message').prop( "disabled", false );
      $('#idelivr_submit').prop( "disabled", false );
      $('#idelivr_message').focus();
      idelivr.toggleButton();
      // idelivr.disconnectNotif('Sending Failed');
    }, 10000);
  // Check that the user entered a message and is signed in.
  if (this.hiddenMessage == "Start_Chat_callback_mode"&& this.checkSignedInWithMessage() && chatbase.isConnected()) {
    console.log("Inside saveMessage ");
    idelivr.toggleButton();
    chatbase.push('active_conversation', null, {
      content: this.messageInput.value,
      customer: chatbase.getCustomer(),
      from_operator: 0,
      is_processed: "pending",
      is_reached: 0,
      operator: "",
      origin: "widget",
      chatType: idelivr.chatType,
      read: 0,
      timestamp: chatbase.SERVER_TIME,
      sender: chatbase.getCustomer(),
      sent: 0,
      meta: idelivr.createMeta(),
      type: "hidden"
    });
    // .then(function(snapshot) {
    //   this.toggleButton();
    // }
  }
  else if (this.messageInput.value && this.checkSignedInWithMessage() && chatbase.isConnected()) {
    console.log("Inside saveMessage ");
    idelivr.toggleButton();
    chatbase.push('active_conversation', null, {
      content: this.messageInput.value,
      customer: chatbase.getCustomer(),
      from_operator: 0,
      is_processed: "pending",
      is_reached: 0,
      operator: "",
      origin: "widget",
      chatType: idelivr.chatType,
      read: 0,
      timestamp: chatbase.SERVER_TIME,
      sender: chatbase.getCustomer(),
      sent: 0,
      meta: idelivr.createMeta(),
      type: "text"
    });
    // .then(function(snapshot) {
    //   this.toggleButton();
    // }
  }
};


FriendlyChat.prototype.saveQuickMessage = function(payload, payloadContent) {
  if (this.checkSignedInWithMessage() && chatbase.isConnected()) {
    // $('#idelivr_submit').html('Sending...');
    $('#idelivr_message').prop( "disabled", true );
    $('#idelivr_submit').prop( "disabled", true );
    $('#quick_replier').hide();
    $('.replier_row').hide();
    $('.image_row').attr("style", "height: 300px");
    idelivr.toggleButton();
    idelivr.resizer();
    this.sendingTimout = setTimeout(function(){
      chatbase.flush();
      // $('#idelivr_submit').html('Send');
      $('#idelivr_message').prop( "disabled", true );
      $('#idelivr_submit').prop( "disabled", true );
      $('#quick_replier').show();
      idelivr.toggleButton();
      // idelivr.disconnectNotif('Sending Failed');
    }, 10000);
    chatbase.push('active_conversation', null, {
      content: payload,
      content_extra: payloadContent,
      customer: chatbase.getCustomer(),
      from_operator: 0,
      is_processed: "pending",
      is_reached: 0,
      operator: "",
      origin: "widget",
      chatType: idelivr.chatType,
      read: 0,
      timestamp: chatbase.SERVER_TIME,
      sender: chatbase.getCustomer(),
      sent: 0,
      meta: idelivr.createMeta(),
      type: "quick_reply"
    });

  }
};


FriendlyChat.prototype.setImageUrl = function(imageUri, imgElement) {
  imgElement.src = imageUri;
};

FriendlyChat.prototype.saveFileMessage = function(filename, fileurl) {
  // var file = input.files[0];
  // if(file == null){
  //   return;
  // }
  if (this.checkSignedInWithMessage() && chatbase.isConnected()) {
    chatbase.push('active_conversation', null, {
      content: filename,
      content_extra: fileurl,
      customer: chatbase.getCustomer(),
      from_operator: 0,
      is_processed: "pending",
      is_reached: 0,
      operator: "",
      origin: "widget",
      chatType: idelivr.chatType,
      read: 0,
      timestamp: chatbase.SERVER_TIME,
      sender: chatbase.getCustomer(),
      sent: 0,
      meta: idelivr.createMeta(),
      type: "file"
    });
  }

};

FriendlyChat.prototype.saveCalMessage = function(appointment) {
  console.log("appointment - "+appointment);
  if (this.checkSignedInWithMessage() && chatbase.isConnected()) {
    // $('#idelivr_submit').html('Sending...');
    $('#idelivr_message').prop( "disabled", true );
    $('#idelivr_submit').prop( "disabled", true );
    $('#calendar_replier').hide();

    this.windowHeight = $(window).height();
    this.windowWidth = $(window).width();
    // if(this.windowWidth<481){
      this.widgetHeader = $('.idelivr-panel-heading').outerHeight(true);
      this.widgetFooter = $('.idelivr-panel-footer').outerHeight(true);
      this.messagesHeight = this.windowHeight - this.widgetHeader - this.widgetFooter;
      $('#idelivr_messages').outerHeight(this.messagesHeight);
    // }else{
      // $('#idelivr_messages').outerHeight(500);
    // }

    idelivr.toggleButton();
    this.sendingTimout = setTimeout(function(){
      chatbase.flush();
      // $('#idelivr_submit').html('Send');
      $('#idelivr_message').prop( "disabled", true );
      $('#idelivr_submit').prop( "disabled", true );
      $('#calendar_replier').show();
      idelivr.toggleButton();
      // idelivr.disconnectNotif('Sending Failed');
    }, 10000);

    chatbase.push('active_conversation', null, {
      content: appointment.toLocaleDateString(),
      customer: chatbase.getCustomer(),
      from_operator: 0,
      is_processed: "pending",
      is_reached: 0,
      operator: "",
      origin: "widget",
      chatType: idelivr.chatType,
      read: 0,
      timestamp: chatbase.SERVER_TIME,
      sender: chatbase.getCustomer(),
      sent: 0,
      meta: idelivr.createMeta(),
      type: "text"
    });

  }
};

// FriendlyChat.prototype.signIn = function() {
//   // e.preventDefault();
// this.auth.signInAnonymously().catch(function(error) {
//   var errorCode = error.code;
//   var errorMessage = error.message;
// });
// };

// FriendlyChat.prototype.signInFacebook = function() {
//   var provider = new firebase.auth.FacebookAuthProvider();
//   firebase.auth().signInWithPopup(provider).then(function(result) {
//   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//   var token = result.credential.accessToken;
//   // The signed-in user info.
//   var user = result.user;
// }).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // The email of the user's account used.
//   var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//   var credential = error.credential;
// });
// };

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

FriendlyChat.prototype.createMeta = function(){
  var jsonData = {};
  jsonData.mobile = this.mobileUser;
  jsonData.email = this.emailUser;
  jsonData.email_verified = this.emailVerified;
  jsonData.mobile_verified = this.mobileVerified;
  jsonData.context_string = this.pushValue;
  jsonData.screen_info = this.screenValue;
  return JSON.stringify(jsonData);
}

FriendlyChat.prototype.displayWelcomeMessage = function() {

   
   
   if(idelivr.callback_mode == "payment_status"){

    setTimeout(function() {
      idelivr.displayMessage(null, idelivr.welcomeTypingQuick.id, idelivr.welcomeTypingQuick);      
    },100);    
    
    setTimeout(function() { 
      idelivr.hiddenMessage = "Start_Chat_callback_mode";
      idelivr.submitButton.click()
    },2000);
   }
   else{
    setTimeout(function() {idelivr.displayWelcomeMessages(idelivr.welcomeMessageOne)},1);
    setTimeout(function() {idelivr.displayQuick(null, idelivr.welcomeQuick.id, idelivr.welcomeQuick);},100);
   }
// setTimeout(function() {idelivr.displayQuick(null, idelivr.welcomeMessageOne.id, idelivr.welcomeMessageOne);},100);
  
  // setTimeout(function() {idelivr.displayQuick(null, idelivr.welcomeUpload.id, idelivr.welcomeUpload);},1);
}

FriendlyChat.prototype.displayWelcomeMessages = function(value) {
  var container = document.createElement('div');
  container.innerHTML = FriendlyChat.MSG_TEMPLATE;
  var div = container.firstChild;
  div.setAttribute('id', "WELCOME");
  this.messageList.appendChild(div);


  div.querySelector('.idelivr-img-responsive').src = this.defaultURL;
  hide(div.querySelector('.idelivr-gif-responsive'));
  var messageElement = div.querySelector('.idelivr-message');
  var timeElement = div.querySelector('.idelivr-time');
  var date = new Date();
  messageElement.textContent = value;
  var hoursString = date.getHours();
  var minutesString = date.getMinutes();
  if(date.getHours()<10){
    hoursString = "0" + date.getHours();
  }
  if(date.getMinutes()<10){
    minutesString = "0" + date.getMinutes();
  }

  timeElement.textContent = hoursString + ":" + minutesString;
  messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  setTimeout(function() {div.classList.add('idelivr-visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
}


// Triggers when the auth state change for instance when the user signs-in or signs-out.
FriendlyChat.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!

    try{
      var some = new URLSearchParams(window.location.search)
      for(var pair of some.entries()) {
        console.log(pair[0]+ ', '+ pair[1]);
        idelivr.contextUpdater(pair[0], pair[1]);
      }
      if(window.idelivrCallback){
        idelivrCallback();
      }
    }catch (e) {
      // console.log(e)
    }
    this.customer = user;

    idelivr.displayWelcomeMessage();
    chatbase.push('customer_url', null, {
      customer: chatbase.getCustomer(),
      status: 'P',
      url: window.location.href,
      timestamp: chatbase.SERVER_TIME
    });

    window.globalCustomer = this.customer;
    var self = this;

    $(window).bind('hashchange', function() {
      if(window.globalCustomer){
        chatbase.push('customer_url', null, {
          customer: chatbase.getCustomer(),
          status: 'P',
          url: window.location.href,
          timestamp: chatbase.SERVER_TIME
        });
      }
    });

    idelivr.loadMessages(user);
    
  } else {
    chatbase.signIn();
  }
};

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePhone(phone) {
  var isnum = /^\d+$/;
  return isnum.test(phone)&&phone.length==10;
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function delete_cookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// Returns true if user is signed-in. Otherwise false and displays a message.
FriendlyChat.prototype.checkSignedInWithMessage = function() {
  if (chatbase.getCustomer()) {
    return true;
  }
  return false;
};

// Resets the given MaterialTextField.
FriendlyChat.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

FriendlyChat.MSG_TEMPLATE =
                    '<div class="idelivr-msg_container idelivr-base_receive">' +
                         '<div class="idelivr-avatar">' +
                            '<img id="a" src="https://s3.ap-south-1.amazonaws.com/chatwidget/yatra/user.png" class="idelivr-img-responsive">' +
                         '</div>' +
                        '<img src="https://s3.ap-south-1.amazonaws.com/chatwidget/lighting.gif" class="idelivr-gif-responsive">' +
                        '<div class="idelivr-messages idelivr-msg_receive">' +
                            '<div class="idelivr-message"></div>' +
                            '<time datetime="2009-11-13T20:00" class="idelivr-time"></time>' +
                        '</div>' +
                    '</div>';

FriendlyChat.SENT_TEMPLATE =
                    '<div class="idelivr-msg_container idelivr-base_sent">' +
                        '<div class="idelivr-messages idelivr-msg_sent">' +
                            '<div class="idelivr-message"></div>' +
                            '<time datetime="2009-11-13T20:00" class="idelivr-time"></time>' +
                        '</div>' +
                    '</div>';

FriendlyChat.UPLOAD_TEMPLATE =
                    '<div class="idelivr-msg_container idelivr-base_upload">' +
                        '<div class="idelivr-uploading">Document Uploaded' +
                        '</div>' +
                        '<div class="idelivr-container">' +
                          '<div class="idelivr-chevron"></div>' +
                          '<div class="idelivr-chevron"></div>' +
                          '<div class="idelivr-chevron"></div>' +
                        '</div>'+
                    '</div>';

FriendlyChat.ITEM_TEMPLATE = '<li class="carousel-item">'+
                                '<div class="item-1">'+
                                  '<div class="replier_block">'+
                                    '<img class="image_row" src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"></img>'+
                                    '<div class="content_row">'+
                                      '<span class="card_title">Welcome to Phonon</span>'+
                                      '<span class="card_content">This is first of the many samples to be handed out for this.</span>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'+
                              '</li>';


// A loading image URL.
FriendlyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

function preloadImage(url)
{
    var img=new Image();
    img.src=url;
}

// Displays a Message in the UI.
FriendlyChat.prototype.deleteMessage = function(key, val) {
  var div = document.getElementById(key);
  if(div!=null  && val.type=="typing"){
    div.parentNode.removeChild(div);
  }
}



// Displays a Message in the UI.
FriendlyChat.prototype.displayMessage = function(user, key, val) {

if(val.flowbox_type){
  this.flowbox_type = val.flowbox_type;
  }else{
    this.flowbox_type = "";
  }
  var isUpdate = false
  var div = document.getElementById(key);
  if(div){
    isUpdate = true
  }
  if(this.sendingTimout){
    clearTimeout(this.sendingTimout);
    this.sendingTimout = null;
  }
  if(val.type!='typing' && !isUpdate && val.type != 'hidden'){
    $('.idelivr-typer').hide();
  }
  // $('#idelivr_submit').html('Send');
  this.toggleButton();

  if(val.from_operator==0){
    $('#idelivr_message').focus();
  }
  this.windowHeight = $(window).height();
  this.windowWidth = $(window).width();

  // var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.

  if (!div && val.type !="hidden") {
    this.lastQuick = false;
    this.lastCal = false;
    this.lastCarousal = false;
    var container = document.createElement('div');
    if(val.from_operator==1 || val.type=="typing"){
      container.innerHTML = FriendlyChat.MSG_TEMPLATE;
    }else{
      container.innerHTML = FriendlyChat.SENT_TEMPLATE;
    }

    div = container;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }

  if(val.type=="typing"){
    $(div).addClass("idelivr-typer");
    // div.querySelector('.idelivr-img-responsive').src = this.defaultURL;
    if((window.typingKey==key)&&((Date.now()-9000)>window.typingTime)){
      return;
    }
    if(window.typingKey){
      var tempDiv = document.getElementById(window.typingKey);
      if(tempDiv!=null){
        tempDiv.parentNode.removeChild(tempDiv);
      }
    }
    window.typingKey = key;
    window.typingTime = Date.now();

    show(div.querySelector('.idelivr-avatar'));
    hide(div.querySelector('.idelivr-msg_receive'));
    hide(div.querySelector('.idelivr-time'));
    show(div.querySelector('.idelivr-gif-responsive'));
    this.messageList.scrollTop = 9999;
    setTimeout(function() {
      if(window.typingKey && ((Date.now()-9000)>window.typingTime)){
        var tempDiv = document.getElementById(window.typingKey);
        if(tempDiv!=null){
          tempDiv.parentNode.removeChild(tempDiv);
        }
      }
    }, 10000);
    return;
  }else{
    if(window.typingKey && !isUpdate && val.type != "hidden"){
      var tempDiv = document.getElementById(window.typingKey);
      if(tempDiv!=null){
        tempDiv.parentNode.removeChild(tempDiv);
      }
    }
  }
if(val.type != "hidden"){
  if(!div.querySelector('.idelivr-img-responsive') && val.content){
    if(val.from_operator==1){
      div.innerHTML = FriendlyChat.MSG_TEMPLATE;
    }else{
      div.innerHTML = FriendlyChat.SENT_TEMPLATE;
    }
  }
}
  // var profilePicUrl = user.photoURL;
  // var userName = user.displayName;

  // if(user.photoURL==null){
  var profilePicUrl = this.defaultProfile;
  // }


  var updates = {};
  if(val.from_operator==1){
    if(div.querySelector('.idelivr-img-responsive')){
      // div.querySelector('.idelivr-img-responsive').src = this.defaultURL;
    }
    if(!val.is_reached){
      updates['is_reached'] = 1;
    }
    if(!val.read){
      updates['read'] = chatbase.SERVER_TIME
    }
  }else{
    if(!val.sent){
      updates['sent'] = chatbase.SERVER_TIME
    }
    if (profilePicUrl) {
      // div.querySelector('.idelivr-img-responsive').src = profilePicUrl;
    }
  }
  // this.database.ref('active_conversation/'+key).update(updates);
  chatbase.update('active_conversation', key, updates);
  if(val.type != "hidden"){
  var messageElement = div.querySelector('.idelivr-message');
  var timeElement = div.querySelector('.idelivr-time');
  if (val.content) {// If the message is text.
    val.content = val.content.split("||",1);
    if (val.content_extra){
    val.content_extra = val.content_extra.split("||",1);
    }
    var date = new Date(val.timestamp);
    if(val.type == "quick_reply"){
      var msgContent = filterXSS(val.content_extra);
      messageElement.innerHTML = linkify(msgContent);
    }else if(val.type == "file"){
      if(val.content_extra==""){
        messageElement.setAttribute('data-key', key);
        messageElement.setAttribute('data-url', val.content);
        messageElement.innerHTML = '<svg width="56px"  height="56px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-eclipse"><path ng-attr-d="{{config.pathCmd}}" ng-attr-fill="{{config.color}}" stroke="none" d="M10 50A40 40 0 0 0 90 50A40 44 0 0 1 10 50" fill="#ffffff" transform="rotate(54 50 52)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 52;360 50 52" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path></svg>'+'<br><span>Uploading</span>';
        
        if(idelivr.uploadTimeout){
          clearTimeout(idelivr.uploadTimeout);
        }

        idelivr.uploadTimeout = setTimeout(function(){ 
          if(idelivr.uploadTimeout){
            uploadRequest.abort();
            idelivr.uploadTimeout = null;
            var fileKey = $("[data-url='"+val.content+"']").attr("data-key");
            var updates = {};
            updates['content_extra'] = 3;
            chatbase.update('active_conversation', fileKey, updates);
            console.log("Upload aborted due to timeout");
          }
        }, idelivr.uploadTimeoutDuration);

      }else{
        // messageElement.innerHTML = '<a href="'+val.content+'">'+val.content_extra+'</a>';
        switch(val.content_extra) {
            case 1: messageElement.innerHTML = "File upload successfull";
                    break;
            case 2: messageElement.innerHTML = "File upload failed";
                    break;
            case 3: messageElement.innerHTML = "File upload timed out";
                    break;
            default:messageElement.innerHTML = val.content_extra;
                    break;
                    
        }
        

      }
      console.log("--2", messageElement.innerHTML);
    }else{
      var msgContent = filterXSS(val.content);
      messageElement.innerHTML = linkify(msgContent);
    }
    
    var hoursString = date.getHours();
    var minutesString = date.getMinutes();
    if(date.getHours()<10){
      hoursString = "0" + date.getHours();
    }
    if(date.getMinutes()<10){
      minutesString = "0" + date.getMinutes();
    }

    if(val.content==this.messageInput.value){
      timeElement.textContent="SENDING...";
      this.messageInput.value="";
    }else{
      timeElement.textContent = hoursString + ":" + minutesString;
    }

    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    show(div.querySelector('.idelivr-avatar'));
    show(div.querySelector('.idelivr-msg_receive'));
    show(div.querySelector('.idelivr-time'));
    hide(div.querySelector('.idelivr-gif-responsive'));
  }else{
    show(div.querySelector('.idelivr-avatar'));
    hide(div.querySelector('.idelivr-msg_receive'));
    hide(div.querySelector('.idelivr-time'));
    show(div.querySelector('.idelivr-gif-responsive'));
  }

  if(this.lastQuick){
    $('#quick_replier').show();
    $('#calendar_replier').hide();
  }else if(this.lastCal){
    $('#calendar_replier').show();
    $('#quick_replier').attr("data-visi",0);
    $('#quick_replier').empty();
  }else{
    $('#calendar_replier').hide();
    $('#quick_replier').attr("data-visi",0);
    $('#quick_replier').empty();
  }

  idelivr.resizer();
  // Show the card fading-in.
  setTimeout(function() {div.classList.add('idelivr-visible')}, 1);
  this.messageList.scrollTop = 9999;
}
};
FriendlyChat.prototype.displayQuick = function(user, key, val) {
  
  if(this.sendingTimout){
    clearTimeout(this.sendingTimout);
    this.sendingTimout = null;
  }
  if(val.type!='typing'){
    $('.idelivr-typer').hide();
  }
  // $('#idelivr_submit').html('Send');
  this.toggleButton();
  if(val.from_operator==0){

    $('#idelivr_message').focus();
  }

  for (var testName in this.displayed) {
      if (this.displayed[testName] == key) {
          return;
      }
  }
  if($('#quick_replier').attr("data-visi")==1){
    return;
  }else{
    $('#quick_replier').attr("data-visi",1);
  }
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    this.lastQuick = true;
    var container = document.createElement('div');
    if(val.from_operator==1){
      container.innerHTML = FriendlyChat.MSG_TEMPLATE;
    }else{
      container.innerHTML = FriendlyChat.SENT_TEMPLATE;
    }

    div = container;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  var jsonContent = JSON.parse(val.content);

    // console.log(jsonContent.recipient.id);

  if(!div.querySelector('.idelivr-img-responsive') && val.content){
    if(val.from_operator==1){
      div.innerHTML = FriendlyChat.MSG_TEMPLATE;
    }else{
      div.innerHTML = FriendlyChat.SENT_TEMPLATE;
    }
  }

  // var profilePicUrl = user.photoURL;
  // var userName = user.displayName;

  // if(user.photoURL==null){
  var profilePicUrl = this.defaultProfile;
  // }


  var updates = {};
  if(val.from_operator==1){
    if(div.querySelector('.idelivr-img-responsive')){
      div.querySelector('.idelivr-img-responsive').src = this.defaultURL;
    }
    if(!val.is_reached){
      updates['is_reached'] = 1;
    }
    if(!val.read){
      updates['read'] = chatbase.SERVER_TIME;
    }
  }else{
    if(!val.sent){
      updates['sent'] = chatbase.SERVER_TIME;
    }
    if (profilePicUrl) {
      div.querySelector('.idelivr-img-responsive').src = profilePicUrl;
    }
  }
  // this.database.ref('active_conversation/'+key).update(updates);
  chatbase.update('active_conversation', key, updates);

  var messageElement = div.querySelector('.idelivr-message');
  var timeElement = div.querySelector('.idelivr-time');
  if (jsonContent.message.text) { // If the message is text.
    var date = new Date(val.timestamp);
    var msgContent = filterXSS(jsonContent.message.text);
    messageElement.innerHTML = linkify(msgContent);
    var hoursString = date.getHours();
    var minutesString = date.getMinutes();
    if(date.getHours()<10){
      hoursString = "0" + date.getHours();
    }
    if(date.getMinutes()<10){
      minutesString = "0" + date.getMinutes();
    }

    timeElement.textContent = hoursString + ":" + minutesString;

    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    show(div.querySelector('.idelivr-avatar'));
    show(div.querySelector('.idelivr-msg_receive'));
    show(div.querySelector('.idelivr-time'));
    hide(div.querySelector('.idelivr-gif-responsive'));
  }else{
    show(div.querySelector('.idelivr-avatar'));
    hide(div.querySelector('.idelivr-msg_receive'));
    hide(div.querySelector('.idelivr-time'));
    show(div.querySelector('.idelivr-gif-responsive'));
  }

  
  var switching = false;

  // var params = {

  //               "Name" : "abc",
  //               "mobile":"9111111111",
  //               "address":"qwerty"
  //           }

  // jsonContent.message.quick_replies[0].type = "redirect";
  // jsonContent.message.quick_replies[0].http_method = "POST";
  // // jsonContent.message.quick_replies[0].title = "Redirect";
  // jsonContent.message.quick_replies[0].redirect_url = "https://www.google.com/";
  //  jsonContent.message.quick_replies[0].data = params;
  
  var messIndex;
  for(var index = 0; index < jsonContent.message.quick_replies.length; index++){
    var string = jsonContent.message.quick_replies[index].title;
    var payload = jsonContent.message.quick_replies[index].payload;
    var payloadContent = jsonContent.message.quick_replies[index].title;
    messIndex = index;
    var div = document.createElement("div");

    // div.class = "quick-button";
    div.innerHTML = payloadContent;
    $(div).addClass("quick-button")
    var self = this;
    if(jsonContent.message.quick_replies[index].content_type=='upload'){
      $(div).on("click",function(){
        $('#idelivr-filepicker').click();
      });
    }else{
      $(div).on("click",function(){
      if(jsonContent.message.quick_replies[messIndex].type){ 
        if(jsonContent.message.quick_replies[messIndex].type == "redirect"){
              
            url_redirect({
                            url: jsonContent.message.quick_replies[messIndex].redirect_url,
                            method: jsonContent.message.quick_replies[messIndex].http_method,
                            data: jsonContent.message.quick_replies[messIndex].data
            });
        }
      }else{
              
               self.saveQuickMessage($(this).attr("data-cont"),$(this).html());
        }
      });
    }
    $(div).attr("data-cont",payload);
    $('#quick_replier').append(div);
    // $('#idelivr_message').prop( "disabled", true );
    // $('#idelivr_submit').prop( "disabled", true );
  }

  // var height = $('#idelivr_messages').outerHeight(true);
  var height = $('#idelivr_messages').outerHeight(true);
  if(this.disabledButtons){
    $('#idelivr_message').prop( "disabled", true );
    $('#idelivr_submit').prop( "disabled", true );
  }
  // $('#quick_replier').show();
  // if(name!="1"){
    // $('#quick_replier').slideUp();
  // }else{
    $('#quick_replier').show();
  // }

  var total_width = 0;
  var max_width = 0;
  // $('#quick_replier > *').outerWidth(function(i,w){total_width+=w;});
  // for(var childs in $('#quick_replier > *')){
    // console.log($(childs).outerWidth(true));
  // }
  $('#quick_replier').children().each(function(idx, val){
    //alert($(this).outerWidth(true));
    total_width+=$(this).outerWidth(true);
    if(max_width<$(this).outerWidth(true)){
      max_width = $(this).outerWidth(true);
     
    }
  });

  // console.log("total width - "+total_width);
  // console.log("outer width false - "+$('#quick_replier').outerWidth());
  // console.log("outer width true - "+$('#quick_replier').outerWidth(true));

//Need to change the condition for horizontal flag,
  if(val.horizontal_flag){
      
      this.horizontalFlag = val.horizontal_flag;
      
  }

  if(total_width > $('#quick_replier').outerWidth(true)){
    if((max_width*2)<$('#quick_replier').outerWidth(true) && !(this.horizontalFlag)){
      $('.quick-button').addClass('quick-button-mid');
      $('.quick-button-mid').removeClass('quick-button');
    }else if(this.horizontalFlag){
      $('.idelivr-quick').addClass('idelivr-quick-horizontal');      
      $('.idelivr-quick-horizontal').removeClass('idelivr-quick');
      $('.quick-button').addClass('quick-button-horizontal');
      $('.quick-button-horizontal').removeClass('quick-button');
    }else {
      $('.quick-button').addClass('quick-button-wide');
      $('.quick-button-wide').removeClass('quick-button');
    }
  }

  this.displayed.push(key);
  $('#idelivr_messages').outerHeight(height-$('#quick_replier').outerHeight(true));
  idelivr.resizer();
  // Show the card fading-in.
  // setTimeout(function() {div.classList.add('idelivr-visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
};

function url_redirect(options){
        

    var $form = $("<form />");
                 
        $form.attr("action",options.url);
        $form.attr("method",options.method);
                 
        for (var data in options.data)
        $form.append('<input type="hidden" name="'+data+'" value="'+options.data[data]+'" />');
                  
        $("body").append($form);
        $form.submit();
}

FriendlyChat.prototype.displayVideo = function(user, key, val) {
  var div = document.getElementById(key);
  if (!div) {
    $('#quick_replier').hide();
    // $('#calendar_replier').hide();
    console.log("video")
    this.lastVideo = true;
    var container = document.createElement('div');
    var jsonContent = JSON.parse(val.content);

    var url = jsonContent.url;    
    container.innerHTML = '<iframe width="400" height="225" src="https://www.youtube.com/embed/'+url.substring(1)+' frameborder="0" allowfullscreen></iframe>'

    console.log(container.innerHTML)
    div = container;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
}

FriendlyChat.prototype.displayFlifo = function(user, key, val) {

  

    var flifoJson  = {

    "departing_date" : "Sept 15",
    "departing_time" : "16:40 AM",
    "departing_airport" : "Indira Gandhi International Airport",
    "departing_confirmed" : "Confirmed",
    "flight_duration" : "1h 30m flight",
    "arrival_time" : "8:10 AM",
    "arrival_airport" : "Ahmedabad Airport",
    "arrival_confirmed" : "Confirmed",
    "pnr" : "YXA320",
    "names" : ["Mr. Somendra Patel", "Gyanendra Kumar"] ,
    "flight_others" : "",
    "flight_name" : "IndiGo",
    "flight_code" : "6E 517",
    "flight_class" : "Economy",
    "footer" : true

  };

   var div =  document.createElement('div');
      div.id="flightInfo";

    this.messageList.appendChild(div);
    console.log(flifoJson);
    flifo(flifoJson);

    this.messageList.scrollTop = this.messageList.scrollHeight;

    var height = $('#idelivr_messages').outerHeight(true);
    if(this.disabledButtons){
    $('#idelivr_message').prop( "disabled", true );
    $('#idelivr_submit').prop( "disabled", true );
}

}

FriendlyChat.prototype.displayCarousal = function(user, key, val) {
  var div = document.getElementById(key);
  if (!div) {
    $('#quick_replier').hide();
    // $('#calendar_replier').hide();
    console.log("carousal")
    this.lastCarousal = true;
    this.toggleButton();
    var container = document.createElement('div');
    // var jsonContent = JSON.parse(val.content);

    // var url = jsonContent.url;

    // FriendlyChat.ITEM_TEMPLATE;
    // var messageElement = div.querySelector('.');
    var elementList = '';

    var itemArray = JSON.parse(val.content);
     var carLength = itemArray.length
    for (var item in itemArray) {
      item = itemArray[item]
      // console.log('---->'+item)
      // console.log('---->'+itemArray[item])
      var container = document.createElement('div');
      container.innerHTML =  FriendlyChat.ITEM_TEMPLATE;

      var replierElement = container.querySelector('.replier_block');
      var carItem = container.querySelector('.carousel-item');
      carItem.style.width = (100/carLength)+"%";
      // var temp =
     var CarousalID = "";
      
      if(item.option_key){

        CarousalID = item.option_key;

      }
      
      if(item.option1){
        var div = document.createElement('div');
        if(item.link1){
           div.innerHTML = '<div class="replier_row"><a href="'+item.link1+'" target="_blank">'+item.option1+'</a></div>';
        }else{
          if(CarousalID){
           div.innerHTML = '<div class="replier_row" style="cursor: pointer;" onclick="idelivr.saveQuickMessage(\''+item.option1+'||'+CarousalID+'\',\''+item.option1+'||'+CarousalID+'\')">'+item.option1+'</div>';
          }else{
            div.innerHTML = '<div class="replier_row" style="cursor: pointer;" onclick="idelivr.saveQuickMessage(\''+item.option1+'\',\''+item.option1+'\')">'+item.option1+'</div>';
          }
        }
        replierElement.appendChild(div);
      }
     
      if(item.option2){
        var div = document.createElement('div');
        if(item.link2){
           div.innerHTML = '<div class="replier_row"><a href="'+item.link2+'" target="_blank">'+item.option2+'</a></div>';
        }else{
          if(CarousalID){
           div.innerHTML = '<div class="replier_row" style="cursor: pointer;" onclick="idelivr.saveQuickMessage(\''+item.option2+'||'+CarousalID+'\',\''+item.option2+'||'+CarousalID+'\')">'+item.option2+'</div>';
          }else{
            div.innerHTML = '<div class="replier_row" style="cursor: pointer;" onclick="idelivr.saveQuickMessage(\''+item.option2+'\',\''+item.option2+'\')">'+item.option2+'</div>';
          }
           
        }
        replierElement.appendChild(div);
      }
       
      if(item.option3){
        var div = document.createElement('div');
        if(item.link3){
           div.innerHTML = '<div class="replier_row"><a href="'+item.link3+'" target="_blank">'+item.option3+'</a></div>';
        }else{
          if(CarousalID){
           div.innerHTML = '<div class="replier_row" style="cursor: pointer;" onclick="idelivr.saveQuickMessage(\''+item.option3+'||'+CarousalID+'\',\''+item.option3+'||'+CarousalID+'\')">'+item.option3+'</div>';
          }else{
            div.innerHTML = '<div class="replier_row" style="cursor: pointer;" onclick="idelivr.saveQuickMessage(\''+item.option3+'\',\''+item.option3+'\')">'+item.option3+'</div>';
          }
           
        }
        replierElement.appendChild(div);
      }
      
      var missingElementCount = missingElement(item);
     
        if(missingElementCount)
        {       
             var imgElement = container.querySelector('.image_row');

                  imgElement.style.height = (176+missingElementCount*50)+"px";                  
        }



      var titleElement = container.querySelector('.card_title');
      var subElement = container.querySelector('.card_content');
      var imgElement = container.querySelector('.image_row');

      

      titleElement.innerHTML = item.title;
      subElement.innerHTML = item.sub_title;
      imgElement.src = item.image_url;

      elementList = elementList + container.innerHTML;
    }

    container.innerHTML = '<div class="container"> '+
                            '<div class="carousel"> '+
                              '<div class="carousel-prev"></div>'+
                              '<div class="carousel-next"></div>'+
                              '<ul class="carousel-container">'+
                                  
                                  elementList +

                              '</ul>'+
                            '</div>'+
                          '</div>'
    console.log(val);
    console.log(itemArray);
    console.log(elementList);
    console.log(container.innerHTML);

    // carLength
    var imageItem = container.querySelector('.image_row');
    imageItem.style.height = 176 + (3 - carLength)*40;
    var containerItem = container.querySelector('.carousel-container');
    containerItem.style.width = (carLength*100)+"%";
    div = container;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);

    this.messageList.scrollTop = this.messageList.scrollHeight;

    var height = $('#idelivr_messages').outerHeight(true);
    if(this.disabledButtons){
    $('#idelivr_message').prop( "disabled", true );
    $('#idelivr_submit').prop( "disabled", true );
  }

    var car = new Carousal();
  }
}

function missingElement(item){

var count=0;
    
        if(!item.option1)
          count = count + 1;
        if(!item.option2)
          count = count + 1;
        if(!item.option3)
          count = count + 1;        
    return count; 
}

FriendlyChat.prototype.displayCal = function(user, key, val) {
  console.log("Calendar triggered")
  if(this.sendingTimout){
    clearTimeout(this.sendingTimout);
    this.sendingTimout = null;
  }
  if(val.type!='typing'){
    $('.idelivr-typer').hide();
  }
  // $('#idelivr_submit').html('Send');
  this.toggleButton();
  if(val.from_operator==0){
    $('#idelivr_message').focus();
  }

  for (var testName in this.displayed) {
      if (this.displayed[testName] == key) {
          return;
      }
  }
  
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    $('#quick_replier').hide();
    // $('#calendar_replier').hide();
    console.log("Calendar 2")
    this.lastCal = true;
    var container = document.createElement('div');
    if(val.from_operator==1){
      container.innerHTML = FriendlyChat.MSG_TEMPLATE;
    }else{
      container.innerHTML = FriendlyChat.SENT_TEMPLATE;
    }

    div = container;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  var jsonContent = JSON.parse(val.content);
  
  if(window.calendars){
    window.calendars.ranger = jsonContent.message.dates;
    window.calendars.update();
  }
  
  if(!div.querySelector('.idelivr-img-responsive') && val.content){
    if(val.from_operator==1){
      div.innerHTML = FriendlyChat.MSG_TEMPLATE;
    }else{
      div.innerHTML = FriendlyChat.SENT_TEMPLATE;
    }
  }

  // var profilePicUrl = user.photoURL;
  // var userName = user.displayName;

  // if(user.photoURL==null){
  var profilePicUrl = this.defaultProfile;
  // }
  var updates = {};
  if(val.from_operator==1){
    if(div.querySelector('.idelivr-img-responsive')){
      div.querySelector('.idelivr-img-responsive').src = this.defaultURL;
    }
    if(!val.is_reached){
      updates['is_reached'] = 1;
    }
    if(!val.read){
      updates['read'] = chatbase.SERVER_TIME;
    }
  }else{
    if(!val.sent){
      updates['sent'] = chatbase.SERVER_TIME;
    }
    if (profilePicUrl) {
      div.querySelector('.idelivr-img-responsive').src = profilePicUrl;
    }
  }
  // this.database.ref('active_conversation/'+key).update(updates);
  chatbase.update('active_conversation', key, updates);

  var messageElement = div.querySelector('.idelivr-message');
  var timeElement = div.querySelector('.idelivr-time');
  if (jsonContent.message.text) { // If the message is text.
    var date = new Date(val.timestamp);
    var msgContent = filterXSS(jsonContent.message.text);
    messageElement.innerHTML = linkify(msgContent);
    var hoursString = date.getHours();
    var minutesString = date.getMinutes();
    if(date.getHours()<10){
      hoursString = "0" + date.getHours();
    }
    if(date.getMinutes()<10){
      minutesString = "0" + date.getMinutes();
    }

    timeElement.textContent = hoursString + ":" + minutesString;

    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    show(div.querySelector('.idelivr-avatar'));
    show(div.querySelector('.idelivr-msg_receive'));
    show(div.querySelector('.idelivr-time'));
    hide(div.querySelector('.idelivr-gif-responsive'));
  }else{
    show(div.querySelector('.idelivr-avatar'));
    hide(div.querySelector('.idelivr-msg_receive'));
    hide(div.querySelector('.idelivr-time'));
    show(div.querySelector('.idelivr-gif-responsive'));
  }

  var height = $('#idelivr_messages').outerHeight(true);

  if(this.disabledButtons){
    $('#idelivr_message').prop( "disabled", true );
    $('#idelivr_submit').prop( "disabled", true );
  }
  // var windowWidth = $(window).outerWidth(true);
  // var windowHeight = $(window).outerHeight(true);
  // var calSize = windowHeight > windowWidth ? windowWidth : windowHeight - $('.idelivr-panel-footer').outerHeight();
  // if($('#calendarMaster').outerHeight(true)>calSize){
  //   $('#calendarMaster').outerHeight(calSize);
  //   $('#calendarMaster').outerWidth(calSize);
  // }
  $('#calendar_replier').show();

  $('#idelivr_messages').outerHeight(height-$('#quick_replier').outerHeight(true));
  this.displayed.push(key);
  $(window).trigger('resize');
  this.messageList.scrollTop = this.messageList.scrollHeight;
};

// Displays a Message in the UI.
FriendlyChat.prototype.displayFile = function(user, key, val) {
  var div = document.getElementById(key);
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = FriendlyChat.UPLOAD_TEMPLATE;
    div = container;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  var updates = {};
  if(!val.sent){
    updates['sent'] = firebase.database.ServerValue.TIMESTAMP;
  }
  this.database.ref('active_conversation/'+key).update(updates);

  if(val.content==""){
    // $('#'+key+' > div').html('Uploading')
    if(Date.now()-60000>val.timestamp && val.timestamp!=0){
      $('#'+key+' > div').addClass('idelivr-failed');
      $('#'+key+' > div > div').html('Upload Failed');
    }else{
      $('#'+key+' > div').addClass('idelivr-active');
    }
  }else{
    // $('#'+key+' > div > div').html('Uploaded')
    $('#'+key+' > div').removeClass('idelivr-active');
  }

  // var messageElement = div.querySelector('.idelivr-message');

  this.messageList.scrollTop = this.messageList.scrollHeight;
};

function hide (elements) {
  if(elements){
    elements = elements.length ? elements : [elements];
    for (var index = 0; index < elements.length; index++) {
      elements[index].style.display = 'none';
    }
  }
}

function show (elements, specifiedDisplay) {
  if(elements){
    elements = elements.length ? elements : [elements];
    for (var index = 0; index < elements.length; index++) {
      elements[index].style.display = specifiedDisplay || 'block';
    }
  }
}

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

// Enables or disables the submit button depending on the values of the input
// fields.
FriendlyChat.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    $(".idelivr-options").addClass('idelivr-typing');
  } else {
    $(".idelivr-options").removeClass('idelivr-typing');
  }
};

FriendlyChat.prototype.mobile = function(s){
  this.mobileVerified = s;
  this.contextUpdater('mobile_verified', s);
}

FriendlyChat.prototype.email = function(s){
  this.emailVerified = s;
  this.contextUpdater('email_verified', s);
}

FriendlyChat.prototype.anony = function(s){
  this.anonymousID = s;
  this.contextUpdater('anonymousID', s);
}

FriendlyChat.prototype.context = function(value){
  this.pushValue = value;
  for ( var i in value ){
    this.contextUpdater(i, value[i]);
  }
}

FriendlyChat.prototype.screenInfo = function(value){
  this.screenValue = value;

  chatbase.push('scenario_code', null, {
    prev_screen: value.backScreenId,
    current_screen: value.presentScreenId,
    next_screen: value.frontScreenId,
    customer: chatbase.getCustomer(),
    status: 'P'
  });
}

FriendlyChat.prototype.contextUpdater = function(key, value){
    var updates = {};
    updates.customer = chatbase.getCustomer()
    updates[key] = value;
    chatbase.push("customer_meta", null, updates);
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
      var socketjs = document.createElement("script");
      socketjs.onload = function () {
        var xssjs = document.createElement("script");
        xssjs.onload = function () {
            var chatbasejs = document.createElement("script");
            chatbasejs.onload = function () {
              // var style = document.createElement('style')
              // style.type = 'text/css'
              // style.innerHTML = '.idelivr-panel { margin-bottom: 0px; height: calc(100% - 50px)!important; box-shadow: 0 5px 40px rgba(0,0,0,.16)!important; background-color: #FFFFFF; } .idelivr-chat-window { opacity: 0; visibility: hidden; transform: scale(0.98); bottom: 5px!important; position: fixed!important; width: 370px!important; right: 20px!important; z-index: 2147483600!important; height: calc(100% - 55px - 20px)!important; min-height: 250px!important; max-height: 590px!important; /*box-shadow: 0 5px 40px rgba(0,0,0,.16)!important;*/ /*border-radius: 2px!important;*/ /*overflow: hidden!important;*/ transition: transform .16s linear, opacity .08s linear, -webkit-transform .16s linear, visibility 0s; } .idelivr-chat-window-active { transform: scale(1); opacity: 1; visibility: visible; } .idelivr-panel-closer { position: relative; height: 50px; width: 100%; /*background-color: #FF0000;*/ } .idelivr-launcher-closer-icon { background-image: url(https://s3.ap-south-1.amazonaws.com/chatwidget/wealthy/chat_closer.png); background-size: 50px 50px; background-repeat: no-repeat; opacity: 0.4; float: right; width: 50px; height: 50px; cursor: pointer; } .idelivr-chat-window>div>.idelivr-panel { border-radius: 5px 5px 0 0; } .idelivr-icon_minim { padding: 2px 10px; } .idelivr-messages>p { font-size: 13px; margin: 0 0 0.2rem 0; } .idelivr-messages>time { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 100; } .idelivr-message>a { color: #3366BB!important; text-decoration: none!important; cursor: auto!important; font-family: inherit; } .idelivr-msg_container { padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px; overflow: hidden; display: flex; } .idelivr-base_receive>.idelivr-avatar:after { position: absolute; top: 0; right: 0; width: 0; height: 0; border: 5px solid #FFF; border-left-color: rgba(0, 0, 0, 0); border-bottom-color: rgba(0, 0, 0, 0); } .idelivr-base_sent { justify-content: flex-end; align-items: flex-end; } .idelivr-base_upload { justify-content: center; align-items: flex-end; } .idelivr-base_sent>.idelivr-avatar:after { position: absolute; bottom: 0; left: 0; width: 0; height: 0; border: 5px solid white; border-right-color: transparent; border-top-color: transparent; box-shadow: 1px 1px 2px rgba(black, 0.2); } .idelivr-msg_sent>time { float: right; } .idelivr-msg_container_base::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); background-color: #F5F5F5; } .idelivr-msg_container_base::-webkit-scrollbar { width: 5px; background-color: #F5F5F5; } .idelivr-msg_container_base::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3); background-color: #005b78; border-radius: 10px; } .idelivr-btn-group.dropup { position: fixed; left: 0px; bottom: 0; } .idelivr-btn-social { position: relative; padding-left: 44px; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis } .idelivr-btn-social>:first-child { position: absolute; left: 0; top: 0; bottom: 0; width: 32px; line-height: 34px; font-size: 1.6em; text-align: center; border-right: 1px solid rgba(0, 0, 0, 0.2) } .idelivr-btn-social-icon { position: relative; padding-left: 44px; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 34px; width: 34px; padding: 0 } .idelivr-btn-social-icon>:first-child { position: absolute; left: 0; top: 0; bottom: 0; width: 32px; line-height: 34px; font-size: 1.6em; text-align: center; border-right: 1px solid rgba(0, 0, 0, 0.2) } .idelivr-panel-footer { position: absolute; bottom: 0; left: 0; right: 0; min-height: 55px; max-height: 55px; box-sizing: border-box; } .idelivr-footer-form { position: absolute; width: 100%; height: 100%; } #idelivr_message { position: absolute; left: 0; width: 100%; color: #565867; background-color: #f4f7f9; resize: none; border: none; transition: background-color .2s ease,box-shadow .2s ease; min-height: 55px; max-height: 55px; box-sizing: border-box; padding: 16px; padding-right: 50px; padding-left: 30px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 200; line-height: 1.33; word-wrap: break-word; } #idelivr_message:focus { outline: none; background-color: #fff; box-shadow: 0 0 100px 0 rgba(150,165,190,.24); } .idelivr-small-text { font-size: 10px; } .idelivr-hover-cursor { cursor: pointer; cursor: hand; } .idelivr-logo { position: relative; display: block; margin: auto; width: 110px; height: 50px; } .idelivr-start-button { position: relative; display: block; margin: auto; width: 70%; height: 30px; margin-left: 15%; margin-right: 15%; } .idelivr-msg_container_base { min-height: 120px!important; max-height: 430px!important; height: calc(100% - 130px)!important; background: url("https://s3.ap-south-1.amazonaws.com/chatwidget/wealthy/background.png"); margin: 0; padding: 0; overflow-x: hidden; } .idelivr-lack-border { border: 0px; } .idelivr-form-control { display: block; border-radius: 6px; color: #555; width: 99%; background-color: #fff; background-image: none; border: 1px solid #ccc; transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s } .idelivr-font { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.42857143; padding: 2%; } .idelivr-panel-default>.idelivr-panel-heading { color: #fff; background-color: #005b78; border-color: #ddd; } .idelivr-chat-avatar { display: inline-block; border-radius: 50%; } .idelivr-chat-avatar > img{ width: 64px; height: 64px; margin: 5px 5px 5px 5px; border: 1px solid white; } .idelivr-panel-heading { height: 75px; border-bottom: 1px solid transparent; border-top-left-radius: 2px; border-top-right-radius: 2px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; background: #666; color: white; position: relative; overflow: hidden; } .idelivr-profile-body{ display: inline-block; position: absolute; padding-top: 21px; } .idelivr-box-logo{ display: inline-block; position: absolute; right: 20px; top: 30px; } .idelivr-profile-logo{ width: 100px; } .idelivr-panel-operator{ color: #fff; font-size: 16px; line-height: 1.2em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .idelivr-panel-time{ color: hsla(0,0%,100%,.8); font-size: 13px; line-height: 1.1em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 100; } .idelivr-options { position: absolute; right: 10px; bottom: 8px; vertical-align: middle; } .idelivr-options > input { display: none; } .idelivr-typing .idelivr-sender { opacity: 0.2; display: inherit; padding-bottom: 4px; } .idelivr-typing .idelivr-sender:hover { opacity: 0.3; display: inherit; padding-bottom: 4px; cursor: pointer; } .idelivr-typing .idelivr-paperclip { display: none; } .idelivr-sender { width: 32px; height: 32px; display: none; } .idelivr-paperclip { width: 32px; height: 32px; margin: 0px 0px 4px 0px; padding: 3px; opacity: 0.6; } .idelivr-paperclip:hover { opacity: 0.8; cursor: pointer; } .idelivr-form-send { border-top-right-radius: 0; border-bottom-right-radius: 0; border-top-left-radius: 6px!important; border-bottom-left-radius: 6px!important; position: relative; float: left; width: 100%; margin-bottom: 0; display: table-cell; padding: 5px 10px; font-size: 12px; line-height: 1.5; border-radius: 3px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #333; background-color: #fff; } .idelivr-input-group { position: relative; display: table; border-collapse: separate; } .idelivr-img-responsive { box-sizing: border-box; display: block; width: 100%; height: auto; float: left; vertical-align: middle; /*border-radius: 50%;*/ bottom:0; position: absolute; border: 1px solid white; } .idelivr-gif-responsive { display: block; width: 25%; height: 30%; float: left; } .idelivr-msg_sent { color: #fff; background-color: #005b78; margin-right: 0; max-width: 83.33333333%; position: relative; min-height: 1px; float: left; box-sizing: border-box; display: block; } .idelivr-msg_receive { color: #263238; background-color: #f4f7f9; padding-left: 0; margin-left: 0; margin-right: 0; max-width: 75%; position: relative; min-height: 1px; float: right; box-sizing: border-box; display: block; } .idelivr-messages { word-wrap: break-word; padding: 7px 10px 7px 10px; border-radius: 3px; } .idelivr-avatar { width: 12%; float: left; box-sizing: border-box; position: relative; } .idelivr-message { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.42857143; } .idelivr-uploading { padding: 10px 20px 10px 20px; border-radius: 6px; color: #fff; background-color: #169a14; position: relative; font-weight: 100; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; } .idelivr-active > .idelivr-uploading{ display: none; } .idelivr-failed > .idelivr-uploading{ padding: 10px 20px 10px 20px; border-radius: 6px; color: #fff; background-color: #ff0000; position: relative; font-weight: 100; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; } .idelivr-container { position: relative; width: 56px; height: 56px; transform: rotate(180deg); padding-left: 20px; display: none; } .idelivr-active > .idelivr-container { display: inline-block; } .idelivr-chevron { position: absolute; width: 28px; height: 8px; opacity: 0; transform: scale3d(0.5, 0.5, 0.5); animation: idelivr-move 3s ease-out infinite; } .idelivr-chevron:first-child { animation: idelivr-move 3s ease-out 1s infinite; } .idelivr-chevron:nth-child(2) { animation: idelivr-move 3s ease-out 2s infinite; } .idelivr-chevron:before, .idelivr-chevron:after { content: ""; position: absolute; top: 0; height: 100%; width: 51%; background: #005b78; } .idelivr-chevron:before { left: 0; transform: skew(0deg, 30deg); } .idelivr-chevron:after { right: 0; width: 50%; transform: skew(0deg, -30deg); } @keyframes idelivr-move { 25% { opacity: 1; } 33% { opacity: 1; transform: translateY(30px); } 67% { opacity: 1; transform: translateY(40px); } 100% { opacity: 0; transform: translateY(55px) scale3d(0.5, 0.5, 0.5); } } .idelivr-launcher { position: fixed; bottom: 20px; right: 20px; width: 64px; height: 64px; /*background: #005b78;*/ /*border-radius: 50%;*/ cursor: pointer; -webkit-transform-origin: center; -ms-transform-origin: center; transform-origin: center; -webkit-backface-visibility: hidden; backface-visibility: hidden; overflow: hidden; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale } .idelivr-launcher-close-icon, .idelivr-launcher-open-icon { position: absolute; top: 0; bottom: 0; width: 100%; transition: opacity .08s linear, -webkit-transform .16s linear; transition: transform .16s linear, opacity .08s linear; transition: transform .16s linear, opacity .08s linear, -webkit-transform .16s linear; background-position: 50%; background-repeat: no-repeat } .idelivr-launcher-open-icon { background-image: url(https://s3.ap-south-1.amazonaws.com/chatwidget/wealthy/chat_icon.png); background-size: 64px 64px; background-repeat: no-repeat; opacity: 1; -webkit-transform: rotate(0deg) scale(1); -ms-transform: rotate(0deg) scale(1); transform: rotate(0deg) scale(1) } .idelivr-launcher-close-icon { background-image: url(https://s3.ap-south-1.amazonaws.com/chatwidget/wealthy/chat_close.png); background-size: 50px 50px; background-repeat: no-repeat; opacity: 0; -webkit-transform: rotate(-30deg); -ms-transform: rotate(-30deg); transform: rotate(-30deg) } .idelivr-launcher-active .idelivr-launcher-open-icon { opacity: 0; -webkit-transform: rotate(30deg) scale(0); -ms-transform: rotate(30deg) scale(0); transform: rotate(30deg) scale(0) } .idelivr-launcher-active .idelivr-launcher-close-icon { opacity: 0.3; -webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); transform: rotate(0deg) } '
              // document.getElementsByTagName('head')[0].appendChild(style);
              // $('body').append('<div hidden class="idelivr-chat-window" id="idelivr_chat_window_1"> <div class="idelivr-panel-closer"> <div class="idelivr-launcher-closer-icon"></div> </div> <div class="idelivr-panel idelivr-panel-default"> <div class="idelivr-panel-heading"> <div class="idelivr-chat-avatar"> <img src="https://s3.ap-south-1.amazonaws.com/chatwidget/idelivr/idelivr.jpg"> </div> <div class="idelivr-profile-body"> <div class="idelivr-panel-operator"></div> <div class="idelivr-panel-time"></div> </div> <div class="idelivr-box-logo"> <img class="idelivr-profile-logo" src="https://s3.ap-south-1.amazonaws.com/chatwidget/wealthy/wealthy.png"> </div> </div> <div id="idelivr_messages" class="idelivr-msg_container_base" style="position:relative;"></div> <div class="idelivr-panel-footer" id="idelivr_footers"> <form id="idelivr_message-form" action="#" class="idelivr-footer-form"> <textarea id="idelivr_message" rows="2" placeholder="Type your message here..."></textarea> <div class="idelivr-options"> <label for="idelivr-filepicker"> <img class="idelivr-paperclip" src="https://s3.ap-south-1.amazonaws.com/chatwidget/wealthy/paper.png"> </label> <input type="file" id="idelivr-filepicker" name="file"/> <img id="idelivr_submit" class="idelivr-sender" src="https://s3.ap-south-1.amazonaws.com/chatwidget/wealthy/send.png"> </div> </form> </div> </div> </div> <div class="idelivr-launcher"> <div class="idelivr-launcher-open-icon"></div> <!-- <div class="idelivr-launcher-close-icon"></div> --> </div>');
              // var config = {
              //   apiKey: "AIzaSyD5BXbJ1H-44QJ6usdXRBt0z8CgpJ9Gfyg",
              //   authDomain: "wealthy-e5d11.firebaseapp.com",
              //   databaseURL: "https://wealthy-e5d11.firebaseio.com",
              //   storageBucket: "wealthy-e5d11.appspot.com",
              //   messagingSenderId: "377658700829"
              // };
              // firebase.initializeApp(config);
              window.idelivr = new FriendlyChat();
            };
            chatbasejs.src = "https://s3.ap-south-1.amazonaws.com/chatwidget/chatbase/chatbase-1.0.1.js";
            document.head.appendChild(chatbasejs);
          };
        xssjs.src = "https://s3.ap-south-1.amazonaws.com/chatwidget/xss.js";
        document.head.appendChild(xssjs);
        };
      socketjs.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.1/socket.io.js";
      document.head.appendChild(socketjs);
          

};

// var jqueryjs = document.createElement("script");
// jqueryjs.onload = function () {
$(window).on("load", function() {
  checkSetup();
});
