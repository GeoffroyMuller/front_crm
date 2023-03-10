# setup the projet 
yarn setup
    --env: copy packages/{PACKAGE_NAME}/.env.sample in packages/{PACKAGE_NAME}/.env
    --migrate: yarn migrate in packages/api_{PACKAGE_NAME}