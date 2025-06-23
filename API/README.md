# Projet de Tests Unitaires pour une API

## Description
Ce projet a pour objectif de mettre en place des tests unitaires pour une API. Les tests unitaires permettent de vérifier le bon fonctionnement des différentes parties de l'API de manière isolée.

## Prérequis
Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :
- Node
- nvm

## Installation
1. Clonez le dépôt du projet :
  ```bash
  git clone https://github.com/votre-utilisateur/votre-repo.git
  ```
2. Accédez au répertoire du projet :
  ```bash
  cd votre-repo
  ```
3. Initialiser la base de données :
  ```bash
  npm run prisma:generate
  npm run prisma:migrate
  ```
4. Exécuter l'API :
  ```bash
  npm run dev
  ```

## Structure du Projet
La structure du projet est organisée comme suit :

```
├── src
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   └── utils
├── .env
├── .nvmrc
├── docker-compose.yaml
├── package.json
└── tsconfig.json
```

## Migrations
Pour faire un changement mineur sur la db:
```bash
npx prisma db push
```

Pour créer une nouvelle migration :
```bash
npx prisma migrate dev --setting-only --name "nom_de_la_migration"
```

## Auteurs
- Mathias [mathias.collas@gmail.com]
