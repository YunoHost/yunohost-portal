## POC for new YunoHost portal

- This is a based on [Nuxt v3](https://nuxt.com/)

### Setup

- I'm doing all this from inside a YunoHost LXC
- You may want to open port 3000 (or disable the firewall) to access the dev server
- You'll need NodeJS 18.14 (or higher)
- And `yarn`
- Run `yarn install`
- Also make sure the new yunohost-portal-api is running and corresponding route is in nginx config

### Dev

- Run `yarn dev`
- Access `http://1.2.3.4:3000/`
