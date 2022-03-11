/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./ethers/config.ts":
/*!**************************!*\
  !*** ./ethers/config.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"NETWORK_NAME\": () => (/* binding */ NETWORK_NAME),\n/* harmony export */   \"CONTRACT_ADDRESS\": () => (/* binding */ CONTRACT_ADDRESS)\n/* harmony export */ });\n// Next.js detects if deployed on vercel, or running locally\nconst IS_PROD = 'development' === 'production';\n// Retrieve the name of the network the contract is deployed on\nconst NETWORK_NAME = \"http://localhost:8545/\";\n// Hard-coded contract addresses so easy to change in development\nconst DEV_CONTRACT_ADDRESS = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';\n// Address of the contract is fetched from env vars in production, but hard-coded when in development\nconst CONTRACT_ADDRESS = IS_PROD ? \"0x6419B7a260696C3D49B5eF6Ee3e9A12b45E20041\" : DEV_CONTRACT_ADDRESS;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ldGhlcnMvY29uZmlnLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsRUFBNEQ7QUFDNUQsS0FBSyxDQUFDQSxPQUFPLEdBRGIsQ0FBYSxpQkFDNEIsQ0FBWTtBQUVyRCxFQUErRDtBQUN4RCxLQUFLLENBQUNDLFlBQVksR0FBR0Msd0JBQW9DO0FBRWhFLEVBQWlFO0FBQ2pFLEtBQUssQ0FBQ0csb0JBQW9CLEdBQUcsQ0FBNEM7QUFFekUsRUFBcUc7QUFDOUYsS0FBSyxDQUFDQyxnQkFBZ0IsR0FBR04sT0FBTyxHQUFHRSw0Q0FBd0MsR0FBR0csb0JBQW9CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGFwZS1tb25pdG9yL3d3dy8uL2V0aGVycy9jb25maWcudHM/OTUwMSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBOZXh0LmpzIGRldGVjdHMgaWYgZGVwbG95ZWQgb24gdmVyY2VsLCBvciBydW5uaW5nIGxvY2FsbHlcbmNvbnN0IElTX1BST0QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nXG5cbi8vIFJldHJpZXZlIHRoZSBuYW1lIG9mIHRoZSBuZXR3b3JrIHRoZSBjb250cmFjdCBpcyBkZXBsb3llZCBvblxuZXhwb3J0IGNvbnN0IE5FVFdPUktfTkFNRSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX05FVFdPUktfTkFNRVxuXG4vLyBIYXJkLWNvZGVkIGNvbnRyYWN0IGFkZHJlc3NlcyBzbyBlYXN5IHRvIGNoYW5nZSBpbiBkZXZlbG9wbWVudFxuY29uc3QgREVWX0NPTlRSQUNUX0FERFJFU1MgPSAnMHhEYzY0YTE0MEFhM0U5ODExMDBhOWJlY0E0RTY4NWY5NjJmMGNGNkM5J1xuXG4vLyBBZGRyZXNzIG9mIHRoZSBjb250cmFjdCBpcyBmZXRjaGVkIGZyb20gZW52IHZhcnMgaW4gcHJvZHVjdGlvbiwgYnV0IGhhcmQtY29kZWQgd2hlbiBpbiBkZXZlbG9wbWVudFxuZXhwb3J0IGNvbnN0IENPTlRSQUNUX0FERFJFU1MgPSBJU19QUk9EID8gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQ09OVFJBQ1RfQUREUkVTUyA6IERFVl9DT05UUkFDVF9BRERSRVNTXG4iXSwibmFtZXMiOlsiSVNfUFJPRCIsIk5FVFdPUktfTkFNRSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19ORVRXT1JLX05BTUUiLCJERVZfQ09OVFJBQ1RfQUREUkVTUyIsIkNPTlRSQUNUX0FERFJFU1MiLCJORVhUX1BVQkxJQ19DT05UUkFDVF9BRERSRVNTIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./ethers/config.ts\n");

/***/ }),

/***/ "./frontend/apollo-client.ts":
/*!***********************************!*\
  !*** ./frontend/apollo-client.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst herokuUri = \"https://apemonitor-production.herokuapp.com/v1/graphql\";\nif (typeof herokuUri === 'undefined' || herokuUri === '') {\n    console.error('The NEXT_PUBLIC_HEROKU_URI environment variable is not set, exiting.');\n    process.exit(1);\n}\nconst client = new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloClient({\n    uri: herokuUri,\n    cache: new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.InMemoryCache()\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (client);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9mcm9udGVuZC9hcG9sbG8tY2xpZW50LnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE0RDtBQUU1RCxLQUFLLENBQUNFLFNBQVMsR0FBR0Msd0RBQWtDO0FBRXBELEVBQUUsRUFBRSxNQUFNLENBQUNELFNBQVMsS0FBSyxDQUFXLGNBQUlBLFNBQVMsS0FBSyxDQUFFLEdBQUUsQ0FBQztJQUN6REksT0FBTyxDQUFDQyxLQUFLLENBQUMsQ0FBc0U7SUFDcEZKLE9BQU8sQ0FBQ0ssSUFBSSxDQUFDLENBQUM7QUFDaEIsQ0FBQztBQUVELEtBQUssQ0FBQ0MsTUFBTSxHQUFHLEdBQUcsQ0FBQ1Qsd0RBQVksQ0FBQyxDQUFDO0lBQy9CVSxHQUFHLEVBQUVSLFNBQVM7SUFDZFMsS0FBSyxFQUFFLEdBQUcsQ0FBQ1YseURBQWE7QUFDMUIsQ0FBQztBQUVELGlFQUFlUSxNQUFNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGFwZS1tb25pdG9yL3d3dy8uL2Zyb250ZW5kL2Fwb2xsby1jbGllbnQudHM/YTI1OSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcG9sbG9DbGllbnQsIEluTWVtb3J5Q2FjaGUgfSBmcm9tICdAYXBvbGxvL2NsaWVudCdcblxuY29uc3QgaGVyb2t1VXJpID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfSEVST0tVX1VSSVxuXG5pZiAodHlwZW9mIGhlcm9rdVVyaSA9PT0gJ3VuZGVmaW5lZCcgfHwgaGVyb2t1VXJpID09PSAnJykge1xuICBjb25zb2xlLmVycm9yKCdUaGUgTkVYVF9QVUJMSUNfSEVST0tVX1VSSSBlbnZpcm9ubWVudCB2YXJpYWJsZSBpcyBub3Qgc2V0LCBleGl0aW5nLicpXG4gIHByb2Nlc3MuZXhpdCgxKVxufVxuXG5jb25zdCBjbGllbnQgPSBuZXcgQXBvbGxvQ2xpZW50KHtcbiAgdXJpOiBoZXJva3VVcmksXG4gIGNhY2hlOiBuZXcgSW5NZW1vcnlDYWNoZSgpLFxufSlcblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50XG4iXSwibmFtZXMiOlsiQXBvbGxvQ2xpZW50IiwiSW5NZW1vcnlDYWNoZSIsImhlcm9rdVVyaSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19IRVJPS1VfVVJJIiwiY29uc29sZSIsImVycm9yIiwiZXhpdCIsImNsaWVudCIsInVyaSIsImNhY2hlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./frontend/apollo-client.ts\n");

/***/ }),

/***/ "./hooks/useWeb3User.ts":
/*!******************************!*\
  !*** ./hooks/useWeb3User.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var unstated_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! unstated-next */ \"unstated-next\");\n/* harmony import */ var unstated_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(unstated_next__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ethers */ \"ethers\");\n/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var use_wallet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! use-wallet */ \"use-wallet\");\n/* harmony import */ var use_wallet__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(use_wallet__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _ethers_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ethers/config */ \"./ethers/config.ts\");\n\n\n\n\n\nconst Web3UserState = ()=>{\n    const wallet = (0,use_wallet__WEBPACK_IMPORTED_MODULE_3__.useWallet)();\n    const { networkName , account , ethereum  } = wallet;\n    const { 0: ensName1 , 1: setEnsName  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null) // If the user has an ENS name, it gets set here.\n    ;\n    const { 0: provider1 , 1: setProvider  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null) // Ethers provider\n    ;\n    const { 0: ethPrice , 1: setEthPrice  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n    // Fetch ether price\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{\n        async function fetchEtherPrice() {\n            var etherscanProvider = new ethers__WEBPACK_IMPORTED_MODULE_2__.ethers.providers.EtherscanProvider();\n            const price1 = await etherscanProvider.getEtherPrice().then((price)=>setEthPrice(price)\n            ).catch((err)=>console.error(`Error while fetching eth price: ${err}`)\n            );\n        }\n        fetchEtherPrice();\n    }, []);\n    // Fetch other data\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{\n        if (account) {\n            initializeData(account);\n        }\n        async function initializeData(address) {\n            const provider = new ethers__WEBPACK_IMPORTED_MODULE_2__.ethers.providers.Web3Provider(ethereum);\n            setProvider(provider);\n            if (!_ethers_config__WEBPACK_IMPORTED_MODULE_4__.CONTRACT_ADDRESS) return console.error('Could not find contract address');\n            let ensName;\n            if (networkName === 'main') {\n                ensName = await provider.lookupAddress(address);\n                setEnsName(ensName);\n            }\n        }\n    }, [\n        account,\n        ethereum,\n        networkName\n    ]);\n    return {\n        wallet,\n        ensName: ensName1,\n        provider: provider1,\n        ethPrice\n    };\n};\nconst web3UserContainer = (0,unstated_next__WEBPACK_IMPORTED_MODULE_1__.createContainer)(Web3UserState);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (web3UserContainer);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ob29rcy91c2VXZWIzVXNlci50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQTJDO0FBQ0k7QUFHaEI7QUFDTztBQUVhO0FBRW5ELEtBQUssQ0FBQ00sYUFBYSxPQUFTLENBQUM7SUFDM0IsS0FBSyxDQUFDQyxNQUFNLEdBQUdILHFEQUFTO0lBQ3hCLEtBQUssQ0FBQyxDQUFDLENBQUNJLFdBQVcsR0FBRUMsT0FBTyxHQUFFQyxRQUFRLEVBQUMsQ0FBQyxHQUFHSCxNQUFNO0lBRWpELEtBQUssTUFBRUksUUFBTyxNQUFFQyxVQUFVLE1BQUlaLCtDQUFRLENBQWdCLElBQUksQ0FBRSxDQUFpRDs7SUFDN0csS0FBSyxNQUFFYSxTQUFRLE1BQUVDLFdBQVcsTUFBSWQsK0NBQVEsQ0FBd0MsSUFBSSxDQUFFLENBQWtCOztJQUN4RyxLQUFLLE1BQUVlLFFBQVEsTUFBRUMsV0FBVyxNQUFJaEIsK0NBQVE7SUFFeEMsRUFBb0I7SUFDcEJDLGdEQUFTLEtBQU8sQ0FBQzt1QkFDQWdCLGVBQWUsR0FBRyxDQUFDO1lBQ2hDLEdBQUcsQ0FBQ0MsaUJBQWlCLEdBQUcsR0FBRyxDQUFDZixzRUFBa0M7WUFDOUQsS0FBSyxDQUFDa0IsTUFBSyxHQUFHLEtBQUssQ0FBQ0gsaUJBQWlCLENBQ2xDSSxhQUFhLEdBQ2JDLElBQUksRUFBRUYsS0FBSyxHQUFLTCxXQUFXLENBQUNLLEtBQUs7Y0FDakNHLEtBQUssRUFBRUMsR0FBRyxHQUFLQyxPQUFPLENBQUNDLEtBQUssRUFBRSxnQ0FBZ0MsRUFBRUYsR0FBRzs7UUFDeEUsQ0FBQztRQUVEUixlQUFlO0lBQ2pCLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFTCxFQUFtQjtJQUNuQmhCLGdEQUFTLEtBQU8sQ0FBQztRQUNmLEVBQUUsRUFBRVEsT0FBTyxFQUFFLENBQUM7WUFDWm1CLGNBQWMsQ0FBQ25CLE9BQU87UUFDeEIsQ0FBQzt1QkFDY21CLGNBQWMsQ0FBQ0MsT0FBZSxFQUFFLENBQUM7WUFDOUMsS0FBSyxDQUFDaEIsUUFBUSxHQUFHLEdBQUcsQ0FBQ1YsaUVBQTZCLENBQUNPLFFBQVE7WUFDM0RJLFdBQVcsQ0FBQ0QsUUFBUTtZQUNwQixFQUFFLEdBQUdSLDREQUFnQixFQUFFLE1BQU0sQ0FBQ3FCLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDLENBQWlDO1lBQzdFLEdBQUcsQ0FBQ2hCLE9BQU87WUFDWCxFQUFFLEVBQUVILFdBQVcsS0FBSyxDQUFNLE9BQUUsQ0FBQztnQkFDM0JHLE9BQU8sR0FBRyxLQUFLLENBQUNFLFFBQVEsQ0FBQ2tCLGFBQWEsQ0FBQ0YsT0FBTztnQkFDOUNqQixVQUFVLENBQUNELE9BQU87WUFDcEIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQ0Y7UUFBQUEsT0FBTztRQUFFQyxRQUFRO1FBQUVGLFdBQVc7SUFBQSxDQUFDO0lBRW5DLE1BQU0sQ0FBQyxDQUFDO1FBQUNELE1BQU07UUFBRUksT0FBTyxFQUFQQSxRQUFPO1FBQUVFLFFBQVEsRUFBUkEsU0FBUTtRQUFFRSxRQUFRO0lBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQsS0FBSyxDQUFDaUIsaUJBQWlCLEdBQUc5Qiw4REFBZSxDQUFDSSxhQUFhO0FBRXZELGlFQUFlMEIsaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGFwZS1tb25pdG9yL3d3dy8uL2hvb2tzL3VzZVdlYjNVc2VyLnRzPzEyNGQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY3JlYXRlQ29udGFpbmVyIH0gZnJvbSAndW5zdGF0ZWQtbmV4dCdcbmltcG9ydCB7IFdlYjNQcm92aWRlciwgSnNvblJwY1Byb3ZpZGVyIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvcHJvdmlkZXJzJ1xuXG5pbXBvcnQgeyBldGhlcnMgfSBmcm9tICdldGhlcnMnXG5pbXBvcnQgeyB1c2VXYWxsZXQgfSBmcm9tICd1c2Utd2FsbGV0J1xuXG5pbXBvcnQgeyBDT05UUkFDVF9BRERSRVNTIH0gZnJvbSAnLi4vZXRoZXJzL2NvbmZpZydcblxuY29uc3QgV2ViM1VzZXJTdGF0ZSA9ICgpID0+IHtcbiAgY29uc3Qgd2FsbGV0ID0gdXNlV2FsbGV0KClcbiAgY29uc3QgeyBuZXR3b3JrTmFtZSwgYWNjb3VudCwgZXRoZXJldW0gfSA9IHdhbGxldFxuXG4gIGNvbnN0IFtlbnNOYW1lLCBzZXRFbnNOYW1lXSA9IHVzZVN0YXRlPG51bGwgfCBzdHJpbmc+KG51bGwpIC8vIElmIHRoZSB1c2VyIGhhcyBhbiBFTlMgbmFtZSwgaXQgZ2V0cyBzZXQgaGVyZS5cbiAgY29uc3QgW3Byb3ZpZGVyLCBzZXRQcm92aWRlcl0gPSB1c2VTdGF0ZTxXZWIzUHJvdmlkZXIgfCBKc29uUnBjUHJvdmlkZXIgfCBudWxsPihudWxsKSAvLyBFdGhlcnMgcHJvdmlkZXJcbiAgY29uc3QgW2V0aFByaWNlLCBzZXRFdGhQcmljZV0gPSB1c2VTdGF0ZTxudW1iZXI+KClcblxuICAvLyBGZXRjaCBldGhlciBwcmljZVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoRXRoZXJQcmljZSgpIHtcbiAgICAgIHZhciBldGhlcnNjYW5Qcm92aWRlciA9IG5ldyBldGhlcnMucHJvdmlkZXJzLkV0aGVyc2NhblByb3ZpZGVyKClcbiAgICAgIGNvbnN0IHByaWNlID0gYXdhaXQgZXRoZXJzY2FuUHJvdmlkZXJcbiAgICAgICAgLmdldEV0aGVyUHJpY2UoKVxuICAgICAgICAudGhlbigocHJpY2UpID0+IHNldEV0aFByaWNlKHByaWNlKSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoYEVycm9yIHdoaWxlIGZldGNoaW5nIGV0aCBwcmljZTogJHtlcnJ9YCkpXG4gICAgfVxuXG4gICAgZmV0Y2hFdGhlclByaWNlKClcbiAgfSwgW10pXG5cbiAgLy8gRmV0Y2ggb3RoZXIgZGF0YVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhY2NvdW50KSB7XG4gICAgICBpbml0aWFsaXplRGF0YShhY2NvdW50KVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplRGF0YShhZGRyZXNzOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IGV0aGVycy5wcm92aWRlcnMuV2ViM1Byb3ZpZGVyKGV0aGVyZXVtKVxuICAgICAgc2V0UHJvdmlkZXIocHJvdmlkZXIpXG4gICAgICBpZiAoIUNPTlRSQUNUX0FERFJFU1MpIHJldHVybiBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgZmluZCBjb250cmFjdCBhZGRyZXNzJylcbiAgICAgIGxldCBlbnNOYW1lXG4gICAgICBpZiAobmV0d29ya05hbWUgPT09ICdtYWluJykge1xuICAgICAgICBlbnNOYW1lID0gYXdhaXQgcHJvdmlkZXIubG9va3VwQWRkcmVzcyhhZGRyZXNzKVxuICAgICAgICBzZXRFbnNOYW1lKGVuc05hbWUpXG4gICAgICB9XG4gICAgfVxuICB9LCBbYWNjb3VudCwgZXRoZXJldW0sIG5ldHdvcmtOYW1lXSlcblxuICByZXR1cm4geyB3YWxsZXQsIGVuc05hbWUsIHByb3ZpZGVyLCBldGhQcmljZSB9XG59XG5cbmNvbnN0IHdlYjNVc2VyQ29udGFpbmVyID0gY3JlYXRlQ29udGFpbmVyKFdlYjNVc2VyU3RhdGUpXG5cbmV4cG9ydCBkZWZhdWx0IHdlYjNVc2VyQ29udGFpbmVyXG4iXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJjcmVhdGVDb250YWluZXIiLCJldGhlcnMiLCJ1c2VXYWxsZXQiLCJDT05UUkFDVF9BRERSRVNTIiwiV2ViM1VzZXJTdGF0ZSIsIndhbGxldCIsIm5ldHdvcmtOYW1lIiwiYWNjb3VudCIsImV0aGVyZXVtIiwiZW5zTmFtZSIsInNldEVuc05hbWUiLCJwcm92aWRlciIsInNldFByb3ZpZGVyIiwiZXRoUHJpY2UiLCJzZXRFdGhQcmljZSIsImZldGNoRXRoZXJQcmljZSIsImV0aGVyc2NhblByb3ZpZGVyIiwicHJvdmlkZXJzIiwiRXRoZXJzY2FuUHJvdmlkZXIiLCJwcmljZSIsImdldEV0aGVyUHJpY2UiLCJ0aGVuIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJpbml0aWFsaXplRGF0YSIsImFkZHJlc3MiLCJXZWIzUHJvdmlkZXIiLCJsb29rdXBBZGRyZXNzIiwid2ViM1VzZXJDb250YWluZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./hooks/useWeb3User.ts\n");

/***/ }),

/***/ "./hooks/web3UserProvider.tsx":
/*!************************************!*\
  !*** ./hooks/web3UserProvider.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ GlobalWeb3UserProvider),\n/* harmony export */   \"data\": () => (/* reexport safe */ _useWeb3User__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ \"react/jsx-runtime\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _useWeb3User__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useWeb3User */ \"./hooks/useWeb3User.ts\");\n\n // Import data container\n// Export global provider to encompass application\nfunction GlobalWeb3UserProvider({ children  }) {\n    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_useWeb3User__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Provider, {\n            __source: {\n                fileName: \"/Users/jonathancai/Documents/git/ape-monitor/packages/www/hooks/web3UserProvider.tsx\",\n                lineNumber: 7\n            },\n            __self: this,\n            children: children\n        })\n    }));\n};\n// Export data container\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ob29rcy93ZWIzVXNlclByb3ZpZGVyLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBaUMsQ0FBd0I7QUFFekQsRUFBa0Q7QUFDbkMsUUFBUSxDQUFDQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUNDLFFBQVEsRUFBNEIsQ0FBQyxFQUFFLENBQUM7SUFDdkYsTUFBTTt1RkFFREYsNkRBQWE7Ozs7OztzQkFBRUUsUUFBUTs7O0FBRzlCLENBQUM7QUFFRCxFQUF3QjtBQUNYIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGFwZS1tb25pdG9yL3d3dy8uL2hvb2tzL3dlYjNVc2VyUHJvdmlkZXIudHN4P2M1MjEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRhdGEgZnJvbSAnLi91c2VXZWIzVXNlcicgLy8gSW1wb3J0IGRhdGEgY29udGFpbmVyXG5cbi8vIEV4cG9ydCBnbG9iYWwgcHJvdmlkZXIgdG8gZW5jb21wYXNzIGFwcGxpY2F0aW9uXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHbG9iYWxXZWIzVXNlclByb3ZpZGVyKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogSlNYLkVsZW1lbnQgfSkge1xuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGF0YS5Qcm92aWRlcj57Y2hpbGRyZW59PC9kYXRhLlByb3ZpZGVyPlxuICAgIDwvPlxuICApXG59XG5cbi8vIEV4cG9ydCBkYXRhIGNvbnRhaW5lclxuZXhwb3J0IHsgZGF0YSB9XG4iXSwibmFtZXMiOlsiZGF0YSIsIkdsb2JhbFdlYjNVc2VyUHJvdmlkZXIiLCJjaGlsZHJlbiIsIlByb3ZpZGVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./hooks/web3UserProvider.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ \"react/jsx-runtime\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var tailwindcss_tailwind_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tailwindcss/tailwind.css */ \"../../node_modules/tailwindcss/tailwind.css\");\n/* harmony import */ var tailwindcss_tailwind_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tailwindcss_tailwind_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next-themes */ \"next-themes\");\n/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_themes__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var use_wallet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! use-wallet */ \"use-wallet\");\n/* harmony import */ var use_wallet__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(use_wallet__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _hooks_web3UserProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../hooks/web3UserProvider */ \"./hooks/web3UserProvider.tsx\");\n/* harmony import */ var _frontend_apollo_client__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../frontend/apollo-client */ \"./frontend/apollo-client.ts\");\n\n\n\n\n\n\n\n\nfunction MyApp({ Component , pageProps  }) {\n    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_themes__WEBPACK_IMPORTED_MODULE_4__.ThemeProvider, {\n        attribute: \"class\",\n        __source: {\n            fileName: \"/Users/jonathancai/Documents/git/ape-monitor/packages/www/pages/_app.tsx\",\n            lineNumber: 14\n        },\n        __self: this,\n        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_apollo_client__WEBPACK_IMPORTED_MODULE_3__.ApolloProvider, {\n            client: _frontend_apollo_client__WEBPACK_IMPORTED_MODULE_7__[\"default\"],\n            __source: {\n                fileName: \"/Users/jonathancai/Documents/git/ape-monitor/packages/www/pages/_app.tsx\",\n                lineNumber: 15\n            },\n            __self: this,\n            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"div\", {\n                className: \"min-h-screen bg-white dark:bg-blackPearl dark:text-white\",\n                __source: {\n                    fileName: \"/Users/jonathancai/Documents/git/ape-monitor/packages/www/pages/_app.tsx\",\n                    lineNumber: 16\n                },\n                __self: this,\n                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(use_wallet__WEBPACK_IMPORTED_MODULE_5__.UseWalletProvider, {\n                    connectors: {\n                        walletconnect: {\n                            // TODO: support testnet configurations\n                            // chainId 1 is mainnet\n                            chainId: 1,\n                            rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/GBjvplStTQ2x1FiAa5-5Qdyv2_8ZBuwe'\n                        }\n                    },\n                    __source: {\n                        fileName: \"/Users/jonathancai/Documents/git/ape-monitor/packages/www/pages/_app.tsx\",\n                        lineNumber: 17\n                    },\n                    __self: this,\n                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hooks_web3UserProvider__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {\n                        __source: {\n                            fileName: \"/Users/jonathancai/Documents/git/ape-monitor/packages/www/pages/_app.tsx\",\n                            lineNumber: 27\n                        },\n                        __self: this,\n                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Component, {\n                            ...pageProps,\n                            __source: {\n                                fileName: \"/Users/jonathancai/Documents/git/ape-monitor/packages/www/pages/_app.tsx\",\n                                lineNumber: 28\n                            },\n                            __self: this\n                        })\n                    })\n                })\n            })\n        })\n    }));\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQThCO0FBQ0c7QUFHYztBQUVKO0FBQ0c7QUFDVTtBQUNWO1NBRXJDSyxLQUFLLENBQUMsQ0FBQyxDQUFDQyxTQUFTLEdBQUVDLFNBQVMsRUFBVyxDQUFDLEVBQUUsQ0FBQztJQUNsRCxNQUFNLHNFQUNITixzREFBYTtRQUFDTyxTQUFTLEVBQUMsQ0FBTzs7Ozs7O3VGQUM3QlIsMERBQWM7WUFBQ0ksTUFBTSxFQUFFQSwrREFBTTs7Ozs7OzJGQUMzQkssQ0FBRztnQkFBQ0MsU0FBUyxFQUFDLENBQTBEOzs7Ozs7K0ZBQ3RFUix5REFBaUI7b0JBQ2hCUyxVQUFVLEVBQUUsQ0FBQzt3QkFDWEMsYUFBYSxFQUFFLENBQUM7NEJBQ2QsRUFBdUM7NEJBQ3ZDLEVBQXVCOzRCQUN2QkMsT0FBTyxFQUFFLENBQUM7NEJBQ1ZDLE1BQU0sRUFBRSxDQUF1RTt3QkFDakYsQ0FBQztvQkFDSCxDQUFDOzs7Ozs7bUdBRUFYLCtEQUFnQjs7Ozs7O3VHQUNkRyxTQUFTOytCQUFLQyxTQUFTOzs7Ozs7Ozs7Ozs7QUFPdEMsQ0FBQztBQUNELGlFQUFlRixLQUFLIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGFwZS1tb25pdG9yL3d3dy8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnXG5pbXBvcnQgJ3RhaWx3aW5kY3NzL3RhaWx3aW5kLmNzcydcblxuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJ1xuaW1wb3J0IHsgQXBvbGxvUHJvdmlkZXIgfSBmcm9tICdAYXBvbGxvL2NsaWVudCdcblxuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJ25leHQtdGhlbWVzJ1xuaW1wb3J0IHsgVXNlV2FsbGV0UHJvdmlkZXIgfSBmcm9tICd1c2Utd2FsbGV0J1xuaW1wb3J0IFdlYjNVc2VyUHJvdmlkZXIgZnJvbSAnLi4vaG9va3Mvd2ViM1VzZXJQcm92aWRlcidcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vZnJvbnRlbmQvYXBvbGxvLWNsaWVudCdcblxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxUaGVtZVByb3ZpZGVyIGF0dHJpYnV0ZT1cImNsYXNzXCI+XG4gICAgICA8QXBvbGxvUHJvdmlkZXIgY2xpZW50PXtjbGllbnR9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBiZy13aGl0ZSBkYXJrOmJnLWJsYWNrUGVhcmwgZGFyazp0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgPFVzZVdhbGxldFByb3ZpZGVyXG4gICAgICAgICAgICBjb25uZWN0b3JzPXt7XG4gICAgICAgICAgICAgIHdhbGxldGNvbm5lY3Q6IHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IHRlc3RuZXQgY29uZmlndXJhdGlvbnNcbiAgICAgICAgICAgICAgICAvLyBjaGFpbklkIDEgaXMgbWFpbm5ldFxuICAgICAgICAgICAgICAgIGNoYWluSWQ6IDEsXG4gICAgICAgICAgICAgICAgcnBjVXJsOiAnaHR0cHM6Ly9ldGgtbWFpbm5ldC5hbGNoZW15YXBpLmlvL3YyL0dCanZwbFN0VFEyeDFGaUFhNS01UWR5djJfOFpCdXdlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFdlYjNVc2VyUHJvdmlkZXI+XG4gICAgICAgICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICAgICAgICAgIDwvV2ViM1VzZXJQcm92aWRlcj5cbiAgICAgICAgICA8L1VzZVdhbGxldFByb3ZpZGVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQXBvbGxvUHJvdmlkZXI+XG4gICAgPC9UaGVtZVByb3ZpZGVyPlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBNeUFwcFxuIl0sIm5hbWVzIjpbIkFwb2xsb1Byb3ZpZGVyIiwiVGhlbWVQcm92aWRlciIsIlVzZVdhbGxldFByb3ZpZGVyIiwiV2ViM1VzZXJQcm92aWRlciIsImNsaWVudCIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwiYXR0cmlidXRlIiwiZGl2IiwiY2xhc3NOYW1lIiwiY29ubmVjdG9ycyIsIndhbGxldGNvbm5lY3QiLCJjaGFpbklkIiwicnBjVXJsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "../../node_modules/tailwindcss/tailwind.css":
/*!***************************************************!*\
  !*** ../../node_modules/tailwindcss/tailwind.css ***!
  \***************************************************/
/***/ (() => {



/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@apollo/client":
/*!*********************************!*\
  !*** external "@apollo/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client");

/***/ }),

/***/ "ethers":
/*!*************************!*\
  !*** external "ethers" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("ethers");

/***/ }),

/***/ "next-themes":
/*!******************************!*\
  !*** external "next-themes" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-themes");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "unstated-next":
/*!********************************!*\
  !*** external "unstated-next" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("unstated-next");

/***/ }),

/***/ "use-wallet":
/*!*****************************!*\
  !*** external "use-wallet" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("use-wallet");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();