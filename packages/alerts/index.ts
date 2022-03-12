const moment = require('moment')

const run = async () => {
  console.log('HEHE!')
  const startedAt = moment()
  const completedAt = moment()
  console.log(`
    🎉 Job Finished 🎉
    ----------------------
    Started At: ${startedAt.format('MMMM Do YYYY, h:mm:ss a')}
    Completed At: ${completedAt.format('MMMM Do YYYY, h:mm:ss a')}
  `)
}

run()
