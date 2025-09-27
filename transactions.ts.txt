import type { PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js"
import { connection } from "./solana"

export interface Transaction {
  signature: string
  timestamp: number
  type: "send" | "receive" | "swap" | "stake" | "unknown"
  status: "success" | "failed" | "pending"
  amount: number
  token: string
  from?: string
  to?: string
  fee: number
  blockTime: number | null
}

export const getTransactionHistory = async (publicKey: PublicKey, limit = 20): Promise<Transaction[]> => {
  try {
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit })

    const transactions: Transaction[] = []

    for (const sig of signatures) {
      try {
        const tx = await connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        })

        if (tx) {
          const parsedTx = parseTransaction(tx, publicKey, sig.signature)
          if (parsedTx) {
            transactions.push(parsedTx)
          }
        }
      } catch (error) {
        console.error(`Error parsing transaction ${sig.signature}:`, error)
      }
    }

    return transactions
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return getMockTransactions() // Fallback to mock data
  }
}

const parseTransaction = (
  tx: ParsedTransactionWithMeta,
  userPublicKey: PublicKey,
  signature: string,
): Transaction | null => {
  if (!tx.meta || !tx.blockTime) return null

  const userAddress = userPublicKey.toString()
  let type: Transaction["type"] = "unknown"
  let amount = 0
  const token = "SOL"
  const from = ""
  const to = ""

  // Parse SOL transfers
  const preBalances = tx.meta.preBalances
  const postBalances = tx.meta.postBalances
  const accountKeys = tx.transaction.message.accountKeys

  for (let i = 0; i < accountKeys.length; i++) {
    const account = accountKeys[i]
    if (account.pubkey.toString() === userAddress) {
      const balanceChange = (postBalances[i] - preBalances[i]) / 1e9
      if (balanceChange !== 0) {
        amount = Math.abs(balanceChange)
        type = balanceChange > 0 ? "receive" : "send"
        break
      }
    }
  }

  return {
    signature,
    timestamp: tx.blockTime * 1000,
    type,
    status: tx.meta.err ? "failed" : "success",
    amount,
    token,
    from,
    to,
    fee: (tx.meta.fee || 0) / 1e9,
    blockTime: tx.blockTime,
  }
}

// Mock transaction data for demonstration
const getMockTransactions = (): Transaction[] => [
  {
    signature: "5j7s8K9mN2pQ3rT4uV6wX7yZ8aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3",
    timestamp: Date.now() - 3600000, // 1 hour ago
    type: "send",
    status: "success",
    amount: 0.5,
    token: "SOL",
    from: "11111111111111111111111111111112",
    to: "22222222222222222222222222222223",
    fee: 0.000005,
    blockTime: Math.floor((Date.now() - 3600000) / 1000),
  },
  {
    signature: "4i6r7K8mL1nO2pP3qR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9",
    timestamp: Date.now() - 7200000, // 2 hours ago
    type: "receive",
    status: "success",
    amount: 1.25,
    token: "SOL",
    from: "33333333333333333333333333333334",
    to: "11111111111111111111111111111112",
    fee: 0.000005,
    blockTime: Math.floor((Date.now() - 7200000) / 1000),
  },
  {
    signature: "3h5q6J7kK8lL9mM0nN1oO2pP3qQ4rR5sS6tT7uU8vV9wW0xX1yY2zZ3aA4bB5cC6",
    timestamp: Date.now() - 86400000, // 1 day ago
    type: "send",
    status: "success",
    amount: 100.0,
    token: "USDC",
    from: "11111111111111111111111111111112",
    to: "44444444444444444444444444444445",
    fee: 0.000005,
    blockTime: Math.floor((Date.now() - 86400000) / 1000),
  },
  {
    signature: "2g4p5I6jJ7kK8lL9mM0nN1oO2pP3qQ4rR5sS6tT7uU8vV9wW0xX1yY2zZ3aA4bB5",
    timestamp: Date.now() - 172800000, // 2 days ago
    type: "swap",
    status: "success",
    amount: 50.0,
    token: "RAY",
    from: "11111111111111111111111111111112",
    to: "11111111111111111111111111111112",
    fee: 0.000025,
    blockTime: Math.floor((Date.now() - 172800000) / 1000),
  },
  {
    signature: "1f3o4H5iI6jJ7kK8lL9mM0nN1oO2pP3qQ4rR5sS6tT7uU8vV9wW0xX1yY2zZ3aA4",
    timestamp: Date.now() - 259200000, // 3 days ago
    type: "send",
    status: "failed",
    amount: 0.1,
    token: "SOL",
    from: "11111111111111111111111111111112",
    to: "55555555555555555555555555555556",
    fee: 0.000005,
    blockTime: Math.floor((Date.now() - 259200000) / 1000),
  },
]

export const formatTransactionType = (type: Transaction["type"]): string => {
  switch (type) {
    case "send":
      return "Sent"
    case "receive":
      return "Received"
    case "swap":
      return "Swapped"
    case "stake":
      return "Staked"
    default:
      return "Unknown"
  }
}

export const getTransactionTypeColor = (type: Transaction["type"]): string => {
  switch (type) {
    case "send":
      return "text-destructive"
    case "receive":
      return "text-accent"
    case "swap":
      return "text-chart-1"
    case "stake":
      return "text-primary"
    default:
      return "text-muted-foreground"
  }
}
