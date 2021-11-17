import { ethers } from 'ethers'

const alchemyAPIKey = process.env.NEXT_PUBLIC_ALCHEMY_API

if (!alchemyAPIKey) process.exit(1)

export const alchemyProvider = new ethers.providers.AlchemyProvider(1, 'XJ_dGolXlwbvMdHln2f_Wcu5Okrpmjdz')
