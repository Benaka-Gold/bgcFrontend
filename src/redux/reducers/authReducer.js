const initialState =  {
    isAuthenticated: !!localStorage.getItem('auth'),
    user: null,
    token: null,
  }
  const AuthReducer = (state = initialState, action)=>{
    switch (action.type) {
        case 'LOGGEDIN':
            console.log(action.payload);
           let login =  { ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
            }
            localStorage.setItem('auth', action.payload.token)
            localStorage.setItem('role', action.payload.user.role)
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            return login;
            

            case 'LOGOUT':
            let logout = {...state,
                isAuthenticated: false,
                user: null,
                token: null,
            }
            localStorage.removeItem('auth');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            return logout;
        default:
            return state
    }
  }
  export default AuthReducer;