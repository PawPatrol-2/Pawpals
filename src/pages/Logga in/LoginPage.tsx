import './LoginPage.css'


export default function LoginPage() {
    return (
        <div className="LoginPage">
            <h2>Logga in</h2>
            <p>Logga in på ditt konto</p>
            <div>
                <label htmlFor="username">Användarnamn:</label>
                <input id="username" type="text" />
            </div>
            <div>
                <label htmlFor="password">Lösenord:</label>
                <input id="password" type="password" />
            </div>
            <div>
                <button className='loginbutton' type="submit">Logga in</button>
            </div>
        </div>
    )
}