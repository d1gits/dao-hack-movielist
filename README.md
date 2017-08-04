# The Ultimate Sci-Fi Movie List

Hello! This is a temporary public repo containing a mock version of the dao hack.
Please don't ever put this on a production blockchain.

Its basically this:

https://www.reddit.com/r/ethereum/comments/3g7lx6/are_you_tired_of_best_scifi_movies_of_all_time/

But then as a truffle-box:

https://github.com/truffle-box/react-box

With a little interface.

And added a cool dao exploit feature based on this:

https://github.com/joeb000/mock-dao-hack

## Warning

Don't ever deploy anything written in this repo on a production blockchain. The contracts in here have been written to contain exploits. And the exploit has been added as an example. Your Ether will get stolen.

## React-box

The installation instruction and FAQ are the instructions that came with react-box. Everything is adjusted so that the instructions below remain intact.

## Installation

1. Install truffle and an ethereum client. For local development, try EthereumJS TestRPC.
    ```javascript
    npm install -g truffle // Version 3.0.5+ required.
    npm install -g ethereumjs-testrpc
    ```

2. Clone repo
    ```javascript
    git clone git@github.com:d1gits/scifi-truffle.git
    ```

3. Enter folder
    ```javascript
    cd scifi-truffle
    ```

3. Compile and migrate the contracts.
    ```javascript
    truffle compile
    truffle migrate
    ```

4. Run the webpack server for front-end hot reloading. For now, smart contract changes must be manually recompiled and migrated.
    ```javascript
    npm run start
    ```

5. Truffle's own suite is included for smart contracts. Be sure you've compile your contracts before running jest, or you'll receive some file not found errors.
    ```javascript
    // Runs Truffle's test suite for smart contract tests.
    truffle test
    ```

6. To build the application for production, use the build command. A production build will be in the build_webpack folder.
    ```javascript
    npm run build
    ```
