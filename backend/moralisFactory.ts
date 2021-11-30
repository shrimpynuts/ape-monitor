import Moralis from 'moralis/node'

const serverUrl = 'https://tsbzralcfzgz.usemoralis.com:2053/server'
const appId = 'lpW0viv4FUr2qnGUNj8FqmkzCRGgMzkmxyd6pZfT'
Moralis.start({ serverUrl, appId })

export default Moralis
