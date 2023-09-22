# setup the projet 
- Installer une db Mysql sur localhost
    DB_USER=root
    DB_PASSWORD=
- Créer les Base de données des apis (faire une recherche sur "DB_DATABASE=" pour les nom de DB)
- A la racine du monorepo, lancer les commandes suivantes (dans cet ordre) :
    - yarn setup --env --migrate
    - yarn generate:keypair
    - yarn start:apis
# scripts
yarn setup
    -env: Copy packages/{PACKAGE_NAME}/.env.sample in packages/{PACKAGE_NAME}/.env
    -migrate: 'yarn migrate' in packages/api_{PACKAGE_NAME}
    -keypair: yarn generate:keypair
    -all 
yarn start:apis
    'yarn dev' in packages/api_{PACKAGE_NAME}
yarn generate:keypair
    Generate private and public keys for authentication

# documentations
- Typescript fondamentaux : https://www.typescriptlang.org/docs/handbook/utility-types.html