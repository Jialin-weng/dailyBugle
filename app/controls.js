const endpoint = {};
endpoint['signup']='http://localhost:3003/signup';
endpoint['login']='http://localhost:3003/login';
endpoint['ads'] = 'http://localhost:3004/ads';
endpoint['adsIP'] = 'http://localhost:3004/get-ip';
endpoint['adsClicked'] = 'http://localhost:3004/adsClicked';
endpoint['adsViewed'] = 'http://localhost:3004/adsViewed';

var ipAddress = "";

const browserInfo = {
    appName: navigator.appName,
    appVersion: navigator.appVersion,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
};

console.log('Browser Information:', navigator.userAgent);

function logout(event){
    event.preventDefault();
    document.cookie = "userType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
const currentUserName = getCookie('userName');

if (currentUserName) {
    console.log(`Username: ${currentUserName}`);
} else {
    console.log('Username not found');
}

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
        setCookie('userType', result.userType, 7);  // Expires in 7 days
        setCookie('userName', username, 7);  // Expires in 7 days

        window.location.href = 'index.html';
    }
    else if (result.success == false){
        alert("Wrong Combination Of Username Password");
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

document.addEventListener("DOMContentLoaded", function() {
    // Make a GET request to the server endpoint
    fetch(endpoint["adsIP"])
        .then(response => response.text())
        .then(data => {
            // Log the response from the server
            ipAddress = data;
            console.log(ipAddress)
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
    
async function displayAds() {
    const adList = await getAd();

    // Check if there are any ads
    if (adList.length === 0) {
        console.log('No ads available.');
        return;
    }
    const randomIndex = Math.floor(Math.random() * adList.length);
    const ads = adList[randomIndex];
    console.log(ads);
    const adsContainer = document.getElementById('adsContainer');

    // Clear previous content
    adsContainer.innerHTML = '';
        if (!currentUserName) {
            var sendName = "anon"
        } else{
            var sendName = currentUserName
        }

    
        const adContainer = document.createElement('div');
        adContainer.classList.add('ad-container'); // Add a class for styling



        // Header element
        const headerElement = document.createElement('h2');
        headerElement.textContent = `${ads.adName}`;
        adContainer.appendChild(headerElement);

        // Body element
        const bodyElement = document.createElement('p');
        bodyElement.textContent = `${ads.body}`;
        adContainer.appendChild(bodyElement);

        // Add a click event listener to the adContainer
        adContainer.addEventListener('click', async() => {
            // Handle the click event (e.g., open a detailed view, navigate to a link, etc.)
            if (!currentUserName) {
                var sendName = "anon"
            } else{
                var sendName = currentUserName
            }
            await sendAdClickRequest(ads._id, ipAddress,sendName);
            
        });
        

        adsContainer.appendChild(adContainer);
        await sendAdViewedRequest(ads._id, ipAddress,sendName);

}


async function sendAdClickRequest(adId, ipAddress,sendName) {
    const response = await fetch(endpoint['adsClicked'], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ad_id: adId,
            user_id: sendName, // Implement your logic to get the user ID
            ip_add: ipAddress,
            user_agent: navigator.userAgent, // Example: sending user agent information
        }),
    });

    if (response.ok) {
        console.log('Ad click recorded successfully');
    } else {
        console.error('Failed to record ad click');
    }
}


async function sendAdViewedRequest(adId, ipAddress,sendName) {
    const response = await fetch(endpoint['adsViewed'], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ad_id: adId,
            user_id: sendName, // Implement your logic to get the user ID
            ip_add: ipAddress,
            user_agent: navigator.userAgent, // Example: sending user agent information
        }),
    });

    if (response.ok) {
        console.log('Ad click recorded successfully');
    } else {
        console.error('Failed to record ad click');
    }
}



// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Call displayAds with the result of getAd
    displayAds(getAd());
    const userType = getCookie('userType');
    generateContentBasedOnUserType(userType);
});

function generateContentBasedOnUserType(userType) {
    // Sections based on user type
    switch (userType) {
        case 'author':
            // Generate content for author
            generateAuthorContent();
            break;
        case 'reader':
            // Generate content for reader
            generateReaderContent();
            break;
        default:
            // Generate content for none or other user types
            generateDefaultContent();
    }
}
function generateAuthorContent() {
    const viewWelcome = document.getElementById('viewWelcome');
    viewWelcome.innerHTML = '<div class="container text-center"><h2>Welcome ' + currentUserName + '</h2><p>Modify your article below:</p></div>';

    const viewChangeSection = document.getElementById('viewContent');
    viewChangeSection.innerHTML = `
        <div class="container" id="articleContainer">
            <div id="articleView">
                <h2>Article Title</h2>
                <p>Article Content</p>
            </div>
            <form id="articleForm" style="display:none;">
                <div class="form-group">
                    <label for="articleTitle">Article Title:</label>
                    <input type="text" class="form-control" id="articleTitle" placeholder="Enter article title" required>
                </div>
                <div class="form-group">
                    <label for="articleContent">Article Content:</label>
                    <textarea class="form-control" id="articleContent" rows="5" placeholder="Enter article content" required></textarea>
                </div>
                <button type="button" class="btn btn-primary" onclick="submitArticleForm()">Save</button>
                <button type="button" class="btn btn-secondary" onclick="cancelEdit()">Cancel</button>
            </form>
            <button type="button" class="btn btn-info" onclick="toggleEditMode()">Edit</button>
        </div>
    `;
}

function submitArticleForm() {
    const articleTitle = document.getElementById('articleTitle').value;
    const articleContent = document.getElementById('articleContent').value;

    // Create a JSON object with the article information
    const articleData = {
        title: articleTitle,
        content: articleContent,
    };

    // Log the JSON object to the console (replace this with your actual logic)
    console.log('Article Data:', articleData);

    // Perform additional actions, such as sending the data to the server
    // Example: You can call a function from controls.js to handle the server submission
    // submitArticleData(articleData);

    // After submitting, toggle back to view mode
    toggleViewMode(articleData);
}
function toggleEditMode() {
    const articleView = document.getElementById('articleView');
    const articleForm = document.getElementById('articleForm');

    // Toggle the visibility of the article view and edit form
    articleView.style.display = 'none';
    articleForm.style.display = 'block';

    // Retrieve current article data and populate the form
    const currentTitle = articleView.querySelector('h2').textContent;
    const currentContent = articleView.querySelector('p').textContent;

    document.getElementById('articleTitle').value = currentTitle;
    document.getElementById('articleContent').value = currentContent;
}

function toggleViewMode(articleData) {
    const articleView = document.getElementById('articleView');
    const articleForm = document.getElementById('articleForm');

    // Toggle the visibility of the article view and edit form
    articleView.style.display = 'block';
    articleForm.style.display = 'none';

    // Update the article view with the new data
    articleView.querySelector('h2').textContent = articleData.title;
    articleView.querySelector('p').textContent = articleData.content;
}

function cancelEdit() {
    const articleView = document.getElementById('articleView');
    const articleForm = document.getElementById('articleForm');

    // Toggle the visibility of the article view and edit form
    articleView.style.display = 'block';
    articleForm.style.display = 'none';
}

function generateReaderContent() {
    const viewWelcome = document.getElementById('viewWelcome');
    viewWelcome.innerHTML = `<div class="container text-center"><h2>Welcome ${currentUserName}</div>`;

    const viewChangeSection = document.getElementById('viewContent');
    viewChangeSection.innerHTML = '<div class="container text-center"><h2>Reader View - Headline Story Title</h2><p>Reader-specific teaser for the headline story.</p></div>';
}

function generateDefaultContent() {
    // Example: Display default content for none or other user types
    const viewWelcome = document.getElementById('viewWelcome');
    viewWelcome.innerHTML = '<div class="container text-center"><h2>Welcome!</h2><p>Your default content goes here.</p></div>';

    // Insert additional content into ViewChange section
    const viewChangeSection = document.getElementById('viewContent');
    viewChangeSection.innerHTML = '<div class="container text-center"><h2>Default View - Headline Story Title</h2><p>Default teaser for the headline story.</p></div>';
}
