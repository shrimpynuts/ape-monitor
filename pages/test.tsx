import type { NextPage } from 'next'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast'
import HtmlEmail from '../components/email/template'
import Button from '../components/util/button'
import { getServer } from '../lib/util'

const TestPage: NextPage = () => {
  const onSendEmail = () => {
    fetch(`${getServer()}/api/jobs/send-email`)
      .then((resp) => JSON.stringify(resp.json()))
      .then(toast.success)
      .catch(toast.error)
  }
  return (
    <div className="max-w-screen-xl m-auto pb-4 md:pb-12">
      <Head>
        <title>Admin</title>
      </Head>
      <Toaster />
      <div className="flex flex-col space-y-4 mt-4">
        <div className="flex shadow border p-8">
          <Button onClick={onSendEmail}>Send Email</Button>
        </div>
        <div className="flex shadow border p-8">
          <HtmlEmail title="test" />
        </div>
      </div>
    </div>
  )
}

export default TestPage
