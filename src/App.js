import { useState, useEffect } from 'react'
import './index.css'
import axios from 'axios'
import { RiSendPlaneLine } from 'react-icons/ri'

function App() {
  // const SLACK_API_TOKEN = 'dsada'
  const [message, setMessage] = useState('')
  const [threadTs, setThreadTS] = useState(null)
  const [messages, setMessages] = useState([
    { text: 'hello maria, ce mai faci?' },
  ])

  const sendMessage = async () => {
    const res = await axios.post(
      'https://slack-chat.testenv.ro/api/send-message',
      {
        channel: 'CHANNEL_ID',
        message: message,
        thread_ts: threadTs,
      },
      {
        headers: {
          Authorization: `Bearer ${SLACK_API_TOKEN}`,
        },
      }
    )
    setThreadTS(res.data.ts)
    setMessage('')
  }

  const getMessages = async () => {
    const res = await axios.post(
      ``,
      {
        channel: 'CHANNEL_ID',
        latest: threadTs,
        inclusive: true,
      },
      {
        headers: {
          Authorization: `Bearer ${SLACK_API_TOKEN}`,
        },
      }
    )
    setMessages((messages) => [...messages, ...res.data.messages])
  }

  // useEffect(() => {
  //   if (threadTs) {
  //     getMessages()
  //     const intervalId = setInterval(getMessages, 1000)
  //     return () => clearInterval(intervalId)
  //   }
  // }, [threadTs])

  // const onSubmit = (e) => {
  //   e.preventDefault()
  //   sendMessage()
  // }

  useEffect(() => {
    const sse = new EventSource('https://slack-chat.testenv.ro/sse/', {
      withCredentials: true,
    })
    function getRealtimeData(data) {
      // process the data here,
      // then pass it to state to be rendered
    }
    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data))
    sse.onerror = (err) => {
      console.log(err)

      sse.close()
    }
    return () => {
      sse.close()
    }
  }, [threadTs])

  return (
    <div className="container">
      {messages.map((message) => (
        <div className="message" key={message.ts}>
          <p>{message.text}</p>
        </div>
      ))}
      <form onSubmit={onSubmit} className="form">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn">
          <RiSendPlaneLine />
        </button>
      </form>
    </div>
  )
}

export default App
