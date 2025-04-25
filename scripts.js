class Calculator { // This class handles the calculator functionality, including input handling and dropdown menus
  constructor() {
   this.pasteButton = document.querySelector(".btnPaste");
   this.inputField = document.querySelector("input[name='display']");
   this.ellipsisBtn = document.querySelector('.btnEllipsis');
   this.userBtn = document.querySelector('.btnUser');
   this.btnSolve = document.querySelector('.solveBtn');
   this.solveDropdown = document.querySelector('.solve-dropdown-content');
   this.solveDropdownArrow = document.querySelector('.dropdownArrow');
   
   this.initialiseEventListeners(); // Call the method to set up event listeners
  };
  
  initialiseEventListeners() {
   // Handle input field and paste button
    if (this.pasteButton && this.inputField) {
      this.initialiseClipboard();
      this.inputField.addEventListener("input", () => this.handleInput()); // Hide paste button when input changes
      this.inputField.addEventListener("blur", () => this.handleBlur()); // Show paste button when input is empty
    } 
    // Dropdown menu functionality 
    this.ellipsisBtn.addEventListener('click', (e) => this.handleDropdownClick(e, this.ellipsisBtn)); // Show dropdown when ellipsis button is clicked
    this.userBtn.addEventListener('click', (e) => this.handleDropdownClick(e, this.userBtn)); // Show dropdown when user button is clicked
    this.btnSolve.addEventListener('click', (e) => this.handleSolveClick(e)); // Show solve dropdown when solve button is clicked

    document.addEventListener('click', (e) => this.handleOutsideClick(e)); // Hide dropdowns when clicking outside
  }
  // Request clipboard permission and handle paste button functionality. Asynchronously reads text from the clipboard and pastes it into the input field
  // The async keyword is used to define an asynchronous function, which allows the use of await within the function
  async initialiseClipboard() {
    try {
      const permission = await navigator.permissions.query({name: 'clipboard-read'}); // Request permission to read from the clipboard
      if (permission.state === 'granted' || permission.state === 'prompt') { // If permission is granted or prompt is shown, display the paste button
        this.pasteButton.style.display = 'block';
      }
      this.pasteButton.addEventListener("mouseover", () => {
        this.pasteButton.style.cursor = "pointer";
      }
      );
      // Add event listener to the paste button to handle paste action
      this.pasteButton.addEventListener("click", async () => {
        try {
          // Read text from the clipboard and check if it is empty
          const text = await navigator.clipboard.readText();
          if (!text) {
            alert("ERROR: Your clipboard is empty.");
            return;
          }
          // Check if the text is empty
          this.inputField.value = text;
          this.pasteButton.style.display = "none";
        } catch (err) {
          // Handle error if clipboard access is denied
          alert ("ERROR: Clipboard access denied: might be because: - Your browser blocked clipboard access ", err); 
        }
      });
      } catch (err) {
      alert ("ERROR: Clipboard permission denied", err);
    }
  }
  handleInput() {
    this.pasteButton.style.display = "none"; // Hide paste button when input changes
  }
  
  handleBlur() {
    if (this.inputField.value === "") {
      this.pasteButton.style.display = "block"; // Show paste button when input is empty
    }
  }
 // Handle dropdown click events
 // e.stopPropagation() prevents the event from bubbling up to parent elements, which can trigger other event listeners
  handleDropdownClick(e, button) {
    e.stopPropagation(); // Prevent event from bubbling up which can trigger other event listeners
    const dropdown = button.nextElementSibling;
    document.querySelectorAll('.dropdown-content').forEach(d => {
      if (d !== dropdown) d.classList.remove('show');
    });
    dropdown.classList.toggle('show');
  }
// Handle solve button click event
  handleSolveClick(e) {
    e.stopPropagation();
    this.solveDropdown.classList.toggle('show'); // Toggle the visibility of the solve dropdown
    this.solveDropdownArrow.classList.toggle('active');
  }
// Handle click events outside the dropdowns
  handleOutsideClick(e) {
    if (!e.target.matches('.btnEllipsis, .btnUser, .fa-ellipsis-vertical, .fa-user, .solveBtn')) {
      document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  }
}

class Accounts { /* This class handles user account management, including sign-up and sign-in functionality */
  constructor () { /* Constructor initializes the class and sets up event listeners */
  /* The attibute "this" refers to the current instance of the class */
   this.signUpDialog = document.getElementById("signUp");
   this.signUpBtn = document.getElementById("signUpBtn");
   this.closeSignUp = document.getElementById("closeSignUp");
   this.signUpForm = document.getElementById("signUpForm"); 
   this.signInDialog = document.getElementById("signIn");  // Select the sign-in dialog/modal 
   this.signInBtn = document.getElementById("signInBtn"); // Select the "Sign-In" button
   this.closeSignIn = document.getElementById("closeSignIn"); // Select the close button
   this.signInForm = document.getElementById("signInForm");  // Select the sign-in form
   this.signUpMessageBox = document.getElementById("signUpMessage");
   this.signInMessageBox = document.getElementById("signInMessage");
   this.initialiseEventListeners();
  }
  initialiseEventListeners() {
    // Open and close sign-up modal window 
    if (this.signUpBtn && this.signUpDialog && this.closeSignUp) {
      this.signUpBtn.addEventListener("click", (e) => this.openSignUpDialog(e)); 
      this.closeSignUp.addEventListener("click", () => this.closeDialog(this.signUpDialog));
    } /*Opens and closes sign-in modal window */
    if (this.signInBtn && this.signInDialog && this.closeSignIn) {
      this.signInBtn.addEventListener("click", (e) => this.openSignInDialog(e));
      this.closeSignIn.addEventListener("click", () => this.closeDialog(this.signInDialog));
    } /* Checks if the sign-up and sign-in forms exist and adds event listeners to listen for when the submit button has been pressed */
    if (this.signUpForm) {
      this.signUpForm.addEventListener("submit", (e) => this.handleSignUp(e));
    }

    if (this.signInForm) {
      this.signInForm.addEventListener("submit", (e) => this.handleSignIn(e));
    }
  }
  // Open dialog when "Sign-Up" is clicked
  openSignUpDialog(event) {
    event.preventDefault(); // Prevents default anchor behavior
    this.signUpDialog.showModal(); // Open the dialog/modal
  }
  // Open dialog when "Sign-In" is clicked
  openSignInDialog(event) {
    event.preventDefault();
    this.signInDialog.showModal();
  }
  // Close dialog when "Close" button is clicked
  closeDialog(dialog) {
    dialog.close(); // Close the dialog/modal
  }
  // Validate email format using regex
  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
   
    // Handle form submission
    handleSignUp (event) {
      event.preventDefault(); // Prevent form submission
      const email = this.signUpForm.querySelector("input[name='email']").value.trim(); /* Get the email input value and trim any whitespace */
      const password = this.signUpForm.querySelector("input[name='password']").value; /* Get the password input value */
      const repassword = this.signUpForm.querySelector("input[name='repassword']").value; /* Get the re-enter password input value */
      
      this.signUpMessageBox.textContent = ""; // Clear previous messages
      this.signUpMessageBox.classList.remove('error', 'success'); // Clear previous messages
      // Check if email field is empty
      if (!email) {
        alert("ERROR: Email is required.");
        return;
      } 
      // Check if email format is valid
      if (!this.validateEmail(email)) {
        alert("ERROR: Invalid email format.");
        return;
      } 
      // Check if password and re-enter password fields are empty
      if (!password || !repassword)  {
        alert("ERROR: Password fields are required.");
        return;
      }
      // Check if password and re-enter password match
      if (password !== repassword) {
        alert("ERROR: Passwords do not match!");
        return;
      }
      // Check password length
      if (password.length < 8 || password.length > 20) {
        alert("ERROR: Password must be between 8 and 20 characters.");
        return;
      }

      // Prepare form data for AJAX request
     const formData = new FormData(); // Create a new FormData object which is used to construct a set of key/value pairs representing form fields and their values
     formData.append('email', email); // Append the email to the form data
     formData.append('password', password); // Append the password to the form data

      // Send AJAX request which sends the form data to the server and handles the response 
     fetch('/signUp', { 
       method: 'POST', // Specify the HTTP method which is POST
       body: formData // Set the body of the request to the form data
      })
     .then(response => response.json()) // Parse the response as JSON which basically converts the response to a JavaScript object
      // Check if the response is successful
     .then(data => {
        if (data.success) {
         this.signUpMessageBox.textContent = data.message;
         this.signUpMessageBox.classList.add('success');
         setTimeout(() => this.closeDialog(this.signUpDialog), 2000);
        } else {
          this.signUpMessageBox.textContent = data.message;
          this.signUpMessageBox.classList.add('error');
        }
     })
      // Handle any errors that occur during the fetch operation
     .catch(error => {
       console.error('Error:', error);
       this.signUpMessageBox.textContent = "An error occurred during sign-up.";
       this.signUpMessageBox.classList.add('error');
    });
  }
    // Handle form submission
    handleSignIn(event) {
      event.preventDefault();
      const email = this.signInForm.querySelector("input[name='email']").value.trim();
      const password = this.signInForm.querySelector("input[name='password']").value;
      
      this.signInMessageBox.textContent = "";
      this.signInMessageBox.classList.remove('error', 'success');

      if (!email) {
       alert("ERROR: Email is required.");
       return;
      } 
           
      if (!this.validateEmail(email)) {
       alert("ERROR: Invalid email format.");
       return;
      }
      
      if (!password) {
       alert("ERROR: Password is required."); 
       return;
      }
      // Prepare form data for AJAX request and send it to the server 
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      fetch('/signIn', {
       method: 'POST',
       body: formData
      })
     .then(response => response.json())
     .then(data => {
      if (data.success) {
        this.signInMessageBox.textContent = data.message; // Display success message through the sign-in message box and add the success class which is used to style the message
        this.signInMessageBox.classList.add('success'); // Add the success class to the message box
        // Close the sign-in dialog after a delay
        // The setTimeout function is used to delay the execution of the closeDialog method by 2000 milliseconds (2 seconds)
        // This allows the user to see the success message before the dialog closes
        setTimeout(() => {
          this.closeDialog(this.signInDialog);
        // Update UI for logged-in user
        document.querySelector('.btnUser').textContent = data.user.email; // Update the user button text with the logged-in user's email
      }, 2000);
     } else {
       this.signInMessageBox.textContent = data.message; // Display error message through the sign-in message box and add the error class which is used to style the message
       this.signInMessageBox.classList.add('error'); // Add the error class to the message box
      }
    })
     .catch(error => {
     console.error('Error:', error);
     // Display error message through the sign-in message box and add the error class which is used to style the message
     this.signInMessageBox.textContent = "An error occurred during sign-in."; 
     this.signInMessageBox.classList.add('error'); 
    });
  }
}
 // Instantiate the Accounts and Calculator class
const account = new Accounts();
const calc = new Calculator(); 

