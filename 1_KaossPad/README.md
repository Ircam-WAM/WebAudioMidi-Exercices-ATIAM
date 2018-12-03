# Kaoss Pad

Qu'est-ce qu'un Kaoss Pad :

<img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KAOSS_PAD.JPG" alt="Kaoss Pad" width="40%" height="40%">

> The Korg Kaoss Pad is a small touchpad MIDI controller, sampler, and effects processor for audio and musical instruments.

## Exercice

### Prérequis

- Utiliser la dernière version de Chrome / Chromium / Firefox
- Etant donné que cet exercice nécessite l'utillisation du micro de l'ordinateur, il est conseillé d'utiliser un casque audio pour éviter des larsen.

### Consignes

1. Jouer avec les exemples : https://alemangui.github.io/pizzicato/ (10 min)
2. Ouvrir votre éditeur de texte préféré
3. Editer le fichier exo/js/script.js
4. Ouvrir le fichier exo/index.html dans le navigateur
5. Définir le contexte Web Audio et définir le micro de l'ordinateur en tant qu'une source audio
6. Relier les boutons play / stop du code html à la source audio
7. Définissez les trois effets audio de pizzicato.js:
    - Ping Pong Delay
    - Low Pass Filter
    - High Pass Fitler
8. En utilisant la méthode javascript ```addEventListener```, logger dans la console les mouvements de la souris
9. Faire varier le ```feedback``` du ```Ping Pong Delay``` en fonction de l'abcisse de la souris
10. Faire varier la ```frequency``` du ```High Pass Filter``` en fonction de l'ordonnée de la souris
11. Faire varier la ```frequency``` du ```Low Pass Filter``` en fonction de l'ordonnée de la souris

### Questions

- Quelle latence constatez-vous ?
- Est-ce jouable dans un context live ?
- Avez-vous des clicks ?
- Evaluer la charge CPU de ce processing Web Audio

## Sources

https://en.wikipedia.org/wiki/Korg_Kaoss_Pad
https://alemangui.github.io/pizzicato/

## Aller plus loin

https://tonejs.github.io/
