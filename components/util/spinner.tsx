import Emoji from './emoji'

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="
        loader
        ease-linear
        rounded-full
      "
      >
        <Emoji className="cursor-pointer" label="logo" symbol="🍌" />
      </div>
      <style jsx>
        {`
          .loader {
            border-top-color: white;
            animation: spinner 1.4s linear infinite;
          }

          @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  )
}

export default Spinner

/**
 * This is the original spinner component (not the spinning banana)
 */
// const Spinner = () => {
//   return (
//     <div className="flex justify-center items-center">
//       <div
//         className="
//         border-2 border-t-2 border-gray-800
//         loader
//         ease-linear
//         rounded-full
//         h-4
//         w-4
//       "
//       />
//       <style jsx>
//         {`
//           .loader {
//             border-top-color: white;
//             animation: spinner 0.6s linear infinite;
//           }

//           @keyframes spinner {
//             0% {
//               transform: rotate(0deg);
//             }
//             100% {
//               transform: rotate(360deg);
//             }
//           }
//         `}
//       </style>
//     </div>
//   )
// }
