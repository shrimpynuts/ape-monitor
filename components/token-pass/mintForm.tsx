import Button from '../util/button'
import { useMint } from '../../hooks/useMint'

interface IProps {}

const MintForm: React.FC<IProps> = () => {
  const {
    mint,
    data: { loading },
  } = useMint()

  const handleClick = async () => {
    console.log(`invoking mint`)
    await mint(1)
  }

  return (
    <div className="">
      <div className="p-2 bg-blue-600 flex justify-center blue-gradient">
        <span className="absolute right-4 top-3 text-sm font-semibold company-name">People Index, Inc.</span>
        <div className="bg-red-500 rounded-full w-20 h-20 border-2 border-solid border-white relative top-12">
          <img src="" />
        </div>
      </div>
      <div className="p-8 mt-6">
        <h3 className="font-semibold text-2xl mb-4"> Mint A Premium Pass</h3>
        <video loop autoPlay className="rounded-md">
          <source src="/pro-license.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Button
          isLoading={loading}
          onClick={handleClick}
          classOverrides="w-full mt-4 py-2 text-lg bg-blue-500 hover:bg-blue-600"
        >
          Mint
        </Button>
      </div>

      <style jsx>{`
        .blue-gradient {
          background: linear-gradient(272.71deg, #2463eb 1.87%, #4e85fb 106.04%);
        }

        .company-name {
          color: #0d317f;
        }
      `}</style>
    </div>
  )
}

export default MintForm
