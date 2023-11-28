const endpoint = {};
endpoint['users']='http://localhost:3003/signup';

function submitSignUpForm() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    signUpForm(username, password);
}

async function signUpForm(username, password) {
    const dataToSend = { "username": username, "password": password };

    let addUser = await fetch( endpoint['users'],
    {
        method:'POST',
        headers: {
            'Accept':'application/JSON',
            'Content-type':'application/json'
        },
        body: JSON.stringify( dataToSend )
    })
    .then( response=>response.json())
    .then( (result)=> {
        statusMessage(result);
        fetchAndListVoters(); // update the list of voters
    })
    .catch(error=>console.log("error saving user"));
    // STUB: maybe write the error on the page somewhere
}
    
