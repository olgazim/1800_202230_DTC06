'use strict';


//----------------------------------------
//  Get DOM nodes
//----------------------------------------

const errorMessageContainer = document.getElementById('error-message');
const form = document.getElementById('sign-up-form');
const inputPassword = document.getElementById('password');
const inputShowPassword = document.getElementById('show-password');

//----------------------------------------
//  Firebase actions
//----------------------------------------

const signIn = async (email, password) => {
  return authClient.signInWithEmailAndPassword(email, password);
};

//----------------------------------------
//  Event listeners
//----------------------------------------

// change password field type in order to make password visible
const togglePasswordVisibility = (event) => {
  const checked = event.target.checked;

  inputPassword.type = checked ? 'text' : 'password';
};

const onSubmit = async (event) => {
  // prevent default actions to run validation
  event.preventDefault();
  event.stopPropagation();

  // check form validation
  const isValid = form.checkValidity();

  if (isValid) {
    // get email and password values to pass to Firebase
    const email = form.elements[0].value;
    const password = form.elements[1].value;
    console.log(email, password);

    // fetch Firebase auth API
    try {
      const authData = await signIn(email, password);

      console.log('Auth data:', authData);
      // Actions when user is created (redirect to home)
      window.location.href = "home.html";
    } catch (error) {
      // Actions when user creation failed (e.g. redirect to login page)

      // Show Firebase error message below the form
      errorMessageContainer.innerText = `Error from Firebase: ${error.message}`;

      console.log('ERROR code:', error.code);
      console.log('ERROR message:', error.message);
    }
  } else {
    // Actions when validation failed
    form.classList.add('was-validated');

    console.log('Form is invalid');
  }
};

//----------------------------------------
//  Add event listeners
//----------------------------------------
// Listen to form's onSubmit event to validate the form
form.addEventListener('submit', onSubmit, false);

// Listen to "onChange" event of the checkbox input to show/hide password
inputShowPassword.addEventListener('change', togglePasswordVisibility, false);
