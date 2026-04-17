# Commands to load the 3 pages into your database

## Option A: Using Symfony Console (most common)
cd BACKEND
php bin/console doctrine:fixtures:load --append

## Option B: If using DDEV
ddev exec php bin/console doctrine:fixtures:load --append

## Option C: Clear first, then load (clean slate)
cd BACKEND
php bin/console doctrine:query:sql "DELETE FROM section; DELETE FROM page;"
php bin/console doctrine:fixtures:load
