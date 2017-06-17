
'use strict';

// Initializes RefugeeNetwork.
function RefugeeNetwork() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.submitButton = document.getElementById('submit');
  this.submitImageButton = document.getElementById('submitImage');
  this.imageForm = document.getElementById('image-form');
  this.mediaCapture = document.getElementById('mediaCapture');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.postLoginDiv = document.getElementsByClassName("post-login");
  this.homeDiv = document.getElementById('home-div');
  this.seekerDiv = document.getElementById('seek-help');
  this.volunteerDiv = document.getElementById('volunteer-help');
  this.v1Div = document.getElementById('V1-div');
  this.s1Div = document.getElementById('S1-div');
  this.v2Div = document.getElementById('V2-div');
  this.s2Div = document.getElementById('S2-div');

  this.productNeed = document.getElementById('product-need');
  this.serviceNeed = document.getElementById('service-need');
  this.otherNeed = document.getElementById('other-need');

  this.productOffer = document.getElementById('product-offer');
  this.serviceOffer = document.getElementById('service-offer');
  this.otherOffer = document.getElementById('other-offer');



  // Saves message on form submit.
  //this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  // Takes you to the next respective page
  this.seekerDiv.addEventListener('click', this.seekerClick.bind(this));
  this.volunteerDiv.addEventListener('click', this.helperClick.bind(this));


  this.productNeed.addEventListener('click', this.prodNeedClick.bind(this));
  this.serviceNeed.addEventListener('click', this.serviceNeedClick.bind(this));
  this.otherNeed.addEventListener('click', this.otherNeedClick.bind(this));

  this.productOffer.addEventListener('click', this.prodOfferClick.bind(this));
  this.serviceOffer.addEventListener('click', this.serviceOfferClick.bind(this));
  this.otherOffer.addEventListener('click', this.otherOfferClick.bind(this));

  //this.v1S1Buttons = document.querySelectorAll('#V1-div button');


 //  for(var i=0;i<   this.v1S1Buttons.length;i++){
 //   this.v1S1Buttons[i].addEventListener('click', function(){console.log(i);},false);
 // }

  // Toggle for the button.
  var buttonTogglingHandler = this.toggleButton.bind(this);
  //this.messageInput.addEventListener('keyup', buttonTogglingHandler);
  //this.messageInput.addEventListener('change', buttonTogglingHandler);

  // Events for image upload.
  // this.submitImageButton.addEventListener('click', function(e) {
  //   e.preventDefault();
  //   this.mediaCapture.click();
  // }.bind(this));
  // this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

  this.initFirebase();
  this.loadRefugees();
}


RefugeeNetwork.prototype.loadRefugees = function() {
  // Reference to the /messages/ database path.
  this.messagesRef = this.database.ref('refugees');
  // Make sure we remove all previous listeners.
  this.messagesRef.off();

  // Loads the last 12 messages and listen for new ones.
  var setMessage = function(data) {
    var val = data.val();
    console.log(val.name+" , "+val.seek);
    console.log(data.name+" , "+data.seek);
    //this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
  }.bind(this);
  this.messagesRef.limitToLast(12).on('child_added', setMessage);
  this.messagesRef.limitToLast(12).on('child_changed', setMessage);
};

RefugeeNetwork.prototype.prodNeedClick = function() {
this.populate("product-need","S2-div");
};
RefugeeNetwork.prototype.serviceNeedClick = function() {
this.populate("service-need","S2-div");
};
RefugeeNetwork.prototype.otherNeedClick = function() {
this.populate("other-need","S2-div");
};

RefugeeNetwork.prototype.prodOfferClick = function() {
this.populate("product-share","V2-div");
};
RefugeeNetwork.prototype.serviceOfferClick = function() {
this.populate("service-share","V2-div");
};
RefugeeNetwork.prototype.otherOfferClick = function() {
this.populate("other-share", "V2-div");
};

RefugeeNetwork.prototype.populate = function(subItem, mainItem) {
console.log("item to populate >> "+subItem+","+mainItem);
  for(var i = 0; i < this.postLoginDiv.length;i++){

this.postLoginDiv[i].setAttribute("hidden", true);

  }


// one more for loop todo nehal

var mainNode = document.getElementById(mainItem);
var subNode = document.getElementById(subItem);
mainNode.removeAttribute("hidden");

this.v1S1divs = document.querySelectorAll('#'+mainItem+' div');
  for(var i = 0; i < this.v1S1divs.length;i++){

this.v1S1divs[i].setAttribute("hidden", true);

  }

subNode.removeAttribute("hidden");

}
// Sets up shortcuts to Firebase features and initiate firebase auth.
RefugeeNetwork.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};
// Loads chat messages history and listens for upcoming ones.
RefugeeNetwork.prototype.showHomeDivs = function() {
  // Reference to the /messages/ database path.
  // for(var i=0;i<this.postLoginDiv.length;i++){
  //   this.postLoginDiv[i].removeAttribute('hidden');
  // }

  this.homeDiv.removeAttribute("hidden");


};


// Saves a new message on the Firebase DB.
RefugeeNetwork.prototype.saveMessage = function(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (this.messageInput.value && this.checkSignedInWithMessage()) {
    var currentUser = this.auth.currentUser;
    // Add a new message entry to the Firebase Database.
    this.messagesRef.push({
      name: currentUser.displayName,
      text: this.messageInput.value,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function() {
      // Clear message text field and SEND button state.
      RefugeeNetwork.resetMaterialTextfield(this.messageInput);
      this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};

// Sets the URL of the given img element with the URL of the image stored in Cloud Storage.
RefugeeNetwork.prototype.setImageUrl = function(imageUri, imgElement) {
  // If the image is a Cloud Storage URI we fetch the URL.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = RefugeeNetwork.LOADING_IMAGE_URL; // Display a loading image first.
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];
    });
  } else {
    imgElement.src = imageUri;
  }
};

// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
RefugeeNetwork.prototype.saveImageMessage = function(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  this.imageForm.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (this.checkSignedInWithMessage()) {

    // We add a message with a loading icon that will get updated with the shared image.
    var currentUser = this.auth.currentUser;
    this.messagesRef.push({
      name: currentUser.displayName,
      imageUrl: RefugeeNetwork.LOADING_IMAGE_URL,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function(data) {

      // Upload the image to Cloud Storage.
      var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
      return this.storage.ref(filePath).put(file).then(function(snapshot) {

        // Get the file's Storage URI and update the chat message placeholder.
        var fullPath = snapshot.metadata.fullPath;
        return data.update({imageUrl: this.storage.ref(fullPath).toString()});
      }.bind(this));
    }.bind(this)).catch(function(error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
  }
};

// Signs-in Friendly Chat.
RefugeeNetwork.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat.
RefugeeNetwork.prototype.signOut = function() {
  // Sign out of Firebase.
  this.auth.signOut();


  for(var i=0;i<this.postLoginDiv.length;i++){
    this.postLoginDiv[i].setAttribute('hidden', 'true');
  }

};
// Triggers when the auth state change for instance when the user signs-in or signs-out.
RefugeeNetwork.prototype.onAuthStateChanged = function(user) {
  console.log("user >> "+user)
  if (user) { // User is signed in!
      console.log("user >> "+user.displayName)
    // Get profile pic and user's name from the Firebase user object.
    // Get profile pic and user's name from the Firebase user object.
      var profilePicUrl = user.photoURL; // Only change these two lines!
      var userName = user.displayName;   // Only change these two lines!

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

    // We load currently existing chant messages.
    this.showHomeDivs();

    //this.showHomeDivs();

    // We save the Firebase Messaging Device token and enable notifications.
    this.saveMessagingDeviceToken();


  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
RefugeeNetwork.prototype.checkSignedInWithMessage = function() {

  // Return true if the user is signed in Firebase
    if (this.auth.currentUser) {
      return true;
    }
  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// Saves the messaging device token to the datastore.
RefugeeNetwork.prototype.saveMessagingDeviceToken = function() {
  firebase.messaging().getToken().then(function(currentToken) {
      if (currentToken) {
        console.log('Got FCM device token:', currentToken);
        // Saving the Device Token to the datastore.
        firebase.database().ref('/fcmTokens').child(currentToken)
            .set(firebase.auth().currentUser.uid);
      } else {
        // Need to request permissions to show notifications.
        this.requestNotificationsPermissions();
      }
    }.bind(this)).catch(function(error){
      console.error('Unable to get messaging token.', error);
    });
};

// Requests permissions to show notifications.
RefugeeNetwork.prototype.requestNotificationsPermissions = function() {
  // TODO(DEVELOPER): Request permissions to send notifications.
};

// Action on helpeclick
RefugeeNetwork.prototype.helperClick = function() {
    console.log("selected volunteer work >> ");
  // hide other divs
this.homeDiv.setAttribute("hidden", true);
this.s1Div.setAttribute("hidden", true);
//  ....
//  ....

// Show required div
this.v1Div.removeAttribute("hidden");
};


// Action on helpeclick
RefugeeNetwork.prototype.seekerClick = function() {
  // hide other divs
this.homeDiv.setAttribute("hidden", true);
this.v1Div.setAttribute("hidden", true);

//  ....
//  ....

// Show required div
this.s1Div.removeAttribute("hidden");
};

//V1BtnClick
RefugeeNetwork.prototype.V1BtnClick = function(btn) {
  // hide other divs
console.log("btn clicked ?? "+btn)

};

// Resets the given MaterialTextField.
RefugeeNetwork.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
RefugeeNetwork.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// A loading image URL.
RefugeeNetwork.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
RefugeeNetwork.prototype.displayMessage = function(key, name, text, picUrl, imageUri) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = RefugeeNetwork.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUri) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }.bind(this));
    this.setImageUrl(imageUri, image);
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
RefugeeNetwork.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
RefugeeNetwork.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

window.onload = function() {
  window.RefugeeNetwork = new RefugeeNetwork();
};
