import classNames from 'classnames'

interface ITab {
  index: number
  display: string
}

interface IProps {
  tabs: any[]
  setCurrentTab: (tab: ITab) => void
  currentTab: ITab
}

export default function TabOptions({ tabs, setCurrentTab, currentTab }: IProps) {
  return (
    <div className="flex flex-wrap gap-y-2 gap-x-2 space-x-0 md:space-x-4 mx-4">
      {tabs.map(({ display, index }) => {
        return (
          <div
            key={index}
            className={classNames(
              'py-2 px-4 cursor-pointer rounded-xl border border-solid border-gray-300 dark:border-darkblue drop-shadow-md  ',
              // Styling if tab is selected
              {
                'bg-gray-100 dark:bg-gray-850 ': currentTab.index === index,
              },
              // Styling if tab is not selected
              {
                'bg-white dark:bg-blackPearl hover:bg-gray-100 dark:hover:bg-gray-800': currentTab.index !== index,
              },
            )}
            onClick={() => {
              setCurrentTab(tabs[index])
            }}
          >
            <span className="text-gray-600 dark:text-gray-50 ">{display}</span>
          </div>
        )
      })}
    </div>
  )
}
