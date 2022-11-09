'use strict';


//----------------------------------------
//  Get DOM nodes
//----------------------------------------
const buttonSignOut = document.getElementById('sign-out');

// Firebase actions

const signOut = () => {
  return authClient.signOut();
};


//----------------------------------------
//  Event listeners
//----------------------------------------
const onSignOut = async () => {
  try {
    const response = await signOut();

    console.log('Signed out:', response);
  } catch (error) {
    console.log('Sign out error:', error);
  } finally {
    window.alert('Do you want to sign out of MediTrack');
    window.location.href = "../onboarding.html";
  }
};


//----------------------------------------
//  Add event listeners
//----------------------------------------
buttonSignOut.addEventListener('click', onSignOut, false);
