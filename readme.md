# Knitwit Studios Website

Website will be broken into two distinct parts.

1. An exciting, impressive 3D landing page that uses [three.js](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)
2. The boring, informative pages using basic Wordpress themes and blogs.

## Pre-requisites

- NodeJS
- NPM

`sudo apt-get update && sudo apt-get install nodejs npm`

### Node Dependencies

- THREE

All dependencies should be in `package.json`.

`npm install` command will install them all.

## How to Run

After installing dependencies, we use `five-server` to mimic a simple HTTP local server.

`npm -g i five-server` then `five-server . -p 8080` inside the root, repo directory.