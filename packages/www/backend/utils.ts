import fs from 'fs'

export const serialLoopFlow = async (jobs: any, doJob: Function) => {
  for (const job of jobs) {
    await doJob(job)
  }
}

export const writeFileToLocalCache = async (data: any) => {
  return new Promise((resolve, reject) => {
    return fs.writeFile('cache.json', JSON.stringify(data), (err) => {
      if (err) {
        console.log(err)
        reject()
      } else {
        console.log('The file was saved!')
        resolve('')
      }
    })
  })
}
