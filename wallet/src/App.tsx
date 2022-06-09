import React from 'react'
import './App.css'
import { Database } from './db'
import { WalletType } from './types'

export const App = () => {
  const [ wallets, setWallets ] = React.useState<any[]>([])

  React.useEffect(() => {
    Database().then(async db => {
      const items = await db.wallets.getAll()
      if(items.length === 0) {
        const prompt = window.prompt('Enter your Cardano wallet seed:')
        if(prompt) {
          await db.wallets.add(WalletType.CARDANO, prompt)
        }
      }
      setWallets(items)
    })
  }, [])

  return (
    <div className="App">
      {wallets.map(wallet => (
        <div key={wallet.id}>
          <h1>{wallet.id}</h1>
        </div>
      ))}
    </div>
  )
}
