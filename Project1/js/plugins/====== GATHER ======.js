/*
super. on va commencer par definir leur implementation dans la scene map.
les huds sont afficher sur l'ecran au dessus de la map dans la scene_map.
il sont contenu dans un layer special ._hudsLayer.

Il faut ajouter une logique a la scene map lors du clique droit sur la map. le mouvement du joueur doit etre inactif si il clique sur un des hud contenu dans ._hudsLayer.
un fonctionnement propre aux huds qui vont les differencier du reste des fenetres. les huds peuvent avoir 2 formes : la forme reduite et la forme elargie.
Dans leur forme reduite les huds sont miniaturisé et contienne seulement des elements importants et condensé. Dans la version elargie on a acces a plus d'infos et de contenu.
*/