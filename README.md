## POC for new YunoHost portal

- This is a based on [Nuxt v3](https://nuxt.com/)

### Develop (using Docker)

- Install Docker
    - cf [these instructions](https://docs.docker.com/engine/install/debian/#set-up-the-repository) to add Docker's apt repository
    - and then `apt update && apt install docker-ce`
- Install Docker-compose
    - `pip3 install docker-compose`
- Inside your Yunohost LXC/ynh-dev/???, make sure the new `yunohost-portal-api` is running and corresponding route is in nginx config
- Add something like `NUXT_PUBLIC_API_IP=yolo.test` inside a `.env` which you may need to create. Replace `yolo.test` with you test domain or test IP (eg your ynh-dev LXC)
- `docker-compose up -d` : will rebuild the docker on the first time, then launch it
- Check `docker-compose logs -f` : should show that nuxt/nitro is building stuff then serving it on port 3000
- Access `127.0.0.1:3000` from your browser

### Develop (manual / directly on your host machine)

- Same as for Docker, this assumes that `yunohost-portal-api` does run, is configured in nginx, and you may have to set `NUXT_PUBLIC_API_IP` in `.env` which you may have to create
- You'll need NodeJS 18.14 (or higher)
- And `yarn`
- Run `yarn install`
- Run `yarn dev`
