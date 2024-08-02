const signin = async(user)=>{
    try{
        let response = await fetch('/auth/signin',{
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })

        if (!response.ok) {
            throw new Error(`Signin failed: ${response.statusText}`);
        }
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

const signout = async() =>{
    try{
        let response = await fetch('/auth/signout',{ 
            method:'GET'
        })
        if (!response.ok) {
            throw new Error(`Signout failed: ${response.statusText}`);
        }
        return await response.json()
    } catch(err) {
        console.error(`Error during signout: ${err.message}`)
        throw err
    }
}

const auth = {
    isAuthenticated() {
        if (typeof window == "undefined")
            return false
        if (sessionStorage.getItem('jwt'))
            return JSON.parse(sessionStorage.getItem('jwt'))
        else
            return false
    },
    authenticate(jwt,cb){
        if(typeof window !== "undefined")
            sessionStorage.setItem('jwt',JSON.stringify(jwt))
        cb()
    },
    clearJWT(cb){
        if (typeof window !=="undefined")
            sessionStorage.removeItem('jwt')
        cb()
        signout().then((date) => {
            document.cookie = "t=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        })
    },
    updateUser(user,cb){
        if(typeof window !== "undefined"){
            if(sessionStorage.getItem('jwt')){
                let auth = JSON.parse(sessionStorage.getItem('jwt'))
                auth.user = user
                sessionStorage.setItem('jwt',JSON.stringify(auth))
                cb()
            }
        }
    }
    
}

export{
    signin,
    signout,
    auth
}