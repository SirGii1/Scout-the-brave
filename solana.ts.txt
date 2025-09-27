import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

// Use devnet for development
export const connection = new Connection("https://api.devnet.solana.com", "confirmed")

export interface WalletAdapter {
  publicKey: PublicKey | null
  connected: boolean
  connect(): Promise<void>
  disconnect(): Promise<void>
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
}

export const getBalance = async (publicKey: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error("Error fetching balance:", error)
    return 0
  }
}

export const sendSOL = async (wallet: WalletAdapter, toAddress: string, amount: number): Promise<string> => {
  if (!wallet.publicKey) throw new Error("Wallet not connected")

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports: amount * LAMPORTS_PER_SOL,
    }),
  )

  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = wallet.publicKey

  const signedTransaction = await wallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signedTransaction.serialize())

  await connection.confirmTransaction(signature)
  return signature
}

export const getTokenAccounts = async (publicKey: PublicKey) => {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    return tokenAccounts.value.map((account) => ({
      address: account.pubkey.toString(),
      mint: account.account.data.parsed.info.mint,
      amount: account.account.data.parsed.info.tokenAmount.uiAmount,
      decimals: account.account.data.parsed.info.tokenAmount.decimals,
    }))
  } catch (error) {
    console.error("Error fetching token accounts:", error)
    return []
  }
}
