import { QuestionMarkCircleIcon } from '@heroicons/react/solid'

export default function Tooltip({ text }: { text: string }) {
  return (
    <div>
      <div id="has-tooltip">
        <div className="text-gray-700">
          <QuestionMarkCircleIcon className="h-4 w-4 fill-current" />
        </div>
      </div>
      <span
        id="tooltip"
        className="transition-all duration-200 absolute w-72 -top-10 max-h-12 rounded text-black dark:text-gray-900 bg-white text-sm dark:bg-gray-800 p-2 border dark:border-gray-700"
      >
        {text}
      </span>
      <style jsx>{`
        #tooltip {
          visibility: hidden;
          opacity: 0;
          transition: visibility 0s 2s, opacity 0.1s linear;
        }
        #has-tooltip:hover + #tooltip {
          opacity: 1;
          visibility: visible;
          transition: opacity 0.1s linear;
        }
      `}</style>
    </div>
  )
}
