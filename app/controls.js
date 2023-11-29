const endpoint = {};
endpoint['signup']='http://localhost:3003/signup';
endpoint['login']='http://localhost:3003/login';
endpoint['ads'] = 'http://localhost:3004/ads';

function logout(event){
    event.preventDefault();
    document.cookie = "userType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'login.html';
}
function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expirationDate.toUTCString()};path=/`;
    document.cookie = cookieValue;
}

function getCookie(name) {
    const cookieName = `${encodeURIComponent(name)}=`;
    const cookieArray = document.cookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
        }
    }

    return null;
}

// Example of checking the 'userType' cookie
const userType = getCookie('userType');
if (userType) {
    console.log(`User type: ${userType}`);
} else {
    console.log('User type cookie not found.');
}

// Dynamically update the login and signup buttons based on the presence of the cookie
const loginSignupButtons = document.getElementById("loginSignupButtons");

if (userType) {
    // If the userType cookie is present, create a logout button
    const logoutButton = document.createElement("button");
    logoutButton.className = "btn btn-outline-danger my-2 my-sm-0";
    logoutButton.textContent = "Logout";
    logoutButton.onclick = logout;
    loginSignupButtons.appendChild(logoutButton);
} else {
    // If the userType cookie is not present, create login and signup buttons
    const loginButton = document.createElement("button");
    loginButton.className = "btn btn-outline-success my-2 my-sm-0 mr-2";
    loginButton.textContent = "Login";
    loginButton.onclick = () => window.location.href = 'login.html';
    loginSignupButtons.appendChild(loginButton);

    const signupButton = document.createElement("button");
    signupButton.className = "btn btn-outline-primary my-2 my-sm-0";
    signupButton.textContent = "Signup";
    signupButton.onclick = () => window.location.href = 'signup.html';
    loginSignupButtons.appendChild(signupButton);
}

async function submitLoginForm(event){
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var result = await loginForm(username,password);
    if (result.success == true){
        console.log(result)
        setCookie('userType', result.userType, 7);  // Expires in 7 days
        window.location.href = 'index.html';
    }
    else if (result.success == false){
        alert("wrong");
    }
}
async function loginForm(username, password) {
    const dataToSend = { username, password };
    try {
        const response = await fetch(endpoint['login'], {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error(`Login request failed: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error logging in user:", error);
        alert("Failed to log in.");
    }
}
async function submitSignUpForm(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var userType = document.getElementById('userType').value;

    // Use try-catch to handle errors during the signup process
    try {
        await signUpForm(username, password, userType);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error during signup:', error);
    }

    return false;
}


async function signUpForm(username, password,userType) {
    const dataToSend = { "username": username, "password": password,"userType": userType };
    let addUser = await fetch( endpoint['signup'],
    {
        method:'POST',
        headers: {
            'Accept':'application/JSON',
            'Content-type':'application/json'
        },
        body: JSON.stringify( dataToSend )
    })
    .then( response=>response.json())

}


async function getAd(){
    try {
        const response = await fetch(endpoint['ads']);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching ads:', error);
    }
}
    
async function displayAds() {
    const ads = await getAd();
    console.log(ads);
    const adsContainer = document.getElementById('adsContainer');

    // Clear previous content
    adsContainer.innerHTML = '';

    ads.forEach(ad => {
        const adContainer = document.createElement('div');
        adContainer.classList.add('ad-container'); // Add a class for styling

        // Header element
        const headerElement = document.createElement('h2');
        headerElement.textContent = `Ad Header: ${ad.adName}`;
        adContainer.appendChild(headerElement);

        // Body element
        const bodyElement = document.createElement('p');
        bodyElement.textContent = `Ad Body: ${ad.body}`;
        adContainer.appendChild(bodyElement);

        // Add a click event listener to the adContainer
        adContainer.addEventListener('click', () => {
            // Handle the click event (e.g., open a detailed view, navigate to a link, etc.)
            console.log('Ad clicked:', ad._id);
        });

        adsContainer.appendChild(adContainer);
    });
}

