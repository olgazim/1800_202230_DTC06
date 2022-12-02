## My Web Application (MediTrack)

- [General info](#general-info)
- [Technologies](#technologies)
- [Contents](#content)

## General Info

This browser based web application to keep track of medication intake.

- Hi my name is Olga. I'm excited about this project because it will help people I know.
- Hi my name is Jason. I'm excited about this project because it will help a lot of people keep track of the medication.
- Hi my name is Natalie and I'm excited about this project because it is important that people take their medication as needed.
- Hi my name is Daniel and I'm excited about this project because I think it can be really helpful for people who are taking care of their   loved ones.

## Technologies

Technologies used for this project:

- HTML, CSS
- JavaScript
- Bootstrap
- Firebase
- ...

## Content

Content of the project folder:

```
 Top level of project folder:
├── .gitignore               # Git ignore file
├── onboarding.html          # landing HTML file, this is what users see when you come to url
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── assets                   # Folder for assets shared across screens
    /top-nav-calendar.html   # HTML file for the calendar in the top

├── images                   # Folder for images
    /avatar.jpg    
    /pills-logo.png
    /placeholder.jpg

├── screens                  # Folder for screen pages
    /account-scr.html        # this is where users can view and their account information
    /add-medication.html     # form for users to add medications to their account
    /edit-medication.html    # page to edit their medication info
    /edit-notification.html  # page to edit notification info (medication, dosage, date, time)
    /home.html               # the homepage screen
    /notification-scr.html   # this is where users can set notifications
    /pills-list.html         # this is where users can view their list of medications
    /set-notification.html   # form for users to set a notification 
    /sign-in-scr.html        # this is where users can login to their account
    /sign-up-scr.html        # this is where users can create an account

├── scripts                  # Folder for scripts
    /account.js              # JS for account-scr.html
    /add-medication.js       # JS for add-medication.html
    /edit-medication.js      # JS for edit-medication.html
    /edit-notification.js    # JS for edit-notification.html
    /firebase.js             # firebase API, shared across pages
    /home.js                 # JS for home.html
    /notification-scr.js     # JS for notification-scr.html
    /pills-list.js           # JS for pills-list.html
    /set-notification.js     # JS for set-notification.html
    /sign-in.js              # JS for sign-in-scr.html
    /sign-up.js              # JS for sign-up.html
    /top-nav-calendar.js     # JS for top-nav-calendar.html

├── styles                   # Folder for styles
    /account-scr.css         # style for account-scr.html
    /add-medication.css      # style for add-medication.html
    /bottom-nav.css          # style for bottom-nav.html
    /edit-notification.css   # style for edit-notification.html
    /first-time-flow.css     # style for sign-in-scr.html
    /home.css                # style for home.html
    /notification-scr.css    # style for notification-scr.html
    /pills-list.css          # style for pills-list.html
    /set-notification.css    # style for set-notification.html
    /top-nav-calendar.css    # style for top-nav-calendar.html

Firebase hosting files:
├── .firebaserc
├── 404.html
├── firebase.json



```

Tips for file naming files and folders:

- use lowercase with no spaces
- use dashes (not underscore) for word separation
