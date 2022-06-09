import { WalletType } from "./types"

type Output = {
  wallets: {
    getAll: () => Promise<any[]>
    add: (type: WalletType, mnemonic: string) => Promise<void>
  }
}

export const Database = () => {
  const walletsDB = window.indexedDB.open("chains.place", 1)

  walletsDB.onupgradeneeded = () => {
    const db = walletsDB.result
    const store = db.createObjectStore("wallets", {
      keyPath: "id",
      autoIncrement: true,
    })
    store.createIndex("id", "id", { unique: true })
    store.createIndex("type", "type", { unique: false })
    store.createIndex("mnemonic", "mnemonic", { unique: false })
  }

  return new Promise<Output>((resolve, reject) => {
    walletsDB.onsuccess = () => {
      resolve({
        wallets: {
          getAll: () => {
            const db = walletsDB.result
            const tx = db.transaction("wallets", "readonly")
            const store = tx.objectStore("wallets")
            const all = store.getAll()
            return new Promise<any[]>((resolve, reject) => {
              all.onsuccess = () => resolve(all.result)
              all.onerror = () => reject(all.error)
            })
          },
          add: async (type: WalletType, mnemonic: string) => {
            const db = walletsDB.result
            const tx = db.transaction("wallets", "readwrite")
            const store = tx.objectStore("wallets")
            const add = store.add({ type, mnemonic })
            return new Promise<void>((resolve, reject) => {
              add.onsuccess = () => resolve()
              add.onerror = () => reject(add.error)
            })
          },
        },
      })
    }
  })
}
