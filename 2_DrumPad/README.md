# Drum Pad

## Exercice

Le but de cet exercice est de controller des paramètres et flux Web Audio à l'aide d'un controller Midi hardware via l'API Web Midi.

### Prérequis

- Utiliser le navigateur Chrome / Chromium
- Dans Chrome / Chromium, saissez l'adresse : chrome://flags/ et activer 'Experimental JavaScript' (#enable-javascript-harmony)
- Avoir python d'installé
- A la racine du dossier de l'exercice, lancer un serveur web local :
    - ```python -m SimpleHTTPServer 8001``` (python 2)
    - ```python -m http.server 8001``` (python 3)

 Cette commande lance un web serveur accessible depuis votre navigateur à cette adresse : http://localhost:8001

### Consignes

0. Connecter votre clavier Midi à un port USB de votre ordinateur et allumer le
1. Ouvrir votre éditeur de texte préféré
2. Editer le fichier exo/js/script.js
3. Définir le contexte Web Audio (cf https://www.w3.org/TR/webaudio/)
4. Initialiser le Web Midi (cf https://www.w3.org/TR/webmidi/)
5. Lister les controllers Midi dans la console javascript
6. Afficher dans la console les messages Midi de votre controller
7. En utilisant la class ```BufferLoader``` du fichier ```script.js```, instancier les samples de batterie (dossier ```samples```) en tant que source Web Audio
8. Remplir la méthode ```playSound``` qui permettra de jouer un sample bufferisé (source), à connecter à un noeud de destination audio
9. Déclencher les samples de batterie à partir de notes Midi que vous aurez choisis
10. Ajouter un filtre Biquad entre le noeud source et de destination
11. Relier ce filtre à un "controller continue" (potentiomètre) de votre clavier

## Sources

### Web Midi

http://webaudio.github.io/web-midi-api/

### Web Audio

https://developer.mozilla.org/fr/docs/Web/API/Web_Audio_API

https://webaudio.github.io/web-audio-api/

### MIDI commands

http://www.opensound.com/pguide/midi/midi5.html

https://ccrma.stanford.edu/~craig/articles/linuxmidi/misc/essenmidi.html

https://www.nyu.edu/classes/bello/FMT_files/9_MIDI_code.pdf


### Samples Audio 

https://www.electrogroove.fr


## Aller plus loin

https://webaudiodemos.appspot.com/

https://github.com/alemangui/web-audio-resources



