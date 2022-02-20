var emailInputEl = document.querySelector('#loginInput')
var passwordInputEl = document.querySelector('#password')
var loginForm = document.querySelector('.login__form')

const API = 'https://reqres.in/api'

function valideteEmail(){
    return /\S+@\S+\.\S+/.test(email)
    
}

function login(credentials){
    fetch(`${API}/login`, {
        method:'POST',
        headers:{
            "Content-type":'application/json'
        },
        body:JSON.stringify(credentials)
    })
    .then(res=>{
                if(res.status===400)reject(res)
                    return res.json()
                
                })
                .then(res=>{
                    if(res.token){
                        window.localStorage.setItem('token',res.token)
                        window.location.replace('index.html')
                    }
                })
                .catch(err=>{
                    alert(err)
                })
}
loginForm.addEventListener('submit', event => {
event.preventDefault()

    const body = {
        email:emailInputEl.value,
        password:passwordInputEl.value
    }

    try{
        login(body)
    }catch{
        alert(error)
            }
})
