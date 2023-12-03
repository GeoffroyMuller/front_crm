# setup the projet 
- Installer une db Mysql sur localhost
    DB_USER=root
    DB_PASSWORD=
- Créer les Base de données des apis (faire une recherche sur "DB_DATABASE=" pour les nom de DB)
- A la racine du monorepo, lancer les commandes suivantes (dans cet ordre) :
    - yarn setup -env -migrate 
        ( ou "yarn setup -all" )
    - yarn generate:keypair
    - yarn start:apis
# scripts
- yarn setup
    - -env: Copy packages/{PACKAGE_NAME}/.env.sample in packages/{PACKAGE_NAME}/.env
    - -migrate: 'yarn migrate' in packages/api_{PACKAGE_NAME}
    - -keypair: yarn generate:keypair
    - -all: equivalent "yarn setup -env -migrate"
- yarn start:apis
    
    'yarn dev' in all packages/api_{PACKAGE_NAME}
- yarn generate:keypair
    
    Generate private and public keys for authentication

# documentations
- Typescript fondamentaux : https://www.typescriptlang.org/docs/handbook/utility-types.html
- Outils pour doc/tests apis : https://www.usebruno.com/

# outils prometteur à checker
- Open-Source, Cloud-Native Storage for Kubernetes: https://rook.io/

# tuto utils
- How to upload files to aws s3 with node : https://www.freecodecamp.org/news/how-to-upload-files-to-aws-s3-with-node/

# packages
- api_* : webservices de l'app
- api_gateway : point d'entrée de l'API (check l'auth et relaie les requetes aux services)
- core_api : lib qui sert pour les service de l'app (specific à l'app)
- core : lib de composants, helpers... frontend (generic, utilisable pour n'importe quel projet)
- erp : frontend de l'app
- @DEPRECATED pdfs : lib qui sert à générer des pdf de devis/factures, utilisé anciennement par api_erp et erp (specific à l'app)