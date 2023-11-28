const endpoint = {};
endpoint['users']='http://localhost:3003/signup';

function submitSignUpForm() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    signUpForm(username, password);
}

async function signUpForm(username, password) {
    const dataToSend = { "username": username, "password": password };

    try {
        let signUpResponse = await fetch(endpoint['users'], {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (!signUpResponse.ok) {
            console.log("hi")
            console.error('Sign-up request failed:', signUpResponse.statusText);
            alert('Failed to sign up. Please try again.');
            return;
        }
        let result = await signUpResponse.json();

    } catch (error) {
        console.error("Error signing up user:", error);
        console.log(error)
        alert("Failed to sign up.");
        // STUB: Handle the error and display it on the page or take appropriate action
    }
}
