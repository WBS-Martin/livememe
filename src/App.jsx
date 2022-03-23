import './App.css'
import { useState, useEffect, useRef } from 'react'
import domtoimage from 'dom-to-image'

function App() {
  const imageContainerRef = useRef(null)

  const [meme, setMeme] = useState()
  const [userInput, setUserInput] = useState({ topText: '', bottomText: '' })
  const [userImage, setUserImage] = useState({ file: null })

  const getMeme = async () => {
    const response = await fetch('https://api.imgflip.com/get_memes')
    const data = await response.json()
    const randomMeme =
      data.data.memes[Math.floor(Math.random() * data.data.memes.length)]
    setMeme(randomMeme)
  }

  useEffect(() => {
    getMeme()
  }, [])

  const handleFileInput = (e) => {
    setUserImage({ file: URL.createObjectURL(e.target.files[0]) })
  }

  const handleExport = () => {
    const myImage = imageContainerRef.current
    domtoimage.toJpeg(myImage, { quality: 0.95 }).then((imageUrl) => {
      const link = document.createElement('a')
      link.download = 'meme.jpg'
      link.href = imageUrl
      link.click()
    })
  }

  // console.log(meme)
  // console.log(userInput)
  console.log(imageContainerRef)

  return (
    <div className='App'>
      <button onClick={getMeme}>New Random Image</button>
      <button onClick={handleExport}>Export To JPEG</button>
      <div className='input-container'>
        <input
          type='file'
          name='fileinput'
          id='fileinput'
          onChange={handleFileInput}
        />
        <input
          type='text'
          name='userInputTop'
          id='userInputTop'
          placeholder='Top Text'
          onChange={(e) =>
            setUserInput({ ...userInput, topText: e.target.value })
          }
        />
        <input
          type='text'
          name='userInputBottom'
          id='userInputBottom'
          placeholder='Bottom Text'
          onChange={(e) =>
            setUserInput({ ...userInput, bottomText: e.target.value })
          }
        />
      </div>
      <div className='content-container'>
        {meme && (
          <div className='image-container' ref={imageContainerRef}>
            <img src={userImage.file ? userImage.file : meme.url} alt='' />
            <div className='top-text'>{userInput.topText}</div>
            <div className='bottom-text'>{userInput.bottomText}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
