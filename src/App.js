import {useState, useEffect} from 'react'



const App = () => {
    const [value, setValue] = useState(null)
    const [message, setMessage] = useState(null)
    const [ previouseChats, setPreviouseChats] = useState([])
    const [currentTitle , setCurrentTitle] = useState(null)

    const createNewChat = () => {
      setMessage(null)
      setValue("")
      setCurrentTitle(null)
    }

    const handleClick = (uniqueTitle) => {
      setCurrentTitle(uniqueTitle)
      setMessage(null)
      setValue("")
    }

    const getMessages = async () => {
        const options = {
            method : 'POST',
            body: JSON.stringify({
                message : value
            }),
            headers:{
                "Content-Type" : "application/json"
            }
        }
         try {
            const response =  await  fetch('http://localhost:8000/completions', options)
            const data = await  response.json()
            setMessage(data.choices[0].message)
        }catch (error){
            console.error(error)
         }
    }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if ( currentTitle && value && message) {
       setPreviouseChats(prevChats => (
         [...prevChats,
             {
                  title : currentTitle,
                  role : "user",
                  content : value
             } , 
             {
                  title : currentTitle,
                  role: message.role,
                  content : message.content
             }
          ]
       ))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, currentTitle])
  

  console.log(previouseChats)

  const currentChat =  previouseChats.filter(previouseChats => previouseChats.title === currentTitle)
  const uniqueTitles =  Array.from( new Set(previouseChats.map(previouseChats => previouseChats.title)))
  console.log(uniqueTitles)

    return (
        <div className="app">
          <section className="side-bar">
            <button onClick={createNewChat}>+ New chat</button>
            <ul className="history">
                {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={ () => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
            </ul>
            <nav>
              <p>Made by kamroch</p>
            </nav>
          </section>
          <section className="main">
            {!currentTitle && <h1>KamrochGPT</h1> }
            <ul className="feed">
                 {currentChat?.map((chatMessage, index) => <li key={index}>
                   <p className="role">{chatMessage.role}</p>
                   <p>{chatMessage.content}</p>
                 </li> )}
            </ul>
            <div className="bottom-section">
                <div className="input-container">
                  <input value={value} onChange={(e) => setValue(e.target.value)}/>
                  <button id="submit" onClick={getMessages}><img src="/public/send.svg" alt="send"/></button>
                </div>
                <p className="info">Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT May 24 Version</p>
            </div>
          </section>
        
        </div>
    )
  }
  
  export default App
  