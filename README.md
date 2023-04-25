This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Welcome

This is a simple web app for tracking TV shows watched episodes, a task assigned by Games Global OÜ.

To access the site, go to

https://tv-show-tracker-c3ca2.web.app/

To run this project, one must use Firebase with a MeiliSearch plugin. The following environment variables must be set:

NEXTAUTH\_SECRET
NEXTAUTH\_URL
MEILISEARCH\_HOST
MEILISEARCH\_KEY
IMDB\_API\_KEY

Additionaly, in a dev environment, the following must also be set:

GOOGLE\_APPLICATION\_CREDENTIALS (pointing to the service account credentials file)
HTTPS (as false)
