import { useEffect, useMemo, useRef, useState } from 'react'
import GameBoard from './components/GameBoard'
import GameModal from './components/GameModal'
import Scoreboard from './components/Scoreboard'
import bgMusicSrc from './audio/bg-music.mp3'
import loserSrc from './audio/loser.mp3'
import winnerSrc from './audio/winner.mp3'
import loserGif from './gifs/loser.gif'
import winnerGif from './gifs/winner.gif'
import cat1 from './images/cat-1.webp'
import cat2 from './images/cat-2.webp'
import cat3 from './images/cat-3.webp'
import cat4 from './images/cat-4.webp'
import cat5 from './images/cat-5.webp'
import cat6 from './images/cat-6.webp'
import cat7 from './images/cat-7.webp'
import cat8 from './images/cat-8.webp'
import cat9 from './images/cat-9.webp'
import cat10 from './images/cat-10.webp'
import cat11 from './images/cat-11.webp'
import cat12 from './images/cat-12.webp'
import cat13 from './images/cat-13.webp'
import cat14 from './images/cat-14.webp'
import cat15 from './images/cat-15.webp'
import cat16 from './images/cat-16.webp'
import { evaluateCardSelection, shuffleItems, TARGET_STREAK } from './utils/gameLogic'

const GRID_SIZE = 16

const CAT_IMAGES = [
  { key: 'cat-1', src: cat1 },
  { key: 'cat-2', src: cat2 },
  { key: 'cat-3', src: cat3 },
  { key: 'cat-4', src: cat4 },
  { key: 'cat-5', src: cat5 },
  { key: 'cat-6', src: cat6 },
  { key: 'cat-7', src: cat7 },
  { key: 'cat-8', src: cat8 },
  { key: 'cat-9', src: cat9 },
  { key: 'cat-10', src: cat10 },
  { key: 'cat-11', src: cat11 },
  { key: 'cat-12', src: cat12 },
  { key: 'cat-13', src: cat13 },
  { key: 'cat-14', src: cat14 },
  { key: 'cat-15', src: cat15 },
  { key: 'cat-16', src: cat16 },
]

function buildDeck() {
  const cards = []

  for (let i = 0; i < GRID_SIZE; i += 1) {
    const cat = CAT_IMAGES[i % CAT_IMAGES.length]
    cards.push({
      id: `${cat.key}-${i}`,
      imageKey: cat.key,
      imageSrc: cat.src,
      alt: `Funny ${cat.key} meme cat`,
    })
  }

  return shuffleItems(cards)
}

export default function App() {
  const [cards, setCards] = useState(() => buildDeck())
  const [clickedImageKeys, setClickedImageKeys] = useState([])
  const [currentScore, setCurrentScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameStatus, setGameStatus] = useState('playing')

  const bgMusicRef = useRef(new Audio(bgMusicSrc))
  const winnerRef = useRef(new Audio(winnerSrc))
  const loserRef = useRef(new Audio(loserSrc))

  useEffect(() => {
    const bg = bgMusicRef.current
    bg.loop = true
    bg.volume = 0.35

    winnerRef.current.volume = 0.7
    loserRef.current.volume = 0.7

    return () => {
      bg.pause()
      winnerRef.current.pause()
      loserRef.current.pause()
    }
  }, [])

  const stopBackgroundMusic = () => {
    const bg = bgMusicRef.current
    bg.pause()
    bg.currentTime = 0
  }

  const playBackgroundMusic = () => {
    if (gameStatus !== 'playing') {
      return
    }

    void bgMusicRef.current.play().catch(() => {
      // Browser may block autoplay until first user interaction.
    })
  }

  useEffect(() => {
    if (gameStatus === 'playing') {
      return
    }

    stopBackgroundMusic()

    if (gameStatus === 'win') {
      winnerRef.current.currentTime = 0
      void winnerRef.current.play().catch(() => { })
    }

    if (gameStatus === 'fail') {
      loserRef.current.currentTime = 0
      void loserRef.current.play().catch(() => { })
    }
  }, [gameStatus])

  const handleCardClick = (card) => {
    if (gameStatus !== 'playing') {
      return
    }

    playBackgroundMusic()

    const result = evaluateCardSelection(clickedImageKeys, card.imageKey)

    if (result.status === 'fail') {
      setHighScore((prev) => Math.max(prev, currentScore))
      setGameStatus('fail')
      return
    }

    setClickedImageKeys(result.clickedIds)
    setCurrentScore(result.streak)
    setHighScore((prev) => Math.max(prev, result.streak))
    setCards((previousCards) => shuffleItems(previousCards))

    if (result.status === 'win') {
      setGameStatus('win')
    }
  }

  const startNewGame = () => {
    winnerRef.current.pause()
    loserRef.current.pause()
    winnerRef.current.currentTime = 0
    loserRef.current.currentTime = 0

    setClickedImageKeys([])
    setCurrentScore(0)
    setGameStatus('playing')
    setCards(buildDeck())

    void bgMusicRef.current.play().catch(() => {
      // Browser may block autoplay until first user interaction.
    })
  }

  const modalContent = useMemo(() => {
    if (gameStatus === 'fail') {
      return {
        title: 'You Failed',
        message: 'You clicked the same cat twice. Try again!',
        primaryLabel: 'Play Again',
        gifSrc: loserGif,
        gifAlt: 'Losing reaction gif',
      }
    }

    if (gameStatus === 'win') {
      return {
        title: 'You Win',
        message: `Amazing memory. You reached ${TARGET_STREAK} streaks!`,
        primaryLabel: 'Play Again',
        gifSrc: winnerGif,
        gifAlt: 'Winning celebration gif',
      }
    }

    return null
  }, [gameStatus])

  return (
    <main className="app">
      <Scoreboard streak={currentScore} best={highScore} />
      <GameBoard cards={cards} onCardClick={handleCardClick} disabled={gameStatus !== 'playing'} />

      <footer className="footer">
        Created with love by{' '}
        <a href="https://www.romelioteodoro.dev" target="_blank" rel="noreferrer">
          melio0504
        </a>
      </footer>

      {modalContent ? (
        <GameModal
          title={modalContent.title}
          message={modalContent.message}
          primaryLabel={modalContent.primaryLabel}
          onPrimary={startNewGame}
          gifSrc={modalContent.gifSrc}
          gifAlt={modalContent.gifAlt}
        />
      ) : null}
    </main>
  )
}
