# Web3 Starter

Web 3 Starter is a modern web 3 starter template project.

Here's the full stack of frameworks/libraries used:

- Next.js React
- TailwindCSS for styling
- [HeadlessUI](https://headlessui.dev/) for Tailwind components
- [use-wallet](https://github.com/aragon/use-wallet) to connect to Ethereum wallets
- [davatar](https://www.davatar.xyz/) for ENS avatars
- [react-hot-toast](https://react-hot-toast.com/) for toast messages
- [unstated-next](https://github.com/jamiebuilds/unstated-next) for state management
- [next-themes](https://www.npmjs.com/package/next-themes) for dark mode theme

## How to Setup Development Environment

#### A. Start the local hardhat ethereum node

```bash
npx hardhat node
```

#### B. In a seperate shell, start the NextJS Server.

```bash
yarn && yarn dev
```

Navigate to `http://localhost:3000` to see your app.

## First Time Project Template Setup

#### 1. Create a `.env` file.

```bash
# Private key used for testnets (ropsten)
ETH_PRIVATE_KEY=""

# This is the private key you will used to deploy to mainnet
ETH_MAINNET_PRIVATE_KEY=""

# This API Key is used for Etherscan contract verifications
# To obtain the API Key go here -> https://etherscan.io/apis
ETHERSCAN_API_KEY=""

# This is the address of the contract that will be used in production
# You'll neeed to set it here, and in Vercel (or wherever you choose
# to deploy the app.)
NEXT_PUBLIC_CONTRACT_ADDRESS=""

# Name of the network contract is deployed on
NEXT_PUBLIC_NETWORK_NAME=""

# This API is needed when you run `npx hardhat test` -- so that
# you can approximate the cost of deployin your contract on mainnet
COIN_MARKETCAP_API_KEY=""
```

## Resources

#### Frontend

- **[Tailwind UI](https://tailwindcss.com/docs)**
- **[Tailwind UI Components](https://tailwindui.com/)**
- **[Tailwind Community Components](https://tailwindcomponents.com/)**

## How do I start the hasura console?

1. Go to `hasura/config.yaml` and commment in the staging `admin_secret` & `endpoint` values.

2. Go to `hasura/metadata/databases/databases.yaml` and comment in the staging `database_url` value.

From inside the `/hasura` directory, run the following command:

```bash
$ hasura console
```

## How do I run migrations on production?

1. Go to `hasura/config.yaml` and commment in the production `admin_secret` & `endpoint` values.

2. Go to `hasura/metadata/databases/databases.yaml` and comment in the `database_url` value.

3. Run this command to apply migrations

```bash
$ hasura migrate apply --all-databases
```

4. Run the following two commands to apply metadata/permissions

```bash
$ hasura metadata apply --endpoint 'https://apemonitor-production.herokuapp.com/'
$ hasura metadata reload --endpoint 'https://apemonitor-production.herokuapp.com/'
```
