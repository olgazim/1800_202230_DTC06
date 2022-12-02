"use strict";

//----------------------------------------
//  Get DOM nodes
//----------------------------------------

const errorMessageContainer = document.getElementById("error-message");
const form = document.getElementById("sign-up-form");
const inputPassword = document.getElementById("password");
const inputPasswordConfirm = document.getElementById("password-confirm");
const inputShowPassword = document.getElementById("show-password");

//----------------------------------------
//  Firebase actions
//----------------------------------------

const signUp = async (email, password) => {
  return authClient.createUserWithEmailAndPassword(email, password);
};

///----------------------------------------
//  Event listeners
//----------------------------------------

// change password field type in order to make password visible
const togglePasswordVisibility = (event) => {
  const checked = event.target.checked;

  inputPassword.type = checked ? "text" : "password";
  inputPasswordConfirm.type = checked ? "text" : "password";
};

// check whether values form Password anf Confirm password fields match
const onPasswordChange = () => {
  const passwordValue = inputPassword.value;
  const passwordConfirmValue = inputPasswordConfirm.value;
  const arePasswordsMatch = passwordValue === passwordConfirmValue;

  if (passwordValue !== "" && arePasswordsMatch) {
    inputPasswordConfirm.setCustomValidity("");
  } else {
    inputPasswordConfirm.setCustomValidity("Passwords do not match");
  }
};

const onSubmit = async (event) => {
  // prevent default actions to run validation
  event.preventDefault();
  event.stopPropagation();

  // check form validation
  const isValid = form.checkValidity();

  if (isValid) {
    // get email and password values to pass to Firebase
    const email = form.elements[2].value;
    const password = form.elements[3].value;
    console.log(email, password);

    // fetch Firebase auth API
    try {
      const authData = await signUp(email, password);
      var users = authData.user;
      console.log("Auth data:", authData);
      // Actions when user is created (redirect to home)
      db.collection("users")
        .doc(users.uid)
        .set({
          name: form.elements[1].value,
          email: form.elements[2].value,
        })
        .then(function () {
          console.log("New user added to database");
          window.alert(
            "Congratulations!\n You've successfully created an account in MediTrack."
          );
          window.location.href = "home.html";
        });
    } catch (error) {
      // Actions when user creation failed (redirect to sign in page)
      // Check if user already exists
      if (error.code === "auth/email-already-in-use") {
        // Redirect to login page
        window.alert(
          "Account with this email is already a member of MediTrack. Use your email and password to sign in."
        );
        window.location.href = "sign-in-scr.html";
      }

      // Show Firebase error message below the form
      errorMessageContainer.innerText = `Error from Firebase: ${error.message}`;

      console.log("ERROR code:", error.code);
      console.log("ERROR message:", error.message);
    }
  } else {
    // Actions when validation failed
    form.classList.add("was-validated");

    console.log("Form is invalid");
  }
};

//----------------------------------------
//  Add event listeners
//----------------------------------------
// Listen to form's onSubmit event to validate the form
form.addEventListener("submit", onSubmit, false);

// Listen to "onKeyUp" event of the password inputs to validate the values for equality
inputPassword.addEventListener("keyup", onPasswordChange, false);
inputPasswordConfirm.addEventListener("keyup", onPasswordChange, false);

// Listen to "onChange" event of the checkbox input to show/hide password
inputShowPassword.addEventListener("change", togglePasswordVisibility, false);

function showUploadedPicture() {
  const fileInput = document.getElementById("avatar_upload"); // pointer #1
  const image = document.getElementById("avatar_photo"); // pointer #2

  //attach listener to input file
  fileInput.addEventListener("change", function (e) {
    //the change event returns a file "e.target.files[0]"
    var blob = URL.createObjectURL(e.target.files[0]);

    //change the DOM img element source to point to this file
    image.src = blob; //assign the "src" property of the "img" tag
  });
}
showUploadedPicture();
